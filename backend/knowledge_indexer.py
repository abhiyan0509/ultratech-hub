import os
import json
import glob
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

TABLE_NAME = "knowledge_embeddings"

def get_embedding(text: str) -> list[float]:
    """Generate vector embedding using Gemini API."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set")
    
    genai.configure(api_key=GEMINI_API_KEY)
    
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text,
        task_type="retrieval_document",
    )
    return result['embedding']

def clear_existing_embeddings():
    """Clear the knowledge_embeddings table before re-indexing."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
        
    print("[Supabase] Clearing old vector embeddings...")
    endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}?id=not.is.null"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    requests.delete(endpoint, headers=headers)

def upsert_knowledge_vector(content: str, metadata: dict):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return False
        
    try:
        embedding = get_embedding(content)
    except Exception as e:
        print(f"  [Gemini] Embedding failed: {e}")
        return False
        
    endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    data = {
        "content": content,
        "metadata": metadata,
        "embedding": embedding
    }
    
    response = requests.post(endpoint, headers=headers, json=data)
    if response.status_code in [200, 201, 204]:
        print(f"  [Supabase] Indexed snippet from '{metadata.get('source')}'")
        return True
    else:
        print(f"  [Supabase] Failed to insert vector: {response.text}")
        return False

def extract_semantic_chunks(ds_name: str, data: dict):
    """Semantic chunking of JSON payloads to form context paragraphs."""
    chunks = []
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict):
                # Break apart lists of objects (e.g., individual M&A deals or News articles)
                for item in value:
                    text = f"Regarding {ds_name} - {key}:\n" + json.dumps(item)
                    chunks.append(text)
            else:
                # Group other objects into a single chunk
                text = f"Regarding {ds_name} - {key}:\n" + json.dumps(value)
                chunks.append(text)
    elif isinstance(data, list):
        for item in data:
            chunks.append(f"Regarding {ds_name}:\n" + json.dumps(item))
    else:
        chunks.append(f"Regarding {ds_name}:\n" + str(data))
    return chunks

def process_datasets():
    """Reads all scraped data, chunks it, and creates vector embeddings."""
    print("="*60)
    print("   Starting Vector Knowledge Indexing Pipeline   ")
    print("="*60)
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase credentials missing. Aborting.")
        return
        
    clear_existing_embeddings()
    
    base_dir = os.path.dirname(__file__)
    data_dir = os.path.join(base_dir, "data")
    
    for filepath in glob.glob(os.path.join(data_dir, "*.json")):
        ds_name = os.path.splitext(os.path.basename(filepath))[0]
        print(f"\n[Processing] Extracting knowledge from '{ds_name}'...")
        
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception:
                continue
                
        chunks = extract_semantic_chunks(ds_name, data)
        
        # Upsert chunks
        for i, text in enumerate(chunks):
            # Clean up the text a bit to save tokens
            if len(text) < 10: 
                continue
                
            # Truncate to avoid Gemini token limit overflows per chunk (approx 8000 chars)
            if len(text) > 8000:
                text = text[:8000]
                
            upsert_knowledge_vector(
                content=text,
                metadata={"source": ds_name, "chunk_index": i}
            )
            
    print("="*60)
    print("   Finished indexing all knowledge!   ")
    print("="*60)

if __name__ == "__main__":
    process_datasets()
