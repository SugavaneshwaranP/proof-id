import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Link2, Calendar, 
  GripVertical, Paperclip as ClipIcon, Edit, Trash2, FolderPlus, 
  CheckCircle2, Shield, Sparkles
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardProjectsPage({ setActivePage, onOpenEvidence }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'profile';

  const [projects, setProjects] = useState(() => dbStore.getProjects(slug));
  const [projectName, setProjectName] = useState('');
  const [whatYouDid, setWhatYouDid] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [dates, setDates] = useState('');

  useEffect(() => {
    const load = () => setProjects(dbStore.getProjects(slug));
    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, [slug]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectName || !whatYouDid) return;

    dbStore.addProject(slug, {
      title: projectName,
      description: whatYouDid,
      link: linkUrl || 'https://example.com',
      year: dates || '2026',
      tags: ["Verified"],
    });

    setProjectName('');
    setWhatYouDid('');
    setLinkUrl('');
    setDates('');
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>FEATURED PROJECTS</span>
        </div>

        {/* Title */}
        <div className="space-y-1 pt-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Featured Projects
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Showcase your key projects on backed.network/{slug}
          </p>
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <span className="text-xs font-mono font-black uppercase text-slate-900 block">
            Add a Project
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. E-Commerce Redesign or Mobile App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Timeframe / Dates</label>
              <input
                type="text"
                placeholder="e.g. 2025 - 2026"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold block mb-1">Summary / What You Did *</label>
            <textarea
              rows={2}
              required
              placeholder="Describe your contribution, tools used, and results..."
              value={whatYouDid}
              onChange={(e) => setWhatYouDid(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold block mb-1">Project Link / URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add Project</span>
          </button>
        </form>

        {/* Existing Projects List */}
        <div className="space-y-3 pt-2">
          {projects.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-900 text-center">
              <p className="text-xs font-bold text-slate-600">No project case studies added yet. Add your first project above.</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">{proj.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{proj.year || proj.timeframe}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await dbStore.deleteProject(slug, proj.id);
                        setProjects(dbStore.getProjects(slug));
                      }}
                      className="p-1 rounded-lg border border-slate-300 text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">{proj.description}</p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold text-emerald-800 underline block pt-1">
                    {proj.link}
                  </a>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
