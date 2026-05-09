# Cerebyte Setup Guide

Follow these steps to set up Cerebyte on your local machine for development.

## Prerequisites
- **Node.js** v18 or newer
- **Python** v3.10 or newer
- **Git**
- A **Supabase** Project (Free tier is sufficient)
- A **Groq API Key** (for the AI Tutor module)

---

## 1. Supabase Project Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Authentication > Providers > Email**.
   - Ensure "Enable Email provider" is **ON**.
   - Turn "Confirm email" **OFF** to make local development easier.
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Copy the contents of `database/schema.sql` and run it. This will build all required tables, triggers, and Row Level Security policies.
5. Apply any additional SQL scripts inside the `database/migrations/` folder (such as `010_seed_more_problems.sql`) to keep your database up to date.
6. (Optional but recommended) Copy the contents of `database/seed.sql` and run it to populate your app with sample DSA problems and DBMS lessons.

---

## 2. Environment Variables Configuration

### Backend Environment
Navigate to the root directory and create your backend `.env` file:
```bash
cp .env.example .env
```
Fill in the `.env` with your Supabase keys (found in Project Settings > API) and your Groq API key:
```ini
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_KEY="your-service-role-key" 
GROQ_API_KEY="your-groq-key"
```

### Frontend Environment
Navigate to the frontend folder and configure the `.env.local` file:
```bash
cd frontend
cp .env.local.example .env.local
```
Fill in `.env.local`:
```ini
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## 3. Starting the Backend Server
The backend requires a Python virtual environment to manage dependencies cleanly.

**Windows:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Mac/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> Verify the backend is running by visiting [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to see the interactive Swagger API documentation.

---

## 4. Starting the Frontend Client
Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

> The application will now be running at [http://localhost:3000](http://localhost:3000).

You are fully configured and ready to develop!
