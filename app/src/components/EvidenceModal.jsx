import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ExternalLink, Calendar, User, Lock, Award, Paperclip, CheckCircle2 } from 'lucide-react';

export default function EvidenceModal({ isOpen, onClose, evidence }) {
  if (!isOpen || !evidence) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl dossier-card rounded-3xl p-6 sm:p-8 border-2 border-blue-500/40 shadow-2xl overflow-hidden"
        >
          {/* Top Metallic Clip */}
          <div className="dossier-clip">
            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL PROOF FILE #{evidence.id || 'EV-9402'}</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Stamp Header */}
          <div className="flex items-start gap-4 mb-6 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 ring-2 ring-blue-400/30">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="dossier-stamp">
                  ★ VERIFIED CLAIM ★
                </span>
                <span className="dossier-pill-proof font-mono">
                  {evidence.type || 'Proof Document'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white pt-1">{evidence.title}</h3>
            </div>
          </div>

          {/* Detailed Verification Information */}
          <div className="space-y-4 text-sm mb-6">
            
            <div className="bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-4 h-4 text-blue-400" />
                  Verifier Relationship:
                </span>
                <span className="text-slate-200 font-bold">{evidence.relationship || 'VP of Engineering / Auditor'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Verification Date:
                </span>
                <span className="text-slate-200 font-bold">{evidence.date || '2026-09-15'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  RLS Isolation:
                </span>
                <span className="text-emerald-400 font-bold">100% Kernel Enforced</span>
              </div>
            </div>

            {/* Scope Statement */}
            <div className="space-y-1.5">
              <span className="dossier-pill-bio">Exact Verified Scope:</span>
              <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl text-slate-200 italic text-xs leading-relaxed">
                "{evidence.scope || 'Verified architectural contribution, component primitives design, and migration implementation on production repository.'}"
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-sm font-semibold"
            >
              Close Dossier
            </button>
            {evidence.url && (
              <a
                href={evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all border border-blue-400/30"
              >
                <span>Inspect Source Proof</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
