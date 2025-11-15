from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.conf import settings
from resources.models import LearningResource
from utils.embeddings import generate_embedding
import google.generativeai as genai

# Setup Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

def safe_ai(prompt: str) -> str:
    """Safe AI wrapper for Gemini Flash."""
    try:
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.2}
        )
        text = (response.text or "").strip()

        # Remove unwanted markdown/code block wrappers
        text = text.replace("```", "").replace("json", "").strip()
        return text

    except Exception:
        return ""

@receiver(post_save, sender=LearningResource)
def generate_resource_ai(sender, instance, created, **kwargs):
    update_fields = kwargs.get("update_fields")

    # prevent recursion
    if update_fields and any(
        f in update_fields for f in ["ai_vector", "ai_summary", "ai_keywords", "skill_vector"]
    ):
        return

    title = instance.title or ""
    description = instance.description or ""
    full_text = f"{title}\n\n{description}".strip()

    if not full_text:
        return

    # -------- 1) AI VECTOR --------
    ai_vector = generate_embedding(full_text)

    # -------- 2) SUMMARY (working) --------
    ai_summary = safe_ai(
        f"Write a clear 2–3 sentence summary of this learning resource:\n\n{full_text}"
    )

    # -------- 3) KEYWORDS (fixed) --------
    ai_keywords = safe_ai(
        f"""
Extract exactly 8–12 important keywords from the text below.

FORMAT:
Comma-separated values ONLY.
NO sentences.
NO extra text.

Text:
{full_text}
"""
    )

    LearningResource.objects.filter(pk=instance.pk).update(
        ai_vector=ai_vector,
        ai_summary=ai_summary,
        ai_keywords=ai_keywords,
    )

@receiver(m2m_changed, sender=LearningResource.related_skills.through)
def update_skill_vector(sender, instance, action, **kwargs):
    if action not in ["post_add", "post_remove", "post_clear"]:
        return

    skills = instance.related_skills.all()

    vectors = [s.ai_vector for s in skills if s.ai_vector is not None]

    if not vectors:
        final_vector = None
    else:
        final_vector = [sum(col) / len(vectors) for col in zip(*vectors)]

    LearningResource.objects.filter(pk=instance.pk).update(skill_vector=final_vector)
