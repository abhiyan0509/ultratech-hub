"""
Macro Agent V1 — tracks energy, infrastructure, and housing indices.
Context: Cement production is energy-intensive; Infra spending drives volume.
"""

import json
import os
import yfinance as yf
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

MACRO_TICKERS = {
    "Coal (Newcastle)": "NCF=F",
    "Crude Oil (WTI)": "CL=F",
    "Nifty Infrastructure": "^CNXINFRA",
    "Nifty Realty": "^CNXREALTY",
    "US Dollar/INR": "INR=X"
}

def fetch_macro_data():
    print("  [Macro] Fetching global trends...")
    results = []
    
    for name, ticker in MACRO_TICKERS.items():
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="5d")
            if not hist.empty:
                current = hist['Close'].iloc[-1]
                prev = hist['Close'].iloc[-2]
                change = ((current - prev) / prev) * 100
                
                results.append({
                    "name": name,
                    "value": round(float(current), 2),
                    "change": round(float(change), 2),
                    "trend": "up" if change > 0 else "down"
                })
        except Exception as e:
            print(f"    Warning: Failed to fetch {name}: {e}")
            
    return {
        "data": results,
        "generated_at": datetime.now().isoformat(),
        "summary": "Energy prices and infrastructure indices affecting UltraTech's input costs and market demand."
    }

def run():
    print("\n[MACRO] Macro Agent Starting...")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    macro_info = fetch_macro_data()
    
    with open(os.path.join(DATA_DIR, "macro.json"), "w", encoding="utf-8") as f:
        json.dump(macro_info, f, indent=2, ensure_ascii=False)
        
    print(f"  [OK] Saved macro.json ({len(macro_info['data'])} items)")
    print("[MACRO] Macro Agent Complete!\n")
    return macro_info

if __name__ == "__main__":
    run()
