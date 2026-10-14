import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Paperclip, 
  Trash2, Bell, Shield, Eye, Check, RefreshCw, Zap, Flag, Ban
} from 'lucide-react';
import { subscribeToAdminReportsChannel } from '../lib/realtime';
import { dbStore } from '../lib/dbStore';

export default function AdminReportsPage({ setActivePage, onOpenEvidence }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveToast, setLiveToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadReports = async () => {
    try {
      const data = await dbStore.getReports();
      setReports(data || []);
    } catch (err) {
      console.warn("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    const unsubStore = dbStore.onSync(loadReports);
    const unsubRealtime = subscribeToAdminReportsChannel((newReport) => {
      loadReports();
      setLiveToast(`New moderation report filed for ${newReport.target_slug || 'a page'}!`);
      setTimeout(() => setLiveToast(null), 4000);
    });

    return () => {
      unsubStore();
      if (typeof unsubRealtime === 'function') unsubRealtime();
    };
  }, []);

  const handleModerate = async (reportId, action) => {
    setActionLoading(reportId + action);
    try {
      await dbStore.moderateReport(reportId, action);
      setLiveToast(`Report #${reportId.slice(0, 8)} successfully resolved with action: ${action.toUpperCase()}`);
      await loadReports();
    } catch (err) {
      alert(`Moderation failed: ${err.message}`);
    } finally {
      setActionLoading(null);
      setTimeout(() => setLiveToast(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Realtime WebSocket Incoming Report Alert */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-300 text-slate-900 p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3 font-black text-sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-900 fill-slate-900" />
              <span>{liveToast}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg uppercase">
              REAL-TIME MODERATION
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
            {reports.length} TICKETS IN DATABASE
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <span>Community Moderation Queue</span>
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Review and resolve flagged content, inquiries, and user reports in real time.
          </p>
        </div>

        {/* Reports List */}
        <div className="space-y-4 pt-2">
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-900 rounded-2xl space-y-2">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-black text-slate-900">Moderation queue is empty.</p>
              <p className="text-xs font-bold text-slate-600">No open reports or policy flags in the database.</p>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-red-50 p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-900 uppercase bg-red-200 px-2.5 py-0.5 rounded border border-slate-900">
                      Target: {rep.target_slug}
                    </span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase border ${
                      rep.status === 'dismissed' ? 'bg-slate-200 text-slate-700 border-slate-400' :
                      rep.status === 'taken_down' ? 'bg-red-600 text-white border-red-900' :
                      rep.status === 'warned' ? 'bg-amber-200 text-amber-900 border-amber-900' :
                      'bg-yellow-200 text-yellow-900 border-yellow-900'
                    }`}>
                      Status: {rep.status || 'pending'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {rep.created_at ? new Date(rep.created_at).toLocaleString() : 'Recent'}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900">Reason: {rep.reason}</h4>
                {rep.details && <p className="text-xs text-slate-700 font-medium italic">"{rep.details}"</p>}
                <p className="text-xs font-bold text-slate-600">Reporter: {rep.reporter || 'Public Visitor'}</p>

                {rep.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <button
                      type="button"
                      disabled={Boolean(actionLoading)}
                      onClick={() => handleModerate(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                    >
                      Dismiss Report
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(actionLoading)}
                      onClick={() => handleModerate(rep.id, 'warn')}
                      className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                    >
                      Issue Warning
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(actionLoading)}
                      onClick={() => handleModerate(rep.id, 'takedown')}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Take Down Profile</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
