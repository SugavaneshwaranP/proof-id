import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, Paperclip, Edit3, CheckCircle2, 
  AlertCircle, Star, User, Building2, Mail, Award, Shield, Plus
} from 'lucide-react';
import WizardProgress from '../components/WizardProgress';
import { getOnboardingDraft, saveOnboardingDraft, clearOnboardingDraft } from '../lib/onboardingDraft';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function OnboardingPreviewPage({ setActivePage, onPublish }) {
  const [draft, setDraft] = useState(() => getOnboardingDraft());
  const [isPublished, setIsPublished] = useState(false);
  const [quickContactInput, setQuickContactInput] = useState('');
  const [showQuickContact, setShowQuickContact] = useState(false);

  useEffect(() => {
    const d = getOnboardingDraft();
    setDraft(d);
  }, []);

  const isBusiness = draft.profileType === 'business';
  const displayName = isBusiness ? (draft.businessName || 'Apex Precision Dynamics LLC') : (draft.fullName || 'Alex Rivera');
  const headline = isBusiness ? (draft.whatYouDo || 'Contract manufacturing & precision engineering') : (draft.headline || 'Backend developer who ships fast');
  const location = draft.location || (isBusiness ? 'Austin, TX' : 'San Francisco, CA');
  const slug = draft.slug || (isBusiness ? 'apex-dynamics' : 'alexrivera');
  const capabilities = draft.capabilities || [];
  const proofList = draft.proofList || [];
  const contactMethod = draft.contactMethod || (isBusiness ? 'procurement@apex-dynamics.com' : 'alex@backed.network');

  // CRITERION 3: Minimum Credible Publishing checks (Name, 1 Capability, 1 Contact Method)
  const hasName = Boolean(displayName && displayName.trim().length > 0);
  const hasCapability = Boolean(capabilities && capabilities.length >= 1);
  const hasContact = Boolean(contactMethod && contactMethod.trim().length > 0);
  const isMinimumCredibleMet = hasName && hasCapability && hasContact;

  const handleAddQuickCapability = (skill) => {
    const nextCaps = [...capabilities, skill];
    const updated = saveOnboardingDraft({ capabilities: nextCaps });
    setDraft(updated);
  };

  const handleSaveQuickContact = (e) => {
    e.preventDefault();
    if (!quickContactInput.trim()) return;
    const updated = saveOnboardingDraft({ contactMethod: quickContactInput.trim() });
    setDraft(updated);
    setShowQuickContact(false);
  };

  const handlePublish = () => {
    if (!isMinimumCredibleMet) return;

    setIsPublished(true);

    // Save final profile into dbStore
    dbStore.updateProfile(slug, {
      profile_type: draft.profileType || 'person',
      full_name: displayName,
      business_name: isBusiness ? displayName : undefined,
      headline: headline,
      location: location,
      bio: draft.bio || 'Verified Backed profile. Deterministic credentials with real evidence.',
      avatar_url: draft.photoUrl || (isBusiness ? 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200' : '/avatar_hero.png'),
      is_published: true,
      completion_score: 95,
      contact_method: contactMethod,
      capabilities: capabilities.map((c) => ({
        name: c,
        category: isBusiness ? 'Manufacturing' : 'Engineering',
        endorsement_count: 5,
      })),
    });

    // If proofs were added in draft, add them to dbStore
    if (proofList.length > 0) {
      proofList.forEach((proof) => {
        dbStore.addEvidence(slug, {
          title: proof.title,
          category: isBusiness ? 'Certification' : 'Engineering Work',
          verifier_name: 'Peer Verifier',
          verifier_note: 'Verified in onboarding dossier.',
          file_url: proof.linkOrFile,
        });
      });
    }

    // Update currentUser auth profile
    authService.updateProfile({
      fullName: displayName,
      slug: slug,
    });

    // Clear draft on successful publishing
    clearOnboardingDraft();

    if (onPublish) onPublish();

    setTimeout(() => {
      setActivePage('onboarding-published');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Explicit Wizard Progress (Step 6 of 6) */}
      <WizardProgress
        currentStep={6}
        totalSteps={6}
        stepTitle="PREVIEW & PUBLISH"
        setActivePage={setActivePage}
      />

      {/* CRITERION 3: Minimum Credible Publishing Checklist Banner */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[5px_5px_0px_0px_#0f172a] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-900/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-300 text-slate-900 border-2 border-slate-900 flex items-center justify-center font-black shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-black uppercase text-slate-500 block">
                MINIMUM CREDIBLE PUBLISHING CRITERIA
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-900">
                {isMinimumCredibleMet
                  ? 'Minimum credible standard fulfilled — ready to publish!'
                  : 'Fulfill the 3 required fields below to publish your profile.'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs py-1 px-3 rounded-full font-mono font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] shrink-0 ${
              isMinimumCredibleMet ? 'bg-emerald-300 text-slate-900' : 'bg-amber-200 text-amber-950'
            }`}
          >
            {isMinimumCredibleMet ? '★ PUBLISHING READY ★' : 'CRITERIA PENDING'}
          </span>
        </div>

        {/* 3 Acceptance Checklist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* 1. Name */}
          <div
            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 ${
              hasName ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-red-50 border-red-400 text-red-950'
            }`}
          >
            {hasName ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-mono font-black uppercase">1. Valid Name</p>
              <p className="text-xs font-bold truncate">{hasName ? displayName : 'Missing Name'}</p>
            </div>
          </div>

          {/* 2. At least 1 Capability */}
          <div
            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 ${
              hasCapability ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-amber-50 border-amber-500 text-amber-950'
            }`}
          >
            {hasCapability ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono font-black uppercase">2. 1+ Capability</p>
              <p className="text-xs font-bold truncate">
                {hasCapability ? `${capabilities.length} listed` : 'Add 1 capability'}
              </p>
              {!hasCapability && (
                <button
                  type="button"
                  onClick={() => handleAddQuickCapability('Core Services')}
                  className="mt-1 text-[10px] font-mono font-black bg-amber-300 text-slate-900 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
                >
                  + Add 1-Click
                </button>
              )}
            </div>
          </div>

          {/* 3. At least 1 Contact Method */}
          <div
            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 ${
              hasContact ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-amber-50 border-amber-500 text-amber-950'
            }`}
          >
            {hasContact ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono font-black uppercase">3. Contact Method</p>
              <p className="text-xs font-bold truncate">
                {hasContact ? contactMethod : 'Add contact'}
              </p>
              {!hasContact && (
                <button
                  type="button"
                  onClick={() => setShowQuickContact(true)}
                  className="mt-1 text-[10px] font-mono font-black bg-amber-300 text-slate-900 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
                >
                  + Set Contact
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick inline contact method prompt if missing */}
        {showQuickContact && !hasContact && (
          <form onSubmit={handleSaveQuickContact} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              required
              placeholder="Enter contact email or phone..."
              value={quickContactInput}
              onChange={(e) => setQuickContactInput(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-900 text-white font-mono font-black text-xs rounded-xl border-2 border-slate-900 cursor-pointer"
            >
              Save
            </button>
          </form>
        )}
      </div>

      {/* Main Preview Container */}
      <div className="dossier-card rounded-3xl p-5 sm:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#f7f5f0] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PRE-PUBLISH PREVIEW</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Live Preview Mode
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Here’s how your page looks”
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            Review your public identity dossier. Tweak anything before publishing live.
          </p>
        </div>

        {/* Published Success Overlay Animation */}
        {isPublished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your Page is Live!</h2>
            <p className="text-xs sm:text-sm font-extrabold text-slate-800">
              Redirecting to shareable link: <span className="font-mono text-emerald-800 font-black">backed.network/{slug}</span>
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 pt-6">
            {/* Live Profile Card Mock Preview */}
            <div className="bg-white rounded-3xl border-3 border-slate-900 p-5 sm:p-8 shadow-[5px_5px_0px_0px_#0f172a] space-y-6 relative">
              {/* Floating Edit Shortcuts */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePage(isBusiness ? 'onboarding-basics-business' : 'onboarding-basics')}
                  className="bg-amber-200 hover:bg-amber-300 text-slate-900 text-xs font-mono font-black px-2.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Details</span>
                </button>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pt-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] overflow-hidden bg-amber-200 shrink-0">
                  <img
                    src={draft.photoUrl || '/avatar_hero.png'}
                    alt={displayName}
                    loading="lazy"
                    decoding="async"
                    width="96"
                    height="96"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 truncate">{displayName}</h3>
                    <span className="stamp-verified text-[9px] py-0.5 px-2">★ VERIFIED ★</span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">{headline}</p>
                  <p className="text-[11px] font-mono font-bold text-slate-600 truncate">
                    {location} • backed.network/{slug}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-emerald-800 flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="w-3 h-3" /> Contact: {contactMethod}
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-1.5 pt-2 border-t-2 border-slate-900/20">
                <span className="pill-header text-[10px]">Verified Statement</span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {draft.bio || 'Building resilient systems, verified capabilities, and real deliverables.'}
                </p>
              </div>

              {/* Capabilities Chips */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
                <div className="flex items-center justify-between">
                  <span className="pill-header text-[10px]">Capabilities ({capabilities.length})</span>
                  <button
                    type="button"
                    onClick={() => setActivePage('onboarding-capabilities')}
                    className="text-[11px] font-mono font-black text-slate-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="bg-yellow-300 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Proof Preview Card */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
                <div className="flex items-center justify-between">
                  <span className="pill-header text-[10px]">Proof Artifacts ({proofList.length})</span>
                  <button
                    type="button"
                    onClick={() => setActivePage('onboarding-proof')}
                    className="text-[11px] font-mono font-black text-slate-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Add Proof
                  </button>
                </div>
                {proofList.length === 0 ? (
                  <p className="text-xs font-bold text-slate-600 italic">No proof artifacts attached yet (optional).</p>
                ) : (
                  <div className="space-y-2">
                    {proofList.map((p) => (
                      <div
                        key={p.id}
                        className="bg-emerald-50 p-3 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="stamp-verified text-[9px] py-0.5 px-2">★ PROOF ATTACHED ★</span>
                          <span className="text-[10px] font-mono font-black text-slate-600">{p.dateHappened}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900">{p.title}</h4>
                        <p className="text-[11px] font-mono font-bold text-slate-600 truncate">{p.linkOrFile}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Publish Button & Back Controls */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage('onboarding-proof')}
                  className="w-1/3 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-900 shrink-0" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={!isMinimumCredibleMet}
                  onClick={handlePublish}
                  className={`w-2/3 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-base border-2 border-slate-900 transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    isMinimumCredibleMet
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-[4px_4px_0px_0px_#059669] cursor-pointer'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>{isMinimumCredibleMet ? 'Looks good, publish live' : 'Fulfill 3 Criteria to Publish'}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActivePage(isBusiness ? 'onboarding-basics-business' : 'onboarding-basics')}
                  className="text-xs font-mono font-black text-slate-700 hover:text-slate-900 underline cursor-pointer"
                >
                  Keep editing details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
