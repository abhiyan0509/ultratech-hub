-- Copy and paste this into the Supabase SQL Editor to create the table

CREATE TABLE ultratech_intelligence (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) so the Python backend and Next.js 
-- can read/write freely using the Anon key.
ALTER TABLE ultratech_intelligence DISABLE ROW LEVEL SECURITY;
