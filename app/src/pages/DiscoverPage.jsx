import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, CheckCircle2, ShieldCheck, 
  Paperclip, ArrowRight, Building2, User, Sparkles, Filter, X 
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';

export default function DiscoverPage({ setActivePage, onOpenEvidence }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [profiles, setProfiles] = useState(() => dbStore.getAllProfiles());

  useEffect(() => {
    const load = () => setProfiles(dbStore.getAllProfiles());
    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, []);

  const filteredProfiles = profiles.filter((p) => {
    const matchesQuery = 
      (p.full_name || p.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.headline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.capabilities || []).some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Person' && p.profile_type === 'person') ||
      (selectedCategory === 'Business' && p.profile_type === 'business');

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Header Banner */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>REAL-TIME DISCOVER & SEARCH</span>
        </div>

        <div className="text-center space-y-2 pt-2 border-b-2 border-slate-900/30 pb-4">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            ★ VERIFIED PAGE NETWORK
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Search Real-Time Verified Profiles”
          </h1>
          <p className="text-xs font-extrabold text-slate-800">
            Browse verified persons and business catalogs with real peer-backed proof badges.
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, headline, capability, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Person', 'Business'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-300 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-slate-900'
                    : 'bg-white border-slate-900 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {filteredProfiles.map((p) => (
            <div
              key={p.slug}
              onClick={() => {
                if (p.profile_type === 'business') {
                  setActivePage('public-business-profile');
                } else {
                  setActivePage('public-profile');
                }
              }}
              className="bg-[#fef9c3] p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 cursor-pointer hover:bg-amber-100 transition-all hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border-2 border-slate-900 overflow-hidden bg-amber-200 shrink-0">
                    <img src={p.avatar_url} alt={p.full_name || p.business_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                      <span>{p.full_name || p.business_name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-slate-600">{p.location}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-900 text-[10px] font-mono font-black uppercase text-slate-900 shrink-0">
                  {p.profile_type}
                </span>
              </div>

              <p className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-relaxed">
                {p.headline}
              </p>

              {p.capabilities && p.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.capabilities.slice(0, 3).map((cap, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-900 border border-slate-900">
                      {cap.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900 pt-2 border-t border-slate-900/20">
                <span className="text-emerald-800 font-black">Score: {p.completion_score || 90}/100</span>
                <span className="underline flex items-center gap-1">View Verified Profile →</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
