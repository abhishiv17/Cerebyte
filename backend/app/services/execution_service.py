import httpx
from fastapi import HTTPException
from app.schemas.execution import CodeExecutionRequest, CodeExecutionResponse

PISTON_API_URL = "https://emkc.org/api/v2/piston/execute"

async def execute_code(request: CodeExecutionRequest) -> CodeExecutionResponse:
    """Execute code using the public Piston API."""
    payload = {
        "language": request.language,
        "version": request.version,
        "files": [
            {
                "content": request.code
            }
        ],
        "stdin": request.stdin
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(PISTON_API_URL, json=payload, timeout=15.0)
            response.raise_for_status()
            data = response.json()
            
            # Check for Piston-level errors (like unsupported language)
            if "message" in data:
                raise HTTPException(status_code=400, detail=f"Piston API Error: {data['message']}")
            
            run_result = data.get("run", {})
            compile_result = data.get("compile", {})
            
            return CodeExecutionResponse(
                stdout=run_result.get("stdout", ""),
                stderr=run_result.get("stderr", ""),
                compile_output=compile_result.get("output"),
                exit_code=run_result.get("code", 0),
                signal=run_result.get("signal"),
                time=run_result.get("time", 0),
                memory=run_result.get("memory", 0)
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Execution API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail="Code execution service is currently unavailable.")
