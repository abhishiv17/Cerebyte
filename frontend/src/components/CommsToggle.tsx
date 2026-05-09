"use client";

import { useTutor } from "@/components/TutorProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CommsToggle() {
  const { tutorEnabled, toggleTutor, rank, xp } = useTutor();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="border-2 border-brand-black bg-white shadow-brutal p-4 w-64 mb-2"
          >
            <div className="font-display uppercase text-sm mb-3 border-b-2 border-brand-black/20 pb-2">
              Admiral&apos;s Comms
            </div>

            {/* Rank & XP */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 border-2 border-brand-black bg-[#ffd166] flex items-center justify-center font-display text-lg shadow-brutal-sm">
                ★
              </div>
              <div>
                <div className="font-mono text-[10px] text-brand-black/50 uppercase font-bold">
                  {rank}
                </div>
                <div className="font-display text-lg">{xp} XP</div>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={toggleTutor}
              className={`w-full text-left border-2 border-brand-black p-3 transition-all duration-150 ${
                tutorEnabled
                  ? "bg-brand-green text-white shadow-none"
                  : "bg-white shadow-brutal-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase">
                  {tutorEnabled ? "Comms Active" : "Comms Muted"}
                </span>
                <div
                  className={`w-8 h-4 border-2 border-brand-black rounded-full relative transition-colors ${
                    tutorEnabled ? "bg-white" : "bg-brand-cream"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border border-brand-black absolute top-[1px] transition-all ${
                      tutorEnabled
                        ? "right-[1px] bg-brand-green"
                        : "left-[1px] bg-brand-black/30"
                    }`}
                  />
                </div>
              </div>
              <p className="font-mono text-[10px] mt-1 opacity-70">
                {tutorEnabled
                  ? "Admiral Hopper is standing by."
                  : "The Admiral's channel is silent."}
              </p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className={`w-14 h-14 border-2 border-brand-black flex items-center justify-center text-xl shadow-brutal transition-colors ${
          tutorEnabled
            ? "bg-brand-green text-white"
            : "bg-white text-brand-black"
        }`}
      >
        {tutorEnabled ? "📡" : "📴"}
      </motion.button>
    </div>
  );
}
