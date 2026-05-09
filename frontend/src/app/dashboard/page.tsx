import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Manual bypass for @supabase/ssr broken cookie parser
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const authCookieStr = cookieStore.get("sb-gerxyogslxthvoqcfxvr-auth-token")?.value;
  let manualAccessToken = undefined;
  let manualRefreshToken = undefined;
  try {
    if (authCookieStr) {
      const decodedStr = decodeURIComponent(authCookieStr);
      const sessionData = JSON.parse(decodedStr);
      manualAccessToken = sessionData.access_token;
      manualRefreshToken = sessionData.refresh_token;
    }
  } catch (e) {}

  // Set the session on the Supabase client so RLS-protected queries work
  if (manualAccessToken && manualRefreshToken) {
    await supabase.auth.setSession({
      access_token: manualAccessToken,
      refresh_token: manualRefreshToken,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(manualAccessToken);

  if (!user) {
    redirect("/login");
  }

  // Check onboarding status via backend API (uses service role key, bypasses RLS)
  let onboardingData = null;
  let shouldOnboard = false;

  try {
    const obRes = await fetch("http://localhost:8000/api/v1/onboarding/status", {
      headers: {
        Authorization: `Bearer ${manualAccessToken}`,
      },
      cache: "no-store",
    });
    if (obRes.ok) {
      const obStatus = await obRes.json();
      if (!obStatus.onboarding_completed) {
        shouldOnboard = true;
      } else {
        onboardingData = obStatus;
      }
    } else {
      // If API fails, assume not onboarded
      shouldOnboard = true;
    }
  } catch {
    // Backend unreachable — don't redirect, just show dashboard
    shouldOnboard = false;
  }

  if (shouldOnboard) {
    redirect("/onboarding");
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "LEARNER";
  
  const navalRank = onboardingData?.naval_rank || "RECRUIT";

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const modules = [
    { title: "DSA HUB", desc: "Arrays, Trees, Graphs & DP.", icon: "🧮", color: "bg-[#ffd166]", link: "/dsa" },
    { title: "IDE", desc: "Code & submit in 10+ languages.", icon: "💻", color: "bg-[#06d6a0]", link: "/ide" },
    { title: "DBMS", desc: "Normalization & SQL concepts.", icon: "🗄️", color: "bg-[#ef476f]", link: "/dbms" },
    { title: "ER BUILDER", desc: "Visual drag-and-drop designer.", icon: "🔗", color: "bg-[#118ab2]", link: "/dbms/er-builder" },
    { title: "SQL SANDBOX", desc: "Run live SQL queries.", icon: "🧪", color: "bg-[#f78c6b]", link: "/dbms/sql-sandbox" },
    { title: "AI CRITIC", desc: "Get Groq-powered hints.", icon: "🤖", color: "bg-[#8338ec]", link: "/ai-tutor" },
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
              <span className="inline-block w-2 h-2 bg-brand-green rounded-full mr-2 animate-pulse"></span>
              System Online
            </div>
            <h1 className="text-4xl md:text-5xl font-display uppercase leading-none break-words max-w-full">
              Welcome, <br/><span className="text-brand-green">{navalRank} {displayName}</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="border-2 border-brand-black bg-white p-4 shadow-brutal-sm text-left">
              <p className="font-mono text-xs font-bold text-brand-black/50 uppercase">User ID</p>
              <p className="font-mono text-sm font-bold truncate max-w-[150px]">{user.id}</p>
              <p className="font-mono text-xs font-bold text-brand-black/50 uppercase mt-2">Member Since</p>
              <p className="font-mono text-sm font-bold">{joinedDate}</p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {[
            { label: "Day Streak", val: "1", icon: "🔥", bg: "bg-[#ffd166]" },
            { label: "Problems", val: "0", icon: "✅", bg: "bg-[#06d6a0]" },
            { label: "DSA Topics", val: "0/24", icon: "🧮", bg: "bg-[#118ab2]" },
            { label: "Critiques", val: "0", icon: "🤖", bg: "bg-[#ef476f]" },
          ].map((stat, i) => (
            <div key={i} className={`border-2 border-brand-black ${stat.bg} p-4 md:p-5 shadow-brutal md:hover:-translate-y-1 transition-transform`}>
              <div className="text-2xl md:text-3xl mb-2 md:mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-display">{stat.val}</div>
              <div className="font-mono text-xs font-bold uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Modules Grid */}
        <div className="flex items-center justify-between mb-4 border-b-2 border-brand-black pb-2">
          <h2 className="text-2xl font-display uppercase">Active Modules</h2>
          <span className="font-mono text-xs font-bold bg-brand-black text-white px-2 py-1">v2.0</span>
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <Link href={m.link} key={i} className="group border-2 border-brand-black bg-white shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col overflow-hidden">
              <div className={`${m.color} p-4 border-b-2 border-brand-black flex justify-between items-center`}>
                <span className="text-2xl">{m.icon}</span>
                <span className="font-mono text-[10px] font-bold uppercase bg-white border-2 border-brand-black px-2 py-1">Module</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display uppercase mb-1 group-hover:text-brand-green transition-colors">{m.title}</h3>
                  <p className="font-mono text-xs font-bold text-brand-black/70 mb-4">{m.desc}</p>
                </div>
                <div className="font-display uppercase text-sm border-t-2 border-dashed border-brand-black/20 pt-3 flex items-center justify-between">
                  <span>Enter</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
