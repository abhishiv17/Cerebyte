# 🧠 Cerebyte

### *Where Algorithms Meet Intelligence.*

> A full-stack interactive educational web application for mastering Data Structures, Algorithms, and Database Management Systems — with an integrated code execution engine, AI tutor, and visual ER diagram builder.

---

## 👥 Team & Responsibilities

- **Arjun**: Frontend Development (UI/UX, Next.js, Tailwind CSS, Monaco Editor, React Flow)
- **Abhishiv**: Backend Development (FastAPI, Python) & Database Architecture (Supabase, PostgreSQL)

---

## 🚦 Project Status

| Module | Status |
|---|---|
| **Landing Page** | ✅ Built |
| **Auth (Login / Signup)** | ✅ Built (Supabase email + OAuth-ready) |
| **Auth Callback & Middleware** | ✅ Built |
| **User Dashboard** | ✅ Built |
| **FastAPI Backend** | ✅ Production Ready |
| **DSA Hub** | ✅ Full Backend + Problem Solving UI |
| **In-Browser IDE** | ✅ Remote execution (Piston) + Result Stream |
| **AI Code Critic** | ✅ Groq Llama 3 Integration |
| **DBMS Module** | ✅ SQL Sandbox + Schema Visualization |
| **ER Diagram Builder** | ✅ React Flow Integration (CRUD Ready) |
| **SQL Sandbox** | ✅ Multi-Dialect Isolated Execution |
| **Profile Page** | ✅ Activity Tracking + Settings |
| **Database Migrations** | ✅ Atomic Migrations (001-006) |
| **Testing Infrastructure** | ✅ Backend Pytest Suite |
| **Documentation** | ✅ Comprehensive System Docs |

---

## 📁 Project Structure

