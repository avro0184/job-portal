import google.generativeai as genai
import pdfplumber
import docx
import fitz  # PyMuPDF
from PIL import Image
import io
import json
import os


# ------------------------------------------------------------
# Configure Gemini
# ------------------------------------------------------------
# GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or "YOUR_KEY_HERE"
GEMINI_API_KEY = "AIzaSyDCEwfw5Kks8VIfs4k36AmBK5W8uo0Ec-A"

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "models/gemini-2.5-pro"


# ------------------------------------------------------------
# DOCX extraction
# ------------------------------------------------------------
def extract_docx(path):
    try:
        document = docx.Document(path)
        return "\n".join([p.text for p in document.paragraphs])
    except Exception as e:
        print("❌ DOCX extraction error:", e)
        return ""


# ------------------------------------------------------------
# PDF extraction → fallback to OCR
# ------------------------------------------------------------
def extract_pdf(path):
    text = ""

    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except Exception:
        text = ""

    if len(text.strip()) > 40:
        return text

    return ocr_pdf(path)


# ------------------------------------------------------------
# OCR (scanned PDF) → Gemini Vision
# ------------------------------------------------------------
def ocr_pdf(path):
    doc = fitz.open(path)
    model = genai.GenerativeModel(MODEL_NAME)
    final_text = ""

    for page in doc:
        pix = page.get_pixmap()
        img_bytes = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_bytes))

        result = model.generate_content(
            ["Extract ALL visible text from this resume page:", img]
        )

        final_text += result.text.strip() + "\n"

    print(final_text)

    return final_text


# ------------------------------------------------------------
# Auto-detect → PDF / DOCX
# ------------------------------------------------------------
def extract_resume_text(path):
    if path.lower().endswith(".pdf"):
        return extract_pdf(path)

    if path.lower().endswith(".docx"):
        return extract_docx(path)
    

    raise ValueError("Unsupported file type. Use PDF or DOCX only.")


# ------------------------------------------------------------
# Gemini → Parse Resume → JSON
# ------------------------------------------------------------
def gemini_parse_resume(text):
    prompt = f"""
Extract structured resume data from the following content.

Return ONLY valid JSON in this exact structure:

{{
 "name": "",
 "email": "",
 "phone": "",
 "summary": "",
 "skills": [],
 "experience": [],
 "education": [],
 "projects": [],
 "certifications": [],
 "social_links": []
}}

Resume Content:
{text}
"""

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)

    ai_text = response.text.strip()

    # Cleanup like your MCQ generator
    ai_text = ai_text.replace("```json", "").replace("```", "").strip()
    if ai_text.lower().startswith("json"):
        ai_text = ai_text[4:].strip()

    # Try JSON
    try:
        return json.loads(ai_text)
    except Exception:
        try:
            import json5
            return json5.loads(ai_text)
        except Exception:
            return {
                "warning": "AI JSON Parse Error",
                "raw_output": ai_text
            }


# ------------------------------------------------------------
# PUBLIC FUNCTION → used by Django views
# ------------------------------------------------------------
def parse_cv_file(file_path):
    text = extract_resume_text(file_path)
    structured = gemini_parse_resume(text)
    data = {
        "resume_text": text,
        "structured_data": structured
    }
    return data