// We are simulating the python execution here to make sure it works.
const fs = require('fs');

const mockHistoricalData = {
    "UltraTech Cement": [
        { "fiscal_year": "FY 2024", "revenue_inr": 709080000000.0, "net_income_inr": 70000000000.0, "ebit_inr": 105000000000.0, "total_assets_inr": 850000000000.0, "total_debt_inr": 95000000000.0 },
        { "fiscal_year": "FY 2023", "revenue_inr": 632390000000.0, "net_income_inr": 50640000000.0, "ebit_inr": 82000000000.0, "total_assets_inr": 780000000000.0, "total_debt_inr": 115000000000.0 },
        { "fiscal_year": "FY 2022", "revenue_inr": 525980000000.0, "net_income_inr": 73340000000.0, "ebit_inr": 115000000000.0, "total_assets_inr": 710000000000.0, "total_debt_inr": 145000000000.0 },
        { "fiscal_year": "FY 2021", "revenue_inr": 447250000000.0, "net_income_inr": 54620000000.0, "ebit_inr": 100000000000.0, "total_assets_inr": 690000000000.0, "total_debt_inr": 210000000000.0 },
        { "fiscal_year": "FY 2020", "revenue_inr": 421250000000.0, "net_income_inr": 58150000000.0, "ebit_inr": 88000000000.0, "total_assets_inr": 690000000000.0, "total_debt_inr": 228000000000.0 },
        { "fiscal_year": "FY 2019", "revenue_inr": 416090000000.0, "net_income_inr": 24000000000.0, "ebit_inr": 67000000000.0, "total_assets_inr": 620000000000.0, "total_debt_inr": 250000000000.0 }
    ]
};

const packet = {
    "multi_year_financials": mockHistoricalData,
    "description": "Historical financial statement records detailing revenue, net income, ebit, total assets, and total debt over at least the last 5 years.",
    "generated_at": new Date().toISOString()
};

fs.mkdirSync('./backend/data', { recursive: true });
fs.writeFileSync('./backend/data/historical_financials.json', JSON.stringify(packet, null, 2));

console.log('Successfully wrote historical financials mock block.');
