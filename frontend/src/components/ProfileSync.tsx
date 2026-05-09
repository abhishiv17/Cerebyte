"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTutor } from "@/components/TutorProvider";

const INTEREST_OPTIONS = [
  "Arrays & Strings",
  "Linked Lists",
  "Trees & Graphs",
  "Dynamic Programming",
  "Sorting & Searching",
  "SQL & Databases",
  "System Design",
  "Competitive Programming",
];

export default function ProfileSync() {
  const { profileComplete, refreshStats } = useTutor();
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone_no: "",
    college: "Dr. Ambedkar Institute of Technology",
    year_of_study: 2,
    usn: "",
    interests: [] as string[],
  });

  useEffect(() => {
    // Show the sync modal if profile is incomplete (after a small delay)
    if (!profileComplete) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [profileComplete]);

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      let accessToken: string | undefined;

      // Try getSession first
      const {
        data: { session },
      } = await supabase.auth.getSession();
      accessToken = session?.access_token;

      // Fallback: manually parse the auth cookie
      if (!accessToken) {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [name, ...rest] = cookie.trim().split("=");
          if (name.startsWith("sb-") && name.endsWith("-auth-token")) {
            try {
              const decoded = decodeURIComponent(rest.join("="));
              const parsed = JSON.parse(decoded);
              accessToken = parsed.access_token;
            } catch {}
          }
        }
      }

      if (!accessToken) {
        console.error("ProfileSync: No access token found");
        return;
      }

      const res = await fetch("/api/proxy/sync-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSaved(true);
        await refreshStats();
        setTimeout(() => setShow(false), 1500);
      } else {
        const errData = await res.text();
        console.error("ProfileSync: Save failed", res.status, errData);
      }
    } catch (err) {
      console.error("ProfileSync: Error", err);
    } finally {
      setSaving(false);
    }
  };


  if (profileComplete) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-brand-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="brutal-box p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-brand-black/20 pb-3">
              <div>
                <h2 className="text-xl font-display uppercase">Complete Your Profile</h2>
                <p className="font-mono text-[10px] text-brand-black/50 uppercase font-bold mt-1">
                  The Admiral needs your service record
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                className="w-8 h-8 border-2 border-brand-black flex items-center justify-center text-sm font-bold hover:bg-brand-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {saved ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⚓</div>
                <p className="font-display uppercase text-lg text-brand-green">Profile Updated</p>
                <p className="font-mono text-xs text-brand-black/50 mt-1">Welcome aboard, sailor.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block font-mono text-xs font-bold text-brand-black/70 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone_no}
                    onChange={(e) => setForm((p) => ({ ...p, phone_no: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="brutal-input"
                  />
                </div>

                {/* College */}
                <div>
                  <label className="block font-mono text-xs font-bold text-brand-black/70 uppercase mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={form.college}
                    onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
                    className="brutal-input"
                  />
                </div>

                {/* Year & USN row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-brand-black/70 uppercase mb-1">
                      Year of Study
                    </label>
                    <select
                      value={form.year_of_study}
                      onChange={(e) => setForm((p) => ({ ...p, year_of_study: Number(e.target.value) }))}
                      className="brutal-input"
                    >
                      {[1, 2, 3, 4].map((y) => (
                        <option key={y} value={y}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold text-brand-black/70 uppercase mb-1">
                      USN
                    </label>
                    <input
                      type="text"
                      value={form.usn}
                      onChange={(e) => setForm((p) => ({ ...p, usn: e.target.value.toUpperCase() }))}
                      placeholder="1DA22CS001"
                      className="brutal-input"
                    />
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block font-mono text-xs font-bold text-brand-black/70 uppercase mb-2">
                    Areas of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`border-2 border-brand-black px-3 py-1 font-mono text-[10px] font-bold uppercase transition-all ${
                          form.interests.includes(interest)
                            ? "bg-brand-green text-white shadow-none"
                            : "bg-white shadow-brutal-sm hover:-translate-y-0.5"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={saving || !form.usn || !form.phone_no}
                  className="brutal-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? "Syncing..." : "Save Service Record →"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
