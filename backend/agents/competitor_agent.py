"""
Competitor Agent — Gathers detailed profiles for Ultratech's key competitors.
Combines scraped data with curated intelligence.
Saves to backend/data/competitors.json
"""

import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


def build_competitor_profiles():
    """Build detailed profiles for each major competitor"""
    print("  [Competitor] Building competitor profiles...")

    competitors = {
        "UltraTech Cement": {
            "ticker": "ULTRACEMCO.NS",
            "parent_group": "Aditya Birla Group",
            "capacity_mtpa": 183.06,
            "target_capacity_mtpa": 200,
            "target_year": "FY27",
            "market_share": "~28%",
            "key_regions": ["Pan-India", "UAE", "Bahrain", "Sri Lanka"],
            "brands": ["UltraTech", "Birla White", "UltraTech Building Solutions"],
            "strengths": [
                "Largest capacity in India (183+ MTPA)",
                "Pan-India presence with unmatched distribution",
                "Strong M&A execution track record",
                "Diversified portfolio (grey, white, RMC, building products)",
                "Part of Aditya Birla Group — deep pockets"
            ],
            "weaknesses": [
                "Integration risk from rapid acquisitions",
                "Premium valuation limits upside",
                "High debt from M&A spree"
            ],
            "recent_moves": [
                "Acquired India Cements (2024)",
                "Completed Kesoram cement acquisition (2025)",
                "8.69% stake in Star Cement",
                "In talks for HeidelbergCement India"
            ]
        },
        "Ambuja Cements (Adani Group)": {
            "ticker": "AMBUJACEM.NS",
            "parent_group": "Adani Group",
            "capacity_mtpa": 100,
            "target_capacity_mtpa": 140,
            "target_year": "FY28",
            "market_share": "~17% (combined with ACC)",
            "key_regions": ["North India", "West India", "Central India"],
            "brands": ["Ambuja Cement"],
            "strengths": [
                "Adani Group financial muscle — aggressive expansion plans",
                "Combined with ACC, forms India's #2 cement platform",
                "Strong brand in North and West India",
                "Premium positioning in the market",
                "Significant expansion of grinding and integrated capacity underway"
            ],
            "weaknesses": [
                "Still integrating post Adani acquisition (2022)",
                "Adani Group faces governance scrutiny (Hindenburg fallout)",
                "Combined entity yet to demonstrate synergies fully"
            ],
            "recent_moves": [
                "Adani acquired Ambuja + ACC from Holcim for $6.4B (2022)",
                "Aggressive capex plan to reach 140 MTPA by FY28",
                "Acquired Sanghi Industries cement (2023)",
                "Consolidating ACC + Ambuja operations"
            ]
        },
        "ACC Ltd (Adani Group)": {
            "ticker": "ACC.NS",
            "parent_group": "Adani Group",
            "capacity_mtpa": 40,
            "target_capacity_mtpa": None,
            "target_year": None,
            "market_share": "Included in Ambuja/Adani combined",
            "key_regions": ["East India", "West India", "Central India"],
            "brands": ["ACC Gold", "ACC Suraksha"],
            "strengths": [
                "One of India's oldest cement brands (since 1936)",
                "Strong presence in East and Central India",
                "Well-established dealer network",
                "RMC operations in key cities"
            ],
            "weaknesses": [
                "Operating under Ambuja Cements — limited independent strategy",
                "Capacity growth dependent on Adani Group decisions",
                "Historical profitability lower than peers"
            ],
            "recent_moves": [
                "Being integrated under Adani Group umbrella",
                "Capacity expansion aligned with Ambuja's growth plans"
            ]
        },
        "Shree Cement": {
            "ticker": "SHREECEM.NS",
            "parent_group": "Bangur Family",
            "capacity_mtpa": 56.4,
            "target_capacity_mtpa": 80,
            "target_year": "FY27",
            "market_share": "~6%",
            "key_regions": ["North India", "East India"],
            "brands": ["Shree Cement", "Roofon", "Bangur"],
            "strengths": [
                "Best-in-class cost efficiency and margins",
                "Highest EBITDA per tonne among peers",
                "Conservative financial management — low debt",
                "Strong in North India (Rajasthan, UP)",
                "Among the lowest power and fuel costs"
            ],
            "weaknesses": [
                "Limited presence in South India",
                "Smaller scale compared to UltraTech and Adani",
                "Less aggressive M&A strategy — organic growth focus"
            ],
            "recent_moves": [
                "Organic capacity expansion from 47 to 56 MTPA",
                "Expanding into East India and Central India",
                "Focus on sustainability and green cement"
            ]
        },
        "Dalmia Bharat": {
            "ticker": "DALBHARAT.NS",
            "parent_group": "Dalmia Bharat Group",
            "capacity_mtpa": 46.6,
            "target_capacity_mtpa": 75,
            "target_year": "FY28",
            "market_share": "~5%",
            "key_regions": ["South India", "East India"],
            "brands": ["Dalmia Cement", "Konark Cement"],
            "strengths": [
                "Strong presence in South and East India",
                "Industry leader in sustainability — highest alternative fuel usage",
                "Good growth trajectory with ambitious targets",
                "Well-managed with consistent financial performance"
            ],
            "weaknesses": [
                "Smaller scale versus top two",
                "Heavy reliance on South and East — geographic concentration",
                "Lower brand recall compared to UltraTech or Ambuja"
            ],
            "recent_moves": [
                "Acquired Jaiprakash Associates cement plants in East India",
                "Commissioning new capacity in Odisha, Bihar, and Tamil Nadu",
                "Target of 75 MTPA by FY28"
            ]
        },
        "JK Cement": {
            "ticker": "JKCEMENT.NS",
            "parent_group": "JK Organisation",
            "capacity_mtpa": 25,
            "target_capacity_mtpa": 35,
            "target_year": "FY27",
            "market_share": "~3%",
            "key_regions": ["North India", "Rajasthan", "Gujarat"],
            "brands": ["JK Cement", "JK Super Cement", "JK Lakshmi"],
            "strengths": [
                "Strong in North India — premium brand",
                "White cement market leader",
                "Good profitability metrics",
                "Established brand trust"
            ],
            "weaknesses": [
                "Limited geographic spread beyond North/West India",
                "Smaller scale — could become acquisition target",
                "Less diversified product portfolio"
            ],
            "recent_moves": [
                "Expanding into Central and South India",
                "New clinker and grinding capacity additions",
                "Investing in sustainable manufacturing"
            ]
        }
    }

    return competitors


