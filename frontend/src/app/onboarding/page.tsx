"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";

const STEPS = [
  {
    id: "welcome",
    title: "INCOMING TRANSMISSION",
    subtitle: "USS Cerebyte — Bridge Command",
    prompt:
      "Admiral Grace Hopper here. Before I assign you to a station, I need to assess your capabilities. Stand by for diagnostic, recruit.",
  },
  {
    id: "experience",
    title: "DIAGNOSTIC 01",
    subtitle: "What's your current rank in the field?",
    field: "experience_level",
    options: [
      { value: "beginner", label: "Ensign", desc: "New to programming — eager to learn the fundamentals." },
      { value: "intermediate", label: "Lieutenant", desc: "Comfortable with basics — ready for deeper systems." },
      { value: "advanced", label: "Commander", desc: "Battle-tested — seeking mastery and optimization." },
    ],
  },
  {
    id: "language",
    title: "DIAGNOSTIC 02",
    subtitle: "Which language do you wield best?",
    field: "primary_language",
    options: [
      { value: "python", label: "Python", desc: "The Swiss-army knife of the fleet." },
      { value: "javascript", label: "JavaScript", desc: "The engine behind every web vessel." },
      { value: "cpp", label: "C++", desc: "Raw power — for those who optimize at the metal." },
      { value: "java", label: "Java", desc: "Enterprise-grade, battle-proven reliability." },
    ],
  },
  {
    id: "goal",
    title: "DIAGNOSTIC 03",
    subtitle: "What are you training for?",
    field: "career_goal",
    options: [
      { value: "university", label: "University Exams", desc: "Academic coursework in CS fundamentals." },
      { value: "faang", label: "FAANG Interviews", desc: "Preparing for top-tier tech company interviews." },
      { value: "competitive", label: "Competitive", desc: "Speed, accuracy, and algorithmic mastery." },
      { value: "general", label: "General Mastery", desc: "Broad understanding of software engineering." },
    ],
  },
  {
    id: "focus",
    title: "DIAGNOSTIC 04",
    subtitle: "Which ship systems will you be maintaining?",
    field: "focus_areas",
    multi: true,
    options: [
      { value: "dsa", label: "DSA Engine Room", desc: "Data Structures & Algorithms" },
      { value: "dbms", label: "Database Deck", desc: "Database Management Systems" },
      { value: "sql", label: "Query Bridge", desc: "SQL & Query Optimization" },
      { value: "algorithms", label: "Navigation Systems", desc: "Advanced Algorithm Design" },
    ],
  },
  { id: "generating", title: "DEPLOYING", subtitle: "Admiral Hopper is preparing your briefing..." },
  { id: "result", title: "MISSION BRIEFING", subtitle: "Your personalized Quest Map" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    experience_level: "",
    primary_language: "",
    career_goal: "",
    focus_areas: ["dsa"],
    weekly_hours: 5,
  });
  const [questMap, setQuestMap] = useState("");
  const [navalRank, setNavalRank] = useState("");
  const [error, setError] = useState("");
  const [typedText, setTypedText] = useState("");
  const currentStep = STEPS[step];

  // Typewriter effect for welcome
  useEffect(() => {
    if (currentStep.id !== "welcome") return;
    const text = currentStep.prompt || "";
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [step, currentStep.id, currentStep.prompt]);

  const selectOption = (field: string, value: string, multi?: boolean) => {
    if (multi) {
      setAnswers((prev) => {
        const arr = prev[field] || [];
        return {
          ...prev,
          [field]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [field]: value }));
      setTimeout(() => setStep((s) => s + 1), 350);
    }
  };

  const submitOnboarding = async () => {
    setStep(STEPS.findIndex((s) => s.id === "generating"));
    setError("");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("You must be logged in. Please sign in first.");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch("http://localhost:8000/api/v1/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle non-JSON error responses
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        let errMsg = `Request failed with status ${res.status}`;
        if (data.detail) {
          if (typeof data.detail === "string") errMsg = data.detail;
          else if (Array.isArray(data.detail)) errMsg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
          else errMsg = JSON.stringify(data.detail);
        } else if (data.error) {
          errMsg = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
        }
        throw new Error(errMsg);
      }

      setQuestMap(data.quest_map_narrative);
      setNavalRank(data.naval_rank);
      setStep(STEPS.findIndex((s) => s.id === "result"));
    } catch (err: any) {
      const msg = err.name === "AbortError" 
        ? "Request timed out (30s). The AI may be overloaded — try again."
        : (typeof err.message === "string" ? err.message : JSON.stringify(err)) || "Something went wrong.";
      setError(msg);
      setStep(STEPS.findIndex((s) => s.id === "focus"));
    }
  };

  const canAdvance = () => {
    if (!currentStep.field) return true;
    const val = answers[currentStep.field];
    if (currentStep.multi) return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const progressPercent = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-black flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#111 2px, transparent 2px)", backgroundSize: "32px 32px" }}
      />

      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-1 bg-brand-black/10">
        <motion.div
          className="h-full bg-brand-green"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Header badge */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 text-center z-10">
        <div className="inline-block border-2 border-brand-black px-4 py-1 bg-white font-mono text-xs font-bold uppercase shadow-brutal-sm mb-3">
          <span className="inline-block w-2 h-2 bg-brand-green rounded-full mr-2 animate-pulse" />
          Onboarding Protocol Active
        </div>
        <h1 className="text-3xl md:text-4xl font-display uppercase leading-none">
          Admiral <span className="text-brand-green">Hopper</span>
        </h1>
        <p className="font-mono text-xs text-brand-black/50 uppercase mt-1 font-bold">
          Step {Math.min(step + 1, STEPS.length - 1)} of {STEPS.length - 1}
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-box p-6 md:p-8 w-full max-w-xl z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step title */}
            <div className="mb-6">
              <div className="font-mono text-[10px] text-brand-black/40 uppercase font-bold mb-1">
                $ diagnostic --{currentStep.id}
              </div>
              <h2 className="text-xl md:text-2xl font-display uppercase">{currentStep.title}</h2>
              <p className="font-mono text-xs text-brand-black/60 font-bold mt-1">{currentStep.subtitle}</p>
            </div>

            {/* WELCOME */}
            {currentStep.id === "welcome" && (
              <div className="space-y-6">
                <div className="border-2 border-brand-black bg-[#111] p-5 shadow-brutal-sm">
                  <p className="font-mono text-sm text-[#4ade80] leading-relaxed">
                    <span className="text-[#fbbf24] font-bold">ADM.HOPPER ~$</span>{" "}
                    {typedText}
                    <span className="animate-pulse text-[#4ade80]">█</span>
                  </p>
                </div>
                <button onClick={() => setStep(1)} className="brutal-button w-full">
                  Begin Diagnostic →
                </button>
              </div>
            )}

            {/* OPTION STEPS */}
            {currentStep.options && (
              <div className="space-y-3">
                {currentStep.options.map((opt) => {
                  const isSelected = currentStep.multi
                    ? (answers[currentStep.field!] || []).includes(opt.value)
                    : answers[currentStep.field!] === opt.value;

                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectOption(currentStep.field!, opt.value, currentStep.multi)}
                      className={`w-full text-left border-2 border-brand-black p-4 transition-all duration-150 ${
                        isSelected
                          ? "bg-brand-green text-white shadow-none translate-x-[2px] translate-y-[2px]"
                          : "bg-white shadow-brutal-sm hover:shadow-brutal"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 border-2 border-brand-black flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-white text-brand-green" : "bg-brand-cream"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <div>
                          <div className="font-display uppercase text-base">{opt.label}</div>
                          <div className={`font-mono text-[10px] font-bold mt-0.5 ${isSelected ? "text-white/70" : "text-brand-black/50"}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {currentStep.multi && (
                  <button
                    onClick={submitOnboarding}
                    disabled={!canAdvance()}
                    className="brutal-button w-full mt-4 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Deploy Quest Map →
                  </button>
                )}
              </div>
            )}

            {/* GENERATING */}
            {currentStep.id === "generating" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-brand-black/20 border-t-brand-green rounded-full"
                />
                <div className="text-center">
                  <p className="font-mono text-sm font-bold text-brand-black/70">Generating Quest Map...</p>
                  <motion.p
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-mono text-xs text-brand-black/40 mt-1"
                  >
                    Admiral Hopper is analyzing your profile via Groq LPU
                  </motion.p>
                </div>
              </div>
            )}

            {/* RESULT */}
            {currentStep.id === "result" && questMap && (
              <div className="space-y-5">
                {/* Rank badge */}
                <div className="flex items-center gap-4 pb-4 border-b-2 border-brand-black">
                  <div className="w-14 h-14 border-2 border-brand-black bg-[#ffd166] flex items-center justify-center font-display text-2xl shadow-brutal-sm">
                    ★
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-brand-black/50 uppercase font-bold">Your Rank</div>
                    <div className="text-2xl font-display uppercase text-brand-green">{navalRank}</div>
                  </div>
                </div>

                {/* Quest map narrative */}
                <div className="border-2 border-brand-black bg-[#111] p-5 shadow-brutal-sm prose prose-sm max-w-none [&_strong]:text-[#fbbf24] [&_li]:text-[#4ade80]/90 [&_p]:text-[#4ade80]/90 [&_h1]:text-[#4ade80] [&_h2]:text-[#4ade80] [&_h3]:text-[#4ade80] [&_ul]:list-disc [&_ul]:pl-4 text-sm leading-relaxed font-mono">
                  <ReactMarkdown>{questMap}</ReactMarkdown>
                </div>

                <button onClick={() => router.push("/dashboard")} className="brutal-button w-full">
                  Report to Bridge →
                </button>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mt-4 border-2 border-brand-black bg-[#ffcccb] p-3 font-mono text-xs font-bold shadow-brutal-sm">
                ERROR: {error}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <p className="mt-6 font-mono text-[10px] text-brand-black/20 uppercase tracking-widest z-10">
        Cerebyte Onboarding Protocol v1.0 — Powered by Groq LPU
      </p>
    </div>
  );
}
