"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function ERBuilderPage() {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 z-10 relative h-full overflow-hidden">
        <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div>
            <Link href="/dbms" className="inline-block font-mono text-xs font-bold uppercase mb-2 hover:underline border-2 border-brand-black px-2 py-1 bg-white shadow-brutal-sm">
              ← Back to DBMS
            </Link>
            <h1 className="text-3xl md:text-4xl font-display uppercase leading-none break-words max-w-full">
              ER <span className="text-[#118ab2]">Builder</span>
            </h1>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="border-2 border-brand-black bg-white px-4 py-2 font-display uppercase text-sm shadow-brutal-sm hover:bg-brand-cream transition-colors flex-1 md:flex-none">
              + Entity
            </button>
            <button className="border-2 border-brand-black bg-[#118ab2] text-white px-4 py-2 font-display uppercase text-sm shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex-1 md:flex-none">
              Export SQL
            </button>
          </div>
        </header>

        {/* Builder Canvas Placeholder */}
        <section className="flex-1 border-2 border-brand-black bg-white shadow-brutal relative overflow-hidden flex items-center justify-center">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none z-0" 
            style={{ backgroundImage: 'linear-gradient(rgb(var(--color-black)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-black)) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
          
          <div className="z-10 text-center max-w-md p-6 bg-white border-2 border-brand-black shadow-brutal-sm">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-2xl font-display uppercase mb-2">Canvas Ready</h2>
            <p className="font-mono text-sm text-brand-black/70">
              The drag-and-drop React Flow canvas is currently initializing. Visual node rendering and edge connections will be available here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
