from fastapi import HTTPException
from app.db.client import supabase
from app.schemas.submission import SubmissionCreate
from app.schemas.execution import CodeExecutionRequest
from app.services.execution_service import execute_code

async def create_submission(submission: SubmissionCreate, user_id: str) -> dict:
    """Submit code for a problem, execute it, and save the result."""
    
    # 1. Save initial pending submission
    sub_data = submission.model_dump()
    sub_data["user_id"] = user_id
    sub_data["status"] = "pending"
    
    res = supabase.table("submissions").insert(sub_data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create submission record")
    
    db_submission = res.data[0]
    submission_id = db_submission["id"]
    
    # 2. Fetch problem details and test cases
    prob_res = supabase.table("problems").select("*").eq("id", submission.problem_id).execute()
    if not prob_res.data:
        # This shouldn't happen if foreign keys are working, but good to check
        supabase.table("submissions").update({"status": "error"}).eq("id", submission_id).execute()
        return db_submission
        
    problem = prob_res.data[0]
    test_cases = problem.get("test_cases", [])
    
    # 3. Run test cases
    # For now, we run them sequentially. For production, consider background tasks or parallel execution.
    final_status = "accepted"
    total_execution_time = 0
    max_memory = 0
    
    if not test_cases:
        # If no test cases, we just mark it as accepted if it compiles/runs
        exec_req = CodeExecutionRequest(
            language=submission.language,
            code=submission.code,
            stdin=""
        )
        exec_res = await execute_code(exec_req)
        if exec_res.exit_code != 0:
            final_status = "runtime_error"
        else:
            final_status = "accepted"
    else:
        for tc in test_cases:
            stdin = tc.get("input", "")
            expected_output = tc.get("output", "").strip()
            
            exec_req = CodeExecutionRequest(
                language=submission.language,
                code=submission.code,
                stdin=stdin
            )
            
            try:
                exec_res = await execute_code(exec_req)
                
                if exec_res.exit_code != 0:
                    final_status = "runtime_error"
                    break
                
                actual_output = exec_res.stdout.strip()
                if actual_output != expected_output:
                    final_status = "wrong_answer"
                    break
                    
                # Update metrics (simple aggregation)
                total_execution_time += exec_res.time * 1000 # convert to ms
                max_memory = max(max_memory, exec_res.memory / (1024 * 1024)) # convert to MB
                
            except Exception as e:
                final_status = "error"
                break
    
    # 4. Update submission in DB
    update_res = supabase.table("submissions").update({
        "status": final_status,
        "execution_time_ms": total_execution_time,
        "memory_used_mb": max_memory
    }).eq("id", submission_id).execute()
    
    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update submission record")
        
    return update_res.data[0]
