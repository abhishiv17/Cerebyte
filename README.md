# 🧠 Cerebyte

### *Where Algorithms Meet Intelligence.*

> A full-stack interactive educational web application for mastering Data Structures, Algorithms, and Database Management Systems — with an integrated code execution engine, AI tutor, and visual ER diagram builder.

---

## 🚦 Project Status

| Module | Status |
|---|---|
| **Landing Page** | ✅ Built |
| **Auth (Login / Signup)** | ✅ Built (Supabase email + OAuth-ready) |
| **Auth Callback & Middleware** | ✅ Built |
| **User Dashboard** | ✅ Built (shell — stats hardcoded, module links present) |
| **FastAPI Backend** | ✅ Running (auth + users routes wired) |
| **DSA Hub** | 🚧 Scaffold only |
| **In-Browser IDE** | 🚧 Scaffold only |
| **AI Code Critic** | 🚧 Scaffold only |
| **DBMS Module** | 🚧 Scaffold only |
| **ER Diagram Builder** | 🚧 Scaffold only |
| **SQL Sandbox** | 🚧 Scaffold only |
| **Profile Page** | 🚧 Scaffold only |
| **Database Migrations** | 🚧 Not yet applied |

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
│       │   ├── 📁 dsa/                  # 🚧 Scaffold
│       │   ├── 📁 dbms/                 # 🚧 Scaffold
│       │   └── 📁 profile/             # 🚧 Scaffold
│       │
│       ├── 📁 components/
│       │   ├── 📁 ui/                   # 🚧 Scaffold (Button, Card, Modal…)
│       │   ├── 📁 layout/               # 🚧 Scaffold (Navbar, Sidebar…)
│       │   ├── 📁 auth/                 # 🚧 Scaffold (LoginForm, SignupForm…)
│       │   ├── 📁 dashboard/            # 🚧 Scaffold (StatsCard, StreakWidget…)
│       │   ├── 📁 dsa/                  # 🚧 Scaffold
│       │   ├── 📁 ide/                  # 🚧 Scaffold (CodeEditor / Monaco)
│       │   ├── 📁 ai-tutor/             # 🚧 Scaffold
│       │   ├── 📁 dbms/                 # 🚧 Scaffold
│       │   ├── 📁 er-builder/           # 🚧 Scaffold (React Flow canvas)
│       │   └── 📁 sql-sandbox/          # 🚧 Scaffold
│       │
│       ├── 📁 hooks/                    # 🚧 Scaffold files created
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useCodeExecution.ts
│       │   ├── 📄 useSubmissions.ts
│       │   ├── 📄 useAIFeedback.ts
│       │   ├── 📄 useSQLExecution.ts
│       │   └── 📄 useERDiagram.ts
│       │
│       ├── 📁 lib/
│       │   ├── 📄 supabaseClient.ts     # ✅ Browser Supabase client
│       │   ├── 📄 apiClient.ts          # 🚧 Scaffold
│       │   ├── 📄 utils.ts              # 🚧 Scaffold
│       │   └── 📁 supabase/
│       │       ├── 📄 client.ts         # ✅ Browser client (SSR-safe)
│       │       └── 📄 server.ts         # ✅ Server-side Supabase client
│       │
│       ├── 📁 store/                    # 🚧 Scaffold (Zustand stores)
│       │   ├── 📄 authStore.ts
│       │   ├── 📄 editorStore.ts
│       │   └── 📄 erDiagramStore.ts
│       │
│       └── 📁 types/                    # 🚧 Scaffold
│           ├── 📄 user.types.ts
│           ├── 📄 problem.types.ts
│           ├── 📄 submission.types.ts
│           ├── 📄 dsa.types.ts
│           ├── 📄 dbms.types.ts
│           └── 📄 er.types.ts
│
│
├── 📁 backend/                          # Python FastAPI Application
│   ├── 📄 requirements.txt              # ✅ Dependencies listed
│   ├── 📄 Dockerfile
│   ├── 📄 .env.example
│   ├── 📄 main.py                       # ✅ FastAPI entry — CORS, routers, health
│   │
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   │
│   │   ├── 📁 api/v1/                   # Route files
│   │   │   ├── 📄 auth.py               # ✅ Minimal auth route
│   │   │   ├── 📄 users.py              # ✅ Minimal users route
│   │   │   ├── 📄 problems.py           # 🚧 Scaffold
│   │   │   ├── 📄 submissions.py        # 🚧 Scaffold
│   │   │   ├── 📄 execution.py          # 🚧 Scaffold (Piston API)
│   │   │   ├── 📄 ai_tutor.py           # 🚧 Scaffold (Groq API)
│   │   │   ├── 📄 dsa_content.py        # 🚧 Scaffold
│   │   │   ├── 📄 dbms_content.py       # 🚧 Scaffold
│   │   │   └── 📄 sql_sandbox.py        # 🚧 Scaffold
│   │   │
│   │   ├── 📁 core/                     # ✅ Config + Security scaffolded
│   │   │   ├── 📄 config.py
│   │   │   ├── 📄 security.py
│   │   │   └── 📄 dependencies.py
│   │   │
│   │   ├── 📁 models/                   # 🚧 Scaffold (Pydantic/DB models)
│   │   ├── 📁 schemas/                  # 🚧 Scaffold (Request/Response schemas)
│   │   ├── 📁 services/                 # 🚧 Scaffold (Business logic)
│   │   └── 📁 db/                       # 🚧 Scaffold (Supabase client + queries)
│   │
│   └── 📁 tests/                        # 🚧 Scaffold
│
│
├── 📁 database/                         # Supabase / PostgreSQL Schema & Seeds
│   ├── 📄 schema.sql                    # 🚧 Not yet applied
│   ├── 📄 seed.sql                      # 🚧 Not yet applied
│   ├── 📁 migrations/                   # 🚧 Migration files scaffolded
│   └── 📁 mock_db/                      # 🚧 SQL Sandbox mock data
│
│
└── 📁 docs/                             # 🚧 Documentation (scaffold)
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
| **Code Editor** | Monaco Editor *(planned)* |
| **ER Diagrams** | React Flow *(planned)* |
| **Backend** | Python 3.13, FastAPI, Uvicorn |
| **Database** | Supabase (PostgreSQL) |
| **Code Execution** | Piston API *(planned)* |
| **AI Tutor** | Groq API *(planned)* |
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
| `/dsa` | 🚧 Scaffold | DSA Hub |
| `/dsa/problems` | 🚧 Scaffold | Problem listing |
| `/dsa/problems/[id]` | 🚧 Scaffold | IDE + problem view |
| `/dbms` | 🚧 Scaffold | DBMS landing |
| `/dbms/er-builder` | 🚧 Scaffold | ER Diagram builder |
| `/dbms/sql-sandbox` | 🚧 Scaffold | SQL Sandbox |
| `/profile` | 🚧 Scaffold | User profile & settings |

