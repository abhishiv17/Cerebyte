# Cerebyte Technology Stack

Cerebyte uses a modern, high-performance technology stack to deliver a seamless interactive learning experience.

## Frontend Client
* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) - Chosen for optimal server-side rendering, SEO, and route-group management.
* **Language**: [TypeScript](https://www.typescriptlang.org/) - Enforces strict typing for API responses and component props.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) - Provides a robust, highly customizable, and accessible design system.
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Used for global state that doesn't fit well into React Context (e.g. tracking open editor tabs, diagram canvas state).
* **Interactive Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Powers the in-browser IDE for the DSA module, providing VSCode-level syntax highlighting and autocompletion.
* **Visual Canvas**: [React Flow](https://reactflow.dev/) - Powers the drag-and-drop interactive ER Diagram builder.

## Backend Service
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - A modern, highly performant Python web framework. Chosen for its native asynchronous support and automated OpenAPI documentation.
* **Language**: [Python 3.13](https://www.python.org/) - Ideal for quickly integrating with AI APIs and handling complex backend logic.
* **Validation**: [Pydantic](https://docs.pydantic.dev/latest/) - Ensures strict parsing and validation of JSON bodies coming from the frontend.
* **Server**: [Uvicorn](https://www.uvicorn.org/) - An ASGI web server implementation for Python.

## Database & Authentication
* **Platform**: [Supabase](https://supabase.com/) - An open-source Firebase alternative.
* **Database Engine**: PostgreSQL.
* **Security**: PostgreSQL Row Level Security (RLS) is heavily utilized to restrict data access at the database level rather than just the application level.
* **Authentication**: Supabase Auth (Email/Password + OAuth flows) deeply integrated with Next.js middleware and FastAPI dependencies via JWT validation.

## Infrastructure & Integrations
* **Code Execution**: [Piston API](https://github.com/engineer-man/piston) - Provides robust, isolated Docker sandboxes for securely compiling and running untrusted user code submitted in the DSA module.
* **AI Engine**: [Groq Cloud (Llama 3)](https://groq.com/) - Powers the AI Tutor module, providing extremely low-latency code critiques, hints, and big-O analysis.
* **Testing**: Pytest & Flake8 for backend static analysis and test execution.
