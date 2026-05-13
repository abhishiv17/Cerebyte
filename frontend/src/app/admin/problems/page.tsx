import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import AdminProblemsClient from "./AdminProblemsClient";

export default async function AdminProblemsPage() {
  const supabase = await createClient();

  // Manual bypass for @supabase/ssr broken cookie parser
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const authCookieStr = cookieStore.get("sb-gerxyogslxthvoqcfxvr-auth-token")?.value;
  let manualAccessToken: string | undefined = undefined;
  let manualRefreshToken: string | undefined = undefined;
  try {
    if (authCookieStr) {
      const decodedStr = decodeURIComponent(authCookieStr);
      const sessionData = JSON.parse(decodedStr);
      manualAccessToken = sessionData.access_token;
      manualRefreshToken = sessionData.refresh_token;
    }
  } catch (e) {}

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

  // Check admin status from backend
  let isAdmin = false;
  try {
    const res = await fetch("http://localhost:8000/api/v1/users/me", {
      headers: { Authorization: `Bearer ${manualAccessToken}` },
      cache: "no-store",
    });
    if (res.ok) {
      const profile = await res.json();
      isAdmin = profile.is_admin === true;
    }
  } catch {}

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch existing problems
  let problems: any[] = [];
  try {
    const res = await fetch("http://localhost:8000/api/v1/problems?limit=100", {
      cache: "no-store",
    });
    if (res.ok) {
      problems = await res.json();
    }
  } catch {}

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-block border-2 border-brand-black px-3 py-1 bg-[#ef476f] text-white font-mono-accent text-xs font-bold uppercase shadow-brutal-sm">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Admin Panel
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display uppercase leading-none">
            Problem <span className="text-brand-green">Manager</span>
          </h1>
          <p className="font-mono-accent text-sm text-brand-black/60 mt-2 uppercase font-bold">
            Create, manage, and delete DSA problems.
          </p>
        </header>

        <AdminProblemsClient
          initialProblems={problems}
          accessToken={manualAccessToken || ""}
        />
      </main>
    </div>
  );
}
