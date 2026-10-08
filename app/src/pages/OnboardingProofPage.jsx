import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Paperclip, Plus, Link2, Calendar, FileText, Upload, CheckCircle2, Shield, Trash2 } from 'lucide-react';

export default function OnboardingProofPage({ setActivePage, onAddProof }) {
  const [title, setTitle] = useState('');
  const [linkOrFile, setLinkOrFile] = useState('');
  const [dateHappened, setDateHappened] = useState('');
  const [proofList, setProofList] = useState([
    {
      id: 1,
      title: 'E-commerce site for a local bakery',
      linkOrFile: 'https://github.com/alexrivera/bakery-storefront',
      dateHappened: 'June 2025',
      type: 'Project Artifact'
    }
  ]);

  const handleAddProof = (e) => {
    e.preventDefault();
    if (!title || !linkOrFile) return;

    const newProof = {
      id: Date.now(),
      title,
      linkOrFile,
      dateHappened: dateHappened || 'Recent',
      type: linkOrFile.includes('http') ? 'External Link' : 'Uploaded Artifact'
    };

    setProofList([newProof, ...proofList]);
    if (onAddProof) onAddProof(newProof);

    setTitle('');
    setLinkOrFile('');
    setDateHappened('');
  };

  const handleRemoveProof = (id) => {
    setProofList(proofList.filter((item) => item.id !== id));
  };

  const handleContinue = () => {
    setActivePage('onboarding-preview');
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Onboarding Progress Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-slate-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            FINAL STEP — PROOF COLLECTION
          </span>
          <span className="text-emerald-700 font-extrabold">100% READY</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-full transition-all duration-500 rounded-full" />
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>EVIDENCE DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Real Evidence
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Now, back it up”
          </h1>
          <p className="text-sm font-extrabold text-slate-800 max-w-md mx-auto leading-relaxed">
            Add a project, a certificate, or a link that shows you really do this. One is enough to start.
          </p>
        </div>

        {/* Upload / Link Form */}
        <form onSubmit={handleAddProof} className="space-y-4 pt-6 bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>ATTACH PROOF ITEM</span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Verifiable
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. “E-commerce site for a local bakery”'
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Link or File */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Link or file
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-grow flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
                <Link2 className="w-4 h-4 text-slate-500 ml-3 mr-1" />
                <input
                  type="text"
                  required
                  value={linkOrFile}
                  onChange={(e) => setLinkOrFile(e.target.value)}
                  placeholder="Paste a link or upload a file"
                  className="w-full bg-transparent px-2 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setLinkOrFile('https://proof.backed.app/sample-doc.pdf')}
                className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs px-3 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Simulate File</span>
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Date
            </label>
            <div className="flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
              <Calendar className="w-4 h-4 text-slate-500 ml-3 mr-1" />
              <input
                type="text"
                value={dateHappened}
                onChange={(e) => setDateHappened(e.target.value)}
                placeholder="When this happened (e.g. 2025 or October 2024)"
                className="w-full bg-transparent px-2 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Add Proof Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add proof</span>
          </button>
        </form>

        {/* Evidence List & Empty State */}
        <div className="pt-6 space-y-3">
          <div className="text-xs font-mono font-black text-slate-900 uppercase">
            ATTACHED PROOF ITEMS ({proofList.length})
          </div>

          {proofList.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-1">
              <Shield className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs font-extrabold text-slate-800">
                A page with proof gets noticed. A page without it is just a claim.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence>
                {proofList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="stamp-verified text-[9px] py-0.5 px-2">★ VERIFIED PROOF ★</span>
                        <span className="text-[10px] font-mono font-extrabold text-slate-600 uppercase">{item.type}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs font-mono font-bold text-slate-600 truncate">{item.linkOrFile} • {item.dateHappened}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProof(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Continue & Skip Link */}
        <div className="pt-8 space-y-3 text-center">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 text-emerald-300" />
          </button>

          <div>
            <button
              type="button"
              onClick={() => setActivePage('explorer')}
              className="text-xs font-mono font-black text-slate-800 hover:text-slate-900 underline cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
