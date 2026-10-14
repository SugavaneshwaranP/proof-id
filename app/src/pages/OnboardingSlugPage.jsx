import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Paperclip, CheckCircle2, XCircle, Link2, Copy, Sparkles, Loader2 } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';
import { checkSlugAvailability } from '../lib/supabaseClient';

export default function OnboardingSlugPage({ setActivePage, onSaveSlug }) {
  const [slug, setSlug] = useState(() => {
    const draft = getOnboardingDraft();
    return draft.slug || '';
  });
  const [profileType, setProfileType] = useState('person');
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft.slug) setSlug(draft.slug);
    if (draft.profileType) setProfileType(draft.profileType);
  }, []);

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

  // Live debounce check against check_slug_availability
  useEffect(() => {
    if (!cleanSlug || cleanSlug.length < 2) {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    const reservedSlugs = ['backed', 'admin', 'verified', 'root', 'support', 'api', 'dashboard'];
    if (reservedSlugs.includes(cleanSlug)) {
      setIsAvailable(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(async () => {
      try {
        const available = await checkSlugAvailability(cleanSlug);
        setIsAvailable(available);
      } catch {
        setIsAvailable(true);
      } finally {
        setIsChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [cleanSlug]);

  const handleSlugChange = (e) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
    const cleaned = newSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    saveOnboardingDraft({ slug: cleaned, stepIndex: 2 });
  };

  const handleContinue = () => {
    const finalSlug = cleanSlug || 'my-page';
    saveOnboardingDraft({ slug: finalSlug, stepIndex: 3 });
    if (onSaveSlug) onSaveSlug(finalSlug);

    if (profileType === 'business') {
      setActivePage('onboarding-basics-business');
    } else {
      setActivePage('onboarding-basics');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`backed.network/${cleanSlug || 'yourname'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 2 of 6) */}
      <WizardProgress
        currentStep={2}
        totalSteps={6}
        stepTitle="CLAIM YOUR LINK"
        setActivePage={setActivePage}
        onSaveDraft={() => saveOnboardingDraft({ slug: cleanSlug, stepIndex: 2 })}
      />

      {/* Main Dossier Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>STEP 2 OF 6: YOUR LINK</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Personal Web Address
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Claim your page address”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            This is the personal web address you will share with clients, partners, and employers.
          </p>
        </div>

        {/* Form Body */}
        <div className="space-y-5 pt-6">
          {/* Input with prefix */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
              Choose your page handle
            </label>
            <div className="flex items-center bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="bg-slate-100 text-slate-700 font-mono font-bold text-xs sm:text-sm px-3 sm:px-4 py-3 border-r-2 border-slate-900 select-none flex items-center gap-1 shrink-0">
                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                <span>backed.network/</span>
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="yourname"
                className="w-full bg-transparent px-3 sm:px-4 py-3 text-sm sm:text-base font-black text-slate-900 placeholder-slate-400 focus:outline-none font-mono min-w-0"
              />
            </div>
          </div>

          {/* Availability Check Helper */}
          <div className="min-h-[26px] flex items-center">
            <AnimatePresence mode="wait">
              {isChecking ? (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
                  <span>Checking database availability...</span>
                </motion.div>
              ) : isAvailable === false ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="inline-flex items-center gap-2 bg-red-100 text-red-900 px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Already claimed in database. Pick another address.</span>
                </motion.div>
              ) : isAvailable === true ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Available in database — backed.network/{cleanSlug}</span>
                </motion.div>
              ) : (
                <span className="text-xs font-extrabold text-slate-700 font-mono">
                  Enter at least 2 characters.
                </span>
              )}
            </AnimatePresence>
          </div>

          {/* Live Preview Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-black text-slate-700 uppercase">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                CANONICAL DATABASE PREVIEW
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="hover:underline flex items-center gap-1 text-slate-900 hover:text-emerald-700 cursor-pointer text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm font-black rounded-xl border-2 border-slate-900 flex items-center justify-between tracking-wide overflow-hidden">
              <span className="truncate">backed.network/{cleanSlug || 'yourname'}</span>
              <span className="stamp-verified text-[10px] py-0.5 px-2 shrink-0">RESERVED</span>
            </div>
          </div>

          {/* Navigation Controls: Back & Continue (Never a dead-end) */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActivePage('onboarding-type')}
              className="w-1/3 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isAvailable === false}
              onClick={handleContinue}
              className="w-2/3 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs sm:text-base shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
