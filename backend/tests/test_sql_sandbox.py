from app.services import sql_sandbox_service
from app.schemas.sql_sandbox import SQLExecuteRequest

def test_sql_execution():
    """Test basic SQL calculation."""
    request = SQLExecuteRequest(
        query="SELECT 1 + 1 as result",
        setup_sql=""
    )
    response = sql_sandbox_service.execute_sql(request)
    assert response.error is None
    assert response.rows[0]["result"] == 2

def test_sql_setup():
    """Test SQL execution with setup script."""
    request = SQLExecuteRequest(
        query="SELECT * FROM test_table",
        setup_sql="CREATE TABLE test_table (id INT); INSERT INTO test_table VALUES (10);"
    )
    response = sql_sandbox_service.execute_sql(request)
    assert response.error is None
    assert response.rows[0]["id"] == 10
