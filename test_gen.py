import google.generativeai as genai
import os
from dotenv import load_dotenv

dotenv_path = os.path.join("backend", ".env")
load_dotenv(dotenv_path)
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No API key found")
else:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hello")
        print(f"1.5-flash response: {response.text}")
    except Exception as e:
        print(f"1.5-flash error: {e}")

    try:
        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content("Hello")
        print(f"flash-latest response: {response.text}")
    except Exception as e:
        print(f"flash-latest error: {e}")
