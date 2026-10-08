import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-[#f0ece1] border-t-3 border-slate-900 py-12 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Product links */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
            <ShieldCheck className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight">
            Backed
          </span>
        </div>

        {/* Footer text requested by user */}
        <div className="text-center md:text-right">
          <p className="text-sm font-extrabold text-slate-900">
            Product · Company · Legal — © 2026 Backed. Built on real proof
          </p>
        </div>

      </div>
    </footer>
  );
}
