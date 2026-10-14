import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, User, Lock, Award, Paperclip } from 'lucide-react';

export default function EvidenceModal({ isOpen, onClose, evidence }) {
  if (!isOpen || !evidence) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border-3 border-emerald-400/60 shadow-[8px_8px_0px_0px_#059669] overflow-hidden my-auto max-h-[92vh] overflow-y-auto font-sans"
        >
          {/* Top Metallic Clip */}
          <div className="dossier-clip">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-mono font-black">
              VERIFIED WORK SAMPLE #{evidence.id || '9402'}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Stamp Header */}
          <div className="flex items-start gap-3.5 mb-5 pt-2">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-white flex items-center justify-center shadow-md shrink-0 ${
              evidence.status === 'verified' ? 'bg-emerald-400 text-slate-900' :
              evidence.status === 'pending' ? 'bg-amber-400 text-slate-900' :
              evidence.status === 'declined' ? 'bg-rose-500 text-white' :
              evidence.status === 'expired' ? 'bg-slate-700 text-slate-300' :
              'bg-blue-400 text-slate-900'
            }`}>
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[9px] font-mono font-black uppercase py-0.5 px-2 rounded-md border ${
                  evidence.status === 'verified' ? 'bg-emerald-500 text-slate-950 border-emerald-300' :
                  evidence.status === 'pending' ? 'bg-amber-400 text-slate-950 border-amber-300' :
                  evidence.status === 'declined' ? 'bg-rose-900 text-rose-200 border-rose-600' :
                  evidence.status === 'expired' ? 'bg-slate-800 text-slate-400 border-slate-600' :
                  'bg-blue-900 text-blue-200 border-blue-600'
                }`}>
                  {evidence.status === 'verified' ? '★ CONFIRMED ★' :
                   evidence.status === 'pending' ? '⏳ PENDING CONFIRMATION' :
                   evidence.status === 'declined' ? '✕ DECLINED' :
                   evidence.status === 'expired' ? '⚠️ EXPIRED' :
                   '📝 SELF-SUBMITTED'}
                </span>
                <span className="text-[10px] font-mono font-black bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 uppercase">
                  {evidence.category || evidence.type || 'Work Sample'}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white pt-1 break-words">
                {evidence.title}
              </h3>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-4 text-xs sm:text-sm mb-6">
            <div className="bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Confirmed By:
                </span>
                <span className="text-slate-200 font-bold truncate ml-2">
                  {evidence.verifier_name || 'Colleague / Client'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Confirmed On:
                </span>
                <span className="text-slate-200 font-bold">
                  {evidence.created_at ? evidence.created_at.split('T')[0] : 'Recent'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Security Status:
                </span>
                <span className="text-emerald-400 font-bold">Verified & Protected</span>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider block">
                Confirmation Note:
              </span>
              <div className="p-3.5 sm:p-4 bg-slate-950/60 border border-slate-700 rounded-2xl text-slate-200 italic text-xs leading-relaxed">
                "{evidence.verifier_note || evidence.scope || 'Confirmed contribution and successful project completion.'}"
              </div>
            </div>

            {/* Freshness Notice */}
            {evidence.changed_since_verification && (
              <div className="p-3 bg-amber-950/50 border border-amber-500/60 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span><strong>Notice:</strong> This profile was updated after this confirmation was recorded.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-xs sm:text-sm font-semibold cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Close
            </button>
            {(evidence.file_url || evidence.url) && (
              <a
                href={evidence.file_url || evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                <span>View Project / File</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
