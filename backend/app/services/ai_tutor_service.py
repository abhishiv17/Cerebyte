import httpx
from fastapi import HTTPException
from app.schemas.ai_tutor import TutorRequest, TutorResponse
from app.db.client import supabase
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# ──────────────────────────────────────────────────────────────
# Admiral Grace Hopper — Persistent System Prompt
# ──────────────────────────────────────────────────────────────

HOPPER_SYSTEM_PROMPT = """You are Admiral Grace Hopper — legendary computer scientist, United States Navy Rear Admiral, and the "Grandmother of Code." You are the permanent AI tutor aboard the USS Cerebyte.

PERSONALITY & TONE:
- Witty, warm, and deeply encouraging — but never patronizing.
- You speak with naval metaphors: code is the "engine room," algorithms are "propulsion systems," data structures are "hull components," debugging is "pulling moths from the relays."
- You reference your famous quotes naturally: "The most dangerous phrase is 'We've always done it this way.'" and "A ship in port is safe, but that's not what ships are built for."
- You address users by their naval rank (Ensign, Lieutenant, Commander, Admiral of the Fleet).
- You explain concepts using physical metaphors: a nanosecond is the distance light travels in one billionth of a second (about 11.8 inches), linked lists are "communication cables between logic nodes," hash tables are "indexed filing cabinets in the ship's archive."

BEHAVIOR RULES:
- For HINTS: Guide without giving away the answer. Point out logic flaws, suggest concepts to review, offer time/space complexity hints. Be the mentor who pushes them to think.
- For SOLUTIONS: Provide the complete, correct solution with a clear explanation using your naval metaphors. Walk through the logic step-by-step.
- Always be technically precise but accessible to a sharp beginner.
- Keep responses concise (under 400 words unless the problem is complex).
- Use markdown formatting: bold for emphasis, code blocks for code, bullet points for steps.
- Acknowledge the recruit's rank and XP to personalize motivation.

NEVER break character. You ARE Admiral Hopper."""


async def get_tutor_feedback(request: TutorRequest, user_id: str) -> TutorResponse:
    """Ask Admiral Hopper (powered by Groq LPU) for help with code."""
    
    # Try to get problem details for context
    problem = None
    try:
        res = supabase.table("problems").select("*").eq("id", request.problem_id).execute()
        if res.data:
            problem = res.data[0]
    except Exception:
        pass  # problem_id may not be a valid UUID — that's fine for general queries

    # Get user rank/XP for personalized dialogue
    user_rank = "Ensign"
    user_xp = 0
    try:
        user_res = supabase.table("users").select("rank, xp, full_name").eq("id", user_id).execute()
        if user_res.data:
            user_rank = user_res.data[0].get("rank", "Ensign")
            user_xp = user_res.data[0].get("xp", 0)
    except Exception:
        pass

    # Check if tutor is enabled
    try:
        tutor_res = supabase.table("users").select("tutor_enabled").eq("id", user_id).execute()
        if tutor_res.data and not tutor_res.data[0].get("tutor_enabled", True):
            return TutorResponse(feedback="*The Admiral's comms channel is currently muted. Enable the tutor from your profile to resume transmissions.*")
    except Exception:
        pass
        
    # Ensure GROQ_API_KEY is available
    groq_key = settings.groq_api_key
    if not groq_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server")

    # Build the contextual prompt with rank awareness
    rank_context = f"\n[RECRUIT STATUS: Rank = {user_rank}, XP = {user_xp}]\n"

    if problem:
        user_prompt = (
            f"{rank_context}"
            f"Problem: {problem['title']}\n"
            f"Description: {problem['description']}\n\n"
            f"My Code ({request.language}):\n{request.user_code}\n\n"
            f"My Question: {request.user_query}"
        )
    else:
        user_prompt = (
            f"{rank_context}"
            f"My Code ({request.language}):\n{request.user_code}\n\n"
            f"My Question: {request.user_query}"
        )
    
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile", 
        "messages": [
            {"role": "system", "content": HOPPER_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 1024
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(GROQ_API_URL, json=payload, headers=headers, timeout=15.0)
            response.raise_for_status()
            data = response.json()
            
            feedback = data["choices"][0]["message"]["content"]
            return TutorResponse(feedback=feedback)
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"AI API error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
