import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, XCircle, Paperclip, MessageSquare, 
  ArrowRight, Shield, Sparkles, Check, X, Zap, AlertTriangle, Loader2
} from 'lucide-react';
import { confirmVerificationClaim, getClaimByToken } from '../lib/supabaseClient';
import { dbStore } from '../lib/dbStore';

export default function ConfirmClaimPage({ 
  token: initialToken, 
  requesterName: defaultRequesterName = 'A colleague', 
  claimText: defaultClaimText = 'I contributed to this project.',
  setActivePage 
}) {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const token = initialToken || urlParams?.get('token') || '';

  const [claimData, setClaimData] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(true);
  const [note, setNote] = useState('');
  const [submittedState, setSubmittedState] = useState(null); // 'confirmed' | 'declined' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadClaim() {
      if (!token) {
        setLoadingClaim(false);
        return;
      }
      try {
        const details = await getClaimByToken(token);
        if (isMounted && details) {
          setClaimData(details);
          if (details.status === 'confirmed' || details.status === 'declined') {
            setSubmittedState(details.status);
          }
        }
      } catch (err) {
        console.warn("Failed to load claim details:", err);
      } finally {
        if (isMounted) setLoadingClaim(false);
      }
    }

    loadClaim();
    return () => { isMounted = false; };
  }, [token]);

  const activeRequester = claimData?.requester_name || defaultRequesterName;
  const activeClaim = claimData?.claim_title || defaultClaimText;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await confirmVerificationClaim(token, 'accurate', note);
      if (res?.success === false) {
        setErrorMessage(res.message || 'Unable to confirm verification claim.');
      } else {
        dbStore.updateEvidenceStatus(token, 'verified', note);
        setSubmittedState('confirmed');
      }
    } catch (err) {
      console.warn("confirmVerificationClaim error:", err);
      setErrorMessage(err.message || "Failed to confirm verification with database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await confirmVerificationClaim(token, 'declined', note);
      if (res?.success === false) {
        setErrorMessage(res.message || 'Unable to record decline decision.');
      } else {
        dbStore.updateEvidenceStatus(token, 'declined', note);
        setSubmittedState('declined');
      }
    } catch (err) {
      console.warn("confirmVerificationClaim error:", err);
      setErrorMessage(err.message || "Failed to record response with database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 font-sans desk-grid-background">
      
      {/* Top Banner Status */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          SECURE CONFIRMATION LINK
        </span>
        <span className="text-xs font-mono font-bold text-slate-600">CODE: {token ? token.slice(0, 8) : 'ACTIVE'}</span>
      </div>

      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CONFIRM WORK & SKILL</span>
        </div>

        {/* Loading Indicator */}
        {loadingClaim ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-900" />
            <p className="text-xs font-mono font-black text-slate-800">
              Loading verification request...
            </p>
          </div>
        ) : (
          <>
            {/* Headline & Subhead */}
            <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
              <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
                Confirmation Request
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
                “{activeRequester} requested your confirmation”
              </h1>
              {claimData?.verifier_email && (
                <p className="text-xs font-mono font-bold text-slate-700">
                  Sent to: {claimData.verifier_email}
                </p>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-4 p-3.5 bg-red-100 border-2 border-red-900 rounded-xl flex items-center gap-2 text-xs font-bold text-red-900">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* THANK-YOU OR RESOLVED STATE */}
            {submittedState ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className={`w-20 h-20 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center ${
                  submittedState === 'confirmed' ? 'bg-emerald-300 text-slate-900' : 'bg-red-200 text-slate-900'
                }`}>
                  {submittedState === 'confirmed' ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-700" />
                  )}
                </div>

                <span className="stamp-verified text-xs py-1 px-4 inline-block">
                  {submittedState === 'confirmed' ? '★ CONFIRMATION RECORDED ★' : '★ RESPONSE RECORDED ★'}
                </span>

                <h3 className="text-2xl font-black text-slate-900">
                  {submittedState === 'confirmed' ? 'Thanks — that’s recorded.' : 'Response recorded.'}
                </h3>

                <p className="text-xs font-extrabold text-slate-800 max-w-sm mx-auto leading-relaxed">
                  {activeRequester}’s profile now shows this verified work.
                </p>

                {note && (
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 text-left max-w-sm mx-auto shadow-[3px_3px_0px_0px_#0f172a]">
                    <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">YOUR ATTACHED NOTE:</span>
                    <p className="text-xs font-bold text-slate-800 italic">"{note}"</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActivePage ? setActivePage('home') : window.location.reload()}
                    className="text-xs font-mono font-black text-slate-900 underline hover:text-emerald-800 cursor-pointer"
                  >
                    Learn more about Backed
                  </button>
                </div>
              </motion.div>
            ) : (
              /* QUESTION & FORM STATE */
              <div className="space-y-6 pt-6">
                
                {/* CONTEXT CARD */}
                <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">
                    PROJECT / SKILL TO CONFIRM
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                    They claim: <span className="font-black underline font-mono text-emerald-800">“{activeClaim}”</span>
                  </p>
                  {claimData?.claim_url && (
                    <p className="text-xs font-mono text-blue-700 truncate">
                      Link: <a href={claimData.claim_url} target="_blank" rel="noopener noreferrer" className="underline">{claimData.claim_url}</a>
                    </p>
                  )}
                  <p className="text-xs font-mono font-bold text-slate-600">
                    Does that accurately match what you know to be true?
                  </p>
                </div>

                {/* OPTIONAL FIELD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
                    Add a note (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a brief note (e.g. 'Confirmed: Worked together on this project')..."
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a] resize-none"
                  />
                </div>

                {/* BUTTONS */}
                <div className="space-y-3 pt-2">
                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>{isSubmitting ? "Saving confirmation..." : "• Yes, that’s accurate"}</span>
                  </button>

                  {/* Decline Button */}
                  <button
                    type="button"
                    onClick={handleDecline}
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-white hover:bg-red-50 disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_#991b1b] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4 text-red-600" />
                    <span>• No, that’s not right</span>
                  </button>
                </div>

              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}
