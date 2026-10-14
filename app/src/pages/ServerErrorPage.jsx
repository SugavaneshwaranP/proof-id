import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Paperclip } from 'lucide-react';

export default function ServerErrorPage({ setActivePage, onRetry }) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans desk-grid-background py-16">
      
      <div className="dossier-card rounded-3xl p-8 sm:p-12 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fbcfe8] text-slate-900 max-w-lg w-full text-center space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>SYSTEM NOTICE</span>
        </div>

        {/* Illustration Badge */}
        <motion.div
          initial={{ scale: 0.8, rotate: 5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-white rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center text-red-600"
        >
          <AlertTriangle className="w-12 h-12" />
        </motion.div>

        {/* Headline & Subhead */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            “Something went wrong on our end.”
          </h1>
          <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
            It’s not you — give it another try in a moment.
          </p>
        </div>

        {/* Two Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          {/* Try again */}
          <button
            type="button"
            onClick={handleRetry}
            className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase border-2 border-slate-900 shadow-[4px_4px_0px_0px_#059669] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-emerald-300" />
            <span>Try again</span>
          </button>

          {/* Go home */}
          <button
            type="button"
            onClick={() => setActivePage ? setActivePage('home') : window.location.href = '/'}
            className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-900" />
            <span>Go home</span>
          </button>

        </div>

      </div>

    </div>
  );
}
