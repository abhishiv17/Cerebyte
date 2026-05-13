"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
export default function LandingNavbar({ user }: { user: any }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 bg-brand-cream border-b-2 border-brand-black transition-all duration-300 ${
        isScrolled ? "py-3 shadow-brutal" : "py-4"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border-2 border-brand-black bg-brand-green flex items-center justify-center text-white font-display text-base shadow-brutal-sm">
          C.
        </div>
        <span className="text-base font-display uppercase tracking-widest mt-1">Cerebyte</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <Link href="/dashboard" className="brutal-button-alt !py-2 !px-4 !text-sm">
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="hidden md:block font-mono-accent uppercase text-sm font-bold hover:underline underline-offset-4 decoration-2 text-brand-black">
              Log In
            </Link>
            <Link href="/signup" className="brutal-button !py-2 !px-4 !text-sm">
              Start
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
