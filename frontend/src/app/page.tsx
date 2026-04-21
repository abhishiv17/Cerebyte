import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background grid + glow */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-600/50">
            🧠
          </div>
          <span className="text-xl font-bold tracking-tight">Cerebyte</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-brand-300 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Now in Beta — DSA + DBMS + AI Tutor
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6 animate-slide-up">
          Where{" "}
          <span className="text-gradient">Algorithms</span>
          <br />
          Meet Intelligence.
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed animate-slide-up">
          Master Data Structures, Algorithms, and DBMS with an integrated
          in-browser IDE, AI-powered code critic, and visual ER diagram builder.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Link href="/signup" className="btn-primary text-lg px-8 py-4 glow-brand">
            Start Learning Free →
          </Link>
          <Link href="/login" className="btn-ghost text-lg px-8 py-4">
            Already have an account?
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {[
            "🧮 DSA Hub",
            "💻 In-Browser IDE",
            "🤖 AI Code Critic",
            "🗄️ DBMS Module",
            "🔗 ER Diagram Builder",
            "🧪 SQL Sandbox",
          ].map((feature) => (
            <span
              key={feature}
              className="px-4 py-2 rounded-full glass text-sm text-white/70"
            >
              {feature}
            </span>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "500+", label: "DSA Problems" },
            { value: "10+", label: "Languages" },
            { value: "AI", label: "Code Critic" },
            { value: "Free", label: "To Start" },
          ].map(({ value, label }) => (
            <div key={label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient">{value}</div>
              <div className="text-sm text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
