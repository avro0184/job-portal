from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from jobs.models import Job
from utils.embeddings import generate_embedding
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


# ----------------------------------------------------
# SAFE AI CALL (Guaranteed clean text)
# ----------------------------------------------------
def safe_ai_call(prompt):
    try:
        res = model.generate_content(prompt)

        # Some Gemini responses return dictionary segments
        raw = getattr(res, "text", None)
        if not raw:
            raw = str(res)

        # Clean output
        cleaned = (
            raw.replace("```", "")
               .replace("json", "")
               .replace("summary:", "")
               .replace("*", "")
               .strip()
        )

        return cleaned

    except Exception:
        return ""


# ----------------------------------------------------
# CLEAN KEYWORD OUTPUT
# ----------------------------------------------------
def generate_ai_keywords(description):
    """Generate clean comma-separated keywords."""
    prompt = (
        "Extract 5–10 strong keywords from this job description. "
        "Return ONLY comma-separated keywords.\n\n"
        f"{description}"
    )

    raw = safe_ai_call(prompt)

    cleaned = (
        raw.replace("```", "")
           .replace("json", "")
           .replace("\n", " ")
           .replace("*", "")
           .strip()
    )

    parts = [p.strip() for p in cleaned.split(",") if p.strip()]

    if len(parts) < 3:
        return "skills, job, experience"

    return ", ".join(parts[:10])


# ----------------------------------------------------
# AUTO-GENERATE AI DATA FOR JOBS
# ----------------------------------------------------
@receiver(post_save, sender=Job)
def generate_job_ai(sender, instance, created, **kwargs):
    """
    Runs on create & update.
    Safe for LLM & no recursion.
    """

    update_fields = kwargs.get("update_fields")

    # Avoid infinite recursion when AI fields update
    if update_fields and any(
        f in update_fields for f in ["ai_vector", "ai_summary", "ai_keywords"]
    ):
        return

    description = instance.description or ""

    # ---- 1. Vector ----
    ai_vector = generate_embedding(description)

    # ---- 2. Summary (new cleaned version) ----
    ai_summary = safe_ai_call(
        f"Write a short 2–3 sentence summary for this job posting:\n\n{description}"
    )

    if not ai_summary:
        ai_summary = "No summary available."

    # ---- 3. Keywords ----
    ai_keywords = generate_ai_keywords(description)

    # ---- Save output ----
    Job.objects.filter(id=instance.id).update(
        ai_vector=ai_vector,
        ai_summary=ai_summary,
        ai_keywords=ai_keywords,
    )
