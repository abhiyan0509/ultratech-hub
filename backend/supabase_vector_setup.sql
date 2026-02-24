-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create the knowledge base table with a 768-dimensional vector (Gemini's standard)
create table knowledge_embeddings (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb,
  embedding vector(768)
);

-- 3. Disable Row Level Security so our backend can freely insert/read
alter table knowledge_embeddings disable row level security;

-- 4. Create an RPC function for vector similarity search (Cosine Similarity)
-- This allows our Python backend to query Supabase REST API via POST /rest/v1/rpc/match_documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) as similarity
  from knowledge_embeddings
  where 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
