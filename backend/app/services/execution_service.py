import subprocess
import tempfile
import os
import time
import httpx
import asyncio
from fastapi import HTTPException
from app.schemas.execution import CodeExecutionRequest, CodeExecutionResponse
from app.core.config import settings

# ──────────────────────────────────────────────────────────────
# Judge0 CE (RapidAPI) — Primary remote execution engine
# Free tier: 50 submissions/day, supports 60+ languages
# Docs: https://ce.judge0.com/
# ──────────────────────────────────────────────────────────────

JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"
JUDGE0_HEADERS = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": getattr(settings, "judge0_api_key", ""),
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
}

# Judge0 language IDs — https://ce.judge0.com/languages
JUDGE0_LANGUAGE_MAP = {
    "python": 71,       # Python 3.8.1
    "javascript": 63,   # JavaScript (Node.js 12.14.0)
    "cpp": 54,          # C++ (GCC 9.2.0)
    "java": 62,         # Java (OpenJDK 13.0.1)
    "c": 50,            # C (GCC 9.2.0)
    "typescript": 74,   # TypeScript (3.7.4)
    "ruby": 72,         # Ruby (2.7.0)
    "go": 60,           # Go (1.13.5)
    "rust": 73,         # Rust (1.40.0)
}

# ──────────────────────────────────────────────────────────────
# Local subprocess fallback — for localhost dev when API is down
# ──────────────────────────────────────────────────────────────

LOCAL_LANGUAGE_CONFIG = {
    "python": {"ext": ".py", "cmd": ["python", "{file}"]},
    "javascript": {"ext": ".js", "cmd": ["node", "{file}"]},
    "cpp": {"ext": ".cpp", "compile": ["g++", "{file}", "-o", "{out}"], "cmd": ["{out}"]},
    "java": {"ext": ".java", "compile": ["javac", "{file}"], "cmd": ["java", "-cp", "{dir}", "Main"]},
}

LOCAL_TIMEOUT_SECONDS = 10


# ──────────────────────────────────────────────────────────────
# Main entry point — tries Judge0 first, falls back to local
# ──────────────────────────────────────────────────────────────

async def execute_code(request: CodeExecutionRequest) -> CodeExecutionResponse:
    """Execute code using Judge0 CE (remote) with local subprocess fallback."""

    judge0_key = getattr(settings, "judge0_api_key", "")

    # If Judge0 API key is configured, try remote execution first
    if judge0_key:
        try:
            return await _execute_via_judge0(request)
        except Exception as e:
            # Log the failure and fall through to local execution
            print(f"[Execution] Judge0 failed ({e}), falling back to local subprocess...")

    # Fallback: local subprocess execution (dev only)
    return await _execute_locally(request)


# ──────────────────────────────────────────────────────────────
# Judge0 CE execution
# ──────────────────────────────────────────────────────────────

async def _execute_via_judge0(request: CodeExecutionRequest) -> CodeExecutionResponse:
    """Execute code remotely via Judge0 CE (RapidAPI)."""

    lang = request.language.lower()
    language_id = JUDGE0_LANGUAGE_MAP.get(lang)

    if not language_id:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {request.language}. Supported: {', '.join(JUDGE0_LANGUAGE_MAP.keys())}"
        )

    # Build submission payload
    import base64
    payload = {
        "language_id": language_id,
        "source_code": base64.b64encode(request.code.encode()).decode(),
        "stdin": base64.b64encode((request.stdin or "").encode()).decode(),
        "cpu_time_limit": 10,
        "memory_limit": 128000,  # 128 MB
    }

    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": settings.judge0_api_key,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        # Submit the code (with base64 encoding)
        submit_res = await client.post(
            f"{JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false",
            json=payload,
            headers=headers,
        )

        if submit_res.status_code != 201:
            raise Exception(f"Judge0 submission failed: {submit_res.status_code} — {submit_res.text}")

        token = submit_res.json().get("token")
        if not token:
            raise Exception("Judge0 returned no submission token")

        # Poll for result (max ~15 seconds)
        result = None
        for _ in range(30):
            await asyncio.sleep(0.5)

            poll_res = await client.get(
                f"{JUDGE0_API_URL}/submissions/{token}?base64_encoded=true&fields=stdout,stderr,compile_output,status,time,memory",
                headers=headers,
            )

            if poll_res.status_code != 200:
                continue

            data = poll_res.json()
            status_id = data.get("status", {}).get("id", 0)

            # Status IDs: 1=In Queue, 2=Processing, 3+=Done
            if status_id >= 3:
                result = data
                break

        if not result:
            raise Exception("Judge0 execution timed out (no result after 15s)")

    # Decode base64 results
    def _decode(val):
        if val:
            try:
                return base64.b64decode(val).decode("utf-8", errors="replace")
            except Exception:
                return val
        return ""

    stdout = _decode(result.get("stdout"))
    stderr = _decode(result.get("stderr"))
    compile_output = _decode(result.get("compile_output"))
    exec_time = float(result.get("time") or 0)
    memory_kb = float(result.get("memory") or 0)

    # Map Judge0 status to exit code
    status_id = result.get("status", {}).get("id", 0)
    # 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit, 6 = Compilation Error,
    # 7-12 = Runtime errors, 13 = Internal Error, 14 = Exec Format Error
    exit_code = 0 if status_id == 3 else 1

    return CodeExecutionResponse(
        stdout=stdout,
        stderr=stderr,
        compile_output=compile_output if compile_output else None,
        exit_code=exit_code,
        time=exec_time,
        memory=memory_kb,
    )


