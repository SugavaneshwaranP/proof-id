import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Shield, Link2, Calendar, 
  CheckCircle2, Clock, UserCheck, AlertTriangle, Eye, Sparkles, Filter, Trash2, Copy, Check
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardEvidencePage({ setActivePage, onOpenEvidence }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'alexrivera';

  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering Work');
  const [verifierName, setVerifierName] = useState('');
  const [verifierNote, setVerifierNote] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  useEffect(() => {
    const load = () => setEvidenceList(dbStore.getEvidence(slug));
    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, [slug]);

  const handleAddProof = (e) => {
    e.preventDefault();
    if (!title) return;

    dbStore.addEvidence(slug, {
      title,
      category,
      verifier_name: verifierName || 'Peer Verifier',
      verifier_note: verifierNote,
    });

    setTitle('');
    setVerifierName('');
    setVerifierNote('');
    setShowAddModal(false);
  };

  const handleCopyLink = (token) => {
    const verifUrl = `${window.location.origin}/confirm-claim?token=${token}`;
    navigator.clipboard.writeText(verifUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="dossier-clip relative top-0 left-0">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase font-mono font-black">PROOF & EVIDENCE CARDS</span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-300 hover:bg-emerald-400 border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>Add New Proof</span>
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            “Your Verified Evidence Portfolio”
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Cryptographically and peer-confirmed artifacts for backed.network/{slug}
          </p>
        </div>

        {/* Evidence List Grid */}
        <div className="space-y-4 pt-2">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="bg-[#fef9c3] p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-900 text-[10px] font-mono font-black text-slate-900 uppercase">
                    {item.category}
                  </span>
                  <span className="stamp-verified text-[10px] py-0.5 px-2">
                    ★ {item.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                
                {item.verifier_note && (
                  <p className="text-xs font-bold text-slate-800 italic bg-white p-2.5 rounded-xl border border-slate-900/40">
                    "{item.verifier_note}"
                  </p>
                )}

                <p className="text-[11px] font-mono font-bold text-slate-600">
                  Verifier: {item.verifier_name || 'Pending Peer Verification'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyLink(item.verifier_token)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 text-xs font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Copy verifier access link"
                >
                  {copiedToken === item.verifier_token ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken === item.verifier_token ? 'Link Copied!' : 'Copy Verifier Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenEvidence && onOpenEvidence(item)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white cursor-pointer"
                  title="Inspect Proof Card"
                >
                  <Eye className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ADD PROOF MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Add New Proof Badge</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg border-2 border-slate-900 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddProof} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-black uppercase block mb-1">Claim Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Architected Sub-10ms Canvas Grid Engine"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-black uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Engineering Work">Engineering Work</option>
                    <option value="Certification">Certification</option>
                    <option value="Security & Crypto">Security & Crypto</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Aerospace & Defense">Aerospace & Defense</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-black uppercase block mb-1">Verifier Name / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g., Marcus Vance (VP Engineering)"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-black uppercase block mb-1">Verifier Note / Endorsement</label>
                  <textarea
                    rows={3}
                    placeholder="Brief endorsement or verification context..."
                    value={verifierNote}
                    onChange={(e) => setVerifierNote(e.target.value)}
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-300" />
                  <span>Create Proof Badge</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
