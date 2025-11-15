from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from skills.models import Skill
from utils.embeddings import generate_embedding
import google.generativeai as genai

# Configure API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


# ---------------------------------------------------------
# SAFE AI CALL (Cleans output completely)
# ---------------------------------------------------------
def safe_ai_call(prompt):
    try:
        res = model.generate_content(prompt)

        raw = getattr(res, "text", None)
        if not raw:
            raw = str(res)

        cleaned = (
            raw.replace("```", "")
               .replace("json", "")
               .replace("*", "")
               .replace("\n", " ")
               .replace("Summary:", "")
               .strip()
        )

        return cleaned

    except Exception:
        return ""


# ---------------------------------------------------------
# CLEAN KEYWORDS
# ---------------------------------------------------------
def generate_skill_keywords(text):
    prompt = (
        "Extract 5–10 short keywords related to this skill. "
        "Return ONLY comma-separated keywords.\n\n"
        f"{text}"
    )

    raw = safe_ai_call(prompt)

    parts = [p.strip() for p in raw.split(",") if p.strip()]

    if len(parts) < 3:
        return "skill, learning, basics"

    return ", ".join(parts[:10])


# ---------------------------------------------------------
# AI FOR SKILLS
# ---------------------------------------------------------
@receiver(post_save, sender=Skill)
def generate_skill_ai(sender, instance, created, **kwargs):
    """
    Auto-generate:
    - ai_vector
    - ai_summary
    - ai_keywords
    on create + update
    """

    # Prevent recursion
    update_fields = kwargs.get("update_fields")
    if update_fields and any(f in update_fields for f in ["ai_vector", "ai_summary", "ai_keywords"]):
        return

    text = instance.name + " — " + (instance.category.name if instance.category else "")

    # ---- 1. Vector ----
    ai_vector = generate_embedding(text)

    # ---- 2. Summary ----
    ai_summary = safe_ai_call(
        f"Write a simple 1–3 sentence explanation of this skill:\n\n{text}"
    ) or "No summary available."

    # ---- 3. Keywords ----
    ai_keywords = generate_skill_keywords(text)

    # Save without triggering signal again
    Skill.objects.filter(id=instance.id).update(
        ai_vector=ai_vector,
        ai_summary=ai_summary,
        ai_keywords=ai_keywords,
    )
