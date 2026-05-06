"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Refresh the router to apply new session and navigate
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-brand-cream overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative w-full max-w-md animate-slide-up z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 border-4 border-brand-black bg-brand-green flex items-center justify-center text-white font-display text-2xl shadow-brutal-sm group-hover:-translate-y-1 transition-transform">
              C.
            </div>
            <span className="text-4xl font-display uppercase tracking-widest mt-1 text-brand-black">Cerebyte</span>
          </Link>
          <h1 className="text-5xl font-display uppercase mt-8 mb-2 text-brand-black">Welcome Back.</h1>
          <p className="font-mono-accent text-sm text-brand-black/60 uppercase font-bold">Sign in to continue learning</p>
        </div>

        {/* Card */}
        <div className="brutal-box p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="px-4 py-3 border-4 border-brand-black bg-[#ffcccb] text-brand-black font-mono-accent text-sm font-bold shadow-brutal-sm">
                ERROR: {error}
              </div>
            )}

            <div>
              <label className="block font-mono-accent text-sm font-bold text-brand-black uppercase mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="brutal-input"
              />
            </div>

            <div>
              <label className="block font-mono-accent text-sm font-bold text-brand-black uppercase mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="brutal-input"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="brutal-button w-full mt-4"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-4 border-brand-black text-center">
            <p className="font-mono-accent text-brand-black/60 text-sm font-bold uppercase">
              Don't have an account?{" "}
              <Link href="/signup" className="text-brand-black hover:text-brand-green hover:underline decoration-2 underline-offset-4 transition-colors">
                SIGN UP FREE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
