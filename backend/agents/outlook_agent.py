"""
Outlook Agent — Uses Gemini to analyze all collected data and generate:
- Strategic outlook for UltraTech's next 12 months
- Predicted M&A targets
- Risk factors
- Interview talking points
Saves to backend/data/outlook.json
"""

import json
import os
import glob
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def load_all_data():
    """Load all JSON data from other agents"""
    data = {}
    for filepath in glob.glob(os.path.join(DATA_DIR, "*.json")):
        key = os.path.splitext(os.path.basename(filepath))[0]
        if key == "outlook":
            continue
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data[key] = json.load(f)
        except Exception:
            pass
    return data


def build_context(data):
    """Build concise context string for Gemini"""
    parts = []

    if "company_info" in data:
        ci = data["company_info"]
        parts.append(f"COMPANY: {ci.get('name')}, Capacity: {ci.get('capacity_mtpa')} MTPA, CEO: {ci.get('ceo')}")
        if ci.get("competitive_advantages"):
            parts.append("ADVANTAGES: " + "; ".join(ci["competitive_advantages"][:5]))

    if "ma_deals" in data:
        ma = data["ma_deals"]
        for deal in ma.get("deals", []):
            parts.append(f"M&A: {deal['target']} ({deal['year']}) - Status: {deal['status']}, Capacity: {deal['capacity_added_mtpa']} MTPA, Value: {deal['deal_value']}")
        if ma.get("strategy_summary"):
            parts.append(f"M&A STRATEGY: {ma['strategy_summary'].get('approach','')}")

    if "financials" in data:
        fin = data["financials"]
        for name, comp in fin.get("companies", {}).items():
            if isinstance(comp, dict) and "error" not in comp:
                parts.append(f"FINANCIAL {name}: MC={comp.get('market_cap','N/A')}, PE={comp.get('pe_ratio','N/A')}, Revenue={comp.get('revenue','N/A')}, 1Y Return={comp.get('ytd_return','N/A')}")

    if "competitors" in data:
        comp = data["competitors"]
        for name, profile in comp.get("competitors", {}).items():
            parts.append(f"COMPETITOR {name}: {profile.get('capacity_mtpa')} MTPA, Share: {profile.get('market_share')}, Group: {profile.get('parent_group')}")

    if "industry" in data:
        ind = data["industry"]
        parts.append(f"INDUSTRY: Market size ${ind.get('market_size_usd_billion_2024')}B, Growth: {ind.get('projected_growth_cagr')}")
        if ind.get("industry_trends"):
            parts.append("TRENDS: " + "; ".join(ind["industry_trends"][:3]))

    if "news" in data:
        for item in data["news"].get("news", [])[:8]:
            parts.append(f"NEWS: {item.get('title','')}")

    return "\n".join(parts)


def generate_outlook_with_gemini(context, api_key):
    """Use Gemini to generate strategic outlook"""
    import google.generativeai as genai

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-flash-latest")

    prompt = f"""You are a senior equity research analyst covering UltraTech Cement and the Indian cement sector.

Based on this data:
{context}

Generate a comprehensive strategic outlook in STRICT JSON format with these exact keys:

{{
  "executive_summary": "3-4 sentence summary of UltraTech's current position and trajectory",
  "mood_score": 0.0, // A float from -1.0 (very bearish) to 1.0 (very bullish)
  "sentiment_analysis": "1-2 sentences explaining the rationale behind this score",
  "future_outlook": [
    {{"title": "...", "description": "2-3 sentences", "probability": "High/Medium/Low", "timeframe": "6-12 months", "rationale": "strategic justification"}}
  ],
  "predicted_next_moves": [
    {{"move": "...", "rationale": "why this is likely", "probability": "High/Medium/Low"}}
  ],
  "risk_factors": [
    {{"risk": "...", "severity": "High/Medium/Low", "mitigation": "how UltraTech can handle it", "rationale": "context behind this risk"}}
  ],
  "interview_talking_points": [
    {{"point": "...", "supporting_data": "specific numbers to cite", "rationale": "why this is an effective point"}}
  ],
  "key_metrics_to_watch": [
    {{"metric": "...", "current_value": "...", "significance": "why this matters"}}
  ]
}}

Include 4-5 items per section. Be specific, cite numbers from the data. Focus on forward-looking insights.
Return ONLY valid JSON, no markdown formatting."""

    try:
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.4, "max_output_tokens": 3000}
        )

        text = response.text.strip()
        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        import re
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
        return None
    except Exception as e:
        print(f"  [Outlook] Gemini API error (Rate Limit/Quota): {e}")
        return None


