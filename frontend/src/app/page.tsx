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
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-32">
        {/* Massive Headline */}
        <h1 className="text-7xl md:text-[10rem] font-display uppercase leading-[0.85] tracking-tight mb-8 text-brand-black">
          Cerebyte
        </h1>
        
        {/* Tilted Sticker */}
        <div className="relative mb-16 max-w-2xl mx-auto">
          <div className="border-4 border-brand-black bg-white p-6 shadow-brutal transform -rotate-1 hover:rotate-0 transition-transform">
            <h2 className="text-2xl md:text-3xl font-mono-accent font-bold uppercase leading-tight text-left">
              Where Algorithms <br className="hidden md:block"/> Meet Intelligence.
            </h2>
          </div>
          <div className="absolute -bottom-6 -left-6 border-4 border-brand-black bg-brand-green text-white px-4 py-2 font-mono-accent font-bold uppercase shadow-brutal transform rotate-2">
            Less theory. More code.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
          <Link href="/signup" className="brutal-button text-2xl px-12 py-6">
            Start Coding Free &rarr;
          </Link>
          <div className="border-4 border-brand-black bg-white p-4 shadow-brutal text-left hidden md:block transform rotate-2">
            <p className="font-display text-2xl leading-none">100% FREE</p>
            <p className="font-mono-accent text-xs uppercase text-brand-black/60 mt-1">Beta Access</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t-4 border-brand-black" />

      {/* Features Grid - "How it works" style */}
      <section className="relative z-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 border-b-4 border-brand-black">
          {[
            { num: "/01", title: "DSA HUB", desc: "Master algorithms with structured problems and instant feedback." },
            { num: "/02", title: "IN-BROWSER IDE", desc: "Code in 10+ languages directly in your browser. Built for speed." },
            { num: "/03", title: "AI CRITIC", desc: "Get real-time code reviews. It's like having a senior dev over your shoulder." },
            { num: "/04", title: "DBMS MODULE", desc: "Visual ER diagrams and a raw SQL sandbox for database mastery." },
          ].map(({ num, title, desc }, idx) => (
            <div 
              key={title} 
              className={`group p-8 border-brand-black transition-colors duration-200 ${idx !== 3 ? 'md:border-r-4' : ''} ${idx !== 0 ? 'border-t-4 md:border-t-0' : ''} bg-[#f4f4ec] hover:bg-brand-black text-brand-black hover:text-white`}
            >
              <div className={`font-mono-accent text-sm mb-6 text-brand-black/60 group-hover:text-white/60 transition-colors duration-200`}>{num}</div>
              <h3 className="font-display text-3xl uppercase mb-4">{title}</h3>
              <p className={`font-mono-accent text-sm leading-relaxed text-brand-black/90 group-hover:text-white/90 transition-colors duration-200`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Bottom Banner */}
      <section className="bg-brand-black text-white px-6 py-16 md:px-12 border-t-4 border-brand-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="font-display text-5xl uppercase mb-2">Start Now.</h2>
            <p className="font-mono-accent text-white/60 text-sm">Join the beta for free. Pro features coming soon.</p>
          </div>
          <Link href="/signup" className="brutal-button !bg-white !text-brand-black border-white hover:border-brand-green hover:!bg-brand-green hover:!text-white">
            Create Your Account
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 border-t-2 border-white/20 pt-8 flex justify-between items-center">
          <span className="font-display text-3xl">Cerebyte.</span>
          <span className="font-mono-accent text-xs text-white/40">© 2026 Algorithmic Mastery.</span>
        </div>
      </section>
    </main>
  );
}
