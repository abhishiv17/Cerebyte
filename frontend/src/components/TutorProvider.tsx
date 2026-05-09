"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface TutorContextType {
  tutorEnabled: boolean;
  toggleTutor: () => void;
  rank: string;
  xp: number;
  profileComplete: boolean;
  refreshStats: () => Promise<void>;
}

const TutorContext = createContext<TutorContextType>({
  tutorEnabled: true,
  toggleTutor: () => {},
  rank: "Ensign",
  xp: 0,
  profileComplete: false,
  refreshStats: async () => {},
});

export function useTutor() {
  return useContext(TutorContext);
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [rank, setRank] = useState("Ensign");
  const [xp, setXp] = useState(0);
  const [profileComplete, setProfileComplete] = useState(false);

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch("http://localhost:8000/api/v1/gamification/my-stats", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTutorEnabled(data.tutor_enabled ?? true);
        setRank(data.rank || "Ensign");
        setXp(data.xp || 0);
        setProfileComplete(data.profile_complete ?? false);
      }
    } catch {
      // Silently fail — stats are non-critical
    }
  };

  const toggleTutor = async () => {
    const newValue = !tutorEnabled;
    setTutorEnabled(newValue);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      await fetch("http://localhost:8000/api/v1/gamification/sync-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ tutor_enabled: newValue }),
      });
    } catch {
      setTutorEnabled(!newValue); // Revert on failure
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <TutorContext.Provider
      value={{
        tutorEnabled,
        toggleTutor,
        rank,
        xp,
        profileComplete,
        refreshStats: fetchStats,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
}
