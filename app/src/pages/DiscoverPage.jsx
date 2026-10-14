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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [profiles, setProfiles] = useState(() => dbStore.getAllProfiles());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const results = await dbStore.searchProfiles({ 
          query: searchQuery.trim(),
          location: selectedLocation.trim() || null
        });
        if (isCurrent && results && results.length > 0) {
          setProfiles(results);
        } else if (isCurrent) {
          setProfiles(dbStore.getAllProfiles());
        }
      } catch (err) {
        if (isCurrent) setProfiles(dbStore.getAllProfiles());
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProfiles, 250);
    const unsub = dbStore.onSync(() => {
      if (isCurrent && !searchQuery.trim() && !selectedLocation.trim()) {
        setProfiles(dbStore.getAllProfiles());
      }
    });

    return () => {
      isCurrent = false;
      clearTimeout(timer);
      unsub();
    };
  }, [searchQuery, selectedLocation]);

  const filteredProfiles = profiles.filter((p) => {
    const matchesQuery = 
      (p.full_name || p.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.headline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.capabilities || []).some(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Person' && p.profile_type === 'person') ||
      (selectedCategory === 'Business' && p.profile_type === 'business');

    const matchesLocation = 
      !selectedLocation.trim() || 
      (p.location || '').toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesAvailability = 
      selectedAvailability === 'All' ||
      (selectedAvailability === 'Available' && (p.availability_status === 'available' || p.availability_status === 'open_to_work' || p.availability_status === 'immediate')) ||
      (selectedAvailability === 'Advisory' && p.availability_status === 'advisory');

    return matchesQuery && matchesCategory && matchesLocation && matchesAvailability;
  });

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Header Banner */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>DISCOVER PROFILES</span>
        </div>

        <div className="text-center space-y-2 pt-2 border-b-2 border-slate-900/30 pb-4">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            ★ VERIFIED PROFILES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            Find Verified People & Businesses
          </h1>
          <p className="text-xs font-extrabold text-slate-800">
            Browse verified individuals and businesses with real work samples and recommendations.
          </p>
        </div>

        {/* Search & Primary Category Filters */}
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

        {/* Secondary Location & Availability Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-slate-200">
          <div className="relative flex-1 w-full">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by location (e.g. San Francisco, Germany)..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl pl-10 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0">Status:</span>
            {['All', 'Available', 'Advisory'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedAvailability(st)}
                className={`px-3 py-1.5 rounded-lg border-2 text-[11px] font-black transition-all cursor-pointer ${
                  selectedAvailability === st
                    ? 'bg-emerald-300 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                    : 'bg-white border-slate-900 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Grid */}
        {isLoading && filteredProfiles.length === 0 ? (
          <div className="py-12 text-center text-slate-600 font-mono text-xs">
            Loading verified profiles...
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="py-12 text-center text-slate-600 font-mono text-xs bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6">
            No published profiles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {filteredProfiles.map((p) => (
              <div
                key={p.slug || p.id}
                onClick={() => {
                  if (p.profile_type === 'business') {
                    setActivePage('public-business-profile', p.slug);
                  } else {
                    setActivePage('public-profile', p.slug);
                  }
                }}
                className="bg-[#fef9c3] p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3 cursor-pointer hover:bg-amber-100 transition-all hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border-2 border-slate-900 overflow-hidden bg-amber-200 shrink-0">
                      <img src={p.avatar_url || '/avatar_hero.png'} alt={p.full_name || p.business_name || 'Profile'} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                        <span>{p.full_name || p.business_name || p.slug}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </h3>
                      <p className="text-[11px] font-mono font-bold text-slate-600">{p.location || 'Remote'}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-900 text-[10px] font-mono font-black uppercase text-slate-900 shrink-0">
                    {p.profile_type}
                  </span>
                </div>

                <p className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-relaxed">
                  {p.headline || 'Verified Profile'}
                </p>

                {p.capabilities && p.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.capabilities.slice(0, 3).map((cap, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-900 border border-slate-900">
                        {typeof cap === 'string' ? cap : cap.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900 pt-2 border-t border-slate-900/20">
                  <span className="text-emerald-800 font-black">Score: {p.completion_score || 90}/100</span>
                  <span className="underline flex items-center gap-1">View Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
