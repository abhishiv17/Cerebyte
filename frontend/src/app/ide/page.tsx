"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";

export default function IDEPage() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problem_id");

  const [code, setCode] = useState('def solution():\n    # Write your code here\n    pass\n');
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [activePane, setActivePane] = useState<"terminal" | "graph">("terminal");
  const [isRunning, setIsRunning] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [aiResponse, setAiResponse] = useState<{type: "hint" | "solution", content: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!aiResponse) return;
    // Extract all code blocks from the markdown response
    const codeBlocks = aiResponse.content.match(/```[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
      const code = codeBlocks.map(b => b.replace(/```\w*\n?/g, '').replace(/```$/g, '').trim()).join('\n\n');
      navigator.clipboard.writeText(code);
    } else {
      // Fallback: copy entire response
      navigator.clipboard.writeText(aiResponse.content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiRequest = async (type: "hint" | "solution") => {
    setIsAiLoading(true);
    setAiResponse(null);
    
    const query = type === "hint" 
      ? "Give me a subtle conceptual hint to solve this problem. Do not give the full code solution." 
      : "Provide the direct, optimal code solution for this problem along with a brief explanation.";
      
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("http://localhost:8000/api/v1/ai-tutor/feedback", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          problem_id: problemId || "general",
          user_code: code,
          language: language,
          user_query: query
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(`[${res.status}] ${data.detail || data.error || 'Failed to execute'}`);
      }
      
      setAiResponse({ type, content: data.feedback || "No response received." });
    } catch (err: any) {
      setAiResponse({ type, content: `Error reaching AI Critic: ${err.message}` });
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      if (problemId.startsWith("mock-")) {
        // Handle mock problems locally
        setProblem({
          id: problemId,
          title: problemId === "mock-17" ? "Merge K Sorted Lists" : `Problem ${problemId}`,
          difficulty: problemId === "mock-17" ? "Hard" : "Medium",
          topic: problemId === "mock-17" ? "Linked List" : "General",
          description: "This is a local mock problem because the database is currently starting up or the problem was generated locally. <br/><br/>Please solve the problem as described in the title.",
          test_cases: [
            { input: "Example Input", expected_output: "Example Output" }
          ]
        });
        return;
      }

      setIsLoadingProblem(true);
      fetch(`http://localhost:8000/api/v1/problems/${problemId}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then(data => setProblem(data))
        .catch(err => console.error("Failed to load problem", err))
        .finally(() => setIsLoadingProblem(false));
    }
  }, [problemId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...\n");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("http://localhost:8000/api/v1/execution/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          language: language,
          code: code,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Execution failed");
      }
      
      let out = "";
      if (data.compile_output) out += `[Compiler]:\n${data.compile_output}\n\n`;
      out += `[Output]:\n${data.stdout || '(no output)'}\n`;
      if (data.stderr) out += `\n[Error]:\n${data.stderr}\n`;
      out += `\n——————————————————————————\nExit Code: ${data.exit_code}  |  Time: ${data.time}s  |  Memory: ${data.memory}KB`;

      setOutput(out);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 flex flex-col p-4 md:p-4 lg:p-6 z-10 relative h-full overflow-hidden">
        <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
          <div>
            <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-2 shadow-brutal-sm">
              <span className="inline-block w-2 h-2 bg-[#06d6a0] rounded-full mr-2"></span>
              Live Execution Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-display uppercase leading-none break-words max-w-full">
              IDE <span className="text-brand-green">Workspace</span>
            </h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="border-2 border-brand-black bg-white p-2 font-mono text-sm shadow-brutal-sm focus:outline-none flex-1 md:flex-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node)</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button 
              onClick={handleRunCode}
              disabled={isRunning}
              className="border-2 border-brand-black bg-brand-green text-white px-6 py-2 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex-1 md:flex-none"
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </header>

        {/* Editor & Output Split */}
        <section className={`flex-1 flex flex-col ${problemId ? 'lg:flex-row' : 'lg:flex-row'} gap-4 min-h-0`}>
          
          {/* Problem Pane (Conditional) */}
          {problemId && (
            <div className="w-full lg:w-1/3 flex flex-col border-2 border-brand-black bg-white shadow-brutal min-h-0">
              <div className="bg-[#ffd166] border-b-2 border-brand-black text-brand-black p-2 flex justify-between items-center shrink-0">
                <span className="font-mono text-xs uppercase font-bold pl-2">Problem Description</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-sans text-sm">
                {isLoadingProblem ? (
                  <div className="animate-pulse">Loading problem details...</div>
                ) : problem ? (
                  <>
                    <h2 className="text-2xl font-display mb-2">{problem.title}</h2>
                    <div className="flex gap-2 mb-4">
                      <span className="font-mono text-[10px] font-bold uppercase bg-[#06d6a0] border-2 border-brand-black px-2 py-1">{problem.difficulty}</span>
                      <span className="font-mono text-[10px] font-bold uppercase bg-brand-cream border-2 border-brand-black px-2 py-1">{problem.topic}</span>
                    </div>
                    <div className="prose prose-sm max-w-none prose-headings:font-display" dangerouslySetInnerHTML={{ __html: problem.description }}></div>
                    
                    {problem.test_cases && problem.test_cases.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-display uppercase text-lg border-b-2 border-brand-black mb-2">Test Cases</h3>
                        {problem.test_cases.map((tc: any, i: number) => (
                          <div key={i} className="mb-4 bg-brand-cream border-2 border-brand-black p-2 font-mono text-xs">
                            <div><strong>Input:</strong> {tc.input}</div>
                            <div><strong>Output:</strong> {tc.expected_output}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Tools Section */}
                    <div className="mt-8 pt-4 border-t-2 border-brand-black/20">
                      <div className="flex gap-2 mb-4">
                        <button 
                          onClick={() => handleAiRequest("hint")}
                          disabled={isAiLoading}
                          className="flex-1 border-2 border-brand-black bg-[#8338ec] text-white py-2 font-display uppercase text-sm shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                        >
                          💡 Get Hint
                        </button>
                        <button 
                          onClick={() => handleAiRequest("solution")}
                          disabled={isAiLoading}
                          className="flex-1 border-2 border-brand-black bg-brand-black text-white py-2 font-display uppercase text-sm shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 relative group"
                        >
                          🔑 Solution
                          {/* Note: This is an internal testing tooltip */}
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-brand-black border-2 border-brand-black p-1 text-[10px] w-max hidden group-hover:block pointer-events-none">
                            Testing Phase: Localhost bypass active
                          </span>
                        </button>
                      </div>
                      
                      {isAiLoading && (
                        <div className="p-4 border-2 border-brand-black bg-brand-cream text-center font-mono text-xs animate-pulse">
                          🤖 Generating response from Groq...
                        </div>
                      )}
                      
                      {aiResponse && !isAiLoading && (
                        <div className="p-4 border-2 border-brand-black bg-brand-cream">
                          <div className="font-display uppercase text-lg mb-2 flex justify-between items-center border-b-2 border-brand-black/20 pb-1">
                            <span>{aiResponse.type === "hint" ? "AI Hint" : "Direct Solution"}</span>
                            <div className="flex gap-2 items-center">
                              {aiResponse.type === "solution" && (
                                <button 
                                  onClick={handleCopyCode}
                                  className={`font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-brand-black transition-all ${
                                    copied 
                                      ? 'bg-brand-green text-white' 
                                      : 'bg-white hover:bg-brand-black hover:text-white'
                                  }`}
                                >
                                  {copied ? 'Copied!' : 'Copy Code'}
                                </button>
                              )}
                              <button onClick={() => setAiResponse(null)} className="text-sm">✕</button>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none text-brand-black [&_pre]:bg-[#1a1a1a] [&_pre]:text-[#4ade80] [&_pre]:p-3 [&_pre]:border-2 [&_pre]:border-brand-black [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:bg-[#e8e8d8] [&_code]:px-1 [&_code]:py-0.5 [&_code]:border [&_code]:border-brand-black/30 [&_code]:font-mono [&_code]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_h1]:uppercase [&_h2]:uppercase [&_h3]:uppercase [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:text-xs [&_li]:font-mono [&_p]:text-xs [&_p]:font-mono [&_strong]:text-brand-green">
                            <ReactMarkdown>{aiResponse.content}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div>Failed to load problem. It may not exist.</div>
                )}
              </div>
            </div>
          )}

          {/* Code & Terminal Container */}
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* Editor Pane */}
            <div className="flex-[2] flex flex-col border-2 border-brand-black bg-white shadow-brutal min-h-0">
              <div className="bg-brand-black text-white p-2 flex justify-between items-center shrink-0">
                <span className="font-mono text-xs uppercase font-bold pl-2">editor.code</span>
                <span className="w-3 h-3 rounded-full bg-brand-green mr-2"></span>
              </div>
              <textarea
                className="flex-1 p-4 bg-brand-black text-brand-cream font-mono text-sm focus:outline-none resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="Write your code here..."
              />
            </div>

            {/* Bottom Pane (Terminal / Graph Tabs) */}
            <div className="flex-1 flex flex-col border-2 border-brand-black bg-brand-cream shadow-brutal min-h-0">
              <div className="bg-brand-black text-white flex shrink-0">
                <button 
                  onClick={() => setActivePane("terminal")}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold border-r-2 border-brand-black transition-colors ${activePane === "terminal" ? "bg-brand-cream text-brand-black" : "hover:bg-brand-black/80"}`}
                >
                  terminal.out
                </button>
                <button 
                  onClick={() => setActivePane("graph")}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold border-r-2 border-brand-black transition-colors ${activePane === "graph" ? "bg-brand-cream text-brand-black" : "hover:bg-brand-black/80"}`}
                >
                  graph.viz
                </button>
                <div className="flex-1 flex justify-end items-center pr-2">
                  <span className="w-3 h-3 rounded-full bg-brand-black border border-white mr-2"></span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto relative">
                {activePane === "terminal" ? (
                  <div className="h-full p-4 bg-[#1a1a1a] text-[#4ade80] font-mono text-sm whitespace-pre-wrap">
                    {output || "> Waiting for execution..."}
                  </div>
                ) : (
                  <div className="h-full p-4 flex flex-col items-center justify-center bg-brand-cream overflow-auto relative">
                    <div className="absolute top-4 left-4 font-mono text-[10px] font-bold uppercase bg-white border-2 border-brand-black px-2 py-1 shadow-brutal-sm">
                      Data Structure Visualizer
                    </div>
                    {/* Mock Neo-Brutalist Graph/Tree SVG */}
                    <svg width="400" height="200" viewBox="0 0 400 200" className="mt-8">
                      {/* Edges */}
                      <line x1="200" y1="30" x2="100" y2="100" stroke="#111" strokeWidth="4" />
                      <line x1="200" y1="30" x2="300" y2="100" stroke="#111" strokeWidth="4" />
                      <line x1="100" y1="100" x2="50" y2="170" stroke="#111" strokeWidth="4" />
                      <line x1="100" y1="100" x2="150" y2="170" stroke="#111" strokeWidth="4" />
                      <line x1="300" y1="100" x2="350" y2="170" stroke="#111" strokeWidth="4" />
                      
                      {/* Nodes */}
                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(200, 30)">
                        <circle cx="0" cy="0" r="25" fill="#06d6a0" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">10</text>
                      </g>
                      
                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(100, 100)">
                        <circle cx="0" cy="0" r="25" fill="#ffd166" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">5</text>
                      </g>
                      
                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(300, 100)">
                        <circle cx="0" cy="0" r="25" fill="#ef476f" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">15</text>
                      </g>

                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(50, 170)">
                        <circle cx="0" cy="0" r="25" fill="#fff" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">2</text>
                      </g>

                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(150, 170)">
                        <circle cx="0" cy="0" r="25" fill="#fff" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">7</text>
                      </g>
                      
                      <g className="cursor-pointer hover:-translate-y-1 transition-transform" transform="translate(350, 170)">
                        <circle cx="0" cy="0" r="25" fill="#fff" stroke="#111" strokeWidth="3" />
                        <text x="0" y="5" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#111">20</text>
                      </g>
                    </svg>
                    <div className="mt-6 font-mono text-xs text-brand-black/60 bg-white border-2 border-brand-black/20 p-2 border-dashed">
                      Current State: Binary Search Tree
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
