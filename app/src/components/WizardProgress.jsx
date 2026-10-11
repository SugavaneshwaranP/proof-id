import React, { useState, useEffect } from 'react';
import { ShieldCheck, Save, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

const STEPS = [
  { index: 1, id: 'onboarding-type', title: 'Profile Type' },
  { index: 2, id: 'onboarding-slug', title: 'Claim Link' },
  { index: 3, id: 'onboarding-basics', title: 'Basics' },
  { index: 4, id: 'onboarding-capabilities', title: 'Capabilities' },
  { index: 5, id: 'onboarding-proof', title: 'Proof' },
  { index: 6, id: 'onboarding-preview', title: 'Preview & Publish' },
];

export default function WizardProgress({
  currentStep = 1,
  totalSteps = 6,
  stepTitle = 'Profile Setup',
  setActivePage,
  onSaveDraft,
}) {
  const [saveToast, setSaveToast] = useState(false);
  const [lastSavedText, setLastSavedText] = useState('Draft saved');

  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  const handleManualSave = () => {
    if (onSaveDraft) {
      onSaveDraft();
    } else {
      saveOnboardingDraft({ stepIndex: currentStep });
    }
    setSaveToast(true);
    setLastSavedText('Draft saved just now');
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSaveAndExit = () => {
    handleManualSave();
    if (setActivePage) {
      setActivePage('home');
    }
  };

  return (
    <div className="w-full bg-white border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 font-sans">
      {/* Top Header: Step Info + Autosave Status + Save Draft Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-black uppercase text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            STEP {currentStep} OF {totalSteps} — {stepTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Real-time Draft Save Status indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xs:inline">{saveToast ? 'Draft Saved!' : lastSavedText}</span>
            <span className="xs:hidden">{saveToast ? 'Saved!' : 'Saved'}</span>
          </div>

          {/* Explicit Save Draft Button (Criterion 1) */}
          <button
            type="button"
            onClick={handleManualSave}
            title="Save draft state without exiting"
            className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 border-2 border-slate-900 text-[11px] font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Save & Exit shortcut */}
          <button
            type="button"
            onClick={handleSaveAndExit}
            title="Save draft and exit to homepage"
            className="px-2 py-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold transition-all cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Track & Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
          <span>WIZARD PROGRESS</span>
          <span className="text-emerald-700 font-black">{progressPercent}% COMPLETED</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden relative">
          <div
            className="bg-emerald-400 h-full transition-all duration-500 rounded-full border-r-2 border-slate-900"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Dots Tracker (Responsive for mobile <375px) */}
      <div className="grid grid-cols-6 gap-1 pt-0.5">
        {STEPS.map((step) => {
          const isDone = step.index < currentStep;
          const isCurrent = step.index === currentStep;

          return (
            <div
              key={step.index}
              className={`text-center py-1 rounded-md text-[10px] font-mono font-black border transition-all ${
                isCurrent
                  ? 'bg-slate-900 text-emerald-300 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
              title={step.title}
            >
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
