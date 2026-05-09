"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 border-2 border-brand-black bg-white opacity-50" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 border-2 border-brand-black bg-white flex items-center justify-center font-display text-base hover:-translate-y-1 hover:shadow-brutal-sm transition-all text-brand-black"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
