import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Link2, Calendar, 
  GripVertical, Paperclip as ClipIcon, Edit, Trash2, FolderPlus, 
  CheckCircle2, Shield, Sparkles
} from 'lucide-react';

export default function DashboardProjectsPage({ setActivePage, onOpenEvidence }) {
  const [projectName, setProjectName] = useState('');
  const [whatYouDid, setWhatYouDid] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [dates, setDates] = useState('');

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Engine & Proof Microservices',
      summary: 'Architected scalable Rust backend for order processing with zero-knowledge proof receipt validation.',
      link: 'github.com/alexrivera/ecommerce-proof',
      dates: 'Jan 2025 – Present',
      hasProof: true
    },
    {
      id: 2,
      name: 'High-Throughput API Gateway',
      summary: 'Built unified GraphQL API gateway processing 50k requests/sec with low latency.',
      link: 'api.backend-demo.io',
      dates: 'Mar 2024 – Dec 2024',
      hasProof: false
    }
  ]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectName || !whatYouDid) return;

    const newProj = {
      id: Date.now(),
      name: projectName,
      summary: whatYouDid,
      link: linkUrl || 'N/A',
      dates: dates || '2025',
      hasProof: false
    };

    setProjects([newProj, ...projects]);
    setProjectName('');
    setWhatYouDid('');
    setLinkUrl('');
    setDates('');
  };

  const handleRemoveProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAttachProof = (proj) => {
    if (onOpenEvidence) {
      onOpenEvidence({
        title: proj.name,
        type: 'Project Proof',
        issuer: 'Verified Repository',
        date: proj.dates,
        link: proj.link
      });
    } else {
      setActivePage('onboarding-proof');
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PROJECTS & EXPERIENCE DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Work History
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Your projects & experience”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            The work that shows what you can really do.
          </p>
        </div>

        {/* Add-New Form */}
        <form onSubmit={handleAddProject} className="space-y-4 pt-6 bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FolderPlus className="w-4 h-4 text-emerald-600" />
            <span>ADD NEW PROJECT OR EXPERIENCE</span>
          </div>

          {/* Project Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Project name
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="What was it called"
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* What You Did */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              What you did
            </label>
            <textarea
              rows={2}
              required
              value={whatYouDid}
              onChange={(e) => setWhatYouDid(e.target.value)}
              placeholder="Plain-language summary"
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Link (Optional)
              </label>
              <div className="flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
                <Link2 className="w-3.5 h-3.5 text-slate-500 ml-3 mr-1" />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="github.com/myproject"
                  className="w-full bg-transparent px-2 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Dates
              </label>
              <div className="flex items-center bg-slate-50 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
                <Calendar className="w-3.5 h-3.5 text-slate-500 ml-3 mr-1" />
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Start – end (e.g. 2024 – 2025)"
                  className="w-full bg-transparent px-2 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Add Project Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add project</span>
          </button>
        </form>

        {/* Project Card List & Empty State */}
        <div className="pt-8 space-y-4">
          <div className="text-xs font-mono font-black text-slate-900 uppercase flex items-center justify-between">
            <span>PROJECT LIST ({projects.length})</span>
            <span className="text-[10px] font-mono text-slate-700">DRAG HANDLES TO REORDER</span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-black text-slate-900">No projects yet.</p>
              <p className="text-xs font-bold text-slate-700">Add the one you’re proudest of.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {projects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3 relative group"
                  >
                    {/* Header with Reorder Handle */}
                    <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900/10 pb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab hover:text-slate-900" />
                        <h4 className="text-base font-black text-slate-900">{proj.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-900">
                        {proj.dates}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* Link */}
                    {proj.link !== 'N/A' && (
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800">
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="underline">{proj.link}</span>
                      </div>
                    )}

                    {/* Card Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t-2 border-slate-900/10">
                      
                      {/* Attach Proof Shortcut */}
                      <button
                        type="button"
                        onClick={() => handleAttachProof(proj)}
                        className={`text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#0f172a] ${
                          proj.hasProof
                            ? 'bg-emerald-300 text-slate-900'
                            : 'bg-amber-200 hover:bg-amber-300 text-slate-900'
                        }`}
                      >
                        <ClipIcon className="w-3.5 h-3.5" />
                        <span>{proj.hasProof ? '★ Proof Attached' : 'Attach proof'}</span>
                      </button>

                      {/* Edit & Remove */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProjectName(proj.name);
                            setWhatYouDid(proj.summary);
                            setLinkUrl(proj.link);
                            setDates(proj.dates);
                            handleRemoveProject(proj.id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-900 text-xs font-bold hover:bg-slate-100 text-slate-800 flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-900 text-xs font-bold hover:bg-red-50 text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

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
