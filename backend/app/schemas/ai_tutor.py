from pydantic import BaseModel, Field

class TutorRequest(BaseModel):
    problem_id: str
    user_code: str = Field(..., max_length=10000)
    language: str
    user_query: str = Field(..., max_length=1000)

class TutorResponse(BaseModel):
    feedback: str
