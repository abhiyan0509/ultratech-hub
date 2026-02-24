import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

TABLE_NAME = "ultratech_intelligence"

def upsert_intelligence(dataset_id: str, payload: dict):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase credentials missing. Passing db upsert.")
        return False
        
    endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    data = {
        "id": dataset_id,
        "data": payload
    }
    
    response = requests.post(endpoint, headers=headers, json=data)
    if response.status_code in [200, 201]:
        print(f"[Supabase] Successfully upserted '{dataset_id}'")
        return True
    else:
        print(f"[Supabase] Failed to upsert '{dataset_id}': {response.text}")
        return False

def get_intelligence(dataset_id: str):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
        
    endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}?id=eq.{dataset_id}&select=data"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=5)
        if response.status_code == 200:
            res_json = response.json()
            if len(res_json) > 0:
                print(f"[Supabase] Cache HIT for '{dataset_id}'")
                return res_json[0].get("data")
    except Exception as e:
        print(f"[Supabase] Fetch error for '{dataset_id}': {e}")
        
    print(f"[Supabase] Cache MISS for '{dataset_id}'")
    return None

def query_knowledge_base(query: str, match_threshold: float = 0.5, match_count: int = 5):
    """Semantic vector search against the knowledge base."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return ""
        
    try:
        from knowledge_indexer import get_embedding
        query_embedding = get_embedding(query)
    except Exception as e:
        print(f"[Gemini] Failed to embed query: {e}")
        return ""
        
    endpoint = f"{SUPABASE_URL}/rest/v1/rpc/match_documents"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "query_embedding": query_embedding,
        "match_threshold": match_threshold,
        "match_count": match_count
    }
    
    try:
        response = requests.post(endpoint, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            docs = response.json()
            context = "\n\n".join([d.get("content", "") for d in docs])
            print(f"[Supabase] RAG retrieval success: found {len(docs)} matching paragraphs.")
            return context
        else:
            print(f"[Supabase] RAG retrieval failed: {response.text}")
    except Exception as e:
        print(f"[Supabase] RPC error: {e}")
        
    return ""
