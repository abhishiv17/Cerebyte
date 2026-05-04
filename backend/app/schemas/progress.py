from pydantic import BaseModel
from typing import Literal

class ProgressCreate(BaseModel):
    lesson_id: str
    lesson_type: Literal['dsa', 'dbms']
