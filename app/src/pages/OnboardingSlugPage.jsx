import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Paperclip, CheckCircle2, XCircle, Link2, Copy, Sparkles } from 'lucide-react';

export default function OnboardingSlugPage({ setActivePage, onSaveSlug }) {
  const [slug, setSlug] = useState('yourname');
  const [copied, setCopied] = useState(false);

  // Taken slugs list for live validation check demonstration
  const takenSlugs = ['alex', 'backed', 'admin', 'john', 'verified', 'google'];

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const isTaken = takenSlugs.includes(cleanSlug);
  const isValid = cleanSlug.length >= 3 && !isTaken;

  const handleContinue = () => {
    if (!isValid) return;
    if (onSaveSlug) onSaveSlug(cleanSlug);
    setActivePage('onboarding-basics');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`backed.app/${cleanSlug || 'yourname'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Onboarding Progress Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-slate-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            STEP 2 OF 3 — CLAIM YOUR LINK
          </span>
          <span className="text-emerald-700 font-extrabold">66% COMPLETED</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-2/3 transition-all duration-500 rounded-full border-r-2 border-slate-900" />
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>LINK CLAIM DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Custom Address
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Claim your link”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            This is the page people will see. Pick something simple.
          </p>
        </div>

        {/* Form Body */}
        <div className="space-y-6 pt-6">
          
          {/* Input with prefix */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
              Choose your page handle
            </label>
            <div className="flex items-center bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="bg-slate-100 text-slate-700 font-mono font-bold text-sm px-4 py-3 border-r-2 border-slate-900 select-none flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-slate-600" />
                backed.app/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="yourname"
                className="w-full bg-transparent px-4 py-3 text-base font-black text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Availability Check Helper */}
          <div className="min-h-[28px] flex items-center">
            <AnimatePresence mode="wait">
              {isTaken ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="inline-flex items-center gap-2 bg-red-100 text-red-900 px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Someone already has that. Try another.</span>
                </motion.div>
              ) : cleanSlug.length >= 3 ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>That’s available — nice one.</span>
                </motion.div>
              ) : (
                <span className="text-xs font-extrabold text-slate-700 font-mono">
                  Enter at least 3 characters.
                </span>
              )}
            </AnimatePresence>
          </div>

          {/* Live Preview Box */}
          <div className="bg-white rounded-2xl p-5 border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-black text-slate-700 uppercase">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                LIVE PREVIEW
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="hover:underline flex items-center gap-1 text-slate-900 hover:text-emerald-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-base font-black rounded-xl border-2 border-slate-900 flex items-center justify-between tracking-wide">
              <span>backed.app/{cleanSlug || 'yourname'}</span>
              <span className="stamp-verified text-[10px] py-0.5 px-2">LIVE</span>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <button
              type="button"
              disabled={!isValid}
              onClick={handleContinue}
              className={`w-full py-4 rounded-2xl font-black text-base border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3 ${
                isValid
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-[5px_5px_0px_0px_#059669]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 text-emerald-300" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
