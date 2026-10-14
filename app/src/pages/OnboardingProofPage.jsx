import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Paperclip, Plus, Link2, Calendar, Upload, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

export default function OnboardingProofPage({ setActivePage, onAddProof }) {
  const [draft, setDraft] = useState(() => getOnboardingDraft());
  const [title, setTitle] = useState('');
  const [linkOrFile, setLinkOrFile] = useState('');
  const [dateHappened, setDateHappened] = useState('');
  const [proofList, setProofList] = useState(() => {
    const d = getOnboardingDraft();
    return d.proofList || [];
  });

  useEffect(() => {
    const d = getOnboardingDraft();
    setDraft(d);
    if (d.proofList) {
      setProofList(d.proofList);
    }
  }, []);

  const persistCurrentDraft = (proofs = proofList) => {
    const updated = {
      proofList: proofs,
      stepIndex: 5,
    };
    saveOnboardingDraft(updated);
    return updated;
  };

  const handleAddProof = (e) => {
    if (e) e.preventDefault();
    if (!title.trim() && !linkOrFile.trim()) return;

    const newProof = {
      id: Date.now(),
      title: title.trim() || 'Verified Project Deliverable',
      linkOrFile: linkOrFile.trim() || 'https://github.com/example/artifact',
      dateHappened: dateHappened.trim() || 'Recent',
      type: (linkOrFile.includes('http') || linkOrFile.includes('.')) ? 'External Link' : 'Uploaded Artifact'
    };

    const nextList = [newProof, ...proofList];
    setProofList(nextList);
    persistCurrentDraft(nextList);
    if (onAddProof) onAddProof(newProof);

    setTitle('');
    setLinkOrFile('');
    setDateHappened('');
  };

  const handleRemoveProof = (id) => {
    const nextList = proofList.filter((item) => item.id !== id);
    setProofList(nextList);
    persistCurrentDraft(nextList);
  };

  const handleContinue = () => {
    // Criterion 2: Missing optional data never blocks form submission or page navigation
    persistCurrentDraft();
    setActivePage('onboarding-preview');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 5 of 6) */}
      <WizardProgress
        currentStep={5}
        totalSteps={6}
        stepTitle="WORK SAMPLES & PROOF"
        setActivePage={setActivePage}
        onSaveDraft={() => persistCurrentDraft()}
      />

      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>STEP 5 OF 6: WORK SAMPLES & PROOF</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Work & Credentials
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            Show your real work
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 max-w-md mx-auto leading-relaxed">
            Attach a project link, portfolio item, or certificate. This step is optional and can be updated anytime.
          </p>
        </div>

        {/* Upload / Link Form */}
        <form onSubmit={handleAddProof} className="space-y-3.5 pt-5 bg-white p-4 sm:p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>ADD WORK SAMPLE OR LINK</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              Optional
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Title or Project Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Online Store Redesign, Mobile App, or ISO Certificate"
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Link or File */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Link to Work or Document
            </label>
            <div className="flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
              <Link2 className="w-4 h-4 text-slate-500 ml-3 mr-1 shrink-0" />
              <input
                type="text"
                value={linkOrFile}
                onChange={(e) => setLinkOrFile(e.target.value)}
                placeholder="https://... (website, GitHub repository, Figma link, etc.)"
                className="w-full bg-transparent px-2 py-2.5 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Date or Completion Period (Optional)
            </label>
            <div className="flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
              <Calendar className="w-4 h-4 text-slate-500 ml-3 mr-1 shrink-0" />
              <input
                type="text"
                value={dateHappened}
                onChange={(e) => setDateHappened(e.target.value)}
                placeholder="e.g. 2025 or October 2024"
                className="w-full bg-transparent px-2 py-2.5 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Add Proof Button */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add to Profile</span>
          </button>
        </form>

        {/* Evidence List & Empty State */}
        <div className="pt-5 space-y-3">
          <div className="text-xs font-mono font-black text-slate-900 uppercase">
            ADDED SAMPLES ({proofList.length})
          </div>

          {proofList.length === 0 ? (
            <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-1">
              <Shield className="w-7 h-7 text-amber-500 mx-auto" />
              <p className="text-xs font-extrabold text-slate-800">
                No items added yet. You can continue directly to Preview & Publish.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {proofList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="stamp-verified text-[9px] py-0.5 px-2">★ WORK SAMPLE ★</span>
                        <span className="text-[10px] font-mono font-extrabold text-slate-600 uppercase">{item.type}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[11px] font-mono font-bold text-slate-600 truncate">{item.linkOrFile} • {item.dateHappened}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProof(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-300 transition-colors shrink-0 cursor-pointer"
                      title="Remove sample"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Navigation Controls: Back & Continue */}
        <div className="flex items-center gap-3 pt-6">
          <button
            type="button"
            onClick={() => {
              persistCurrentDraft();
              setActivePage('onboarding-capabilities');
            }}
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
            <span>Review & Publish</span>
            <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
          </button>
        </div>

        {/* Skip for now shortcut */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleContinue}
            className="text-xs font-mono font-black text-slate-700 hover:text-slate-900 underline cursor-pointer"
          >
            Skip this step for now
          </button>
        </div>
      </div>
    </div>
  );
}
