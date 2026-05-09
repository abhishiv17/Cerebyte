"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProblemList({ initialProblems, initialSearch = "" }: { initialProblems: any[], initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);

  const filteredProblems = initialProblems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.topic?.toLowerCase().includes(search.toLowerCase()) ||
    p.difficulty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b-2 border-brand-black pb-2 gap-4">
        <h2 className="text-2xl font-display uppercase">Problem List</h2>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-brand-black bg-white p-2 pl-8 font-mono text-xs shadow-brutal-sm focus:outline-none focus:shadow-none transition-shadow"
          />
          <span className="absolute left-2 top-2 text-brand-black/50">🔍</span>
        </div>
      </div>

      <div className="border-2 border-brand-black bg-white shadow-brutal overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-brand-black bg-brand-cream">
              <th className="p-3 font-mono font-bold uppercase text-xs w-16">Status</th>
              <th className="p-3 font-mono font-bold uppercase text-xs">Title</th>
              <th className="p-3 font-mono font-bold uppercase text-xs w-24">Difficulty</th>
              <th className="p-3 font-mono font-bold uppercase text-xs w-48">Topic</th>
              <th className="p-3 font-mono font-bold uppercase text-xs w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center font-mono text-sm text-brand-black/50">
                  No problems found matching "{search}"
                </td>
              </tr>
            ) : null}
            {filteredProblems.map((p) => (
              <tr key={p.id} className="border-b-[1px] border-brand-black/20 hover:bg-[#f4f4ec] transition-colors group">
                <td className="p-3 text-center">
                  {(p.status || "Unsolved") === "Solved" && <span className="text-brand-green font-bold text-lg">✓</span>}
                  {(p.status || "Unsolved") === "Attempted" && <span className="text-[#ffd166] font-bold text-lg">↻</span>}
                  {(p.status || "Unsolved") === "Unsolved" && <span className="text-brand-black/30 font-bold text-lg">○</span>}
                </td>
                <td className="p-3 font-display text-lg">{p.title}</td>
                <td className="p-3">
                  <span className={`font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-brand-black ${p.difficulty?.toLowerCase() === 'easy' ? 'bg-[#06d6a0]' : p.difficulty?.toLowerCase() === 'medium' ? 'bg-[#ffd166]' : 'bg-[#ef476f]'}`}>
                    {p.difficulty || "Medium"}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs">{p.topic || "General"}</td>
                <td className="p-3">
                  <Link href={`/ide?problem_id=${p.id}`} className="inline-block border-2 border-brand-black bg-white px-3 py-1.5 font-display uppercase text-xs shadow-brutal-sm group-hover:bg-brand-black group-hover:text-white transition-colors">
                    Solve
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
