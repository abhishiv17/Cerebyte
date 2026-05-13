import Sidebar from "@/components/Sidebar";
import ProblemList from "./ProblemList";
import Link from "next/link";

export default async function DSAHubPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  let problems = [];
  try {
    const res = await fetch("http://localhost:8000/api/v1/problems/", {
      cache: "no-store",
    });
    if (res.ok) {
      problems = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch problems:", e);
  }

  const topics = [
    { name: "Arrays & Hashing", progress: "5/10", color: "bg-[#ffd166]" },
    { name: "Two Pointers", progress: "2/5", color: "bg-[#06d6a0]" },
    { name: "Sliding Window", progress: "0/4", color: "bg-[#118ab2]" },
    { name: "Stack", progress: "1/7", color: "bg-[#ef476f]" },
    { name: "Binary Search", progress: "0/6", color: "bg-[#f78c6b]" },
    { name: "Linked List", progress: "0/5", color: "bg-[#8338ec]" },
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row bg-brand-cream text-brand-black selection:bg-brand-green selection:text-white font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 relative h-full">
        <header className="mb-6 md:mb-8">
          <div className="inline-block border-2 border-brand-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
            <span className="inline-block w-2 h-2 bg-[#ffd166] rounded-full mr-2"></span>
            Practice Module
          </div>
          <h1 className="text-4xl md:text-5xl font-display uppercase leading-none break-words max-w-full">
            DSA <span className="text-brand-green">Hub</span>
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-display uppercase mb-4 border-b-2 border-brand-black pb-2">Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map((t) => (
              <Link href={`?topic=${t.name}`} key={t.name}>
                <div className={`h-full border-2 border-brand-black ${t.color} p-4 shadow-brutal hover:-translate-y-1 transition-transform cursor-pointer`}>
                  <div className="font-mono text-[10px] font-bold uppercase mb-2 bg-white border-2 border-brand-black px-2 py-1 inline-block">{t.progress}</div>
                  <div className="font-display text-lg leading-tight">{t.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Problem List */}
          <div className="flex-[3] min-w-0">
            <ProblemList key={searchParams.topic || "all"} initialProblems={problems} initialSearch={searchParams.topic || ""} />
          </div>

          {/* Right Sidebar: Stats & Challenges */}
          <aside className="flex-[1] flex flex-col gap-6 shrink-0 lg:max-w-xs">
            {/* Daily Challenge */}
            <Link href="/ide?problem_id=mock-17">
              <div className="border-2 border-brand-black bg-brand-green text-white shadow-brutal p-5 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display uppercase text-xl">Daily Challenge</h3>
                  <span className="font-mono text-[10px] font-bold bg-white text-brand-black px-2 py-1 border-2 border-brand-black">HOT</span>
                </div>
                <p className="font-mono text-sm font-bold mb-4">Merge K Sorted Lists</p>
                <div className="flex justify-between items-end">
                  <div className="font-mono text-xs text-white/80">Hard • Linked List</div>
                  <div className="text-2xl">🔥</div>
                </div>
              </div>
            </Link>

            {/* Quick Stats */}
            <div className="border-2 border-brand-black bg-white shadow-brutal p-5">
              <h3 className="font-display uppercase text-xl mb-4 border-b-2 border-brand-black pb-2">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-xs font-bold uppercase mb-1">
                    <span>Easy</span>
                    <span className="text-[#06d6a0]">24 / 100</span>
                  </div>
                  <div className="w-full h-2 bg-brand-cream border-2 border-brand-black">
                    <div className="h-full bg-[#06d6a0] w-[24%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-xs font-bold uppercase mb-1">
                    <span>Medium</span>
                    <span className="text-[#ffd166]">12 / 150</span>
                  </div>
                  <div className="w-full h-2 bg-brand-cream border-2 border-brand-black">
                    <div className="h-full bg-[#ffd166] w-[8%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-xs font-bold uppercase mb-1">
                    <span>Hard</span>
                    <span className="text-[#ef476f]">2 / 50</span>
                  </div>
                  <div className="w-full h-2 bg-brand-cream border-2 border-brand-black">
                    <div className="h-full bg-[#ef476f] w-[4%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
