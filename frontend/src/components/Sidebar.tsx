"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/app/actions";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Topbar / Hamburger */}
      <div className="md:hidden w-full border-b-2 border-brand-black bg-brand-green text-white flex justify-between items-center p-3 shrink-0 z-20">
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-8 h-8 border-2 border-brand-black bg-white text-brand-black flex items-center justify-center shadow-brutal-sm hover:bg-brand-cream transition-colors"
          aria-label="Open menu"
        >
          <span className="text-lg font-bold font-display">☰</span>
        </button>
        <Link href="/" className="font-display text-xl uppercase tracking-wider">Cerebyte</Link>
        <ThemeToggle />
      </div>

      {/* Backdrop for sliding drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-brand-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-60 border-r-2 border-brand-black bg-white flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0 overflow-hidden ${isOpen ? 'translate-x-0 shadow-[8px_0_0_0_rgb(var(--color-black))]' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-brand-black bg-brand-green text-white flex justify-between items-center shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 border-2 border-white bg-brand-black flex items-center justify-center font-display text-lg group-hover:-translate-y-1 transition-transform">
              C.
            </div>
            <span className="text-2xl font-display uppercase tracking-wider mt-1">Cerebyte</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden w-6 h-6 border-2 border-white bg-red-400 text-white font-display text-sm flex items-center justify-center shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            aria-label="Close menu"
          >
            X
          </button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-mono font-bold text-brand-black/50 uppercase mb-1">Menu</div>
          
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all ${pathname === '/dashboard' ? 'bg-brand-lightGreen' : 'hover:bg-brand-cream bg-white'}`}>
            Dashboard
          </Link>
          <Link href="/ide" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all ${pathname === '/ide' ? 'bg-brand-lightGreen' : 'hover:bg-brand-cream bg-white'}`}>
            IDE Workspace
          </Link>
          <Link href="/dsa" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all ${pathname === '/dsa' ? 'bg-brand-lightGreen' : 'hover:bg-brand-cream bg-white'}`}>
            DSA Hub
          </Link>
          <Link href="/dbms" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all ${pathname === '/dbms' ? 'bg-brand-lightGreen' : 'hover:bg-brand-cream bg-white'}`}>
            DBMS Module
          </Link>
          <Link href="/ai-tutor" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all ${pathname === '/ai-tutor' ? 'bg-brand-lightGreen' : 'hover:bg-brand-cream bg-white'}`}>
            AI Code Critic
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-5 border-t-2 border-brand-black bg-brand-cream shrink-0 mt-auto">
          <Link href="/profile" onClick={() => setIsOpen(false)} className={`block w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all text-center mb-3 ${pathname === '/profile' ? 'bg-[#06d6a0]' : 'bg-white hover:bg-[#06d6a0]'}`}>
            Profile
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full border-2 border-brand-black p-2.5 font-display uppercase text-lg bg-red-400 hover:bg-red-500 shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover transition-all text-brand-black">
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
