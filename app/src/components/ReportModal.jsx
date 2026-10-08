import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X, CheckCircle2, Send, AlertTriangle } from 'lucide-react';

import { broadcastAdminReport } from '../lib/realtime';

export default function ReportModal({ isOpen, onClose, targetPage = 'backed.app/alexrivera' }) {
  const [selectedReason, setSelectedReason] = useState('Fake or misleading proof');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Broadcast report in real-time to admin:reports channel
    broadcastAdminReport({
      id: Date.now(),
      page: targetPage,
      reason: selectedReason,
      details: details || 'No additional details provided.',
      reportedOn: 'Just now',
      status: 'Pending Review'
    });

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const reportOptions = [
    'Pretending to be someone else',
    'Fake or misleading proof',
    'Inappropriate content',
    'Something else'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#fef08a] rounded-3xl border-3 border-slate-900 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 relative"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/40 pb-3">
          <span className="pill-header text-[10px] bg-red-200 text-slate-900">
            Trust & Safety Audit
          </span>
          <button onClick={onClose} className="p-1 hover:bg-slate-900/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] mx-auto flex items-center justify-center text-red-600 mb-2">
            <Flag className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">“Report this page”</h3>
          <p className="text-xs font-extrabold text-slate-800">
            Tell us what’s wrong. We’ll take a look.
          </p>
        </div>

        {/* CONFIRMATION STATE */}
        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h4 className="text-lg font-black text-slate-900">
              Thanks for flagging this. Our team will review it.
            </h4>
            <p className="text-xs font-bold text-slate-700 font-mono">
              Report ID #REP-{Math.floor(1000 + Math.random() * 9000)}
            </p>
          </div>
        ) : (
          /* OPTIONS & FORM */
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            {/* Reason Select */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                Select Reason
              </label>
              <div className="space-y-2">
                {reportOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-xs font-black ${
                      selectedReason === opt
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#059669]'
                        : 'bg-white text-slate-900 border-slate-900/40 hover:border-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={opt}
                      checked={selectedReason === opt}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="accent-slate-900"
                    />
                    <span>• {opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Field */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                Add details (optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Specify what artifact or claim looks suspicious..."
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Submit report</span>
            </button>

          </form>
        )}

      </motion.div>
    </div>
  );
}
