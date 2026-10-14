import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Paperclip, Building2, MapPin, Globe, Briefcase, UploadCloud, Mail } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

export default function OnboardingBasicsBusinessPage({ setActivePage, onSaveBusinessBasics }) {
  const [draft, setDraft] = useState(() => getOnboardingDraft());
  const [businessName, setBusinessName] = useState(() => draft.businessName || '');
  const [contactMethod, setContactMethod] = useState(() => draft.contactMethod || '');
  const [whatYouDo, setWhatYouDo] = useState(() => draft.whatYouDo || '');
  const [location, setLocation] = useState(() => draft.location || '');
  const [operatingRegions, setOperatingRegions] = useState(() => draft.operatingRegions || '');
  const [logoPreview, setLogoPreview] = useState(() => draft.logoPreview || '🏢');

  useEffect(() => {
    const d = getOnboardingDraft();
    setDraft(d);
    if (d.businessName) setBusinessName(d.businessName);
    if (d.contactMethod) setContactMethod(d.contactMethod);
    if (d.whatYouDo) setWhatYouDo(d.whatYouDo);
    if (d.location) setLocation(d.location);
    if (d.operatingRegions) setOperatingRegions(d.operatingRegions);
    if (d.logoPreview) setLogoPreview(d.logoPreview);
  }, []);

  const persistCurrentDraft = (overrides = {}) => {
    const updated = {
      businessName,
      contactMethod,
      whatYouDo,
      location,
      operatingRegions,
      logoPreview,
      stepIndex: 3,
      ...overrides,
    };
    saveOnboardingDraft(updated);
    return updated;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const payload = persistCurrentDraft({ stepIndex: 4 });
    if (onSaveBusinessBasics) {
      onSaveBusinessBasics(payload);
    }
    setActivePage('onboarding-capabilities');
  };

  const handleLogoSimulate = () => {
    const logoIcons = ['🏢', '🏭', '⚙️', '📦', '🛡️'];
    const currentIndex = logoIcons.indexOf(logoPreview);
    const nextIndex = (currentIndex + 1) % logoIcons.length;
    const nextLogo = logoIcons[nextIndex];
    setLogoPreview(nextLogo);
    persistCurrentDraft({ logoPreview: nextLogo });
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 3 of 6) */}
      <WizardProgress
        currentStep={3}
        totalSteps={6}
        stepTitle="BUSINESS BASICS"
        setActivePage={setActivePage}
        onSaveDraft={() => persistCurrentDraft()}
      />

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>STEP 3 OF 6: YOUR BUSINESS</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-amber-300 text-slate-900">
            Company Credentials
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Tell us about your business”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            Only company name is required. All other fields are optional and never block your progress.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          {/* Logo Upload Section (Optional) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-200 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center text-3xl sm:text-4xl cursor-pointer hover:bg-emerald-300 transition-all select-none shrink-0"
              onClick={handleLogoSimulate}
            >
              {logoPreview}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
                  Logo
                </label>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                Click to cycle brand badges or simulate file
              </p>
              <button
                type="button"
                onClick={handleLogoSimulate}
                className="text-xs font-mono font-black text-slate-900 bg-amber-300 hover:bg-amber-400 px-3 py-1.5 rounded-lg border-2 border-slate-900 inline-flex items-center gap-1 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer mt-1"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-900" />
                <span>Upload Logo</span>
              </button>
            </div>
          </div>

          {/* Business Name (Required for Minimum Credible Publishing) */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-800" />
                Business name *
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-black">MINIMUM CREDIBLE REQUIREMENT</span>
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                persistCurrentDraft({ businessName: e.target.value });
              }}
              placeholder="Your company’s name"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Business Contact Method (Required for Minimum Credible Publishing) */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-800" />
                Inquiry / RFP Contact Method *
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-black">MINIMUM CREDIBLE REQUIREMENT</span>
            </label>
            <input
              type="text"
              required
              value={contactMethod}
              onChange={(e) => {
                setContactMethod(e.target.value);
                persistCurrentDraft({ contactMethod: e.target.value });
              }}
              placeholder="e.g. sales@company.com or phone number"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* What You Do (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-800" />
                What you do
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={whatYouDo}
              onChange={(e) => {
                setWhatYouDo(e.target.value);
                persistCurrentDraft({ whatYouDo: e.target.value });
              }}
              placeholder='One line, e.g. “We manufacture packaging for food brands”'
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Based In (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-800" />
                Based in
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                persistCurrentDraft({ location: e.target.value });
              }}
              placeholder="City, country"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Where You Operate (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-800" />
                Where you operate
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={operatingRegions}
              onChange={(e) => {
                setOperatingRegions(e.target.value);
                persistCurrentDraft({ operatingRegions: e.target.value });
              }}
              placeholder="Regions you serve"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Navigation Controls: Back & Continue (Never a dead-end) */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                persistCurrentDraft();
                setActivePage('onboarding-slug');
              }}
              className="w-1/3 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="w-2/3 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-base shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Continue to Services</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
