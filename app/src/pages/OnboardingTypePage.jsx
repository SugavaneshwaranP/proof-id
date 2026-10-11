import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, ArrowRight, Paperclip, CheckCircle2 } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

export default function OnboardingTypePage({ setActivePage, onSelectType }) {
  const [selectedType, setSelectedType] = useState(() => {
    const draft = getOnboardingDraft();
    return draft.profileType || 'person';
  });

  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft.profileType) {
      setSelectedType(draft.profileType);
    }
  }, []);

  const handleSelect = (type) => {
    setSelectedType(type);
    saveOnboardingDraft({ profileType: type, stepIndex: 1 });
    if (onSelectType) {
      onSelectType(type);
    }
  };

  const handleContinue = () => {
    saveOnboardingDraft({ profileType: selectedType, stepIndex: 2 });
    if (onSelectType) {
      onSelectType(selectedType);
    }
    setActivePage('onboarding-slug');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Unified Explicit Wizard Progress (Step 1 of 6) */}
      <WizardProgress
        currentStep={1}
        totalSteps={6}
        stepTitle="PROFILE TYPE"
        setActivePage={setActivePage}
        onSaveDraft={() => saveOnboardingDraft({ profileType: selectedType, stepIndex: 1 })}
      />

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
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
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Who’s this page for?”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            You can always add more later. Your choices are automatically preserved as a draft.
          </p>
        </div>

        {/* Two Selectable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-6 sm:pt-8">
          {/* Card 1: Individual */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('person')}
            className={`cursor-pointer rounded-2xl p-5 sm:p-6 border-3 transition-all relative flex flex-col justify-between ${
              selectedType === 'person'
                ? 'bg-amber-100 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a]'
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
                Share your skills, verified work, and peer-endorsed evidence.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-slate-900/20 text-xs font-mono font-black text-amber-900 uppercase">
              Person Profile
            </div>
          </motion.div>

          {/* Card 2: Business */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('business')}
            className={`cursor-pointer rounded-2xl p-5 sm:p-6 border-3 transition-all relative flex flex-col justify-between ${
              selectedType === 'business'
                ? 'bg-emerald-100 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a]'
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
                Showcase manufacturing capacities, certifications, products, and MOQs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-slate-900/20 text-xs font-mono font-black text-emerald-900 uppercase">
              Business File
            </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <div className="pt-6 sm:pt-8">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm sm:text-base shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3 min-h-[44px]"
          >
            <span>Continue to Claim Link</span>
            <ArrowRight className="w-5 h-5 text-emerald-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
