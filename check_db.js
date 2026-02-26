const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './backend/.env' });

async function checkSupabase() {
    const url = process.env.SUPABASE_URL + '/rest/v1/knowledge_embeddings?select=metadata&limit=100';
    console.log(`Checking URL: ${url}`);

    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
            }
        });

        const data = response.data;
        console.log(`Found ${data.length} total embeddings.`);

        const sources = new Set(data.map(row => row.metadata?.source));
        console.log("Sources found in vector DB:");
        console.log(Array.from(sources));

    } catch (e) {
        console.error("Error querying Supabase:", e.message);
    }
}

checkSupabase();
