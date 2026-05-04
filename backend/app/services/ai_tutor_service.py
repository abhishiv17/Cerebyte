import httpx
from fastapi import HTTPException
from app.schemas.ai_tutor import TutorRequest, TutorResponse
from app.db.client import supabase
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

async def get_tutor_feedback(request: TutorRequest, user_id: str) -> TutorResponse:
    """Ask the AI tutor (powered by Groq) for help with code."""
    
    # Get problem details to provide context to the AI
    res = supabase.table("problems").select("*").eq("id", request.problem_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    problem = res.data[0]
    
    # Ensure GROQ_API_KEY is available in the environment
    groq_key = settings.groq_api_key
    if not groq_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server")
        
    system_prompt = (
        "You are 'Cerebyte AI', an expert programming tutor helping a student. "
        "Your goal is to guide the student towards the solution without giving away the direct answer. "
        "Point out logic flaws, suggest concepts they should review, or provide hints about time/space complexity. "
        "Always be encouraging and concise."
    )
    
    user_prompt = (
        f"Problem: {problem['title']}\n"
        f"Description: {problem['description']}\n\n"
        f"My Code ({request.language}):\n{request.user_code}\n\n"
        f"My Question: {request.user_query}"
    )
    
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-8b-8192", 
        "messages": [
            {"role": "system", "content": system_prompt},
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
