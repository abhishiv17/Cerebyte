# 🧠 Cerebyte

### *Where Algorithms Meet Intelligence.*

> A full-stack interactive educational web application for mastering Data Structures, Algorithms, and Database Management Systems — with an integrated code execution engine, AI tutor, and visual ER diagram builder.

---

## 📁 Project Structure

```
cerebyte/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 docker-compose.yml
│
├── 📁 frontend/                          # Next.js (React) Application
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.local.example
│   │
│   ├── 📁 public/
│   │   ├── 📁 assets/
│   │   │   ├── 📁 icons/
│   │   │   └── 📁 images/
│   │   └── 📁 fonts/
│   │
│   └── 📁 src/
│       ├── 📁 app/                       # Next.js App Router
│       │   ├── 📄 layout.tsx
│       │   ├── 📄 page.tsx               # Landing Page
│       │   │
│       │   ├── 📁 (auth)/
│       │   │   ├── 📁 login/
│       │   │   │   └── 📄 page.tsx
│       │   │   ├── 📁 signup/
│       │   │   │   └── 📄 page.tsx
│       │   │   └── 📁 callback/
│       │   │       └── 📄 page.tsx
│       │   │
│       │   ├── 📁 dashboard/
│       │   │   └── 📄 page.tsx           # User Dashboard & Analytics
│       │   │
│       │   ├── 📁 dsa/
│       │   │   ├── 📄 page.tsx           # DSA Hub Landing
│       │   │   ├── 📁 [topic]/
│       │   │   │   └── 📄 page.tsx       # Dynamic DSA Concept Page
│       │   │   └── 📁 problems/
│       │   │       ├── 📄 page.tsx       # Problem Listing
│       │   │       └── 📁 [id]/
│       │   │           └── 📄 page.tsx   # Individual Problem + IDE
│       │   │
│       │   ├── 📁 dbms/
│       │   │   ├── 📄 page.tsx           # DBMS Module Landing
│       │   │   ├── 📁 concepts/
│       │   │   │   ├── 📄 page.tsx       # Concepts Listing
│       │   │   │   └── 📁 [topic]/
│       │   │   │       └── 📄 page.tsx   # Dynamic DBMS Concept Page
│       │   │   ├── 📁 er-builder/
│       │   │   │   └── 📄 page.tsx       # Visual ER Diagram Builder
│       │   │   └── 📁 sql-sandbox/
│       │   │       └── 📄 page.tsx       # SQL Sandbox
│       │   │
│       │   └── 📁 profile/
│       │       └── 📄 page.tsx           # User Profile & Settings
│       │
│       ├── 📁 components/
│       │   ├── 📁 ui/                    # Reusable Generic UI Primitives
│       │   │   ├── 📄 Button.tsx
│       │   │   ├── 📄 Card.tsx
│       │   │   ├── 📄 Modal.tsx
│       │   │   ├── 📄 Badge.tsx
│       │   │   ├── 📄 Tabs.tsx
│       │   │   ├── 📄 Tooltip.tsx
│       │   │   ├── 📄 Skeleton.tsx
│       │   │   └── 📄 Spinner.tsx
│       │   │
│       │   ├── 📁 layout/
│       │   │   ├── 📄 Navbar.tsx
│       │   │   ├── 📄 Sidebar.tsx
│       │   │   ├── 📄 Footer.tsx
│       │   │   └── 📄 PageWrapper.tsx
│       │   │
│       │   ├── 📁 auth/
│       │   │   ├── 📄 LoginForm.tsx
│       │   │   ├── 📄 SignupForm.tsx
│       │   │   └── 📄 AuthGuard.tsx
│       │   │
│       │   ├── 📁 dashboard/
│       │   │   ├── 📄 StatsCard.tsx
│       │   │   ├── 📄 StreakWidget.tsx
│       │   │   ├── 📄 ProgressChart.tsx
│       │   │   ├── 📄 SubmissionHistoryTable.tsx
│       │   │   └── 📄 LanguageUsageChart.tsx
│       │   │
│       │   ├── 📁 dsa/
│       │   │   ├── 📄 ConceptCard.tsx
│       │   │   ├── 📄 ComplexityBadge.tsx
│       │   │   ├── 📄 BigOTable.tsx
│       │   │   ├── 📄 ProblemCard.tsx
│       │   │   ├── 📄 AlgorithmStepper.tsx   # Time-Travel Debugger
│       │   │   └── 📄 TopicFilterBar.tsx
│       │   │
│       │   ├── 📁 ide/
│       │   │   ├── 📄 CodeEditor.tsx          # Monaco Editor Wrapper
│       │   │   ├── 📄 LanguageSelector.tsx
│       │   │   ├── 📄 RunButton.tsx
│       │   │   ├── 📄 OutputPanel.tsx
│       │   │   ├── 📄 TestCasePanel.tsx
│       │   │   └── 📄 ExecutionMetrics.tsx    # Time & Memory Usage
│       │   │
│       │   ├── 📁 ai-tutor/
│       │   │   ├── 📄 AIFeedbackPanel.tsx
│       │   │   ├── 📄 HintBox.tsx
│       │   │   └── 📄 ComplexityAnalysisBubble.tsx
│       │   │
│       │   ├── 📁 dbms/
│       │   │   ├── 📄 ConceptAccordion.tsx
│       │   │   ├── 📄 NormalizationStepper.tsx
│       │   │   ├── 📄 RelationalModelDiagram.tsx
│       │   │   └── 📄 KeysExplainer.tsx
│       │   │
│       │   ├── 📁 er-builder/
│       │   │   ├── 📄 ERCanvas.tsx             # React Flow Canvas
│       │   │   ├── 📄 EntityNode.tsx
│       │   │   ├── 📄 RelationshipEdge.tsx
│       │   │   ├── 📄 AttributeNode.tsx
│       │   │   ├── 📄 ERToolbar.tsx
│       │   │   ├── 📄 SQLtoERParser.tsx        # SQL → ER Diagram
│       │   │   └── 📄 ERtoSQLExporter.tsx      # ER Diagram → SQL Schema
│       │   │
│       │   └── 📁 sql-sandbox/
│       │       ├── 📄 SQLEditor.tsx
│       │       ├── 📄 QueryResultTable.tsx
│       │       ├── 📄 SchemaViewer.tsx
│       │       └── 📄 QueryVisualizer.tsx      # Visual EXPLAIN / JOIN Animator
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useCodeExecution.ts
│       │   ├── 📄 useSubmissions.ts
│       │   ├── 📄 useAIFeedback.ts
│       │   ├── 📄 useSQLExecution.ts
│       │   └── 📄 useERDiagram.ts
│       │
│       ├── 📁 lib/
│       │   ├── 📄 supabaseClient.ts
│       │   ├── 📄 apiClient.ts
│       │   └── 📄 utils.ts
│       │
│       ├── 📁 store/                          # Global State (Zustand / Context)
│       │   ├── 📄 authStore.ts
│       │   ├── 📄 editorStore.ts
│       │   └── 📄 erDiagramStore.ts
│       │
│       └── 📁 types/
│           ├── 📄 user.types.ts
│           ├── 📄 problem.types.ts
│           ├── 📄 submission.types.ts
│           ├── 📄 dsa.types.ts
│           ├── 📄 dbms.types.ts
│           └── 📄 er.types.ts
│
│
├── 📁 backend/                               # Python FastAPI Application
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile
│   ├── 📄 .env.example
│   ├── 📄 main.py                            # FastAPI App Entry Point
│   │
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   │
│   │   ├── 📁 api/                           # Route Definitions
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📁 v1/
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 auth.py
│   │   │   │   ├── 📄 users.py
│   │   │   │   ├── 📄 problems.py
│   │   │   │   ├── 📄 submissions.py
│   │   │   │   ├── 📄 execution.py           # Code Execution Routes
│   │   │   │   ├── 📄 ai_tutor.py            # AI Feedback Routes
│   │   │   │   ├── 📄 dsa_content.py
│   │   │   │   ├── 📄 dbms_content.py
│   │   │   │   └── 📄 sql_sandbox.py
│   │   │
│   │   ├── 📁 core/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 config.py                  # App Configuration & Env Vars
│   │   │   ├── 📄 security.py                # JWT / Auth Middleware
│   │   │   └── 📄 dependencies.py            # FastAPI Dependency Injection
│   │   │
│   │   ├── 📁 models/                        # Pydantic & DB Models
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 user.py
│   │   │   ├── 📄 problem.py
│   │   │   ├── 📄 submission.py
│   │   │   └── 📄 content.py
│   │   │
│   │   ├── 📁 schemas/                       # Pydantic Request/Response Schemas
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 user.py
│   │   │   ├── 📄 execution.py
│   │   │   ├── 📄 submission.py
│   │   │   └── 📄 ai_tutor.py
│   │   │
│   │   ├── 📁 services/                      # Business Logic Layer
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 execution_service.py       # Piston API Integration
│   │   │   ├── 📄 ai_tutor_service.py        # Groq API Integration
│   │   │   ├── 📄 submission_service.py
│   │   │   ├── 📄 user_service.py
│   │   │   └── 📄 sql_sandbox_service.py
│   │   │
│   │   └── 📁 db/
│   │       ├── 📄 __init__.py
│   │       ├── 📄 client.py                  # Supabase Client Setup
│   │       └── 📄 queries.py                 # Reusable DB Query Functions
│   │
│   └── 📁 tests/
│       ├── 📄 __init__.py
│       ├── 📄 test_execution.py
│       ├── 📄 test_ai_tutor.py
│       ├── 📄 test_submissions.py
│       └── 📄 test_sql_sandbox.py
│
│
├── 📁 database/                              # Supabase / PostgreSQL Schema & Seeds
│   ├── 📄 schema.sql                         # Full DB Schema Definition
│   ├── 📄 seed.sql                           # Seed Data (problems, concepts)
│   │
│   ├── 📁 migrations/
│   │   ├── 📄 001_create_users.sql
│   │   ├── 📄 002_create_problems.sql
│   │   ├── 📄 003_create_submissions.sql
│   │   ├── 📄 004_create_dsa_content.sql
│   │   ├── 📄 005_create_dbms_content.sql
│   │   └── 📄 006_create_progress_tracking.sql
│   │
│   └── 📁 mock_db/                           # Mock DB for SQL Sandbox
│       ├── 📄 mock_schema.sql
│       └── 📄 mock_data.sql
│
│
└── 📁 docs/                                  # Project Documentation
    ├── 📄 architecture.md
    ├── 📄 api-reference.md
    ├── 📄 setup-guide.md
    ├── 📄 tech-stack.md
    └── 📁 diagrams/
        ├── 📄 system-architecture.png
        ├── 📄 db-erd.png
        └── 📄 user-flow.png
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (React), Tailwind CSS |
| **Code Editor** | Monaco Editor |
| **ER Diagrams** | React Flow |
| **Backend** | Python, FastAPI |
| **Database & Auth** | Supabase (PostgreSQL) |
| **Code Execution** | Piston API (sandboxed) |
| **AI Tutor** | Groq API |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Core Modules

- **DSA Learning Hub** — Categorized concepts with Big-O analysis and the Algorithm Time-Travel Stepper
- **In-Browser IDE** — Multi-language editor with remote sandboxed execution, test cases, and execution metrics
- **AI Code Critic** — Powered by Groq; gives hints and complexity feedback without spoiling solutions
- **DBMS Module** — Interactive tutorials on relational models, normalization, and keys
- **ER Diagram Builder** — Drag-and-drop canvas with SQL↔ER two-way conversion
- **SQL Sandbox** — Live query editor against a mock DB with a visual query execution explainer
- **User Dashboard** — Tracks streaks, submission history, language usage, and performance over time
