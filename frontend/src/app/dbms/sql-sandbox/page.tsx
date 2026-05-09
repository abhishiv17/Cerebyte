"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/client";

export default function SQLSandboxPage() {
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("http://localhost:8000/api/v1/sql-sandbox/execute", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to execute query.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
              SQL <span className="text-[#f78c6b]">Sandbox</span>
            </h1>
          </div>
          <button 
            onClick={handleExecute}
            disabled={isLoading || !query.trim()}
            className="border-2 border-brand-black bg-[#f78c6b] text-white px-6 py-2 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex-1 md:flex-none"
          >
            {isLoading ? "Executing..." : "Run Query"}
          </button>
        </header>

        <section className="flex-1 flex flex-col gap-4 min-h-0">
          
          {/* Query Editor */}
          <div className="flex-[1] flex flex-col border-2 border-brand-black bg-white shadow-brutal min-h-0">
            <div className="bg-brand-black text-white p-2 flex justify-between items-center shrink-0">
              <span className="font-mono text-xs uppercase font-bold pl-2">query.sql</span>
            </div>
            <textarea
              className="flex-1 p-4 bg-[#111111] text-[#f4f4ec] font-mono text-sm focus:outline-none resize-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
              placeholder="Write your SQL query here..."
            />
          </div>

          {/* Results Table */}
          <div className="flex-[2] flex flex-col border-2 border-brand-black bg-white shadow-brutal min-h-0 overflow-hidden">
            <div className="bg-[#f78c6b] border-b-2 border-brand-black text-white p-2 flex justify-between items-center shrink-0">
              <span className="font-mono text-xs uppercase font-bold pl-2">Result Set</span>
              {result && <span className="font-mono text-[10px] border-2 border-brand-black bg-white text-brand-black px-2">{result.execution_time_ms}ms</span>}
            </div>
            
            <div className="flex-1 overflow-auto bg-[#f4f4ec]">
              {error && (
                <div className="p-4 text-red-600 font-mono text-sm whitespace-pre-wrap font-bold">
                  Error: {error}
                </div>
              )}
              
              {!error && !result && !isLoading && (
                <div className="p-4 text-brand-black/50 font-mono text-sm text-center mt-10">
                  Execute a query to see results.
                </div>
              )}

              {!error && result && result.columns && (
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="border-b-2 border-brand-black bg-brand-cream">
                      {result.columns.map((col: string) => (
                        <th key={col} className="p-2 font-mono font-bold uppercase text-xs border-r-2 border-brand-black last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row: any, i: number) => (
                      <tr key={i} className="border-b-[1px] border-brand-black/20 hover:bg-white transition-colors">
                        {result.columns.map((col: string) => (
                          <td key={`${i}-${col}`} className="p-2 font-mono text-xs border-r-2 border-brand-black/20 last:border-r-0">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {result.rows.length === 0 && (
                      <tr>
                        <td colSpan={result.columns.length} className="p-4 text-center font-mono text-sm text-brand-black/50">
                          Query returned 0 rows.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
