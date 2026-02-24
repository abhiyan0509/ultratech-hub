"""
UltraTech Intelligence Hub — FastAPI Server V2
- Loads API key from .env (server-side)
- APScheduler runs all agents every 4 hours
- Serves dashboard + API endpoints
"""

import json
import os
import glob
import sys
import threading
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

import google.generativeai as genai

# Paths
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

# Add parent to path for agent imports
sys.path.insert(0, BASE_DIR)


# ─── APScheduler ─────────────────────────────────────────────────
def run_all_agents():
    """Run all data agents (called on startup + every 4 hours)"""
    print(f"\n[SCHEDULER] Running all agents at {datetime.now().strftime('%H:%M:%S')}...")
    from agents import crawler_agent, financial_agent, ma_agent, competitor_agent, outlook_agent, macro_agent

    agents = [
        ("Crawler", crawler_agent.run, {}),
        ("Financial", financial_agent.run, {}),
        ("M&A", ma_agent.run, {}),
        ("Competitor", competitor_agent.run, {}),
        ("Outlook", outlook_agent.run, {"api_key": GEMINI_API_KEY}),
        ("Macro", macro_agent.run, {}),
    ]

    for name, fn, kwargs in agents:
        try:
            fn(**kwargs)
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")

    # Synchronize all generated JSON files to Supabase Cloud
    print("\n[DB SYNC] Upserting intelligence to Supabase...")
    try:
        from db_client import upsert_intelligence
        for f in glob.glob(os.path.join(DATA_DIR, "*.json")):
            ds_name = os.path.splitext(os.path.basename(f))[0]
            with open(f, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            upsert_intelligence(ds_name, data)
            
        print("\n[VECTOR SYNC] Generating Knowledge Embeddings...")
        from knowledge_indexer import process_datasets
        process_datasets()
    except Exception as e:
        print(f"[DB SYNC FAIL] {e}")

    print(f"[SCHEDULER] All agents complete at {datetime.now().strftime('%H:%M:%S')}\n")


def start_scheduler():
    """Start APScheduler for 4-hourly agent runs"""
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        scheduler = BackgroundScheduler()
        scheduler.add_job(run_all_agents, 'interval', hours=4, id='agent_pipeline')
        scheduler.start()
        print("[SCHEDULER] Background scheduler started (every 4 hours)")
        return scheduler
    except ImportError:
        print("[SCHEDULER] APScheduler not installed, skipping scheduled runs")
        return None


# ─── Lifespan ────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: run agents in background thread then start scheduler
    thread = threading.Thread(target=run_all_agents, daemon=True)
    thread.start()
    scheduler = start_scheduler()
    yield
    # Shutdown
    if scheduler:
        scheduler.shutdown()


# ─── FastAPI App ─────────────────────────────────────────────────
app = FastAPI(title="UltraTech Intelligence Hub", lifespan=lifespan)


# ─── Data API ────────────────────────────────────────────────────
@app.get("/api/data")
async def list_datasets():
    """List available datasets"""
    datasets = []
    for f in glob.glob(os.path.join(DATA_DIR, "*.json")):
        datasets.append(os.path.splitext(os.path.basename(f))[0])
    return {"datasets": sorted(datasets), "count": len(datasets)}


@app.get("/api/data/{dataset}")
async def get_dataset(dataset: str):
    """Get a specific dataset"""
    try:
        from db_client import get_intelligence
        # 1. Attempt to fetch from Supabase for instant load
        db_data = get_intelligence(dataset)
        if db_data:
            return db_data
    except Exception as e:
        print(f"Supabase fetch error for {dataset}: {e}")

    # 2. Fallback to local file
    filepath = os.path.join(DATA_DIR, f"{dataset}.json")
    if not os.path.exists(filepath):
        raise HTTPException(404, f"Dataset '{dataset}' not found locally or in DB")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/api/status")
async def server_status():
    """Server health + data freshness"""
    datasets = {}
    for f in glob.glob(os.path.join(DATA_DIR, "*.json")):
        name = os.path.splitext(os.path.basename(f))[0]
        stat = os.stat(f)
        datasets[name] = {
            "size_bytes": stat.st_size,
            "last_updated": datetime.fromtimestamp(stat.st_mtime).isoformat()
        }
    return {
        "status": "running",
        "api_key_configured": bool(GEMINI_API_KEY),
        "datasets": datasets,
        "server_time": datetime.now().isoformat()
    }


@app.post("/api/refresh")
async def trigger_refresh():
    """Manually trigger agent re-run"""
    thread = threading.Thread(target=run_all_agents, daemon=True)
    thread.start()
    return {"message": "Agent pipeline started in background"}


# ─── Q&A Endpoint ────────────────────────────────────────────────
class QuestionRequest(BaseModel):
    question: str


# Legacy context builder removed. Using vector RAG instead.


@app.post("/api/ask")
async def ask_question(req: QuestionRequest):
    """AI Q&A powered by Gemini — uses server-side API key"""
    if not GEMINI_API_KEY:
        raise HTTPException(500, "Gemini API key not configured on server")

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-flash-latest")

        # Retrieve semantic context via vector search
        from db_client import query_knowledge_base
        context = query_knowledge_base(req.question, match_threshold=0.3, match_count=8)

        # Fallback if DB is empty or fails
        if not context:
            context = "No specific data found in the knowledge base. However, you are an UltraTech expert, answer based on general corporate knowledge."

        prompt = f"""You are the Chief Intelligence Officer for UltraTech Cement. 

**STRICT GUARDRAILS & DOMAIN RULES:**
1. Your ONLY domain of expertise is UltraTech Cement, the Indian cement and construction sector, macro-economic factors affecting it, and direct competitors (e.g., Adani Cement, Shree Cement, Dalmia Bharat, JSW Cement).
2. If the user asks a question COMPLETELY UNRELATED to this domain, you MUST politely decline. Say "I am a highly specialized corporate intelligence agent for UltraTech. I cannot assist with [topic]."
3. **DO NOT REGURGITATE THE ENTIRE CONTEXT.** If the user asks a simple, conversational or YES/NO question (e.g. "Do you have data on annual reports?"), answer it directly and briefly (e.g. "Yes, I have access to UltraTech's capacity, financial revenue, and M&A data.").
4. Only use detailed bullet points and long-form analysis if the user's question demands a comprehensive strategic or financial answer.
5. Your tone must remain austere, objective, and executive ("Consulting Firm" style).

**INTERNAL CONTEXT (Retrieved via pgvector):**
{context}

**USER QUESTION:** 
{req.question}

Answer directly and structurally."""

        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.3, "max_output_tokens": 1500}
        )
        return {"answer": response.text, "source": "gemini"}
    except Exception as e:
        raise HTTPException(500, f"AI error: {str(e)}")


# ─── Frontend Serving ────────────────────────────────────────────
@app.get("/")
async def serve_dashboard():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/{filename}")
async def serve_static(filename: str):
    filepath = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    raise HTTPException(404, f"File not found: {filename}")


# ─── Entry Point ─────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    print(f"\n[SERVER] Starting UltraTech Intelligence Hub Server...")
    print(f"   Dashboard: http://localhost:{port}")
    print(f"   API docs:  http://localhost:{port}/docs")
    print("   Agents auto-refresh every 4 hours")
    print("   Press Ctrl+C to stop\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
