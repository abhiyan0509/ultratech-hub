"""
Financial Agent V2 — Robust data fetching with fallbacks for all fields.
No blank data — every field gets a value or explicit "N/A".
"""

import json
import os
import yfinance as yf
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

TICKERS = {
    "UltraTech Cement": "ULTRACEMCO.NS",
    "Ambuja Cements": "AMBUJACEM.NS",
    "ACC": "ACC.NS",
    "Shree Cement": "SHREECEM.NS",
    "Dalmia Bharat": "DALBHARAT.NS",
    "JK Cement": "JKCEMENT.NS",
}


def safe_get(info, *keys, default=None):
    """Try multiple keys, return first non-None value"""
    for key in keys:
        val = info.get(key)
        if val is not None:
            return val
    return default


def format_inr(val):
    """Format to INR readable string"""
    if val is None or val == 0:
        return "N/A"
    if abs(val) >= 1e12:
        return f"Rs.{val/1e12:.2f}T"
    if abs(val) >= 1e9:
        return f"Rs.{val/1e9:.2f}B"
    if abs(val) >= 1e7:
        return f"Rs.{val/1e7:.0f}Cr"
    if abs(val) >= 1e5:
        return f"Rs.{val/1e5:.0f}L"
    return f"Rs.{val:,.0f}"


def pct(val):
    """Format percentage"""
    if val is None:
        return "N/A"
    if abs(val) < 1:
        return f"{val*100:.1f}%"
    return f"{val:.1f}%"


def num(val, decimals=2):
    """Format number"""
    if val is None:
        return "N/A"
    return f"{val:.{decimals}f}"


def fetch_company_financials(name, ticker):
    """Fetch financial data with robust error handling per field"""
    print(f"  [Financial] Fetching {name} ({ticker})...")
    result = {
        "name": name,
        "ticker": ticker,
        "current_price": "N/A",
        "current_price_raw": None,
        "market_cap": "N/A",
        "market_cap_raw": None,
        "pe_ratio": "N/A",
        "forward_pe": "N/A",
        "pb_ratio": "N/A",
        "ev_ebitda": "N/A",
        "roe": "N/A",
        "debt_to_equity": "N/A",
        "revenue": "N/A",
        "revenue_raw": None,
        "ebitda": "N/A",
        "ebitda_raw": None,
        "profit_margin": "N/A",
        "operating_margin": "N/A",
        "dividend_yield": "N/A",
        "52w_high": "N/A",
        "52w_low": "N/A",
        "beta": "N/A",
        "ytd_return": "N/A",
        "ytd_return_raw": None,
        "price_history": [],
    }

    try:
        stock = yf.Ticker(ticker)
        info = stock.info or {}

        # Price
        price = safe_get(info, "currentPrice", "regularMarketPrice", "previousClose")
        if price:
            result["current_price"] = f"Rs.{price:,.2f}"
            result["current_price_raw"] = price

        # Market cap
        mc = safe_get(info, "marketCap")
        if mc:
            result["market_cap"] = format_inr(mc)
            result["market_cap_raw"] = mc

        # Ratios
        pe = safe_get(info, "trailingPE", "forwardPE")
        result["pe_ratio"] = num(pe) if pe else "N/A"
        result["forward_pe"] = num(safe_get(info, "forwardPE")) if safe_get(info, "forwardPE") else "N/A"
        result["pb_ratio"] = num(safe_get(info, "priceToBook"))
        result["ev_ebitda"] = num(safe_get(info, "enterpriseToEbitda"))

        # Margins & returns
        roe = safe_get(info, "returnOnEquity")
        result["roe"] = pct(roe)
        result["debt_to_equity"] = num(safe_get(info, "debtToEquity"), 1)
        result["profit_margin"] = pct(safe_get(info, "profitMargins"))
        result["operating_margin"] = pct(safe_get(info, "operatingMargins"))

        # Revenue & EBITDA
        rev = safe_get(info, "totalRevenue")
        if rev:
            result["revenue"] = format_inr(rev)
            result["revenue_raw"] = rev
        ebitda = safe_get(info, "ebitda")
        if ebitda:
            result["ebitda"] = format_inr(ebitda)
            result["ebitda_raw"] = ebitda

        # Other
        dy = safe_get(info, "dividendYield")
        result["dividend_yield"] = pct(dy) if dy else "N/A"
        result["52w_high"] = f"Rs.{info['fiftyTwoWeekHigh']:,.2f}" if info.get("fiftyTwoWeekHigh") else "N/A"
        result["52w_low"] = f"Rs.{info['fiftyTwoWeekLow']:,.2f}" if info.get("fiftyTwoWeekLow") else "N/A"
        result["beta"] = num(safe_get(info, "beta"), 2)

        # Price history
        try:
            hist = stock.history(period="1y")
            if hist is not None and not hist.empty:
                ph = []
                for date, row in hist.iterrows():
                    ph.append({
                        "date": date.strftime("%Y-%m-%d"),
                        "close": round(float(row["Close"]), 2),
                        "volume": int(row["Volume"]) if row["Volume"] else 0
                    })
                result["price_history"] = ph
                if len(ph) > 1:
                    ret = ((ph[-1]["close"] - ph[0]["close"]) / ph[0]["close"]) * 100
                    result["ytd_return"] = f"{ret:+.1f}%"
                    result["ytd_return_raw"] = round(ret, 2)
        except Exception as e:
            print(f"    Warning: price history failed for {name}: {e}")

    except Exception as e:
        print(f"  [Financial] Error for {name}: {e}")
        result["error"] = str(e)

    return result


def build_comparison():
    """Build comparison with all data formatted"""
    print("  [Financial] Building comparison...")
    all_data = {}
    for name, ticker in TICKERS.items():
        all_data[name] = fetch_company_financials(name, ticker)

    # Build comparison rows
    metrics = [
        ("Market Cap", "market_cap"),
        ("Stock Price", "current_price"),
        ("P/E Ratio", "pe_ratio"),
        ("P/B Ratio", "pb_ratio"),
        ("EV/EBITDA", "ev_ebitda"),
        ("ROE", "roe"),
        ("Debt/Equity", "debt_to_equity"),
        ("Revenue", "revenue"),
        ("EBITDA", "ebitda"),
        ("Profit Margin", "profit_margin"),
        ("Operating Margin", "operating_margin"),
        ("Dividend Yield", "dividend_yield"),
        ("52W High", "52w_high"),
        ("52W Low", "52w_low"),
        ("1Y Return", "ytd_return"),
        ("Beta", "beta"),
    ]

    comparison_rows = []
    for metric_name, key in metrics:
        row = {"metric": metric_name}
        for name in TICKERS:
            row[name] = all_data[name].get(key, "N/A")
        comparison_rows.append(row)

    return {
        "companies": all_data,
        "comparison_metrics": comparison_rows,
        "generated_at": datetime.now().isoformat()
    }


def run():
    """Execute financial data collection"""
    print("\n[FINANCIAL] Financial Agent Starting...")
    os.makedirs(DATA_DIR, exist_ok=True)

    comparison = build_comparison()

    with open(os.path.join(DATA_DIR, "financials.json"), "w", encoding="utf-8") as f:
        json.dump(comparison, f, indent=2, ensure_ascii=False, default=str)
    print(f"  [OK] Saved financials.json ({len(comparison['companies'])} companies)")
    print("[FINANCIAL] Financial Agent Complete!\n")
    return comparison


if __name__ == "__main__":
    run()
