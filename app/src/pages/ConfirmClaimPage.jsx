import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, XCircle, Paperclip, MessageSquare, 
  ArrowRight, Shield, Sparkles, Check, X, Zap
} from 'lucide-react';
import { confirmVerificationClaim } from '../lib/supabaseClient';
import { dbStore } from '../lib/dbStore';

export default function ConfirmClaimPage({ 
  token = 'token-99281', 
  requesterName = 'Alex Rivera', 
  claimText = 'I built the checkout flow and zero-knowledge auth system for this project.',
  setActivePage 
}) {
  const [note, setNote] = useState('');
  const [submittedState, setSubmittedState] = useState(null); // 'confirmed' | 'declined' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await confirmVerificationClaim(token, 'accurate', note);
      dbStore.updateEvidenceStatus(token, 'verified', note);
      setSubmittedState('confirmed');
    } catch (err) {
      dbStore.updateEvidenceStatus(token, 'verified', note);
      setSubmittedState('confirmed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    try {
      await confirmVerificationClaim(token, 'declined', note);
      dbStore.updateEvidenceStatus(token, 'declined', note);
      setSubmittedState('declined');
    } catch (err) {
      dbStore.updateEvidenceStatus(token, 'declined', note);
      setSubmittedState('declined');
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
          PRIVATE VERIFIER ACCESS LINK
        </span>
        <span className="text-xs font-mono font-bold text-slate-600">TOKEN: {token}</span>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>VERIFICATION RESPONSE DOSSIER</span>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Peer Confirmation Request
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
            “{requesterName} wants you to confirm something”
          </h1>
        </div>

        {/* THANK-YOU STATE */}
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
              {requesterName} will see your confirmation status on their Backed page.
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
                className="text-xs font-mono font-black text-slate-900 underline hover:text-emerald-800"
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
                CLAIM DETAILS FOR VERIFICATION
              </span>
              <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                They say: <span className="font-black underline font-mono text-emerald-800">“{claimText}”</span>
              </p>
              <p className="text-xs font-mono font-bold text-slate-600">
                Does that match what you remember?
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
                placeholder="Add a brief note or endorsement (e.g. 'Alex worked on this project from June to Dec 2025')..."
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
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>• Yes, that’s accurate</span>
              </button>

              {/* Decline Button */}
              <button
                type="button"
                onClick={handleDecline}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-red-50 text-slate-900 font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_#991b1b] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4 text-red-600" />
                <span>• No, that’s not right</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
