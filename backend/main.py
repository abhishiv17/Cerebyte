from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import auth, users, test_routes, problems, submissions, execution, ai_tutor, sql_sandbox, dbms_content, dsa_content, er_diagrams, progress
from app.core.config import settings

app = FastAPI(
    title="Cerebyte API",
    description="Backend for Cerebyte — the DSA/DBMS learning platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# Global Error Handling
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for any unhandled exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred.",
            "error": str(exc)
        },
    )

# ---------------------------------------------------------------------------
# CORS — allow Next.js dev server and production frontend
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",  # Docker internal name
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(test_routes.router, prefix="/api/v1/tests", tags=["tests"])
app.include_router(problems.router, prefix="/api/v1/problems", tags=["problems"])
app.include_router(submissions.router, prefix="/api/v1/submissions", tags=["submissions"])
app.include_router(execution.router, prefix="/api/v1/execution", tags=["execution"])
app.include_router(ai_tutor.router, prefix="/api/v1/ai-tutor", tags=["ai_tutor"])
app.include_router(sql_sandbox.router, prefix="/api/v1/sql-sandbox", tags=["sql_sandbox"])
app.include_router(dbms_content.router, prefix="/api/v1/dbms-content", tags=["dbms_content"])
app.include_router(dsa_content.router, prefix="/api/v1/dsa-content", tags=["dsa_content"])
app.include_router(er_diagrams.router, prefix="/api/v1/er-diagrams", tags=["er_diagrams"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "cerebyte-api"}


@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to the Cerebyte API", "docs": "/docs"}
