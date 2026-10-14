import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Paperclip, Camera, User, MapPin, Briefcase, FileText, Mail } from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingDraft';

export default function OnboardingBasicsPage({ setActivePage, onSaveBasics }) {
  const [draft, setDraft] = useState(() => getOnboardingDraft());
  const [name, setName] = useState(() => draft.fullName || '');
  const [contactMethod, setContactMethod] = useState(() => draft.contactMethod || '');
  const [headline, setHeadline] = useState(() => draft.headline || '');
  const [location, setLocation] = useState(() => draft.location || '');
  const [bio, setBio] = useState(() => draft.bio || '');
  const [photoUrl, setPhotoUrl] = useState(() => draft.photoUrl || '/avatar_hero.png');

  useEffect(() => {
    const d = getOnboardingDraft();
    setDraft(d);
    if (d.fullName) setName(d.fullName);
    if (d.contactMethod) setContactMethod(d.contactMethod);
    if (d.headline) setHeadline(d.headline);
    if (d.location) setLocation(d.location);
    if (d.bio) setBio(d.bio);
    if (d.photoUrl) setPhotoUrl(d.photoUrl);
  }, []);

  const persistCurrentDraft = (overrides = {}) => {
    const updated = {
      fullName: name,
      contactMethod: contactMethod,
      headline: headline,
      location: location,
      bio: bio,
      photoUrl: photoUrl,
      stepIndex: 3,
      ...overrides,
    };
    saveOnboardingDraft(updated);
    return updated;
  };

  const handleContinue = (e) => {
    if (e) e.preventDefault();
    // Criterion 2: Missing optional data never blocks form submission or page navigation
    const payload = persistCurrentDraft({ stepIndex: 4 });
    if (onSaveBasics) {
      onSaveBasics(payload);
    }
    setActivePage('onboarding-capabilities');
  };

  const handlePhotoSimulate = () => {
    const avatarOptions = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      '/avatar_hero.png'
    ];
    const currentIndex = avatarOptions.indexOf(photoUrl);
    const nextIndex = (currentIndex + 1) % avatarOptions.length;
    const nextUrl = avatarOptions[nextIndex];
    setPhotoUrl(nextUrl);
    persistCurrentDraft({ photoUrl: nextUrl });
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 3 of 6) */}
      <WizardProgress
        currentStep={3}
        totalSteps={6}
        stepTitle="PERSON BASICS"
        setActivePage={setActivePage}
        onSaveDraft={() => persistCurrentDraft()}
      />

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>STEP 3 OF 6: ABOUT YOU</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Personal Details
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Tell us a bit about you”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            Only your name is required. All other fields are optional and can be updated anytime.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleContinue} className="space-y-5 pt-6">
          {/* Photo Upload Section (Optional) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group cursor-pointer shrink-0" onClick={handlePhotoSimulate}>
              <img
                src={photoUrl}
                alt="Profile photo preview"
                loading="lazy"
                decoding="async"
                width="80"
                height="80"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
                  Photo
                </label>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                Pre-scaled avatar for fast mobile rendering
              </p>
              <button
                type="button"
                onClick={handlePhotoSimulate}
                className="text-xs font-mono font-black text-slate-900 bg-emerald-300 hover:bg-emerald-400 px-3 py-1.5 rounded-lg border-2 border-slate-900 inline-block shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer mt-1"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Your Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-800" />
                Your name *
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-black">REQUIRED</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                persistCurrentDraft({ fullName: e.target.value });
              }}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Contact Method */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-800" />
                Contact Email or Phone *
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-black">REQUIRED</span>
            </label>
            <input
              type="text"
              required
              value={contactMethod}
              onChange={(e) => {
                setContactMethod(e.target.value);
                persistCurrentDraft({ contactMethod: e.target.value });
              }}
              placeholder="e.g. sarah@example.com"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
            <p className="text-[11px] font-mono font-bold text-slate-600">
              How visitors and clients can reach you directly.
            </p>
          </div>

          {/* Headline (Optional - Criterion 2: Missing optional data never blocks form submission) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-800" />
                Headline
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                persistCurrentDraft({ headline: e.target.value });
              }}
              placeholder='e.g. “Backend developer who ships fast”'
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Location (Optional) */}
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

          {/* About you (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-800" />
                About you
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                persistCurrentDraft({ bio: e.target.value });
              }}
              placeholder="A couple of lines — no need to be formal"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a] resize-none"
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
              <span>Continue to Skills</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