```
cerebyte/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 .env                              # Root-level env vars (backend)
├── 📄 .env.example
├── 📄 docker-compose.yml
│
├── 📁 frontend/                         # Next.js 15 (App Router) Application
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.local                    # ← copy from .env.local.example
│   ├── 📄 .env.local.example
│   │
│   └── 📁 src/
│       ├── 📄 middleware.ts              # ✅ Auth redirect guard
│       │
│       ├── 📁 app/                      # Next.js App Router
│       │   ├── 📄 layout.tsx            # ✅ Root layout + fonts
│       │   ├── 📄 page.tsx              # ✅ Landing Page
│       │   ├── 📄 globals.css
│       │   │
│       │   ├── 📁 (auth)/               # ✅ Auth route group
│       │   │   ├── 📁 login/
│       │   │   │   └── 📄 page.tsx      # ✅ Login page
│       │   │   ├── 📁 signup/
│       │   │   │   └── 📄 page.tsx      # ✅ Signup page
│       │   │   └── 📁 callback/
│       │   │       └── 📄 page.tsx
│       │   │
│       │   ├── 📁 auth/
│       │   │   └── 📁 callback/
│       │   │       └── 📄 route.ts      # ✅ OAuth code exchange → /dashboard
│       │   │
│       │   ├── 📁 dashboard/
│       │   │   └── 📄 page.tsx          # ✅ User dashboard (auth-protected)
│       │   │
│       │   ├── 📁 dsa/                  # ✅ DSA Learning Hub
│       │   ├── 📁 dbms/                 # ✅ DBMS Learning Hub
│       │   └── 📁 profile/             # ✅ User Profile & Stats
│       │
│       ├── 📁 components/
│       │   ├── 📁 ui/                   # ✅ Shadcn/UI Components
│       │   ├── 📁 layout/               # ✅ Navbar, Sidebar, Footer
│       │   ├── 📁 auth/                 # ✅ Auth Forms
│       │   ├── 📁 dashboard/            # ✅ Dashboard Widgets
│       │   ├── 📁 dsa/                  # ✅ DSA Specific Components
│       │   ├── 📁 ide/                  # ✅ Monaco Code Editor
│       │   ├── 📁 ai-tutor/             # ✅ AI Feedback UI
│       │   ├── 📁 dbms/                 # ✅ SQL Execution Panels
│       │   ├── 📁 er-builder/           # ✅ React Flow Canvas
│       │   └── 📁 sql-sandbox/          # ✅ Interactive SQL Editor
│       │
│       ├── 📁 hooks/                    # ✅ Custom React Hooks
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useCodeExecution.ts
│       │   ├── 📄 useSubmissions.ts
│       │   ├── 📄 useAIFeedback.ts
│       │   ├── 📄 useSQLExecution.ts
│       │   └── 📄 useERDiagram.ts
│       │
│       ├── 📁 lib/
│       │   ├── 📄 supabaseClient.ts     # ✅ Browser Supabase client
│       │   ├── 📄 apiClient.ts          # ✅ Axios/Fetch Wrapper
│       │   ├── 📄 utils.ts              # ✅ Tailwind Merge / Helpers
│       │   └── 📁 supabase/
│       │       ├── 📄 client.ts         # ✅ Browser client (SSR-safe)
│       │       └── 📄 server.ts         # ✅ Server-side Supabase client
│       │
│       ├── 📁 store/                    # ✅ State Management (Zustand)
│       │   ├── 📄 authStore.ts
│       │   ├── 📄 editorStore.ts
│       │   └── 📄 erDiagramStore.ts
│       │
│       └── 📁 types/                    # ✅ TypeScript Definitions
│           ├── 📄 user.types.ts
│           ├── 📄 problem.types.ts
│           ├── 📄 submission.types.ts
│           ├── 📄 dsa.types.ts
│           ├── 📄 dbms.types.ts
│           └── 📄 er.types.ts
│
│
├── 📁 backend/                          # Python FastAPI Application
│   ├── 📄 requirements.txt              # ✅ Managed dependencies
│   ├── 📄 Dockerfile
│   ├── 📄 .env.example
│   ├── 📄 main.py                       # ✅ FastAPI entry (CORS, routers)
│   │
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   │
│   │   ├── 📁 api/v1/                   # ✅ Modular Route Handlers
│   │   │   ├── 📄 auth.py               # ✅ Authentication
│   │   │   ├── 📄 users.py              # ✅ User Management
│   │   │   ├── 📄 problems.py           # ✅ Problem Sets
│   │   │   ├── 📄 submissions.py        # ✅ Submission Logic
│   │   │   ├── 📄 execution.py          # ✅ Code Execution (Piston)
│   │   │   ├── 📄 ai_tutor.py           # ✅ AI Feedback (Groq)
│   │   │   ├── 📄 dsa_content.py        # ✅ DSA Lessons
│   │   │   ├── 📄 dbms_content.py       # ✅ DBMS Lessons
│   │   │   ├── 📄 er_diagrams.py        # ✅ ER Diagram CRUD
│   │   │   ├── 📄 progress.py           # ✅ User Progress Tracking
│   │   │   └── 📄 sql_sandbox.py        # ✅ SQLite Sandbox
│   │   │
│   │   ├── 📁 core/                     # ✅ Config & Security
│   │   ├── 📁 models/                   # ✅ Pydantic Models
│   │   ├── 📁 schemas/                  # ✅ API Schemas
│   │   ├── 📁 services/                 # ✅ Business Logic Services
│   │   └── 📁 db/                       # ✅ Database Clients
│   │
│   └── 📁 tests/                        # ✅ Pytest Suite
│
│
├── 📁 database/                         # Supabase / PostgreSQL Schema & Seeds
│   ├── 📄 schema.sql                    # Combined schema
│   ├── 📄 seed.sql                      # Comprehensive seed data
│   ├── 📁 migrations/                   # Atomic SQL migrations
│   │   ├── 📄 001_create_users.sql
│   │   ├── 📄 002_create_problems.sql
│   │   ├── 📄 003_create_submissions.sql
│   │   ├── 📄 004_create_dsa_content.sql
│   │   ├── 📄 005_create_dbms_content.sql
│   │   └── 📄 006_create_progress_tracking.sql
│   └── 📁 mock_db/                      # SQL Sandbox mock data
│
│
└── 📁 docs/                             # ✅ Full System Documentation
    ├── 📄 architecture.md
    ├── 📄 api-reference.md
    ├── 📄 setup-guide.md
    └── 📄 tech-stack.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Auth** | Supabase Auth (email/password + OAuth) |
| **Code Editor** | Monaco Editor ✅ |
| **ER Diagrams** | React Flow ✅ |
| **Backend** | Python 3.13, FastAPI, Uvicorn |
| **Database** | Supabase (PostgreSQL) |
| **Code Execution** | Piston API ✅ |
| **AI Tutor** | Groq API (Llama 3) ✅ |
| **Containerization** | Docker, Docker Compose |

---

## ⚡ Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [Supabase](https://supabase.com) project

### 1. Clone & configure env vars

```bash
# Root .env (backend)
cp .env.example .env

