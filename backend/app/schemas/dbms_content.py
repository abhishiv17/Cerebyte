from pydantic import BaseModel, ConfigDict
from typing import Optional

class DBMSLessonResponse(BaseModel):
    id: str
    title: str
    content: str
    setup_sql: Optional[str] = None
    expected_output_rows: Optional[int] = None
    order: int

    model_config = ConfigDict(from_attributes=True)
