"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Let's use window.location.href to guarantee a full navigation
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Login Exception:", err);
      setError(err?.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-brand-cream overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <div className="absolute top-4 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md animate-slide-up z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 border-2 border-brand-black bg-brand-green flex items-center justify-center text-white font-display text-lg shadow-brutal-sm group-hover:-translate-y-1 transition-transform">
              C.
            </div>
            <span className="text-lg font-display uppercase tracking-widest mt-1 text-brand-black">Cerebyte</span>
          </Link>
          <h1 className="text-base font-display uppercase mt-8 mb-2 text-brand-black">Welcome Back.</h1>
          <p className="font-mono-accent text-sm text-brand-black/60 uppercase font-bold">Sign in to continue learning</p>
        </div>

        {/* Card */}
        <div className="brutal-box p-6 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="px-4 py-3 border-2 border-brand-black bg-[#ffcccb] text-brand-black font-mono-accent text-sm font-bold shadow-brutal-sm">
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

          <div className="mt-8 pt-6 border-t-2 border-brand-black text-center">
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
