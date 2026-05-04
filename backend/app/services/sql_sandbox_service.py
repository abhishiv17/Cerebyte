import sqlite3
import time
from app.schemas.sql_sandbox import SQLExecuteRequest, SQLExecuteResponse

def execute_sql(request: SQLExecuteRequest) -> SQLExecuteResponse:
    """Execute SQL queries safely in an isolated, in-memory SQLite database."""
    start_time = time.time()
    
    # Create an in-memory SQLite database just for this request
    conn = sqlite3.connect(':memory:')
    conn.row_factory = sqlite3.Row
    
    # Safety: Abort queries that take longer than 5 seconds
    def progress_callback():
        if time.time() - start_time > 5.0:
            return 1 # Non-zero aborts the query
        return 0
        
    conn.set_progress_handler(progress_callback, 1000)
    cursor = conn.cursor()
    
    try:
        # Run setup script if provided to populate the mock tables
        if request.setup_sql:
            cursor.executescript(request.setup_sql)
            
        # Execute the user's query
        cursor.execute(request.query)
        
        # Determine if we should fetch results or just return affected rows
        query_upper = request.query.strip().upper()
        if query_upper.startswith("SELECT") or query_upper.startswith("WITH") or query_upper.startswith("PRAGMA"):
            results = cursor.fetchall()
            if results:
                columns = list(results[0].keys())
                rows = [dict(row) for row in results]
            else:
                columns = [description[0] for description in cursor.description] if cursor.description else []
                rows = []
        else:
            conn.commit()
            columns = ["status", "affected_rows"]
            rows = [{"status": "success", "affected_rows": cursor.rowcount}]
            
        execution_time_ms = (time.time() - start_time) * 1000
        
        return SQLExecuteResponse(
            columns=columns,
            rows=rows,
            execution_time_ms=round(execution_time_ms, 2)
        )
        
    except sqlite3.Error as e:
        execution_time_ms = (time.time() - start_time) * 1000
        return SQLExecuteResponse(
            columns=[],
            rows=[],
            execution_time_ms=round(execution_time_ms, 2),
            error=str(e)
        )
    finally:
        conn.close()
