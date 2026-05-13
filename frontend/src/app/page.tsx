import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LandingNavbar from "@/components/landing-navbar";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Background Pattern - subtle dots instead of glowing orbs */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      {/* Navbar */}
      <LandingNavbar user={user} />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-40 pb-32">
        {/* Massive Headline */}
        <h1 className="text-7xl md:text-[10rem] font-display uppercase leading-[0.85] tracking-tight mb-6 text-brand-black">
          Cerebyte
        </h1>
        
        {/* Tilted Sticker */}
        <div className="relative mb-16 max-w-2xl mx-auto">
          <div className="border-2 border-brand-black bg-white p-4 shadow-brutal transform -rotate-1 hover:rotate-0 transition-transform">
            <h2 className="text-lg md:text-base font-mono-accent font-bold uppercase leading-tight text-left">
              Where Algorithms <br className="hidden md:block"/> Meet Intelligence.
            </h2>
          </div>
          <div className="absolute -bottom-6 -left-6 border-2 border-brand-black bg-brand-green text-white px-4 py-2 font-mono-accent font-bold uppercase shadow-brutal transform rotate-2">
            Less theory. More code.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Link href="/signup" className="brutal-button text-lg px-12 py-4">
            Start Coding Free &rarr;
          </Link>
          <div className="border-2 border-brand-black bg-white p-4 shadow-brutal text-left hidden md:block transform rotate-2">
            <p className="font-display text-lg leading-none">100% FREE</p>
            <p className="font-mono-accent text-xs uppercase text-brand-black/60 mt-1">Beta Access</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t-2 border-brand-black" />

      {/* Features Grid - "How it works" style */}
      <section className="relative z-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 border-b-2 border-brand-black">
          {[
            { num: "/01", title: "DSA HUB", desc: "Master algorithms with structured problems and instant feedback." },
            { num: "/02", title: "IN-BROWSER IDE", desc: "Code in 10+ languages directly in your browser. Built for speed." },
            { num: "/03", title: "AI CRITIC", desc: "Get real-time code reviews. It's like having a senior dev over your shoulder." },
            { num: "/04", title: "DBMS MODULE", desc: "Visual ER diagrams and a raw SQL sandbox for database mastery." },
          ].map(({ num, title, desc }, idx) => (
            <div 
              key={title} 
              className={`group p-6 border-brand-black transition-colors duration-200 ${idx !== 3 ? 'md:border-r-2' : ''} ${idx !== 0 ? 'border-t-2 md:border-t-0' : ''} bg-brand-cream hover:bg-brand-black text-brand-black hover:text-white`}
            >
              <div className={`font-mono-accent text-sm mb-6 text-brand-black/60 group-hover:text-white/60 transition-colors duration-200`}>{num}</div>
              <h3 className="font-display text-base uppercase mb-4">{title}</h3>
              <p className={`font-mono-accent text-sm leading-relaxed text-brand-black/90 group-hover:text-white/90 transition-colors duration-200`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="relative z-10 bg-brand-cream border-b-2 border-brand-black overflow-hidden">
        {/* Section Header */}
        <div className="border-b-2 border-brand-black px-4 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-block border-2 border-brand-black bg-brand-green text-white px-3 py-1 font-mono-accent text-xs font-bold uppercase shadow-brutal-sm mb-4 transform -rotate-1">
              The Process
            </div>
            <h2 className="text-4xl md:text-6xl font-display uppercase leading-none">
              How It <span className="text-brand-green">Works</span>
            </h2>
          </div>
          <p className="font-mono-accent text-sm text-brand-black/60 max-w-xs text-right hidden md:block uppercase font-bold">
            From zero to algorithmic mastery in three steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-brand-black relative hover:bg-white transition-colors duration-200">
            <div className="absolute -top-4 -left-2 md:top-4 md:left-4 w-14 h-14 border-2 border-brand-black bg-[#ffd166] flex items-center justify-center font-display text-2xl shadow-brutal transform -rotate-3 group-hover:rotate-0 transition-transform">
              01
            </div>
            <div className="mt-12 md:mt-16">
              <h3 className="font-display text-xl uppercase mb-3">Sign Up &amp; Get Your Quest Map</h3>
              <p className="font-mono-accent text-sm leading-relaxed text-brand-black/80 mb-6">
                Create a free account and tell Cerebyte what you want to learn. Our AI builds a personalized curriculum — a <strong>Quest Map</strong> — tailored to your goals, whether it&apos;s cracking interviews or mastering databases.
              </p>
              <div className="border-2 border-brand-black bg-white p-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 border-b border-brand-black/10 pb-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ef476f]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#ffd166]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="font-mono-accent text-[10px] uppercase font-bold text-brand-black/40 ml-2">onboarding.tsx</span>
                </div>
                <div className="font-mono-accent text-xs space-y-1 text-brand-black/70">
                  <p><span className="text-brand-green">$</span> diagnostic --focus</p>
                  <p className="text-brand-black/40">→ analyzing skill level...</p>
                  <p className="text-brand-green font-bold">✓ Quest Map generated: 24 topics, 148 problems</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-brand-black relative hover:bg-white transition-colors duration-200">
            <div className="absolute -top-4 -left-2 md:top-4 md:left-4 w-14 h-14 border-2 border-brand-black bg-[#06d6a0] flex items-center justify-center font-display text-2xl shadow-brutal transform rotate-2 group-hover:rotate-0 transition-transform">
              02
            </div>
            <div className="mt-12 md:mt-16">
              <h3 className="font-display text-xl uppercase mb-3">Code in the Browser</h3>
              <p className="font-mono-accent text-sm leading-relaxed text-brand-black/80 mb-6">
                Open any problem and write your solution directly in our <strong>in-browser IDE</strong>. Support for 10+ languages with instant execution, test case validation, and data structure visualization — no local setup required.
              </p>
              <div className="border-2 border-brand-black bg-brand-black p-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ef476f]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#ffd166]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  <span className="font-mono-accent text-[10px] uppercase font-bold text-white/30 ml-2">solution.py</span>
                </div>
                <div className="font-mono-accent text-xs space-y-1 text-white/80">
                  <p><span className="text-[#8338ec]">def</span> <span className="text-[#ffd166]">two_sum</span>(nums, target):</p>
                  <p className="pl-4"><span className="text-[#8338ec]">seen</span> = {'{}'}</p>
                  <p className="pl-4"><span className="text-[#8338ec]">for</span> i, n <span className="text-[#8338ec]">in</span> enumerate(nums):</p>
                  <p className="pl-8"><span className="text-[#8338ec]">if</span> target-n <span className="text-[#8338ec]">in</span> seen:</p>
                  <p className="pl-12"><span className="text-[#8338ec]">return</span> [seen[target-n], i]</p>
                  <p className="pl-8">seen[n] = i</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group p-6 md:p-8 relative hover:bg-white transition-colors duration-200">
            <div className="absolute -top-4 -left-2 md:top-4 md:left-4 w-14 h-14 border-2 border-brand-black bg-[#8338ec] text-white flex items-center justify-center font-display text-2xl shadow-brutal transform -rotate-2 group-hover:rotate-0 transition-transform">
              03
            </div>
            <div className="mt-12 md:mt-16">
              <h3 className="font-display text-xl uppercase mb-3">Get AI Feedback &amp; Level Up</h3>
              <p className="font-mono-accent text-sm leading-relaxed text-brand-black/80 mb-6">
                Submit your code and our <strong>AI Code Critic</strong> (powered by Groq LPU) reviews it instantly — pointing out edge cases, suggesting optimizations, and explaining time/space complexity. Track your rank as you climb.
              </p>
              <div className="border-2 border-brand-black bg-white p-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 border-b border-brand-black/10 pb-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="font-mono-accent text-[10px] uppercase font-bold text-brand-black/40">ai critic response</span>
                </div>
                <div className="font-mono-accent text-xs space-y-2 text-brand-black/70">
                  <p><span className="inline-block w-4 h-4 border border-brand-green bg-brand-green/10 text-brand-green text-[10px] text-center mr-1">✓</span> <strong>O(n)</strong> time — optimal hash map approach.</p>
                  <p><span className="inline-block w-4 h-4 border border-[#ffd166] bg-[#ffd166]/10 text-[#ffd166] text-[10px] text-center mr-1">!</span> Consider: what if <code className="bg-brand-cream px-1">nums</code> is empty?</p>
                  <p><span className="inline-block w-4 h-4 border border-[#8338ec] bg-[#8338ec]/10 text-[#8338ec] text-[10px] text-center mr-1">★</span> <strong>Rank up:</strong> Cadet → Ensign</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Bottom Banner */}
      <section className="bg-brand-black text-white px-4 py-16 md:px-12 border-t-2 border-brand-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="font-display text-base uppercase mb-2">Start Now.</h2>
            <p className="font-mono-accent text-white/60 text-sm">Join the beta for free. Pro features coming soon.</p>
          </div>
          <Link href="/signup" className="brutal-button !bg-white !text-brand-black border-white hover:border-brand-green hover:!bg-brand-green hover:!text-white">
            Create Your Account
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 border-t-2 border-white/20 pt-8 flex justify-between items-center">
          <span className="font-display text-base">Cerebyte.</span>
          <span className="font-mono-accent text-xs text-white/40">© 2026 Algorithmic Mastery.</span>
        </div>
      </section>
    </main>
  );
}
