import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Send, User, Mail, Shield, 
  CheckCircle2, Clock, XCircle, Sparkles, RefreshCw, Trash2
} from 'lucide-react';

export default function DashboardVerificationsPage({ setActivePage }) {
  const [selectedProof, setSelectedProof] = useState('Rust Enterprise System Certification');
  const [verifierName, setVerifierName] = useState('');
  const [verifierEmail, setVerifierEmail] = useState('');

  const [requests, setRequests] = useState([
    {
      id: 1,
      proofTitle: 'Rust Enterprise System Certification',
      verifierName: 'Dr. Sarah Jenkins',
      verifierEmail: 's.jenkins@cncf.org',
      dateSent: 'Oct 5, 2026',
      status: 'Confirmed'
    },
    {
      id: 2,
      proofTitle: 'ISO 9001 Precision Machining Audit',
      verifierName: 'Marcus Vance',
      verifierEmail: 'm.vance@tuv-sud.de',
      dateSent: 'Oct 7, 2026',
      status: 'Waiting'
    },
    {
      id: 3,
      title: 'Legacy AWS Cloud Architect Seal',
      proofTitle: 'Legacy AWS Cloud Architect Seal',
      verifierName: 'Tech Audit Team',
      verifierEmail: 'cert-verify@aws.amazon.com',
      dateSent: 'Sept 20, 2026',
      status: 'Declined'
    }
  ]);

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!verifierName || !verifierEmail) return;

    const newReq = {
      id: Date.now(),
      proofTitle: selectedProof,
      verifierName,
      verifierEmail,
      dateSent: 'Just now',
      status: 'Waiting'
    };

    setRequests([newReq, ...requests]);
    setVerifierName('');
    setVerifierEmail('');
  };

  const handleRemoveRequest = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-200 text-emerald-900 border-slate-900';
      case 'Waiting':
        return 'bg-amber-200 text-amber-900 border-slate-900';
      case 'Declined':
        return 'bg-red-200 text-red-900 border-slate-900';
      default:
        return 'bg-slate-200 text-slate-900 border-slate-900';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Waiting': return <Clock className="w-3.5 h-3.5 text-amber-700" />;
      case 'Declined': return <XCircle className="w-3.5 h-3.5 text-red-700" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>VERIFICATION REQUESTS DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Peer & Issuer Proof
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Get verified”
          </h1>
          <p className="text-sm font-extrabold text-slate-800 max-w-lg mx-auto">
            Ask someone who knows your work to confirm it — a client, a manager, an issuing body.
          </p>
        </div>

        {/* New-Request Form */}
        <form onSubmit={handleSendRequest} className="space-y-4 pt-6 bg-white p-5 sm:p-6 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>SEND NEW VERIFICATION REQUEST</span>
          </div>

          {/* Select Proof Item */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              What should they confirm?
            </label>
            <select
              value={selectedProof}
              onChange={(e) => setSelectedProof(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <option value="Rust Enterprise System Certification">Rust Enterprise System Certification</option>
              <option value="ISO 9001 Precision Machining Audit">ISO 9001 Precision Machining Audit</option>
              <option value="E-commerce API Integration Artifacts">E-commerce API Integration Artifacts</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Their Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-700" />
                Their name
              </label>
              <input
                type="text"
                required
                value={verifierName}
                onChange={(e) => setVerifierName(e.target.value)}
                placeholder="Who you’re asking"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            {/* Their Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-700" />
                Their email
              </label>
              <input
                type="email"
                required
                value={verifierEmail}
                onChange={(e) => setVerifierEmail(e.target.value)}
                placeholder="Where we’ll send the request"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          {/* Send Request Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Send request</span>
          </button>
        </form>

        {/* Sent Requests List & Empty State */}
        <div className="pt-8 space-y-4">
          <div className="text-xs font-mono font-black text-slate-900 uppercase flex items-center justify-between">
            <span>SENT REQUESTS ({requests.length})</span>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black">
              <span className="text-amber-800">• Waiting</span>
              <span className="text-emerald-800">• Confirmed</span>
              <span className="text-red-800">• Declined</span>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Shield className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-black text-slate-900">No requests yet.</p>
              <p className="text-xs font-bold text-slate-700">A single confirmation can make your whole page more convincing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {requests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${getStatusStyle(req.status)}`}>
                          {getStatusIcon(req.status)}
                          <span>• {req.status}</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{req.dateSent}</span>
                      </div>

                      <h4 className="text-base font-black text-slate-900">{req.proofTitle}</h4>
                      <p className="text-xs font-mono font-bold text-slate-700">
                        Asked: <span className="text-slate-900 font-extrabold">{req.verifierName}</span> ({req.verifierEmail})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'Waiting' && (
                        <button
                          type="button"
                          onClick={() => alert(`Resent verification email to ${req.verifierEmail}`)}
                          className="px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-mono font-black bg-amber-200 hover:bg-amber-300 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveRequest(req.id)}
                        className="p-1.5 rounded-xl border border-slate-300 text-slate-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
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
