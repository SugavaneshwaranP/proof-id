import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, Search, Paperclip, ArrowLeft } from 'lucide-react';

export default function NotFoundPage({ setActivePage }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans desk-grid-background py-16">
      
      <div className="dossier-card rounded-3xl p-8 sm:p-12 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900 max-w-lg w-full text-center space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PAGE NOT FOUND</span>
        </div>

        {/* Illustration Badge */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-white rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex flex-col items-center justify-center text-slate-900"
        >
          <span className="font-mono font-black text-2xl text-amber-600">404</span>
          <ShieldAlert className="w-8 h-8 text-slate-900 mt-1" />
        </motion.div>

        {/* Headline & Subhead */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            “This page didn’t make it.”
          </h1>
          <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
            The link might be broken, or the page may have moved.
          </p>
        </div>

        {/* Two Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          {/* Go home */}
          <button
            type="button"
            onClick={() => setActivePage ? setActivePage('home') : window.location.href = '/'}
            className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase border-2 border-slate-900 shadow-[4px_4px_0px_0px_#059669] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-emerald-300" />
            <span>Go home</span>
          </button>

          {/* Search Backed */}
          <button
            type="button"
            onClick={() => setActivePage ? setActivePage('discover') : window.location.href = '/discover'}
            className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-emerald-700" />
            <span>Search Backed</span>
          </button>

        </div>

      </div>

    </div>
  );
}
