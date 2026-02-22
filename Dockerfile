FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY README.md .

# Create data directory and pre-bake data
RUN mkdir -p backend/data && \
    chmod -R 777 backend/data && \
    python backend/run_agents.py

EXPOSE 7860

CMD ["python", "backend/qa_agent.py"]
