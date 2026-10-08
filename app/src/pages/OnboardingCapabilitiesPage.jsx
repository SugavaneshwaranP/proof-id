import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Paperclip, Search, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function OnboardingCapabilitiesPage({ setActivePage, onSaveCapabilities }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChips, setSelectedChips] = useState([
    'Backend Systems',
    'Rust Architecture',
    'API Verification'
  ]);

  // Suggested capability catalog for easy 1-click addition
  const suggestedSkills = [
    'Copywriting',
    'Steel Fabrication',
    'React & Next.js',
    'ISO 9001 CNC Machining',
    'UI/UX Design',
    'Distributed Ledgers',
    'Precision Electronics',
    'DevOps & Kubernetes'
  ];

  const filteredSuggestions = suggestedSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedChips.includes(skill)
  );

  const handleAddChip = (chip) => {
    if (!chip.trim()) return;
    if (!selectedChips.includes(chip.trim())) {
      setSelectedChips([...selectedChips, chip.trim()]);
    }
    setSearchQuery('');
  };

  const handleRemoveChip = (chipToRemove) => {
    setSelectedChips(selectedChips.filter((c) => c !== chipToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery) handleAddChip(searchQuery);
    }
  };

  const handleContinue = () => {
    if (onSaveCapabilities) onSaveCapabilities(selectedChips);
    setActivePage('onboarding-proof');
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Onboarding Progress Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-slate-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            STEP 4 OF 4 — CAPABILITIES & SKILLS
          </span>
          <span className="text-emerald-700 font-extrabold">100% COMPLETED</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-full transition-all duration-500 rounded-full" />
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fbcfe8] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CAPABILITIES DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Skills & Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “What can you do?”
          </h1>
          <p className="text-sm font-extrabold text-slate-800 leading-relaxed max-w-lg mx-auto">
            Pick the skills — or for a business, the products and services — that matter most. Three is a good start.
          </p>
        </div>

        {/* Search-Select Input */}
        <div className="space-y-6 pt-6">
          <div className="relative">
            <div className="flex items-center bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-emerald-500">
              <Search className="w-5 h-5 text-slate-500 ml-4 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search skills, like ‘copywriting’ or ‘steel fabrication’"
                className="w-full bg-transparent py-3.5 pr-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleAddChip(searchQuery)}
                  className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black text-xs px-4 py-3.5 border-l-2 border-slate-900 uppercase flex items-center gap-1"
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
                    className="p-3.5 hover:bg-emerald-50 rounded-xl cursor-pointer text-xs font-black text-slate-900 flex items-center justify-between transition-colors"
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
              Suggested Capabilities
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => {
                const isSelected = selectedChips.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => isSelected ? handleRemoveChip(skill) : handleAddChip(skill)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 border-slate-900 transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#059669]'
                        : 'bg-white text-slate-900 hover:bg-amber-100 shadow-[2px_2px_0px_0px_#0f172a]'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Chips Container */}
          <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3 min-h-[120px]">
            <div className="flex items-center justify-between text-xs font-mono font-black text-slate-900 uppercase border-b-2 border-slate-900/20 pb-2">
              <span>SELECTED CAPABILITIES ({selectedChips.length})</span>
              {selectedChips.length >= 3 && (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Great start!
                </span>
              )}
            </div>

            {selectedChips.length === 0 ? (
              <div className="py-6 text-center space-y-1 text-slate-500 font-bold text-xs">
                <p className="text-slate-800">Nothing added yet. Search above to get started.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 pt-1">
                <AnimatePresence>
                  {selectedChips.map((chip) => (
                    <motion.div
                      key={chip}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-yellow-300 text-slate-900 font-extrabold text-xs px-3.5 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-2"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip(chip)}
                        className="hover:bg-slate-900 hover:text-white rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Bottom Actions: Continue Button & Skip Link */}
          <div className="pt-4 space-y-3 text-center">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 text-emerald-300" />
            </button>

            <div>
              <button
                type="button"
                onClick={() => setActivePage('explorer')}
                className="text-xs font-mono font-black text-slate-800 hover:text-slate-900 underline cursor-pointer"
              >
                I’ll do this later
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