# Frontend env
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Supabase — Enable Email Auth

> Go to **Supabase Dashboard → Authentication → Providers → Email**
> - Toggle **Enable Email provider** → ON
> - Toggle **Confirm email** → OFF *(for local dev)*

Or create a user manually: **Authentication → Users → Add user**

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

### 4. Backend

```powershell
cd backend
.\venv\Scripts\Activate   # Windows
# python -m venv venv && source venv/bin/activate  (Mac/Linux)

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

## 🗺️ Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Live | Landing page |
| `/login` | ✅ Live | Supabase email login |
| `/signup` | ✅ Live | Supabase email signup |
| `/auth/callback` | ✅ Live | OAuth code → session exchange |
| `/dashboard` | ✅ Live | Auth-protected; redirects to `/login` if no session |
| `/dsa` | ✅ Live | DSA Hub |
| `/dsa/problems` | ✅ Live | Problem listing |
| `/dsa/problems/[id]` | ✅ Live | IDE + problem view |
| `/dbms` | ✅ Live | DBMS landing |
| `/dbms/er-builder` | ✅ Live | ER Diagram builder |
| `/dbms/sql-sandbox` | ✅ Live | SQL Sandbox |
| `/profile` | ✅ Live | User profile & settings |

### Backend API

| Endpoint | Status |
|---|---|
| `GET /health` | ✅ Live |
| `GET /` | ✅ Live |
| `GET /api/v1/auth/...` | ✅ Built |
| `GET /api/v1/users/...` | ✅ Built |
| `POST /api/v1/execution/run` | ✅ Built (Piston) |
| `POST /api/v1/ai-tutor/feedback` | ✅ Built (Groq) |
| `GET /api/v1/problems` | ✅ Built |
| `POST /api/v1/submissions` | ✅ Built |
| `POST /api/v1/sql-sandbox/execute` | ✅ Built (SQLite) |
| `GET /api/v1/dsa-content/lessons` | ✅ Built |
| `GET /api/v1/dbms-content/lessons` | ✅ Built |
| `GET /api/v1/er-diagrams` | ✅ Built |
| `POST /api/v1/progress/complete` | ✅ Built |
| `GET /api/v1/progress/` | ✅ Built |

---

## 🚀 Core Modules (Planned)

- **DSA Learning Hub** — Categorized concepts with Big-O analysis and the Algorithm Time-Travel Stepper.
- **In-Browser IDE** — Multi-language editor (Monaco) with remote sandboxed execution via Piston API.
- **AI Code Critic** — Powered by Groq; provides hints, complexity analysis, and optimization tips.
- **DBMS Module** — Interactive tutorials on relational models, normalization, and keys.
- **ER Diagram Builder** — Drag-and-drop canvas (React Flow) with persistence and schema generation.
- **SQL Sandbox** — Live query editor against a mock DB with visual query execution explainer.
- **User Dashboard** — Tracks streaks, submission history, and performance metrics.
- **Progress Tracking** — Atomic tracking of completed lessons and solved problems across all modules.
