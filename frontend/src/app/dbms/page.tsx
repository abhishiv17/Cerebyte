"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DBMSPage() {
  const [search, setSearch] = useState("");
  const subModules = [
    {
      title: "SQL Sandbox",
      desc: "Run live SQL queries against a mock database. Practice joins, aggregations, and subqueries.",
      icon: "🧪",
      color: "bg-[#f78c6b]",
      action: "Open Sandbox",
      link: "/dbms/sql-sandbox",
    },
    {
      title: "ER Builder",
      desc: "Visual drag-and-drop designer. Draw entities, define relationships, and export to SQL.",
      icon: "🔗",
      color: "bg-[#118ab2]",
      action: "Launch Builder",
      link: "/dbms/er-builder",
    },
    {
      title: "Normalization",
      desc: "Interactive lessons on 1NF, 2NF, 3NF, and BCNF.",
      icon: "🗄️",
      color: "bg-[#ef476f]",
      action: "Start Lesson",
      link: "/dbms/normalization",
    },
  ];

  const filteredModules = subModules.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full flex flex-col">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div>
            <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
              <span className="inline-block w-2 h-2 bg-[#ef476f] rounded-full mr-2"></span>
              Database Systems
            </div>
            <h1 className="text-4xl md:text-5xl font-display uppercase leading-none break-words max-w-full">
              DBMS <span className="text-brand-green">Module</span>
            </h1>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search tools & lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-brand-black bg-white p-3 pl-10 font-mono text-sm shadow-brutal-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-shadow"
            />
            <span className="absolute left-3 top-3 text-brand-black/50 text-lg">🔍</span>
          </div>
        </header>

        <section className="grid lg:grid-cols-3 gap-6 flex-1 content-start">
          {filteredModules.length === 0 ? (
            <div className="col-span-full p-8 border-2 border-brand-black bg-white shadow-brutal text-center font-mono text-sm text-brand-black/60">
              No modules found matching "{search}".
            </div>
          ) : null}
          {filteredModules.map((m) => (
            <Link href={m.link} key={m.title} className="group border-2 border-brand-black bg-white shadow-brutal hover:-translate-y-1 hover:shadow-brutal-hover transition-all flex flex-col overflow-hidden">
              <div className={`${m.color} p-5 border-b-2 border-brand-black flex justify-between items-start h-24`}>
                <span className="text-3xl bg-white border-2 border-brand-black w-12 h-12 flex items-center justify-center shadow-brutal-sm transform -rotate-3">{m.icon}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-2xl font-display uppercase mb-3">{m.title}</h3>
                <p className="font-mono text-xs font-bold text-brand-black/70 mb-6 flex-1">{m.desc}</p>
                <button className="w-full border-2 border-brand-black bg-brand-cream py-2 font-display uppercase text-lg group-hover:bg-brand-black group-hover:text-white transition-colors">
                  {m.action}
                </button>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
