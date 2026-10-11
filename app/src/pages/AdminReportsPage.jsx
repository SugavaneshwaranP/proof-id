import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Paperclip, 
  Trash2, Bell, Shield, Eye, Check, RefreshCw, Zap
} from 'lucide-react';
import { subscribeToAdminReportsChannel } from '../lib/realtime';
import { dbStore } from '../lib/dbStore';

export default function AdminReportsPage({ setActivePage, onOpenEvidence }) {
  const [reports, setReports] = useState(() => dbStore.getReports());
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    const load = () => setReports(dbStore.getReports());
    load();
    const unsubStore = dbStore.onSync(load);
    const unsubRealtime = subscribeToAdminReportsChannel((newReport) => {
      load();
      setLiveToast(`New moderation report filed for ${newReport.target_slug || 'a page'}!`);
      setTimeout(() => setLiveToast(null), 4000);
    });

    return () => {
      unsubStore();
      if (typeof unsubRealtime === 'function') unsubRealtime();
    };
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Realtime WebSocket Incoming Report Alert */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-300 text-slate-900 p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3 font-black text-sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-900 fill-slate-900 animate-bounce" />
              <span>{liveToast}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg uppercase">
              REAL-TIME MODERATION QUEUE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="dossier-clip relative top-0 left-0">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase font-mono font-black">ADMIN MODERATION QUEUE</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-slate-600">
            {reports.length} TICKETS
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <span>“Admin Moderation & Audit Queue”</span>
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Real-time audit log of flagged claims and user reports.
          </p>
        </div>

        {/* Reports List */}
        <div className="space-y-4 pt-2">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-red-50 p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-slate-900 uppercase bg-red-200 px-2.5 py-0.5 rounded border border-slate-900">
                  Target: {rep.target_slug}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {new Date(rep.created_at).toLocaleDateString()}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900">Reason: {rep.reason}</h4>
              <p className="text-xs font-bold text-slate-700">Reporter: {rep.reporter || 'System Audit'}</p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Review ticket #${rep.id} closed.`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                >
                  Mark Reviewed
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
