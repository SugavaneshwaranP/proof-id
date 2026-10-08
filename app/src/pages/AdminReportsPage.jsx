import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Paperclip, 
  Trash2, Bell, Shield, Eye, Check, RefreshCw 
} from 'lucide-react';

export default function AdminReportsPage({ setActivePage, onOpenEvidence }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [reports, setReports] = useState([
    {
      id: 101,
      page: 'backed.app/fake-dev-99',
      reason: 'Fake or misleading proof',
      reportedOn: 'Oct 8, 2026',
      status: 'Pending Review',
      details: 'Attached ISO 9001 certificate belongs to a different firm.'
    },
    {
      id: 102,
      page: 'backed.app/impostor-corp',
      reason: 'Pretending to be someone else',
      reportedOn: 'Oct 6, 2026',
      status: 'Warned',
      details: 'Using trademarked brand logos without authorization.'
    },
    {
      id: 103,
      page: 'backed.app/spam-link-20',
      reason: 'Inappropriate content',
      reportedOn: 'Oct 2, 2026',
      status: 'Dismissed',
      details: 'False positive flag submitted by competitor.'
    }
  ]);

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'Pending') return r.status === 'Pending Review';
    if (activeFilter === 'Warned') return r.status === 'Warned';
    if (activeFilter === 'Dismissed') return r.status === 'Dismissed';
    return true;
  });

  const handleDismiss = (id) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'Dismissed' } : r));
  };

  const handleWarn = (id) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'Warned' } : r));
    alert('Warning email sent to profile owner.');
  };

  const handleTakeDown = (id) => {
    setReports(reports.filter((r) => r.id !== id));
    alert('Page taken down and unlisted from public discovery.');
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>ADMIN MODERATION DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-red-200 text-slate-900">
            Platform Moderation
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Reports”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Where the team reviews pages people have flagged.
          </p>
        </div>

        {/* Status Filters Bar */}
        <div className="pt-6 flex items-center justify-between gap-4 border-b-2 border-slate-900/20 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Warned', 'Dismissed'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_0px_#059669]'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                • {filter}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono font-black text-slate-700 uppercase">
            {filteredReports.length} REPORTS LISTED
          </span>
        </div>

        {/* Reports Table & Empty State */}
        <div className="pt-6">
          {filteredReports.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border-3 border-dashed border-slate-900 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">Nothing to review right now.</h3>
              <p className="text-xs font-extrabold text-slate-700">All flagged pages have been moderated.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono text-xs font-black uppercase border-b-2 border-slate-900">
                      <th className="p-4">Page</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4">Reported on</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-900/10 text-xs font-bold text-slate-900">
                    <AnimatePresence>
                      {filteredReports.map((report) => (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-amber-50 transition-colors"
                        >
                          <td className="p-4 font-mono font-black text-slate-900">
                            {report.page}
                          </td>
                          <td className="p-4">
                            <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-slate-900 font-extrabold">
                              {report.reason}
                            </span>
                            <p className="text-[11px] text-slate-600 font-normal pt-1">{report.details}</p>
                          </td>
                          <td className="p-4 font-mono text-slate-600">
                            {report.reportedOn}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-black ${
                              report.status === 'Pending Review' ? 'bg-red-200 text-red-900 border-slate-900' :
                              report.status === 'Warned' ? 'bg-amber-200 text-amber-900 border-slate-900' :
                              'bg-slate-200 text-slate-700 border-slate-900'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              
                              {/* Dismiss */}
                              <button
                                type="button"
                                onClick={() => handleDismiss(report.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-900 bg-white hover:bg-slate-100 text-[11px] font-mono font-black shadow-[1px_1px_0px_0px_#0f172a]"
                              >
                                Dismiss
                              </button>

                              {/* Warn owner */}
                              <button
                                type="button"
                                onClick={() => handleWarn(report.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-900 bg-amber-300 hover:bg-amber-400 text-slate-900 text-[11px] font-mono font-black shadow-[1px_1px_0px_0px_#0f172a]"
                              >
                                Warn owner
                              </button>

                              {/* Take page down */}
                              <button
                                type="button"
                                onClick={() => handleTakeDown(report.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-900 bg-red-600 hover:bg-red-700 text-white text-[11px] font-mono font-black shadow-[1px_1px_0px_0px_#0f172a]"
                              >
                                Take page down
                              </button>

                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
