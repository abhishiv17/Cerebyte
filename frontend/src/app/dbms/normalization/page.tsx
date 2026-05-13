"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function NormalizationPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dbms-content/lessons")
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error("Failed to fetch lessons", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 z-10 relative h-full overflow-y-auto">
        <header className="mb-6">
          <Link href="/dbms" className="inline-block font-mono text-xs font-bold uppercase mb-2 hover:underline border-2 border-brand-black px-2 py-1 bg-white shadow-brutal-sm">
            ← Back to DBMS
          </Link>
          <h1 className="text-3xl md:text-4xl font-display uppercase leading-none break-words max-w-full mt-2">
            Normalization <span className="text-[#ef476f]">Lessons</span>
          </h1>
        </header>

        <section className="space-y-4">
          {isLoading ? (
            <div className="p-4 border-2 border-brand-black bg-white shadow-brutal animate-pulse font-mono text-sm">
              Loading lessons from backend...
            </div>
          ) : lessons.length === 0 ? (
            <div className="p-4 border-2 border-brand-black bg-white shadow-brutal font-mono text-sm">
              No lessons available. The database might be empty.
              <br/><br/>
              <span className="text-brand-black/50 block">Dummy fallback enabled below:</span>
              <div className="mt-4 border-2 border-brand-black p-4 bg-brand-cream hover:translate-x-[2px] transition-transform cursor-pointer">
                <h3 className="font-display text-xl uppercase">1st Normal Form (1NF)</h3>
                <p className="font-mono text-xs mt-1">Learn how to eliminate repeating groups and ensure atomicity.</p>
              </div>
            </div>
          ) : (
            lessons.map((lesson, idx) => (
              <div key={lesson.id || idx} className="p-5 border-2 border-brand-black bg-white shadow-brutal group hover:-translate-y-1 hover:shadow-brutal-hover transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl uppercase group-hover:text-[#ef476f] transition-colors">
                    {lesson.title}
                  </h3>
                  <span className="font-mono text-[10px] font-bold uppercase border-2 border-brand-black px-2 py-1 bg-brand-cream">
                    Lesson {lesson.order || idx + 1}
                  </span>
                </div>
                <p className="font-mono text-xs text-brand-black/70 mb-4 line-clamp-2">
                  {lesson.content}
                </p>
                <div className="font-display text-sm uppercase flex items-center justify-between border-t-2 border-brand-black/10 pt-3">
                  <span>Start Learning</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
