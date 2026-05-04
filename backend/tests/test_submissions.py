import pytest
from app.schemas.submission import SubmissionCreate

def test_submission_schema_validation():
    """Test that the submission schema validates correctly."""
    data = {
        "problem_id": "123",
        "language": "python",
        "code": "print('test')"
    }
    submission = SubmissionCreate(**data)
    assert submission.problem_id == "123"
    assert submission.language == "python"
