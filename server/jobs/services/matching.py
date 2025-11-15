# server/utils/matching.py

from skills.models import UserSkill


def calculate_skill_match(user, job):
    job_skills = list(job.required_skills.all())

    if not job_skills:
        return {
            "skill_score": 100,
            "matched_skills": [],
            "missing_skills": [],
        }

    # User’s skills with proficiency
    user_skills = UserSkill.objects.filter(user=user)
    user_skill_map = {item.skill_id: item for item in user_skills}

    matched = []
    missing = []
    weighted_scores = []

    for skill in job_skills:
        user_skill = user_skill_map.get(skill.id)

        if user_skill:
            proficiency = user_skill.proficiency_percentage
            weighted_scores.append(proficiency)

            matched.append({
                "skill": skill.name,
                "proficiency": proficiency,
                "level": user_skill.level,
            })
        else:
            missing.append(skill.name)
            weighted_scores.append(0)

    # Average score
    skill_score = sum(weighted_scores) / len(weighted_scores)

    return {
        "skill_score": round(skill_score, 2),
        "matched_skills": matched,
        "missing_skills": missing,
    }


# ---------------------------------------------------------
# 2️⃣ Experience & Resume Scoring
# ---------------------------------------------------------

def calculate_user_profile_scores(user):
    """
    Returns:
        experience_score
        resume_score
    """
    profile = getattr(user, "profile", None)

    # Experience score
    if profile and hasattr(profile, "experiences"):
        experience_score = 80 if profile.experiences.count() else 40
    else:
        experience_score = 40

    # Resume score
    resume_score = 75 if (profile and profile.resume_file) else 50

    return experience_score, resume_score


# ---------------------------------------------------------
# 3️⃣ Final ATS Score
# ---------------------------------------------------------

def calculate_matching_score(user, job):
    """
    Combines:
      - Skill match (60%)
      - Experience (30%)
      - Resume strength (10%)
    """

    # Skill match
    skill_data = calculate_skill_match(user, job)
    skill_score = skill_data["skill_score"]

    # Profile scoring
    experience_score, resume_score = calculate_user_profile_scores(user)

    # Final weighted score
    final_score = (
        skill_score * 0.6 +
        experience_score * 0.3 +
        resume_score * 0.1
    )

    return {
        "final_score": round(final_score, 2),
        "skill_score": skill_score,
        "matched_skills": skill_data["matched_skills"],
        "missing_skills": skill_data["missing_skills"],
        "experience_score": experience_score,
        "resume_score": resume_score,
    }
