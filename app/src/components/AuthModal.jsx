import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, ArrowRight, User, Building2, CheckCircle2, Lock, Paperclip, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../lib/authService';
import { saveOnboardingDraft } from '../lib/onboardingDraft';

export default function AuthModal({ isOpen, onClose, defaultType = 'person', onComplete }) {
  const [step, setStep] = useState(1); // 1: Type & Email, 2: Claim Slug, 3: Success
  const [profileType, setProfileType] = useState(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleNext = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (step === 1 && email && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
      setStep(2);
    } else if (step === 2 && slug) {
      setIsSubmitting(true);
      try {
        await authService.signUp({
          fullName: name,
          email: email,
          password: password || 'SecurePass123!',
          profileType: profileType,
          slug: slug,
        });
        saveOnboardingDraft({
          profileType: profileType,
          fullName: name,
          contactMethod: email,
          slug: slug,
          stepIndex: 1
        });
        setStep(3);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to create page account.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg dossier-card rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] bg-white text-slate-900"
        >
          {/* Top Metallic Clip */}
          <div className="dossier-clip">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span>CREATE YOUR PAGE</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors border-2 border-slate-900 font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-3 mb-6 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Create Your Backed Page</h3>
              <p className="text-xs font-mono font-bold text-slate-600">Real Proof • Backed by Colleagues</p>
            </div>
          </div>

          {/* ERROR BANNER */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-slate-900 text-red-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              
              <div className="space-y-2">
                <span className="dossier-pill-bio">Select Profile Type</span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setProfileType('person')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      profileType === 'person'
                        ? 'bg-[#fbcfe8] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]'
                        : 'bg-slate-100 border-slate-900 text-slate-700'
                    }`}
                  >
                    <User className="w-6 h-6 mb-2 text-slate-900" />
                    <span className="font-black text-sm block text-slate-900">Person</span>
                    <span className="text-[11px] font-bold text-slate-700">For Individuals</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileType('business')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      profileType === 'business'
                        ? 'bg-[#ffedd5] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]'
                        : 'bg-slate-100 border-slate-900 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-6 h-6 mb-2 text-slate-900" />
                    <span className="font-black text-sm block text-slate-900">Business</span>
                    <span className="text-[11px] font-bold text-slate-700">For Companies</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                  {profileType === 'person' ? 'Your Full Name *' : 'Company Legal Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={profileType === 'person' ? 'e.g. Sarah Jenkins' : 'e.g. Acme Precision Tools LLC'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-sm shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Choose Your Web Address</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="space-y-1.5">
                <span className="dossier-pill-goal">Your Personal Web Address</span>
                <div className="flex items-center bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 mt-2">
                  <span className="text-slate-500 font-bold select-none">backed.network/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full bg-transparent text-slate-900 font-black focus:outline-none ml-1"
                  />
                </div>
                <span className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Address is available!
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-sm shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Setting up your page...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Profile Setup</span>
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-200 text-emerald-900 border-2 border-slate-900 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#0f172a]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Your Backed Page is Ready!</h4>
              <p className="text-xs text-slate-700 font-bold">
                Your Link: <span className="font-mono text-slate-900 bg-amber-200 px-2 py-0.5 rounded border border-slate-900">backed.network/{slug}</span>
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onComplete) onComplete(slug);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-sm shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 cursor-pointer"
              >
                Continue to Profile Setup
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
