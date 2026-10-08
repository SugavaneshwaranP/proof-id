import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Shield, Link2, Calendar, 
  CheckCircle2, Clock, UserCheck, AlertTriangle, Eye, Sparkles, Filter, Trash2
} from 'lucide-react';

export default function DashboardEvidencePage({ setActivePage, onOpenEvidence }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [proofItems, setProofItems] = useState([
    {
      id: 1,
      title: 'Rust Enterprise System Certification',
      issuer: 'Linux Foundation / CNCF',
      date: 'Oct 2025',
      status: 'Confirmed',
      attachedTo: 'Rust Architecture',
      link: 'https://cncf.io/verify/rust-9921'
    },
    {
      id: 2,
      title: 'ISO 9001 Precision Machining Audit',
      issuer: 'TÜV SÜD Quality Bureau',
      date: 'Aug 2025',
      status: 'Waiting',
      attachedTo: 'Steel Fabrication',
      link: 'https://tuv.com/cert/9001-cnc'
    },
    {
      id: 3,
      title: 'E-commerce API Integration Artifacts',
      issuer: 'Self-Reported Project',
      date: 'June 2025',
      status: 'Added by you',
      attachedTo: 'Backend Systems',
      link: 'https://github.com/alexrivera/bakery-storefront'
    },
    {
      id: 4,
      title: 'Legacy AWS Cloud Architect Seal (2022)',
      issuer: 'Amazon Web Services',
      date: 'Jan 2022',
      status: 'Expired',
      attachedTo: 'DevOps & Kubernetes',
      link: 'https://aws.amazon.com/verify/expired-99'
    }
  ]);

  const filteredItems = proofItems.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-200 text-emerald-900 border-slate-900';
      case 'Waiting':
        return 'bg-amber-200 text-amber-900 border-slate-900';
      case 'Added by you':
        return 'bg-sky-200 text-sky-900 border-slate-900';
      case 'Expired':
        return 'bg-red-200 text-red-900 border-slate-900';
      default:
        return 'bg-slate-200 text-slate-900 border-slate-900';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Waiting': return <Clock className="w-3.5 h-3.5 text-amber-700" />;
      case 'Added by you': return <UserCheck className="w-3.5 h-3.5 text-sky-700" />;
      case 'Expired': return <AlertTriangle className="w-3.5 h-3.5 text-red-700" />;
      default: return null;
    }
  };

  const handleRemoveProof = (id) => {
    setProofItems(proofItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>EVIDENCE REPOSITORY DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Verified Credentials
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Your proof”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Every certificate, project and document that backs up what you say.
          </p>
        </div>

        {/* Status Filter Badges & Add Proof Action */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
            {['All', 'Confirmed', 'Waiting', 'Added by you', 'Expired'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_0px_#059669]'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                • {status}
              </button>
            ))}
          </div>

          {/* Add Proof Button */}
          <button
            type="button"
            onClick={() => setActivePage('onboarding-proof')}
            className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_0px_#059669] transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add proof</span>
          </button>
        </div>

        {/* Filterable Proof Grid */}
        <div className="pt-6 space-y-4">
          <div className="text-xs font-mono font-black text-slate-900 uppercase flex items-center justify-between">
            <span>EVIDENCE ARTIFACTS ({filteredItems.length})</span>
            <span className="text-[10px] font-mono text-slate-700">FILTER: {activeFilter.toUpperCase()}</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Shield className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-base font-black text-slate-900">Nothing here yet.</p>
              <p className="text-xs font-bold text-slate-700">Proof is what turns a claim into a fact.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${getStatusBadgeStyle(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span>{item.status}</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{item.date}</span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 tracking-tight pt-1">{item.title}</h4>
                      <p className="text-xs font-mono font-bold text-slate-600">Issued by: {item.issuer}</p>

                      {/* Attach-To Selector Display */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-900 text-xs font-mono font-bold text-slate-700 space-y-1">
                        <span className="text-[10px] font-black text-slate-500 block uppercase">ATTACHED TO SKILL / PRODUCT:</span>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">{item.attachedTo}</span>
                          <span className="text-[10px] text-emerald-700 underline cursor-pointer">Change</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t-2 border-slate-900/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenEvidence) {
                            onOpenEvidence({
                              title: item.title,
                              type: item.status,
                              issuer: item.issuer,
                              date: item.date,
                              link: item.link
                            });
                          }
                        }}
                        className="text-xs font-mono font-black text-slate-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveProof(item.id)}
                        className="p-1.5 rounded-lg border border-red-900 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
