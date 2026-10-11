import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Paperclip, Search, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

export default function OnboardingCapabilitiesPage({ setActivePage, onSaveCapabilities }) {
  const [draft, setDraft] = useState(() => getOnboardingDraft());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChips, setSelectedChips] = useState(() => {
    const d = getOnboardingDraft();
    return d.capabilities && d.capabilities.length > 0
      ? d.capabilities
      : ['Backend Systems', 'Rust Architecture', 'API Verification'];
  });

  useEffect(() => {
    const d = getOnboardingDraft();
    setDraft(d);
    if (d.capabilities && d.capabilities.length > 0) {
      setSelectedChips(d.capabilities);
    }
  }, []);

  const persistCurrentDraft = (chips = selectedChips) => {
    const updated = {
      capabilities: chips,
      stepIndex: 4,
    };
    saveOnboardingDraft(updated);
    return updated;
  };

  const suggestedSkills = draft.profileType === 'business' ? [
    '5-Axis CNC Machining',
    'ISO 9001 Quality Control',
    'Sheet Metal Fabrication',
    'Titanium Prototyping',
    'Zeiss CMM Inspection',
    'Plastic Injection Molding',
    'Rapid Prototyping',
    'Cleanroom Assembly'
  ] : [
    'Backend Systems',
    'Rust Architecture',
    'API Verification',
    'React & Next.js',
    'Distributed Systems',
    'DevOps & Kubernetes',
    'UI/UX Architecture',
    'Security Engineering'
  ];

  const filteredSuggestions = suggestedSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedChips.includes(skill)
  );

  const handleAddChip = (chip) => {
    if (!chip.trim()) return;
    const trimmed = chip.trim();
    if (!selectedChips.includes(trimmed)) {
      const next = [...selectedChips, trimmed];
      setSelectedChips(next);
      persistCurrentDraft(next);
    }
    setSearchQuery('');
  };

  const handleRemoveChip = (chipToRemove) => {
    const next = selectedChips.filter((c) => c !== chipToRemove);
    setSelectedChips(next);
    persistCurrentDraft(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery) handleAddChip(searchQuery);
    }
  };

  const handleContinue = () => {
    // Criterion 2: Missing optional data never blocks form submission or page navigation
    persistCurrentDraft();
    if (onSaveCapabilities) onSaveCapabilities(selectedChips);
    setActivePage('onboarding-proof');
  };

  const handleBack = () => {
    persistCurrentDraft();
    if (draft.profileType === 'business') {
      setActivePage('onboarding-basics-business');
    } else {
      setActivePage('onboarding-basics');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 4 of 6) */}
      <WizardProgress
        currentStep={4}
        totalSteps={6}
        stepTitle="CAPABILITIES & SERVICES"
        setActivePage={setActivePage}
        onSaveDraft={() => persistCurrentDraft()}
      />

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fbcfe8] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CAPABILITIES DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Skills & Capacities
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “What can you deliver?”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed max-w-lg mx-auto">
            Add your core capabilities. At least 1 capability is recommended for minimum credible publishing.
          </p>
        </div>

        {/* Search-Select Input */}
        <div className="space-y-5 pt-6">
          <div className="relative">
            <div className="flex items-center bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-emerald-500">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 ml-3 sm:ml-4 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or enter capability..."
                className="w-full bg-transparent py-3 sm:py-3.5 pr-3 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleAddChip(searchQuery)}
                  className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black text-xs px-3 sm:px-4 py-3 sm:py-3.5 border-l-2 border-slate-900 uppercase flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden p-2 space-y-1">
                {filteredSuggestions.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => handleAddChip(skill)}
                    className="p-3 hover:bg-emerald-50 rounded-xl cursor-pointer text-xs font-black text-slate-900 flex items-center justify-between transition-colors"
                  >
                    <span>{skill}</span>
                    <Plus className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Quick Add Chips */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Suggested {draft.profileType === 'business' ? 'Capacities' : 'Capabilities'}
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => {
                const isSelected = selectedChips.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => (isSelected ? handleRemoveChip(skill) : handleAddChip(skill))}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 border-slate-900 transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#059669]'
                        : 'bg-white text-slate-900 hover:bg-amber-100 shadow-[2px_2px_0px_0px_#0f172a]'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Chips Container */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 min-h-[100px]">
            <div className="flex items-center justify-between text-xs font-mono font-black text-slate-900 uppercase border-b-2 border-slate-900/20 pb-2">
              <span>SELECTED CAPABILITIES ({selectedChips.length})</span>
              {selectedChips.length >= 1 ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Minimum Credible Met!
                </span>
              ) : (
                <span className="text-amber-800 font-extrabold text-[11px]">
                  Add at least 1 capability
                </span>
              )}
            </div>

            {selectedChips.length === 0 ? (
              <div className="py-5 text-center space-y-1 text-slate-500 font-bold text-xs">
                <p className="text-slate-800">Nothing added yet. Select from suggestions above or type your own.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                <AnimatePresence>
                  {selectedChips.map((chip) => (
                    <motion.div
                      key={chip}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-yellow-300 text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-2"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip(chip)}
                        className="hover:bg-slate-900 hover:text-white rounded-full p-0.5 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Navigation Controls: Back & Continue (Never a dead-end) */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-1/3 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="w-2/3 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-base shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Continue to Proof</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
            </button>
          </div>

          {/* Non-blocking Skip shortcut */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleContinue}
              className="text-xs font-mono font-black text-slate-700 hover:text-slate-900 underline cursor-pointer"
            >
              Skip or add more capabilities later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
