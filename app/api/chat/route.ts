import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL || "https://xcaeygmmlolpoeyuxyxp.supabase.co";
        const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_oKS-fK6l5oKyZuQP3bEWZA_ALBCYz7o";
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        const { question } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "Missing question parameter" }, { status: 400 });
        }

        if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
            console.error("Missing Environment Variables in API Chat Route:", {
                hasSupabaseUrl: !!SUPABASE_URL,
                hasSupabaseKey: !!SUPABASE_KEY,
                hasGeminiKey: !!GEMINI_API_KEY,
            });
            return NextResponse.json({ error: "Server misconfiguration. Missing API keys." }, { status: 500 });
        }

        // 1. Generate text embedding for the user's question using Gemini REST API
        const embedRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "models/embedding-001",
                content: { parts: [{ text: question }] }
            }),
        });

        if (!embedRes.ok) {
            const err = await embedRes.text();
            console.error("Gemini Embedding Error:", err);
            throw new Error("Failed to generate query embedding.");
        }

        const embedData = await embedRes.json();
        const queryVector = embedData.embedding.values;

        // 2. Query Supabase pgvector using REST API
        const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_documents`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query_embedding: queryVector,
                match_threshold: 0.5,
                match_count: 5
            })
        });

        let context = "No specific data found in the knowledge base. However, you are an UltraTech expert, answer based on general corporate knowledge.";

        if (rpcRes.ok) {
            const matches = await rpcRes.json();
            if (matches && matches.length > 0) {
                context = matches.map((m: any) => m.content).join("\n\n---\n\n");
            }
        } else {
            console.error("Supabase RPC Error:", await rpcRes.text());
        }

        // 3. The Executive Intelligence Constitution
        const prompt = `You are the Chief Intelligence Officer for UltraTech Cement. 

**STRICT GUARDRAILS & DOMAIN RULES:**
1. Your domain of expertise encompasses UltraTech Cement, its competitors, the broader Indian cement manufacturing sector, allied housing products, and Government of India policies related to infrastructure and real estate.
2. If the user asks general questions about cement production, the housing market, or industry regulations, you MUST answer them professionally and comprehensively based on your internal knowledge. Do NOT reject these queries.
3. If the user asks a question completely unrelated to construction, materials, finance, or macro-economics (e.g., pop culture, recipe, coding), politely decline.
4. **CRITICAL INSTRUCTION: DO NOT REGURGITATE THE ENTIRE CONTEXT.** Ensure your answers are crisp and executive. Do not invent financial numbers.

**INTERNAL CONTEXT (Retrieved via pgvector):**
${context}

**USER QUESTION:** 
${question}

**YOUR ANSWER (Respond as if in a fast-paced executive chat; be extremely crisp):**`;

        // 4. Generate Final Answer using Gemini REST API
        const generateRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2, // Low temp for factual austerity
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!generateRes.ok) {
            const genErr = await generateRes.text();
            console.error("Gemini Generation Error:", genErr);
            throw new Error("Failed to generate LLM response.");
        }

        const genData = await generateRes.json();
        const answer = genData.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to formulate a response.";

        return NextResponse.json({ answer, source: "gemini-native" });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
