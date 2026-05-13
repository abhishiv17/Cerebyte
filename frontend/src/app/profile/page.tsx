"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

// ── Rank Progression ──
const RANK_THRESHOLDS = [
  { min: 0, rank: "Ensign", icon: "⚓", color: "bg-[#94a3b8]" },
  { min: 501, rank: "Lieutenant", icon: "🎖️", color: "bg-[#fbbf24]" },
  { min: 1501, rank: "Commander", icon: "🏅", color: "bg-[#f97316]" },
  { min: 3001, rank: "Admiral of the Fleet", icon: "⭐", color: "bg-[#ef4444]" },
];

// ── Achievements ──
const ACHIEVEMENTS = [
  { id: "first_login", title: "First Contact", desc: "Complete onboarding", icon: "🚀", xpReq: 0 },
  { id: "first_problem", title: "First Blood", desc: "Solve your first DSA problem", icon: "🎯", xpReq: 50 },
  { id: "five_problems", title: "Sharpshooter", desc: "Solve 5 DSA problems", icon: "🔫", xpReq: 250 },
  { id: "first_critique", title: "Code Review Rookie", desc: "Get your first AI critique", icon: "🤖", xpReq: 100 },
  { id: "sql_explorer", title: "Query Navigator", desc: "Run 5 SQL sandbox queries", icon: "🧪", xpReq: 125 },
  { id: "rank_lieutenant", title: "Promoted: Lieutenant", desc: "Reach 501 XP", icon: "🎖️", xpReq: 501 },
  { id: "rank_commander", title: "Promoted: Commander", desc: "Reach 1501 XP", icon: "🏅", xpReq: 1501 },
  { id: "profile_complete", title: "Identity Verified", desc: "Complete your profile", icon: "📋", xpReq: 0 },
  { id: "ten_problems", title: "Veteran", desc: "Solve 10 DSA problems", icon: "⚔️", xpReq: 500 },
  { id: "lesson_streak", title: "Scholar", desc: "Complete 5 lessons", icon: "📚", xpReq: 150 },
  { id: "dbms_intro", title: "Database Cadet", desc: "Complete first DBMS lesson", icon: "🗄️", xpReq: 30 },
  { id: "rank_admiral", title: "Admiral of the Fleet", desc: "Reach 3001 XP", icon: "⭐", xpReq: 3001 },
];

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone_no: string;
  college: string;
  year_of_study: number | null;
  usn: string;
  interests: string[];
  xp: number;
  rank: string;
  tutor_enabled: boolean;
  profile_complete: boolean;
  avatar_url?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [token, setToken] = useState<string>("");

  // Editable form state
  const [form, setForm] = useState({
    full_name: "",
    phone_no: "",
    college: "",
    year_of_study: "" as string | number,
    usn: "",
    interests: [] as string[],
    tutor_enabled: true,
  });

  const [newInterest, setNewInterest] = useState("");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/gamification/my-stats", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setForm({
        full_name: data.full_name || "",
        phone_no: data.phone_no || "",
        college: data.college || "",
        year_of_study: data.year_of_study || "",
        usn: data.usn || "",
        interests: data.interests || [],
        tutor_enabled: data.tutor_enabled ?? true,
      });
    } catch {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push("/login");
        return;
      }
      setToken(session.access_token);
      fetchProfile(session.access_token);
    }
    init();
  }, [router, fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        full_name: form.full_name,
        phone_no: form.phone_no,
        college: form.college,
        year_of_study: form.year_of_study ? Number(form.year_of_study) : null,
        usn: form.usn,
        interests: form.interests,
        tutor_enabled: form.tutor_enabled,
      };

      const res = await fetch("http://localhost:8000/api/v1/gamification/sync-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      showToast("Profile updated successfully!", "success");
      setEditing(false);
      fetchProfile(token);
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    const val = newInterest.trim();
    if (val && !form.interests.includes(val)) {
      setForm((p) => ({ ...p, interests: [...p.interests, val] }));
      setNewInterest("");
    }
  };

  const removeInterest = (val: string) => {
    setForm((p) => ({ ...p, interests: p.interests.filter((i) => i !== val) }));
  };

  // XP progress calculations
  const currentXP = profile?.xp || 0;
  const currentRankInfo = [...RANK_THRESHOLDS].reverse().find((r) => currentXP >= r.min) || RANK_THRESHOLDS[0];
  const nextRankInfo = RANK_THRESHOLDS.find((r) => r.min > currentXP);
  const xpProgress = nextRankInfo
    ? ((currentXP - currentRankInfo.min) / (nextRankInfo.min - currentRankInfo.min)) * 100
    : 100;

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => {
    if (a.id === "profile_complete") return profile?.profile_complete;
    return currentXP >= a.xpReq;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-black/20 border-t-brand-green rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: "radial-gradient(#111 2px, transparent 2px)", backgroundSize: "32px 32px" }}
      />

      <Sidebar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className={`fixed top-4 right-4 z-50 border-2 border-brand-black px-5 py-3 font-mono text-sm font-bold shadow-brutal-sm ${
              toast.type === "success" ? "bg-[#06d6a0] text-white" : "bg-[#ffcccb] text-brand-black"
            }`}
          >
            {toast.type === "success" ? "✓" : "✗"} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
            <span className="inline-block w-2 h-2 bg-brand-green rounded-full mr-2 animate-pulse" />
            Crew Manifest
          </div>
          <h1 className="text-4xl md:text-5xl font-display uppercase leading-none break-words max-w-full">
            Your <br />
            <span className="text-brand-green">Profile</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── LEFT: Profile Details + Edit ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <section className="border-2 border-brand-black bg-white shadow-brutal p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 border-b-2 border-brand-black pb-2">
                <h2 className="text-2xl font-display uppercase">Account Details</h2>
                <button
                  onClick={() => { if (editing) handleSave(); else setEditing(true); }}
                  disabled={saving}
                  className={`border-2 border-brand-black px-4 py-2 font-display uppercase text-sm shadow-brutal-sm transition-all hover:-translate-y-0.5 ${
                    editing ? "bg-[#06d6a0] text-white" : "bg-[#ffd166]"
                  } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {saving ? "Saving..." : editing ? "Save ✓" : "Edit ✎"}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 border-2 border-brand-black bg-brand-green flex items-center justify-center shadow-brutal shrink-0">
                  <span className="text-4xl font-display text-white">
                    {(form.full_name || profile?.email || "?")[0].toUpperCase()}
                  </span>
                </div>

                {/* Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">Full Name</label>
                    {editing ? (
                      <input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className="brutal-input text-sm" placeholder="Your name" />
                    ) : (
                      <div className="text-lg font-bold">{form.full_name || "—"}</div>
                    )}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">Email</label>
                    <div className="text-sm font-mono font-bold bg-brand-cream border-2 border-brand-black p-2 shadow-brutal-sm truncate">{profile?.email}</div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">Phone Number</label>
                    {editing ? (
                      <input value={form.phone_no} onChange={(e) => setForm((p) => ({ ...p, phone_no: e.target.value }))} className="brutal-input text-sm" placeholder="+91 ..." />
                    ) : (
                      <div className="text-base font-bold">{form.phone_no || "—"}</div>
                    )}
                  </div>

                  {/* College */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">College</label>
                    {editing ? (
                      <input value={form.college} onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))} className="brutal-input text-sm" placeholder="Your college" />
                    ) : (
                      <div className="text-base font-bold">{form.college || "—"}</div>
                    )}
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">Year of Study</label>
                    {editing ? (
                      <select value={form.year_of_study} onChange={(e) => setForm((p) => ({ ...p, year_of_study: e.target.value }))} className="brutal-input text-sm">
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    ) : (
                      <div className="text-base font-bold">{form.year_of_study ? `${form.year_of_study}${["st","nd","rd","th"][Math.min(Number(form.year_of_study)-1,3)]} Year` : "—"}</div>
                    )}
                  </div>

                  {/* USN */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-1">USN</label>
                    {editing ? (
                      <input value={form.usn} onChange={(e) => setForm((p) => ({ ...p, usn: e.target.value }))} className="brutal-input text-sm" placeholder="1DA22CS001" />
                    ) : (
                      <div className="text-base font-mono font-bold">{form.usn || "—"}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="mt-5 pt-4 border-t-2 border-dashed border-brand-black/20">
                <label className="font-mono text-[10px] font-bold text-brand-black/50 uppercase block mb-2">Interests / Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.interests.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 border-2 border-brand-black bg-[#ffd166] px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm">
                      {tag}
                      {editing && (
                        <button onClick={() => removeInterest(tag)} className="ml-1 text-brand-black/60 hover:text-red-500 font-bold">×</button>
                      )}
                    </span>
                  ))}
                  {form.interests.length === 0 && <span className="font-mono text-xs text-brand-black/40">No interests added yet</span>}
                </div>
                {editing && (
                  <div className="flex gap-2">
                    <input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                      className="brutal-input text-sm flex-1"
                      placeholder="Add interest (e.g. React, ML, DSA)"
                    />
                    <button onClick={addInterest} className="border-2 border-brand-black bg-brand-green text-white px-4 font-display uppercase text-sm shadow-brutal-sm hover:-translate-y-0.5 transition-all">+</button>
                  </div>
                )}
              </div>

              {/* AI Tutor Toggle */}
              <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-black/20 flex items-center justify-between">
                <div>
                  <div className="font-display uppercase text-base">AI Tutor</div>
                  <div className="font-mono text-[10px] text-brand-black/50 font-bold">Enable Admiral Hopper AI assistance</div>
                </div>
                <button
                  onClick={() => editing && setForm((p) => ({ ...p, tutor_enabled: !p.tutor_enabled }))}
                  className={`w-14 h-8 border-2 border-brand-black relative transition-colors shadow-brutal-sm ${
                    form.tutor_enabled ? "bg-brand-green" : "bg-brand-cream"
                  } ${!editing ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <motion.div
                    animate={{ x: form.tutor_enabled ? 22 : 2 }}
                    className="absolute top-[2px] w-6 h-6 border-2 border-brand-black bg-white shadow-brutal-sm"
                  />
                </button>
              </div>

              {/* Cancel button when editing */}
              {editing && (
                <button onClick={() => { setEditing(false); if (profile) fetchProfile(token); }} className="mt-4 w-full border-2 border-brand-black bg-white p-2 font-display uppercase text-sm shadow-brutal-sm hover:-translate-y-0.5 transition-all">
                  Cancel
                </button>
              )}
            </section>

            {/* ── Achievements Grid ── */}
            <section className="border-2 border-brand-black bg-white shadow-brutal p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 border-b-2 border-brand-black pb-2">
                <h2 className="text-2xl font-display uppercase">Achievements</h2>
                <span className="font-mono text-xs font-bold bg-brand-black text-white px-2 py-1">
                  {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const unlocked = unlockedAchievements.some((a) => a.id === ach.id);
                  return (
                    <motion.div
                      key={ach.id}
                      whileHover={unlocked ? { y: -3 } : {}}
                      className={`border-2 border-brand-black p-3 text-center transition-all ${
                        unlocked
                          ? "bg-[#ffd166] shadow-brutal-sm"
                          : "bg-brand-cream/50 opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-2xl mb-1">{ach.icon}</div>
                      <div className="font-display uppercase text-xs leading-tight">{ach.title}</div>
                      <div className="font-mono text-[9px] text-brand-black/60 font-bold mt-1">{ach.desc}</div>
                      {unlocked && (
                        <div className="mt-2 inline-block bg-brand-green text-white font-mono text-[8px] font-bold px-2 py-0.5 border border-brand-black">
                          UNLOCKED
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── RIGHT: XP & Rank ── */}
          <div className="space-y-6">
            {/* Rank Card */}
            <section className="border-2 border-brand-black bg-[#111] text-white shadow-brutal p-5 md:p-6">
              <h2 className="text-xl font-display uppercase mb-4 text-[#4ade80]">Naval Rank</h2>
              <div className="text-center py-4">
                <div className="text-5xl mb-3">{currentRankInfo.icon}</div>
                <div className="text-3xl font-display uppercase text-[#ffd166]">{profile?.rank || "Ensign"}</div>
              </div>

              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex justify-between font-mono text-xs font-bold text-white/60 mb-1">
                  <span>{currentXP} XP</span>
                  <span>{nextRankInfo ? `${nextRankInfo.min} XP` : "MAX"}</span>
                </div>
                <div className="h-4 border-2 border-white/30 bg-white/10 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#4ade80]"
                  />
                </div>
                {nextRankInfo && (
                  <div className="font-mono text-[10px] text-white/40 mt-1 text-center">
                    {nextRankInfo.min - currentXP} XP to {nextRankInfo.rank}
                  </div>
                )}
              </div>

              {/* Rank Ladder */}
              <div className="mt-5 space-y-2">
                {RANK_THRESHOLDS.map((r) => (
                  <div
                    key={r.rank}
                    className={`flex items-center gap-2 p-2 border border-white/10 font-mono text-xs ${
                      currentXP >= r.min ? "text-[#4ade80] bg-white/5" : "text-white/30"
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span className="font-bold uppercase flex-1">{r.rank}</span>
                    <span>{r.min}+ XP</span>
                    {currentXP >= r.min && <span className="text-[#ffd166]">✓</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Summary */}
            <section className="border-2 border-brand-black bg-brand-green text-white shadow-brutal p-5 md:p-6">
              <h2 className="text-xl font-display uppercase mb-4">Quick Stats</h2>
              <div className="space-y-3">
                {[
                  { label: "Total XP", val: currentXP.toLocaleString(), icon: "⚡" },
                  { label: "Achievements", val: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, icon: "🏆" },
                  { label: "Profile Status", val: profile?.profile_complete ? "Complete" : "Incomplete", icon: profile?.profile_complete ? "✅" : "⚠️" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/20 p-3">
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] font-bold uppercase text-white/60">{s.label}</div>
                      <div className="font-display text-lg uppercase">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* User ID Card */}
            <section className="border-2 border-brand-black bg-white shadow-brutal p-5">
              <h2 className="text-lg font-display uppercase mb-3 border-b-2 border-brand-black pb-2">ID Card</h2>
              <div className="space-y-2">
                <div>
                  <div className="font-mono text-[10px] font-bold text-brand-black/50 uppercase">User ID</div>
                  <div className="font-mono text-xs truncate">{profile?.id}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold text-brand-black/50 uppercase">Email</div>
                  <div className="font-mono text-xs truncate">{profile?.email}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