def build_swot_comparison():
    """Build SWOT-style comparison of Ultratech vs competitors"""
    print("  [Competitor] Building strategic comparison...")

    return {
        "ultratech_vs_adani": {
            "comparison": "The Big Two — UltraTech (183 MTPA) vs Adani Group (100 MTPA, via Ambuja+ACC)",
            "ultratech_advantage": "Larger capacity, more integrated operations, proven integration track record, and stronger pan-India presence",
            "adani_advantage": "Adani Group's deep pockets and aggressive expansion could close the capacity gap faster. They plan to reach 140 MTPA by FY28",
            "verdict": "UltraTech leads today, but the gap is narrowing. Adani is the most credible challenger."
        },
        "ultratech_vs_shree": {
            "comparison": "Scale vs Efficiency — UltraTech (183 MTPA) vs Shree Cement (56 MTPA)",
            "ultratech_advantage": "3x the capacity, pan-India presence, diversified portfolio",
            "shree_advantage": "Best-in-class cost efficiency, highest margins, conservative balance sheet",
            "verdict": "Different strategies — UltraTech wins on scale, Shree wins on profitability per tonne"
        },
        "ultratech_vs_dalmia": {
            "comparison": "Incumbent vs Challenger — UltraTech (183 MTPA) vs Dalmia Bharat (46 MTPA)",
            "ultratech_advantage": "4x capacity, established brand, stronger distribution",
            "dalmia_advantage": "Sustainability leadership, strong South/East presence, ambitious growth targets",
            "verdict": "UltraTech dominates, but Dalmia is a well-run company growing fast in key regions"
        },
        "industry_outlook": {
            "consolidation_trend": "Top 5 companies now hold 59% market share (up from 54% in 2023). Expected to reach 65%+ by FY28.",
            "capacity_race": "UltraTech targets 200 MTPA by FY27. Adani targets 140 MTPA by FY28. The race for #1 is intense.",
            "expected_slowdown": "Major M&A expected to slow in H1 2026 as companies focus on integrating recent acquisitions.",
            "demand_outlook": "Indian cement demand expected to grow 7-8% in FY25-26, driven by government infrastructure spending."
        }
    }


def run():
    """Execute competitor agent"""
    print("\n[COMPETITOR] Competitor Agent Starting...")
    os.makedirs(DATA_DIR, exist_ok=True)

    profiles = build_competitor_profiles()
    swot = build_swot_comparison()

    data = {
        "competitors": profiles,
        "strategic_comparison": swot,
        "generated_at": datetime.now().isoformat()
    }

    with open(os.path.join(DATA_DIR, "competitors.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  [OK] Saved competitors.json ({len(profiles)} companies)")

    print("[COMPETITOR] Competitor Agent Complete!\n")
    return data


if __name__ == "__main__":
    run()
