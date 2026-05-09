import httpx
from fastapi import HTTPException
from app.schemas.onboarding import OnboardingDiagnostic, OnboardingResponse, OnboardingStatus
from app.db.client import supabase
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# ──────────────────────────────────────────────────────────────
# The "Admiral Hopper" System Prompt
# Persistent persona instruction for Groq LPU Inference Engine
# ──────────────────────────────────────────────────────────────

HOPPER_SYSTEM_PROMPT = """You are Admiral Grace Hopper — legendary computer scientist, United States Navy Rear Admiral, and the "Grandmother of Code." You are addressing a new recruit who has just enlisted in the Cerebyte Digital Fleet.

Your personality:
- Witty, warm, and deeply encouraging — but never patronizing.
- You speak with naval metaphors: the codebase is a "ship," algorithms are "engine systems," data structures are "hull components," and debugging is "pulling moths out of the relays."
- You believe the best way to learn is to DIVE IN. Your famous quote: "The most dangerous phrase in the language is, 'We've always done it this way.'"
- You address the recruit by their rank (starting as "Ensign") and treat learning like a naval mission.
- You're technically precise but explain things so a sharp beginner could follow.

Your task right now:
Generate a personalized "Quest Map" — a 3-4 paragraph narrative briefing for this new recruit. Based on their diagnostic data, assign them their first missions, explain what systems they'll be maintaining (using naval/engineering metaphors for CS concepts), and encourage them with a Hopper-esque closing remark.

Rules:
- Keep it under 300 words.
- Use markdown formatting (bold for emphasis, bullet points for missions).
- End with an inspiring one-liner that sounds like something Grace Hopper would actually say.
- Do NOT break character. You ARE Admiral Hopper."""


RANK_PROGRESSION = {
    "beginner": "Ensign",
    "intermediate": "Lieutenant",
    "advanced": "Commander",
}


async def check_onboarding_status(user_id: str) -> OnboardingStatus:
    """Check if a user has completed the onboarding flow."""
    try:
        res = supabase.table("user_onboarding").select("*").eq("user_id", user_id).execute()
        if res.data and len(res.data) > 0:
            record = res.data[0]
            return OnboardingStatus(
                onboarding_completed=record.get("onboarding_completed", False),
                naval_rank=record.get("naval_rank"),
                experience_level=record.get("experience_level"),
                career_goal=record.get("career_goal"),
            )
    except Exception:
        pass

    return OnboardingStatus(onboarding_completed=False)


async def complete_onboarding(diagnostic: OnboardingDiagnostic, user_id: str) -> OnboardingResponse:
    """Process the diagnostic answers and generate the Admiral Hopper quest map."""

    # 1. Determine starting rank based on experience
    naval_rank = RANK_PROGRESSION.get(diagnostic.experience_level, "Ensign")

    # 2. Generate the quest map narrative via Groq
    quest_narrative = await _generate_quest_map(diagnostic, naval_rank)

    # 3. Save to database
    onboarding_data = {
        "user_id": user_id,
        "experience_level": diagnostic.experience_level,
        "primary_language": diagnostic.primary_language,
        "career_goal": diagnostic.career_goal,
        "focus_areas": diagnostic.focus_areas,
        "weekly_hours": diagnostic.weekly_hours,
        "naval_rank": naval_rank,
        "quest_map_narrative": quest_narrative,
        "onboarding_completed": True,
        "story_flags": {"onboarding_complete": True, "first_login": True},
    }

    try:
        # Upsert: if user already has onboarding data, update it
        res = supabase.table("user_onboarding").upsert(
            onboarding_data,
            on_conflict="user_id"
        ).execute()

        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to save onboarding data")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return OnboardingResponse(
        naval_rank=naval_rank,
        quest_map_narrative=quest_narrative,
        onboarding_completed=True,
    )


async def _generate_quest_map(diagnostic: OnboardingDiagnostic, naval_rank: str) -> str:
    """Use Groq LPU to generate the personalized quest map narrative."""

    groq_key = settings.groq_api_key
    if not groq_key:
        # Fallback narrative if Groq is unavailable
        return _fallback_narrative(diagnostic, naval_rank)

    # Build the user context for the LLM
    goal_labels = {
        "university": "university computer science exams",
        "faang": "FAANG-level technical interviews",
        "competitive": "competitive programming competitions",
        "general": "general software engineering mastery",
    }

    focus_labels = {
        "dsa": "Data Structures & Algorithms",
        "dbms": "Database Management Systems",
        "sql": "SQL & Query Optimization",
        "algorithms": "Advanced Algorithm Design",
    }

    user_context = (
        f"Recruit Profile:\n"
        f"- Rank: {naval_rank}\n"
        f"- Experience Level: {diagnostic.experience_level}\n"
        f"- Primary Language: {diagnostic.primary_language}\n"
        f"- Career Objective: {goal_labels.get(diagnostic.career_goal, diagnostic.career_goal)}\n"
        f"- Focus Areas: {', '.join(focus_labels.get(f, f) for f in diagnostic.focus_areas)}\n"
        f"- Weekly Study Commitment: {diagnostic.weekly_hours} hours/week\n\n"
        f"Generate their personalized Quest Map briefing now, Admiral."
    )

    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": HOPPER_SYSTEM_PROMPT},
            {"role": "user", "content": user_context},
        ],
        "temperature": 0.7,
        "max_tokens": 1024,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(GROQ_API_URL, json=payload, headers=headers, timeout=20.0)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[Onboarding] Groq API error: {e}, using fallback narrative")
            return _fallback_narrative(diagnostic, naval_rank)


def _fallback_narrative(diagnostic: OnboardingDiagnostic, naval_rank: str) -> str:
    """Static fallback if Groq is unavailable."""
    return (
        f"**Welcome aboard, {naval_rank}.**\n\n"
        f"I'm Admiral Hopper, and I'll be your commanding officer on this voyage through "
        f"the engine rooms of computer science. You've enlisted with **{diagnostic.primary_language}** "
        f"as your primary tool — a fine choice for the missions ahead.\n\n"
        f"Your first orders:\n"
        f"- **Navigate the Array Decks** — Master the fundamental hull structures.\n"
        f"- **Chart the Hash Table Corridors** — Learn to index and retrieve at O(1) speed.\n"
        f"- **Inspect the Tree Rigging** — Binary trees are the masts that hold our ship together.\n\n"
        f"Remember, {naval_rank}: *\"A ship in port is safe, but that's not what ships are built for.\"* "
        f"Now get out there and write some code. That's an order."
    )