def build_fallback_outlook():
    """Fallback outlook if Gemini fails"""
    return {
        "executive_summary": "UltraTech Cement is India's largest cement manufacturer with 183+ MTPA capacity, aggressively consolidating the market through M&A. With India Cements and Kesoram acquisitions completed, and HeidelbergCement India in discussions, the company is on track for its 200 MTPA target by FY27. The primary competitive threat is the Adani Group's Ambuja+ACC platform at ~100 MTPA.",
        "mood_score": 0.75,
        "sentiment_analysis": "Highly bullish outlook driven by aggressive market consolidation (India Cements acquisition) and near-certainty of reaching 200 MTPA capacity by FY27.",
        "future_outlook": [
            {"title": "200 MTPA Target by FY27", "description": "With current capacity at 183 MTPA and HeidelbergCement India (6.6 MTPA) in discussions, UltraTech is well on track. Organic expansion will fill the remaining gap.", "probability": "High", "timeframe": "12-18 months", "rationale": "Strategic roadmap presented in recent analyst meets and current acquisition pipeline."},
            {"title": "Integration Focus in H1 2026", "description": "India Cements and Kesoram acquisitions need operational integration. Expect focus on cost optimization and capacity utilization improvement rather than new deals.", "probability": "High", "timeframe": "6-12 months", "rationale": "Recent large-scale acquisitions historically follow a 12-month optimization phase at ABG."},
            {"title": "North-East Expansion via Star Cement", "description": "The 8.69% stake in Star Cement could be a precursor to a full acquisition, giving UltraTech access to the underserved North-East market.", "probability": "Medium", "timeframe": "12-24 months", "rationale": "Initial minority stakes are often the first step in UltraTech's consolidation strategy (as seen with India Cements)."},
            {"title": "Margin Expansion from Scale Benefits", "description": "As integration of acquired assets completes, expect EBITDA margins to improve from current levels as synergies are realized.", "probability": "Medium", "timeframe": "12-18 months", "rationale": "Synergies in logistics and procurement typically yield 5-10% cost savings in merged cement units."},
        ],
        "predicted_next_moves": [
            {"move": "Complete HeidelbergCement India acquisition", "rationale": "Negotiations are advanced, adds 6.6 MTPA capacity in Central India, HeidelbergCement AG is exiting non-core Asian markets", "probability": "High"},
            {"move": "Increase stake in Star Cement towards majority", "rationale": "North-East India is a strategic gap, Star Cement is the dominant player there with 7 MTPA capacity", "probability": "Medium"},
            {"move": "Focus on operational integration of India Cements", "rationale": "India Cements has lower utilization rates and margins - fixing this is higher ROI than new acquisitions", "probability": "High"},
            {"move": "Expand green cement and sustainability initiatives", "rationale": "ESG is increasingly important for institutional investors, and blended cement demand is growing", "probability": "High"},
        ],
        "risk_factors": [
            {"risk": "Integration execution risk", "severity": "High", "mitigation": "UltraTech has a strong M&A integration track record from Jaypee and Century deals", "rationale": "India Cements has different operational culture and legacy systems that require careful alignment."},
            {"risk": "Adani Group catching up fast", "severity": "Medium", "mitigation": "UltraTech's 80+ MTPA capacity lead provides a significant buffer", "rationale": "Adani's aggressive capital allocation towards Ambuja and ACC poses a long-term market share threat."},
            {"risk": "Regulatory/CCI scrutiny on market dominance", "severity": "Medium", "mitigation": "28% market share is high but not monopolistic - CCI has approved all recent deals", "rationale": "Increased concentration in certain regional markets could trigger divestment requirements."},
            {"risk": "Cement demand slowdown", "severity": "Low", "mitigation": "Government infrastructure spending (Bharatmala, Smart Cities) provides demand floor", "rationale": "Temporary slowdowns in the real estate sector could impact retail sales volumes."},
        ],
        "interview_talking_points": [
            {"point": "UltraTech's M&A strategy is the most disciplined in Indian cement", "supporting_data": "6 major deals since 2014 adding 65+ MTPA, each targeted at geographic gaps or distressed assets at attractive valuations", "rationale": "Focus on value-unlocking and regional consolidation rather than simple vanity metrics."},
            {"point": "The India Cements deal fills the South India gap", "supporting_data": "55.49% controlling stake giving access to Tamil Nadu, AP, Telangana markets where UltraTech was weaker", "rationale": "Logistics are local in cement; having South Indian plants reduces shipping costs from Central India."},
            {"point": "Scale advantage is widening", "supporting_data": "183 MTPA vs Adani's 100 MTPA - nearly 2x the capacity of #2 player", "rationale": "Provides immense bargaining power with coal suppliers and logistics partners."},
            {"point": "Industry consolidation benefits the leader", "supporting_data": "Top 5 market share grew from 54% to 59% in 2 years - UltraTech benefits most from this trend", "rationale": "Consolidation leads to better price discipline across the industry."},
            {"point": "Path to 200 MTPA is clear", "supporting_data": "HeidelbergCement (6.6 MTPA) + organic expansion covers the remaining 17 MTPA gap from current 183 MTPA", "rationale": "Consistent capital expenditure roadmap backed by strong cash flows."},
        ],
        "key_metrics_to_watch": [
            {"metric": "Capacity Utilization", "current_value": "~70-75%", "significance": "Post-acquisition integration success will show up here first"},
            {"metric": "EBITDA per tonne", "current_value": "~Rs.1,100-1,200/tonne", "significance": "Improving this metric shows operational synergies from M&A are being realized"},
            {"metric": "Net Debt to EBITDA", "current_value": "~1.5x", "significance": "Key leverage metric - needs to stay manageable given M&A debt load"},
            {"metric": "India Cements subsidiary performance", "current_value": "First full quarter results pending", "significance": "Will validate the acquisition thesis"},
        ]
    }


def run(api_key=None):
    """Execute outlook agent"""
    print("\n[OUTLOOK] Outlook Agent Starting...")
    os.makedirs(DATA_DIR, exist_ok=True)

    data = load_all_data()
    context = build_context(data)

    outlook = None
    if api_key:
        print("  [Outlook] Generating AI-powered outlook...")
        outlook = generate_outlook_with_gemini(context, api_key)

    if not outlook:
        print("  [Outlook] Using curated outlook data...")
        outlook = build_fallback_outlook()

    outlook["generated_at"] = datetime.now().isoformat()
    outlook["source"] = "gemini" if api_key and outlook != build_fallback_outlook() else "curated"

    with open(os.path.join(DATA_DIR, "outlook.json"), "w", encoding="utf-8") as f:
        json.dump(outlook, f, indent=2, ensure_ascii=False)
    print("  [OK] Saved outlook.json")
    print("[OUTLOOK] Outlook Agent Complete!\n")
    return outlook


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
    run(api_key=os.environ.get("GEMINI_API_KEY"))
