"""
M&A Agent — Builds a comprehensive knowledge base of Ultratech Cement's M&A history.
Combines pre-researched deal data with live web scraping for latest updates.
Saves to backend/data/ma_deals.json
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


def build_ma_knowledge_base():
    """Build comprehensive M&A deal profiles with research-backed data"""
    print("  [M&A] Building deal knowledge base...")

    deals = [
        {
            "id": "india_cements_2024",
            "target": "India Cements Limited",
            "year": 2024,
            "status": "Completed",
            "deal_value": "~₹3,954 crore (for 32.72% promoter stake) + open market purchases",
            "stake_acquired": "55.49% (controlling stake)",
            "timeline": [
                {"date": "June 2024", "event": "UltraTech acquires initial 22.77% stake through open market"},
                {"date": "July 2024", "event": "Agreement to acquire additional 32.72% from promoters for ₹3,954 crore"},
                {"date": "December 20, 2024", "event": "CCI (Competition Commission of India) approves the acquisition"},
                {"date": "December 24-25, 2024", "event": "India Cements officially becomes a subsidiary of UltraTech"},
                {"date": "Late December 2024", "event": "Open offer launched to acquire additional 26% from public shareholders"}
            ],
            "capacity_added_mtpa": 15.4,
            "rationale": [
                "Strategic entry into South India — India Cements is a dominant player in Tamil Nadu, Andhra Pradesh, and Telangana",
                "Fills geographic gap — UltraTech was relatively weaker in deep South India",
                "Adds 15.4 MTPA capacity at attractive valuation compared to greenfield",
                "India Cements has established brand ('Coromandel' brand, IPL Chennai Super Kings sponsor)",
                "Consolidation play — reduces competition and strengthens market leadership",
                "Access to India Cements' limestone reserves and plant infrastructure"
            ],
            "strategic_impact": "This deal significantly strengthens UltraTech's presence in South India, a market where it was historically under-indexed. India Cements brings established dealer networks, brand recognition, and proximity to key infrastructure projects in Southern states.",
            "risks": [
                "Integration challenges — India Cements has had operational inefficiencies",
                "Regulatory scrutiny around market concentration in Southern region",
                "Open offer obligation increases total deal cost"
            ]
        },
        {
            "id": "kesoram_2025",
            "target": "Kesoram Industries — Cement Business",
            "year": 2025,
            "status": "Completed",
            "deal_value": "Scheme of arrangement",
            "stake_acquired": "100% of cement business",
            "timeline": [
                {"date": "2023", "event": "Scheme of arrangement announced for demerger of Kesoram's cement business"},
                {"date": "2024", "event": "Regulatory approvals obtained (NCLT, CCI, SEBI)"},
                {"date": "March 1, 2025", "event": "Transfer of cement business to UltraTech becomes effective"}
            ],
            "capacity_added_mtpa": 10.75,
            "rationale": [
                "Adds 10.75 MTPA grey cement capacity, pushing total to 183+ MTPA",
                "Kesoram's plants are located in Andhra Pradesh, Telangana, and West Bengal",
                "Synergies with existing UltraTech operations — overlapping regions for logistics",
                "Kesoram was a stressed asset — acquired at favorable valuation",
                "Part of broader Aditya Birla Group restructuring (Kesoram is also a group company)"
            ],
            "strategic_impact": "This acquisition pushed UltraTech's total capacity to 183.06 MTPA, further cementing its position as India's largest cement manufacturer. The plants complement existing operations in the South and East.",
            "risks": [
                "Kesoram's cement business had lower utilization rates",
                "Requires capex to upgrade and optimize acquired plants",
                "Potential overlap with India Cements in similar geographies"
            ]
        },
        {
            "id": "star_cement_2024",
            "target": "Star Cement",
            "year": 2024,
            "status": "Stake Acquired",
            "deal_value": "₹851 crore",
            "stake_acquired": "8.69%",
            "timeline": [
                {"date": "December 2024", "event": "UltraTech acquires 8.69% stake in Star Cement for ₹851 crore"}
            ],
            "capacity_added_mtpa": 0,
            "rationale": [
                "Strategic stake — potential precursor to a full acquisition",
                "Star Cement is the largest cement company in North-East India",
                "North-East is an underserved, high-growth market with government infrastructure push",
                "Gives UltraTech a foothold in a region with high entry barriers (logistics, terrain)",
                "Star Cement has ~7 MTPA capacity with plans to expand to 10+ MTPA"
            ],
            "strategic_impact": "While only a minority stake, this signals UltraTech's intent to have a presence in the North-East Indian market. A full acquisition could follow, giving UltraTech pan-India coverage including this hard-to-enter region.",
            "risks": [
                "Minority stake gives limited control",
                "North-East India has logistical challenges and lower demand density",
                "Star Cement's other shareholders may resist a takeover"
            ]
        },
        {
            "id": "heidelberg_2025",
            "target": "HeidelbergCement India",
            "year": 2025,
            "status": "In Discussions",
            "deal_value": "~₹3,381 crore (estimated for 69.39% stake)",
            "stake_acquired": "69.39% (potential)",
            "timeline": [
                {"date": "January 2025", "event": "Reports emerge of advanced discussions between UltraTech and HeidelbergCement AG"},
                {"date": "Q1 2025", "event": "Negotiations ongoing — deal structure being finalized"}
            ],
            "capacity_added_mtpa": 6.6,
            "rationale": [
                "HeidelbergCement India has plants in Central India (MP, UP) — complements UltraTech's network",
                "HeidelbergCement AG (German parent) is divesting non-core Asian assets",
                "Adds ~6.6 MTPA capacity at reasonable valuation",
                "Well-run plants with good operational metrics — easier integration",
                "Reduces competition in Central India market"
            ],
            "strategic_impact": "If completed, this would add another 6.6 MTPA and bring UltraTech closer to the 200 MTPA target. HeidelbergCement India is known for operational efficiency, so integration risks are lower compared to India Cements.",
            "risks": [
                "Deal not yet confirmed — could fall through",
                "CCI scrutiny given UltraTech's growing market dominance",
                "Valuation may increase with competitive bids"
            ]
        },
        {
            "id": "century_2018",
            "target": "Century Textiles — Cement Division",
            "year": 2018,
            "status": "Completed",
            "deal_value": "Part of group restructuring",
            "stake_acquired": "100%",
            "timeline": [
                {"date": "2018", "event": "Cement division of Century Textiles transferred to UltraTech via demerger scheme"}
            ],
            "capacity_added_mtpa": 11.4,
            "rationale": [
                "Group-level consolidation — Century Textiles is an Aditya Birla Group company",
                "Eliminated intra-group competition in cement",
                "Added 11.4 MTPA capacity primarily in Central and Western India",
                "Operational synergies from combining logistics and distribution"
            ],
            "strategic_impact": "This deal consolidated ABG's cement operations under UltraTech, creating a cleaner corporate structure and unlocking scale benefits.",
            "risks": ["Minimal — intra-group transfer with aligned interests"]
        },
        {
            "id": "jaypee_2017",
            "target": "Jaiprakash Associates — Cement Plants",
            "year": 2017,
            "status": "Completed",
            "deal_value": "₹16,189 crore",
            "stake_acquired": "100% of specified plants",
            "timeline": [
                {"date": "2016-2017", "event": "Multi-phase acquisition of JP cement plants, including 21.2 MTPA capacity"}
            ],
            "capacity_added_mtpa": 21.2,
            "rationale": [
                "Massive capacity addition at distressed valuations (JP was under financial stress)",
                "Plants located across Madhya Pradesh, Uttar Pradesh, Karnataka",
                "Accelerated UltraTech's growth faster than organic expansion",
                "Acquired alongside limestone reserves for long-term raw material security"
            ],
            "strategic_impact": "One of the largest cement acquisitions in Indian history. This propelled UltraTech from a mid-sized player to the undisputed market leader.",
            "risks": ["Integration of distressed assets required significant management attention"]
        },
    ]

    # Add M&A strategy summary
    ma_data = {
        "deals": deals,
        "strategy_summary": {
            "total_deals_since_2014": 6,
            "total_capacity_added_via_ma_mtpa": 65.35,
            "approach": "Aggressive inorganic growth strategy combining opportunistic acquisitions of distressed assets (Jaypee, Kesoram) with strategic acquisitions for geographic expansion (India Cements, Star Cement)",
            "key_themes": [
                "Geographic expansion to underserved regions (South, North-East)",
                "Consolidation of fragmented market — increasing market share",
                "Acquiring distressed assets at attractive valuations",
                "Intra-group restructuring (Century Textiles, Kesoram)",
                "Target of 200 MTPA capacity by FY27"
            ],
            "competitive_context": "UltraTech is in a two-way race with Adani Group (Ambuja+ACC at ~100 MTPA) for cement market dominance. The M&A strategy is critical to maintaining the #1 position."
        },
        "generated_at": datetime.now().isoformat()
    }

    return ma_data


def scrape_latest_ma_news():
    """Scrape for latest M&A-related news"""
    print("  [M&A] Scraping for latest M&A news...")
    ma_news = []

    try:
        url = "https://news.google.com/rss/search?q=UltraTech+Cement+acquisition+merger&hl=en-IN&gl=IN&ceid=IN:en"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "xml")
            items = soup.find_all("item")[:10]
            for item in items:
                title = item.find("title")
                pub_date = item.find("pubDate")
                source = item.find("source")
                if title:
                    ma_news.append({
                        "title": title.get_text(strip=True),
                        "date": pub_date.get_text(strip=True) if pub_date else "",
                        "source": source.get_text(strip=True) if source else ""
                    })
            print(f"  [M&A] Found {len(ma_news)} M&A-related news articles")
    except Exception as e:
        print(f"  [M&A] Warning: M&A news scraping failed: {e}")

    return ma_news


def run():
    """Execute M&A agent"""
    print("\n[M&A] M&A Agent Starting...")
    os.makedirs(DATA_DIR, exist_ok=True)

    ma_data = build_ma_knowledge_base()
    ma_data["latest_news"] = scrape_latest_ma_news()

    with open(os.path.join(DATA_DIR, "ma_deals.json"), "w", encoding="utf-8") as f:
        json.dump(ma_data, f, indent=2, ensure_ascii=False)
    print(f"  [OK] Saved ma_deals.json ({len(ma_data['deals'])} deals)")

    print("[M&A] M&A Agent Complete!\n")
    return ma_data


if __name__ == "__main__":
    run()
