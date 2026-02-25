import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL || "https://xcaeygmmlolpoeyuxyxp.supabase.co";
        const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_oKS-fK6l5oKyZuQP3bEWZA_ALBCYz7o";

        const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_history?select=*&order=created_at.asc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error("Supabase GET History Error:", await res.text());
            throw new Error("Failed to fetch history");
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL || "https://xcaeygmmlolpoeyuxyxp.supabase.co";
        const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_oKS-fK6l5oKyZuQP3bEWZA_ALBCYz7o";

        const { role, text } = await req.json();

        if (!role || !text) {
            return NextResponse.json({ error: "Missing role or text" }, { status: 400 });
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ role, text })
        });

        if (!res.ok) {
            console.error("Supabase POST History Error:", await res.text());
            throw new Error("Failed to save message");
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL || "https://xcaeygmmlolpoeyuxyxp.supabase.co";
        const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_oKS-fK6l5oKyZuQP3bEWZA_ALBCYz7o";

        // To truncate a table via REST API in Supabase without a specific row ID, 
        // you run a DELETE on the entire table endpoint
        const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error("Supabase DELETE History Error:", await res.text());
            throw new Error("Failed to clear chat");
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