### Backend API

| Endpoint | Status |
|---|---|
| `GET /health` | ✅ Live |
| `GET /` | ✅ Live |
| `GET /api/v1/auth/...` | ✅ Minimal |
| `GET /api/v1/users/...` | ✅ Minimal |
| `POST /api/v1/execution/run` | 🚧 Scaffold |
| `POST /api/v1/ai-tutor/feedback` | 🚧 Scaffold |
| `GET /api/v1/problems` | 🚧 Scaffold |
| `POST /api/v1/submissions` | 🚧 Scaffold |
| `POST /api/v1/sql-sandbox/execute` | 🚧 Scaffold |

---

## 🚀 Core Modules (Planned)

- **DSA Learning Hub** — Categorized concepts with Big-O analysis and the Algorithm Time-Travel Stepper
- **In-Browser IDE** — Multi-language editor (Monaco) with remote sandboxed execution via Piston API
- **AI Code Critic** — Powered by Groq; hints and complexity feedback without spoiling solutions
- **DBMS Module** — Interactive tutorials on relational models, normalization, and keys
- **ER Diagram Builder** — Drag-and-drop canvas (React Flow) with SQL ↔ ER two-way conversion
- **SQL Sandbox** — Live query editor against a mock DB with visual query execution explainer
- **User Dashboard** — Tracks streaks, submission history, language usage, and performance over time
