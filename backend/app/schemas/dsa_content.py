from pydantic import BaseModel, ConfigDict
from typing import Optional

class DSALessonResponse(BaseModel):
    id: str
    title: str
    topic: str
    content: str
    big_o_time: Optional[str] = None
    big_o_space: Optional[str] = None
    order: int

    model_config = ConfigDict(from_attributes=True)
