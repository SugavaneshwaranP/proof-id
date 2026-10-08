import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, ArrowRight, Paperclip, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function OnboardingTypePage({ setActivePage, onSelectType }) {
  const [selectedType, setSelectedType] = useState('person');

  const handleContinue = () => {
    if (onSelectType) {
      onSelectType(selectedType);
    }
    // Navigate to next onboarding step: claim link slug
    setActivePage('onboarding-slug');
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Onboarding Progress Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-slate-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            STEP 1 OF 3 — PROFILE TYPE
          </span>
          <span className="text-emerald-700 font-extrabold">33% COMPLETED</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-1/3 transition-all duration-500 rounded-full border-r-2 border-slate-900" />
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>ONBOARDING DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Getting Set Up
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Who’s this page for?”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            You can always add more later.
          </p>
        </div>

        {/* Two Selectable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-8">
          
          {/* Card 1: Individual */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('person')}
            className={`cursor-pointer rounded-2xl p-6 border-3 transition-all relative flex flex-col justify-between ${
              selectedType === 'person'
                ? 'bg-amber-100 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]'
                : 'bg-white border-slate-900/40 opacity-80 hover:opacity-100 hover:border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
            }`}
          >
            {selectedType === 'person' && (
              <div className="absolute top-3 right-3 bg-emerald-400 text-slate-900 rounded-full p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_#0f172a]">
                <User className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                An individual
              </h3>
              <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                Share your skills, your work, and the proof behind them.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t-2 border-slate-900/20 text-xs font-mono font-black text-amber-900 uppercase">
              Person Profile
            </div>
          </motion.div>

          {/* Card 2: Business */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('business')}
            className={`cursor-pointer rounded-2xl p-6 border-3 transition-all relative flex flex-col justify-between ${
              selectedType === 'business'
                ? 'bg-emerald-100 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]'
                : 'bg-white border-slate-900/40 opacity-80 hover:opacity-100 hover:border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
            }`}
          >
            {selectedType === 'business' && (
              <div className="absolute top-3 right-3 bg-emerald-400 text-slate-900 rounded-full p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-300 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_#0f172a]">
                <Building2 className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                A business
              </h3>
              <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                Show what you make or offer, with real capacity and credentials.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t-2 border-slate-900/20 text-xs font-mono font-black text-emerald-900 uppercase">
              Business File
            </div>
          </motion.div>

        </div>

        {/* Continue Button */}
        <div className="pt-8">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 text-emerald-300" />
          </button>
        </div>

      </div>

    </div>
  );
}
