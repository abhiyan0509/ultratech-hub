import json
import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDtsR-meNAXzGp-oJgYTObZa4enzHddKrU")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xcaeygmmlolpoeyuxyxp.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_oKS-fK6l5oKyZuQP3bEWZA_ALBCYz7o")

TABLE_NAME = "knowledge_embeddings"
genai.configure(api_key=GEMINI_API_KEY)

def get_embedding(text: str) -> list[float]:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document",
    )
    return result['embedding']

def upsert_vector(content: str, source: str):
    try:
        embedding = get_embedding(content)
        endpoint = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        data = {
            "content": content,
            "metadata": {"source": source, "manual_push": True},
            "embedding": embedding
        }
        res = requests.post(endpoint, headers=headers, json=data)
        if res.status_code in [200, 201, 204]:
            print(f"[OK] Injected 5-Year History Vector for {source}")
        else:
            print(f"[ERROR] {res.text}")
    except Exception as e:
        print(f"[EMBED FAIL] {e}")

if __name__ == "__main__":
    print("Force Pushing 5-Year Historical Memory into Supabase Vector DB...")
    payload = """
    Regarding historical_financials - UltraTech Cement:
    The revenue (in INR) for UltraTech Cement over the last 5 years is as follows: 
    - FY 2024: 709,080,000,000 (Rs. 709,080 Cr)
    - FY 2023: 632,390,000,000 (Rs. 632,390 Cr)
    - FY 2022: 525,980,000,000 (Rs. 525,980 Cr)
    - FY 2021: 447,250,000,000 (Rs. 447,250 Cr)
    - FY 2020: 421,250,000,000 (Rs. 421,250 Cr)
    - FY 2019: 416,090,000,000 (Rs. 416,090 Cr)
    """
    
    payload_net_income = """
    Regarding historical_financials - UltraTech Cement Net Income:
    The Net Income (in INR) for UltraTech Cement over the last 5 years is as follows:
    - FY 2024: 70,000,000,000 (Rs. 70,000 Cr)
    - FY 2023: 50,640,000,000 (Rs. 50,640 Cr)
    - FY 2022: 73,340,000,000 (Rs. 73,340 Cr)
    - FY 2021: 54,620,000,000 (Rs. 54,620 Cr)
    - FY 2020: 58,150,000,000 (Rs. 58,150 Cr)
    """
    
    upsert_vector(payload, "historical_financials_revenue")
    upsert_vector(payload_net_income, "historical_financials_income")
    print("Done! Ask the RAG agent now.")
