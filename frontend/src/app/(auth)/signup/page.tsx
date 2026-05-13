"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validatePassword = (pw: string) => {
      if (pw.length < 6) return "Password must be at least 6 characters long.";
      if (!/[a-z]/.test(pw)) return "Password must contain at least one lowercase letter.";
      if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter.";
      if (!/[0-9]/.test(pw)) return "Password must contain at least one digit.";
      if (!/[^A-Za-z0-9]/.test(pw)) return "Password must contain at least one symbol.";
      return null;
    };

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const needsConfirmation = !data.session;

    if (needsConfirmation) {
      setSuccess(true);
      setLoading(false);
    } else {
      // Refresh the router to apply new session and navigate
      router.refresh();
      router.push("/onboarding");
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-cream relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
        />
        
        <div className="brutal-box p-10 max-w-md w-full text-center animate-slide-up z-10">
          <div className="text-lg mb-6">📬</div>
          <h2 className="text-lg font-display uppercase mb-4 text-brand-black">Check your email.</h2>
          <p className="font-mono-accent font-bold text-brand-black/70 mb-6 uppercase text-sm leading-relaxed">
            We sent a confirmation link to <br/><strong className="text-brand-black text-base">{email}</strong><br/>
            Click it to activate your account.
          </p>
          <div className="border-2 border-brand-black p-4 bg-brand-lightGreen/20 text-left">
            <p className="font-mono-accent text-xs font-bold uppercase text-brand-black">
              Pro tip: For local dev, disable email confirmation in <br/>
              <span className="text-brand-green">Supabase → Auth → Settings</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-brand-cream overflow-hidden py-12">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative w-full max-w-md animate-slide-up z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 border-2 border-brand-black bg-brand-green flex items-center justify-center text-white font-display text-lg shadow-brutal-sm group-hover:-translate-y-1 transition-transform">
              C.
            </div>
            <span className="text-lg font-display uppercase tracking-widest mt-1 text-brand-black">Cerebyte</span>
          </Link>
          <h1 className="text-base font-display uppercase mt-8 mb-2 text-brand-black">Start Now.</h1>
          <p className="font-mono-accent text-sm text-brand-black/60 uppercase font-bold">Create your free account</p>
        </div>

        {/* Card */}
        <div className="brutal-box p-6 md:p-10">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="px-4 py-3 border-2 border-brand-black bg-[#ffcccb] text-brand-black font-mono-accent text-sm font-bold shadow-brutal-sm">
                ERROR: {error}
              </div>
            )}

            <div>
              <label className="block font-mono-accent text-sm font-bold text-brand-black uppercase mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className="brutal-input"
              />
            </div>

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
                <span className="text-brand-black/40 ml-2 text-xs">(MIN. 6 CHARS, 1 UPPER, 1 LOWER, 1 NUM, 1 SYMBOL)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="brutal-input"
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="brutal-button w-full mt-4"
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-brand-black text-center">
            <p className="font-mono-accent text-brand-black/60 text-sm font-bold uppercase">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-black hover:text-brand-green hover:underline decoration-2 underline-offset-4 transition-colors">
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
