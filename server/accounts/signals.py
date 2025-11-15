from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from accounts.models import Profile
from utils.embeddings import generate_embedding
import google.generativeai as genai

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


def safe_ai(prompt: str) -> str:
    """Safe AI call that never crashes and always returns a string."""
    try:
        r = model.generate_content(prompt)
        return (r.text or "").strip()
    except:
        return ""
    

@receiver(post_save, sender=Profile)
def generate_profile_ai(sender, instance, created, **kwargs):
    """
    Auto-generates AI fields on create and update:
    - ai_cv_vector (embedding)
    - ai_summary   (resume summary)
    - ai_keywords  (resume keywords)
    - summary_text (complete AI profile summary)
    """

    update_fields = kwargs.get("update_fields")

    # Prevent infinite loop if we are updating only AI fields
    if update_fields and any(
        f in update_fields 
        for f in ["ai_cv_vector", "ai_summary", "ai_keywords", "summary_text"]
    ):
        return

    cv_text = instance.cv_text or ""
    bio = instance.bio or ""
    career_goal = instance.career_goal or ""

    # 1️⃣ Generate embedding vector
    vector = generate_embedding(cv_text)

    # 2️⃣ Short AI CV summary (2–3 lines)
    ai_summary = safe_ai(
        f"Summarize this CV into 2–3 short lines:\n\n{cv_text}"
    )

    # 3️⃣ Keywords (comma separated)
    ai_keywords = safe_ai(
        "Extract 8–15 strong resume keywords.\n"
        "Return only comma-separated keywords.\n\n" + cv_text
    )

    # 4️⃣ FULL PROFILE SUMMARY (NEW — BEST FOR RECOMMENDER)
    summary_text = safe_ai(
        "Create a professional summary for this user:\n"
        "Combine: CV text, bio, career goals.\n"
        "Write 4–6 lines.\n\n"
        f"CV: {cv_text}\n\n"
        f"Bio: {bio}\n\n"
        f"Career Goal: {career_goal}\n"
    )

    # Save all AI fields WITHOUT retriggering signal
    Profile.objects.filter(pk=instance.pk).update(
        ai_cv_vector=vector,
        ai_summary=ai_summary,
        ai_keywords=ai_keywords,
        summary_text=summary_text,
    )
