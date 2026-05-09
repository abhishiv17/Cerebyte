"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";

export default function AITutorPage() {
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! Paste your code below and I'll analyze its time complexity, point out potential bugs, and suggest optimal data structures."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { role: "user", content: "Analyze the following code:\n\n" + code }]);
    setIsLoading(true);
    
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("http://localhost:8000/api/v1/ai-tutor/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          problem_id: "general_analysis",
          user_code: code,
          language: "python",
          user_query: "Please provide a detailed code review, focusing on time complexity, potential bugs, and better data structure usage."
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Backend request failed");
      }
      
      setMessages(prev => [...prev, { role: "ai", content: data.feedback || "Received empty feedback from the server." }]);
      setCode(""); // clear input
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full flex flex-col">
        <header className="mb-6">
          <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
            <span className="inline-block w-2 h-2 bg-[#8338ec] rounded-full mr-2"></span>
            Groq Powered
          </div>
          <h1 className="text-4xl md:text-5xl font-display uppercase leading-none break-words max-w-full">
            AI <span className="text-brand-green">Code Critic</span>
          </h1>
        </header>

        {/* Chat / Critic Interface */}
        <section className="flex-1 border-2 border-brand-black bg-white shadow-brutal flex flex-col overflow-hidden min-h-[400px]">
          {/* Header */}
          <div className="bg-[#8338ec] border-b-2 border-brand-black p-3 text-white flex items-center justify-between">
            <div className="font-display text-xl uppercase">Session: <span className="text-brand-cream">New Analysis</span></div>
            <div className="font-mono text-[10px] font-bold bg-brand-black px-2 py-1">Llama 3 70B</div>
          </div>

          {/* Chat History Area */}
          <div className="flex-1 p-5 overflow-y-auto bg-[#f4f4ec] space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 border-2 border-brand-black flex items-center justify-center text-sm shrink-0 ${msg.role === "user" ? "bg-brand-green text-white" : "bg-[#8338ec]"}`}>
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className={`border-2 border-brand-black p-3 shadow-brutal-sm rounded-none ${msg.role === "user" ? "bg-brand-cream" : "bg-white"}`}>
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm max-w-none text-brand-black [&_pre]:bg-[#1a1a1a] [&_pre]:text-[#4ade80] [&_pre]:p-3 [&_pre]:border-2 [&_pre]:border-brand-black [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:bg-[#e8e8d8] [&_code]:px-1 [&_code]:py-0.5 [&_code]:border [&_code]:border-brand-black/30 [&_code]:font-mono [&_code]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:text-xs [&_li]:font-mono [&_p]:text-xs [&_p]:font-mono [&_strong]:text-brand-green">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-mono text-xs font-bold leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 border-2 border-brand-black bg-[#8338ec] flex items-center justify-center text-sm shrink-0">🤖</div>
                <div className="border-2 border-brand-black bg-white p-3 shadow-brutal-sm rounded-none">
                  <p className="font-mono text-xs font-bold leading-relaxed animate-pulse">
                    Analyzing code constraints...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-brand-black bg-white p-4 flex gap-3">
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 border-2 border-brand-black bg-[#f4f4ec] p-3 font-mono text-xs focus:outline-none focus:bg-white transition-colors resize-none h-20 placeholder:text-brand-black/50"
              placeholder="Paste your code here..."
              disabled={isLoading}
            ></textarea>
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !code.trim()}
              className="border-2 border-brand-black bg-brand-green text-white px-5 font-display text-lg hover:bg-[#05b586] transition-colors shadow-brutal-sm active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
