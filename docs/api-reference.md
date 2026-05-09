# Cerebyte API Reference

The Cerebyte backend is built with FastAPI and runs on `http://localhost:8000` locally. The base path for API version 1 is `/api/v1`.

All protected routes expect a valid Supabase JWT token in the `Authorization: Bearer <token>` header.

## Authentication & Users
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/auth/callback` | `GET` | Used for OAuth flow redirection | No |
| `/api/v1/users/me` | `GET` | Get the currently authenticated user's profile | Yes |
| `/api/v1/users/me` | `PUT` | Update the current user's profile data | Yes |

## DSA Learning & Problems
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/dsa-content/lessons` | `GET` | List all available DSA lessons | No |
| `/api/v1/dsa-content/lessons/{id}` | `GET` | Get details for a specific DSA lesson | No |
| `/api/v1/problems` | `GET` | Fetch paginated list of DSA coding problems | No |
| `/api/v1/problems/{id}` | `GET` | Fetch specific problem details and test cases | No |

## Code Execution & Submissions
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/execution/run` | `POST` | Execute raw code using Judge0 CE (with local subprocess fallback) | Yes |
| `/api/v1/submissions` | `POST` | Submit code for a specific problem. Automatically runs against test cases. | Yes |
| `/api/v1/submissions` | `GET` | Get a user's submission history | Yes |

## AI Tutor
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/ai-tutor/feedback` | `POST` | Send code context to Groq API (Llama 3) for hints, complexity analysis, and optimization tips | Yes |

## DBMS Module
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/dbms-content/lessons` | `GET` | List all DBMS lessons | No |
| `/api/v1/dbms-content/lessons/{id}`| `GET` | Get details for a specific DBMS lesson | No |
| `/api/v1/sql-sandbox/execute` | `POST` | Execute SQL queries in the isolated SQLite sandbox | Yes |
| `/api/v1/er-diagrams` | `GET` | Retrieve a user's saved ER diagrams | Yes |
| `/api/v1/er-diagrams` | `POST` | Create a new ER diagram | Yes |
| `/api/v1/er-diagrams/{id}` | `PUT` | Update an existing ER diagram | Yes |
| `/api/v1/er-diagrams/{id}` | `DELETE` | Delete an ER diagram | Yes |

## Progress Tracking
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/progress/` | `GET` | Get the current user's completed lessons and stats | Yes |
| `/api/v1/progress/complete` | `POST` | Mark a specific lesson as completed (upsert) | Yes |

## Health Checks
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | `GET` | Check if the backend service is running | No |
| `/` | `GET` | Root API welcome message | No |
