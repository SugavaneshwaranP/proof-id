import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Send, User, Mail, Shield, 
  CheckCircle2, Clock, XCircle, Sparkles, RefreshCw, Trash2, Check, AlertCircle
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardVerificationsPage({ setActivePage }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const slug = currentUser?.slug || '';

  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  const [requests, setRequests] = useState([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const [verifierEmail, setVerifierEmail] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) setCurrentUser(u);
    const activeSlug = u?.slug || slug;

    const loadData = async () => {
      if (!activeSlug) return;
      const evs = dbStore.getEvidence(activeSlug);
      setEvidenceList(evs);
      if (evs.length > 0 && !selectedEvidenceId) {
        setSelectedEvidenceId(evs[0].id);
      }
      try {
        const reqs = await dbStore.getVerificationRequests(activeSlug);
        setRequests(reqs);
      } catch (err) {
        console.warn("Failed to load verification requests:", err);
      }
    };

    loadData();
    const unsub = dbStore.onSync(loadData);
    return () => unsub();
  }, [slug]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!verifierName.trim() || !verifierEmail.trim() || !selectedEvidenceId) {
      setFeedback({ type: 'error', message: 'Please select an evidence item and enter verifier details.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      await dbStore.requestVerification(slug, {
        evidenceId: selectedEvidenceId,
        verifierName: verifierName.trim(),
        verifierEmail: verifierEmail.trim(),
        note: note.trim(),
      });

      setFeedback({ type: 'success', message: `Verification request successfully dispatched to ${verifierEmail.trim()}!` });
      setVerifierName('');
      setVerifierEmail('');
      setNote('');

      // Refresh requests
      const freshReqs = await dbStore.getVerificationRequests(slug);
      setRequests(freshReqs);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to dispatch verification request.' });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleRemoveRequest = async (id) => {
    try {
      await dbStore.cancelVerificationRequest(slug, id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setFeedback({ type: 'success', message: 'Verification request canceled.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to cancel request.' });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
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
      
      {/* Real-time Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3 font-black text-xs ${
              feedback.type === 'success' ? 'bg-emerald-300 text-slate-900' : 'bg-red-300 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CONFIRMATION REQUESTS</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Confirmations & Recommendations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            Request Confirmations
          </h1>
          <p className="text-sm font-extrabold text-slate-800 max-w-lg mx-auto">
            Ask someone who knows your work to confirm it — a client, a colleague, a manager, or a partner.
          </p>
        </div>

        {/* New-Request Form */}
        <form onSubmit={handleSendRequest} className="space-y-4 pt-6 bg-white p-5 sm:p-6 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>SEND CONFIRMATION REQUEST</span>
          </div>

          {/* Select Proof Item */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Which work sample or skill should they confirm? *
            </label>
            {evidenceList.length === 0 ? (
              <div className="p-3 bg-amber-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>You haven't added any work samples yet.</span>
                <button
                  type="button"
                  onClick={() => setActivePage('dashboard-evidence')}
                  className="px-2.5 py-1 bg-amber-300 rounded-lg text-slate-900 font-black text-[11px] underline"
                >
                  Add Work First
                </button>
              </div>
            ) : (
              <select
                value={selectedEvidenceId}
                onChange={(e) => setSelectedEvidenceId(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                {evidenceList.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.category || 'General'}) [{ev.status === 'confirmed' ? 'CONFIRMED' : 'PENDING'}]
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Their Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-700" />
                Their name *
              </label>
              <input
                type="text"
                required
                value={verifierName}
                onChange={(e) => setVerifierName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            {/* Their Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-700" />
                Their email *
              </label>
              <input
                type="email"
                required
                value={verifierEmail}
                onChange={(e) => setVerifierEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Optional message or context
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Hi Sarah, could you please confirm my contribution to this project?"
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Send Request Button */}
          <button
            type="submit"
            disabled={loading || evidenceList.length === 0}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>{loading ? "Sending..." : "Send Confirmation Request"}</span>
          </button>
        </form>

        {/* Sent Requests List & Empty State */}
        <div className="pt-8 space-y-4">
          <div className="text-xs font-mono font-black text-slate-900 uppercase flex items-center justify-between">
            <span>SENT CONFIRMATION REQUESTS ({requests.length})</span>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black">
              <span className="text-amber-800">• Waiting</span>
              <span className="text-emerald-800">• Confirmed</span>
              <span className="text-red-800">• Declined</span>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Shield className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-black text-slate-900">No confirmation requests sent yet.</p>
              <p className="text-xs font-bold text-slate-700">A confirmation from a colleague or client builds trust and validates your profile.</p>
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
                        Sent to: <span className="text-slate-900 font-extrabold">{req.verifierName}</span> ({req.verifierEmail})
                      </p>
                      {req.note && (
                        <p className="text-xs italic text-slate-600 font-medium">"{req.note}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveRequest(req.id)}
                        className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                        title="Cancel or delete request"
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
