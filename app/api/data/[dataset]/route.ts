import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export async function GET(req: Request, { params }: { params: { dataset: string } }) {
    try {
        const dataset = params.dataset;

        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error("Missing Environment Variables");
            return NextResponse.json({ error: "Server misconfiguration. Missing API keys." }, { status: 500 });
        }

        // Fetch directly from the Supabase REST API
        const res = await fetch(`${SUPABASE_URL}/rest/v1/ultratech_intelligence?id=eq.${dataset}&select=data`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(`Supabase DB Error for ${dataset}:`, err);
            return NextResponse.json({ error: "Failed to fetch data from Supabase" }, { status: 500 });
        }

        const data = await res.json();

        if (data && data.length > 0) {
            // Return the actual JSON payload stored in the 'data' column
            return NextResponse.json(data[0].data);
        } else {
            return NextResponse.json({ error: "Data not found" }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Data Fetch Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