# ──────────────────────────────────────────────────────────────
# Local subprocess execution (fallback for dev)
# ──────────────────────────────────────────────────────────────

async def _execute_locally(request: CodeExecutionRequest) -> CodeExecutionResponse:
    """Execute code locally using subprocess (localhost testing only)."""

    lang = request.language.lower()
    config = LOCAL_LANGUAGE_CONFIG.get(lang)

    if not config:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {request.language}. Supported: {', '.join(LOCAL_LANGUAGE_CONFIG.keys())}"
        )

    # Write code to a temp file
    ext = config["ext"]
    filename = "Main" + ext if lang == "java" else "code" + ext

    tmpdir = tempfile.mkdtemp()
    filepath = os.path.join(tmpdir, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(request.code)

    compile_output = None
    stdout = ""
    stderr = ""
    exit_code = 0
    elapsed = 0.0

    try:
        # Compile step (C++, Java)
        if "compile" in config:
            out_path = os.path.join(tmpdir, "a.out") if lang == "cpp" else None
            compile_cmd = [
                c.replace("{file}", filepath).replace("{out}", out_path or "")
                for c in config["compile"]
            ]
            try:
                comp = subprocess.run(
                    compile_cmd, capture_output=True, text=True, timeout=LOCAL_TIMEOUT_SECONDS, cwd=tmpdir
                )
                compile_output = comp.stdout + comp.stderr
                if comp.returncode != 0:
                    return CodeExecutionResponse(
                        stdout="",
                        stderr=compile_output or "Compilation failed",
                        compile_output=compile_output,
                        exit_code=comp.returncode,
                        time=0,
                        memory=0,
                    )
            except subprocess.TimeoutExpired:
                return CodeExecutionResponse(
                    stdout="", stderr="Compilation timed out", compile_output="Timeout",
                    exit_code=1, time=LOCAL_TIMEOUT_SECONDS, memory=0,
                )

        # Run step
        run_cmd = [
            c.replace("{file}", filepath)
             .replace("{out}", os.path.join(tmpdir, "a.out"))
             .replace("{dir}", tmpdir)
            for c in config["cmd"]
        ]

        start = time.perf_counter()
        try:
            proc = subprocess.run(
                run_cmd,
                capture_output=True,
                text=True,
                timeout=LOCAL_TIMEOUT_SECONDS,
                input=request.stdin or "",
                cwd=tmpdir,
            )
            elapsed = round(time.perf_counter() - start, 3)
            stdout = proc.stdout
            stderr = proc.stderr
            exit_code = proc.returncode
        except subprocess.TimeoutExpired:
            elapsed = LOCAL_TIMEOUT_SECONDS
            stderr = f"Execution timed out after {LOCAL_TIMEOUT_SECONDS}s"
            exit_code = 1

    finally:
        # Cleanup temp files
        try:
            for f in os.listdir(tmpdir):
                os.remove(os.path.join(tmpdir, f))
            os.rmdir(tmpdir)
        except Exception:
            pass

    return CodeExecutionResponse(
        stdout=stdout,
        stderr=stderr,
        compile_output=compile_output,
        exit_code=exit_code,
        time=elapsed,
        memory=0,
    )
