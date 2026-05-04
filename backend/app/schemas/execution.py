from pydantic import BaseModel, ConfigDict
from typing import Optional

class CodeExecutionRequest(BaseModel):
    language: str
    version: str = "*"
    code: str
    stdin: Optional[str] = ""

class CodeExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    compile_output: Optional[str] = None
    exit_code: int
    signal: Optional[str] = None
    time: float = 0
    memory: float = 0

    model_config = ConfigDict(from_attributes=True)
