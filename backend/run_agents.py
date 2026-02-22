"""
Run Agents V2 — Single entry point to run all data collection agents.
Now includes the Outlook agent.
"""

import sys
import os
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from agents import crawler_agent, financial_agent, ma_agent, competitor_agent, outlook_agent, macro_agent


def main():
    print("=" * 60)
    print("   UltraTech Intelligence Hub - Agent Pipeline V2")
    print("=" * 60)
    print("   Starting data collection...\n")

    start_time = time.time()
    results = {}
    api_key = os.environ.get("GEMINI_API_KEY", "")

    agents = [
        ("crawler", lambda: crawler_agent.run()),
        ("financial", lambda: financial_agent.run()),
        ("ma", lambda: ma_agent.run()),
        ("competitor", lambda: competitor_agent.run()),
        ("outlook", lambda: outlook_agent.run(api_key=api_key)),
        ("macro", lambda: macro_agent.run()),
    ]

    for name, fn in agents:
        try:
            results[name] = fn()
        except Exception as e:
            print(f"[FAIL] {name.title()} Agent failed: {e}")
            results[name] = {"error": str(e)}

    elapsed = time.time() - start_time
    print("=" * 60)
    print(f"   [DONE] All agents complete! ({elapsed:.1f}s)")
    print(f"   Data saved to: backend/data/")
    print(f"")
    print(f"   Next steps:")
    print(f"   1. Start the server:  python backend/qa_agent.py")
    print(f"   2. Open dashboard:    http://localhost:8000")
    print("=" * 60)

    return results


if __name__ == "__main__":
    main()
