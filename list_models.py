import google.generativeai as genai
import os
from dotenv import load_dotenv

# Path to the .env file
dotenv_path = os.path.join("backend", ".env")
load_dotenv(dotenv_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print(f"No API key found in {dotenv_path}")
else:
    genai.configure(api_key=api_key)
    try:
        print("Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
