# utils/ai_embeddings.py
import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text: str):
    if not text or not text.strip():
        return None

    try:
        res = genai.embed_content(
            model="models/text-embedding-004",
            content=text
        )
        return res.get("embedding")
    except Exception as e:
        print("Embedding Error:", e)
        return None
