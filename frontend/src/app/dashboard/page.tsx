import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles the redirect, but double-check server-side
  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Learner";

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-950/50 to-transparent" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-surface-900/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-base shadow-lg shadow-brand-600/50">
            🧠
          </div>
          <span className="text-lg font-bold">Cerebyte</span>
          <span className="text-white/30 mx-2">/</span>
          <span className="text-white/60 text-sm">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
              {displayName[0].toUpperCase()}
            </div>
            <span className="text-sm text-white/80">{displayName}</span>
          </div>

          <form action={signOut}>
            <button
              id="sign-out-btn"
              type="submit"
              className="text-sm text-white/40 hover:text-white/80 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-10">
        {/* Welcome header */}
        <div className="mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Online
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-gradient">{displayName}</span> 👋
          </h1>
          <p className="text-white/50">
            Member since {joinedDate} · {user.email}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🔥", label: "Day Streak", value: "1", sub: "Just started!" },
            { icon: "✅", label: "Problems Solved", value: "0", sub: "Start coding →" },
            { icon: "🧮", label: "DSA Topics", value: "0 / 24", sub: "Explore topics" },
            { icon: "🤖", label: "AI Critiques", value: "0", sub: "Submit code first" },
          ].map(({ icon, label, value, sub }) => (
            <div
              key={label}
              className="glass rounded-2xl p-5 hover:border-brand-500/20 transition-colors cursor-default"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <div className="text-2xl font-bold text-gradient">{value}</div>
              <div className="text-xs text-white/60 mt-1 font-medium">{label}</div>
              <div className="text-xs text-white/30 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <h2 className="text-lg font-semibold text-white/70 mb-4">Modules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[
            {
              icon: "🧮",
              title: "DSA Hub",
              description: "Arrays, Trees, Graphs, Dynamic Programming and more.",
              badge: "500+ problems",
              color: "from-brand-600/20 to-violet-600/10",
              href: "/dsa",
              status: "coming-soon",
            },
            {
              icon: "💻",
              title: "In-Browser IDE",
              description: "Write, run, and submit code in 10+ languages.",
              badge: "Multi-language",
              color: "from-emerald-600/20 to-teal-600/10",
              href: "/dsa/problems",
              status: "coming-soon",
            },
            {
              icon: "🗄️",
              title: "DBMS Module",
              description: "Normalization, relational algebra, and SQL concepts.",
              badge: "Interactive",
              color: "from-amber-600/20 to-orange-600/10",
              href: "/dbms",
              status: "coming-soon",
            },
            {
              icon: "🔗",
              title: "ER Diagram Builder",
              description: "Visual drag-and-drop ER designer with SQL export.",
              badge: "Two-way convert",
              color: "from-pink-600/20 to-rose-600/10",
              href: "/dbms/er-builder",
              status: "coming-soon",
            },
            {
              icon: "🧪",
              title: "SQL Sandbox",
              description: "Run live SQL queries against a mock database.",
              badge: "Live execution",
              color: "from-cyan-600/20 to-blue-600/10",
              href: "/dbms/sql-sandbox",
              status: "coming-soon",
            },
            {
              icon: "🤖",
              title: "AI Code Critic",
              description: "Get hints and complexity feedback powered by Groq.",
              badge: "Groq-powered",
              color: "from-violet-600/20 to-purple-600/10",
              href: "/ai-tutor",
              status: "coming-soon",
            },
          ].map(({ icon, title, description, badge, color, status }) => (
            <div
              key={title}
              className={`relative glass rounded-2xl p-6 bg-gradient-to-br ${color} overflow-hidden group cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50">
                    {badge}
                  </span>
                  {status === "coming-soon" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      Soon
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{description}</p>

              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Account info card */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            Account Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/30 mb-1">Email</div>
              <div className="text-white/80 font-mono text-sm">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-white/30 mb-1">User ID</div>
              <div className="text-white/40 font-mono text-xs truncate">{user.id}</div>
            </div>
            <div>
              <div className="text-xs text-white/30 mb-1">Provider</div>
              <div className="text-white/60 text-sm capitalize">
                {user.app_metadata?.provider || "email"}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/30 mb-1">Member Since</div>
              <div className="text-white/60 text-sm">{joinedDate}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
