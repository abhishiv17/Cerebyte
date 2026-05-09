# Cerebyte Architecture Overview

Cerebyte is built on a modern, decoupled architecture designed for performance, modularity, and security.

## High-Level Architecture
1. **Frontend Client**: Next.js 15 (App Router)
2. **Backend Service**: Python FastAPI
3. **Database**: Supabase (PostgreSQL)
4. **Third-Party Integrations**:
   - Judge0 CE API (Code Execution Engine)
   - Groq API / Llama 3 (AI Code Critic)

## 1. Frontend (Next.js)
The frontend is structured into functional modules to separate concerns and maximize component reuse.
- **State Management**: Uses Zustand for localized complex states (`authStore`, `editorStore`, `erDiagramStore`).
- **Data Fetching**: Custom hooks wrapping Axios (`useSubmissions`, `useERDiagram`, etc.).
- **Interactive UI**:
   - `Monaco Editor` embedded for the IDE experience.
   - `Data Structure Visualizer` embedded in the IDE output pane using SVG for Neo-Brutalist tree/graph representation.
   - `React Flow` manages the dynamic ER diagram canvas.
   - `Shadcn UI` + `Tailwind CSS` for a highly polished, responsive design system with robust client-side search/filtering.
- **Routing**: Next.js App Router utilizes Route Groups (e.g., `(auth)`) and server-side middleware to protect dashboard and IDE routes automatically.

## 2. Backend (FastAPI)
The backend acts as a strict API layer enforcing business logic, delegating authentication, and orchestrating external services.
- **Dependency Injection**: Reusable `get_current_user` dependencies validate Supabase JWTs.
- **Modular Routers**: `app/api/v1/` cleanly separates concerns (`auth.py`, `problems.py`, `execution.py`).
- **Services Layer**: Business logic lives in `app/services/` (e.g. `submission_service` handles testing user code against all DB test cases, aggregating execution times and memory usages).
- **Pydantic Validation**: Strict `schemas/` ensure all incoming requests and outgoing responses are strictly typed and sanitized.

## 3. Database (Supabase/PostgreSQL)
We utilize Supabase to handle Identity/Auth and primary persistent storage.
- **Authentication**: Managed natively by Supabase Auth (Email + OAuth). The frontend receives JWTs, which the FastAPI backend cryptographically verifies.
- **Row Level Security (RLS)**: Highly restrictive database policies. Users can only fetch and update their own `user_progress`, `submissions`, and `er_diagrams`. 
- **Automated Triggers**: Postgres functions automatically manage `updated_at` columns on row modifications, and trigger user profile creation upon Supabase Auth sign-up.

## 4. Execution Sandbox
- **Python/DSA Sandbox**: Uses **Judge0 CE** (via RapidAPI) to safely execute arbitrary user code in sandboxed environments, returning `stdout`, execution time, and exit codes. Falls back to local subprocess execution in development.
- **SQL Sandbox**: Uses an isolated, in-memory Python `sqlite3` execution layer (or similar) built directly into the FastAPI backend (`sql_sandbox_service.py`), ensuring users cannot damage the main Supabase database.
