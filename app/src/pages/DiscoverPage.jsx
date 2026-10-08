import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, CheckCircle2, ShieldCheck, 
  Paperclip, ArrowRight, Building2, User, Sparkles, Filter, X 
} from 'lucide-react';

export default function DiscoverPage({ setActivePage, onOpenEvidence }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'recent'

  const catalog = [
    {
      id: 'alexrivera',
      name: 'Alex Rivera',
      type: 'Person',
      headline: 'Backend developer who ships fast',
      location: 'San Francisco, CA',
      availability: 'Open to work',
      category: 'Software Engineering',
      capabilities: ['Backend Systems', 'Rust Architecture', 'API Verification'],
      hasConfirmedProof: true,
      proofCount: 4,
      score: 95
    },
    {
      id: 'apex-dynamics',
      name: 'Apex Precision Dynamics',
      type: 'Business',
      headline: 'Precision CNC Machining & ISO-Certified Component Fabrication',
      location: 'Austin, TX',
      availability: 'Open for enquiries',
      category: 'Manufacturing & Hardware',
      capabilities: ['CNC Machining', 'ISO 9001 Fabrication', 'Aerospace Components'],
      hasConfirmedProof: true,
      proofCount: 6,
      score: 98
    },
    {
      id: 'chennai-steel',
      name: 'Vanguard Steel Fabrication',
      type: 'Business',
      headline: 'Structural steel fabrication & heavy industrial welding',
      location: 'Chennai, India',
      availability: 'Open for enquiries',
      category: 'Manufacturing & Hardware',
      capabilities: ['Steel Fabrication', 'Industrial Welding', 'Structural Engineering'],
      hasConfirmedProof: true,
      proofCount: 5,
      score: 92
    },
    {
      id: 'priya-design',
      name: 'Priya Sharma',
      type: 'Person',
      headline: 'Brand identity & logo design for tech startups',
      location: 'Bengaluru, India',
      availability: 'Open to work',
      category: 'Design & Branding',
      capabilities: ['Logo Design', 'Brand Identity', 'UI System Architecture'],
      hasConfirmedProof: true,
      proofCount: 3,
      score: 89
    }
  ];

  const filteredResults = catalog.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // Location filter
    const matchesLocation = selectedLocation === 'All' || item.location.includes(selectedLocation);

    // Availability filter
    const matchesAvailability = !onlyAvailable || item.availability.includes('Open');

    return matchesSearch && matchesCategory && matchesLocation && matchesAvailability;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Header Banner */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>DISCOVERY DOSSIER</span>
        </div>

        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Verified Network Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Find people and businesses who can actually do it”
          </h1>
        </div>

        {/* SEARCH BAR */}
        <div className="pt-6">
          <div className="relative flex items-center bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-emerald-500">
            <Search className="w-5 h-5 text-slate-500 ml-4 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try ‘logo design’ or ‘steel fabrication in Chennai’"
              className="w-full bg-transparent py-4 pr-4 text-sm sm:text-base font-black text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-2 text-slate-500 hover:text-slate-900 mr-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Layout: Filter Sidebar & Result Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FILTER SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
              <span className="text-xs font-mono font-black text-slate-900 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                FILTERS
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setOnlyAvailable(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-mono font-black text-slate-500 hover:underline cursor-pointer"
              >
                Reset all
              </button>
            </div>

            {/* Skill or Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                • Skill or category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <option value="All">All Categories</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Manufacturing & Hardware">Manufacturing & Hardware</option>
                <option value="Design & Branding">Design & Branding</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                • Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <option value="All">All Locations</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Austin">Austin, TX</option>
                <option value="Chennai">Chennai, India</option>
                <option value="Bengaluru">Bengaluru, India</option>
              </select>
            </div>

            {/* Availability Checkbox */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                • Availability
              </label>
              <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border-2 border-slate-900 cursor-pointer text-xs font-extrabold text-slate-900">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-slate-900"
                />
                <span>Open for work / enquiries only</span>
              </label>
            </div>

            {/* Sort Control */}
            <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
              <label className="text-xs font-mono font-black text-slate-900 uppercase block">
                Sort Control
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSortBy('score')}
                  className={`py-2 rounded-xl text-xs font-mono font-black border-2 transition-all cursor-pointer ${
                    sortBy === 'score'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-900 border-slate-900/40'
                  }`}
                >
                  Proof Score
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('name')}
                  className={`py-2 rounded-xl text-xs font-mono font-black border-2 transition-all cursor-pointer ${
                    sortBy === 'name'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-900 border-slate-900/40'
                  }`}
                >
                  Name A-Z
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-black text-slate-900 uppercase">
            <span>RESULTS ({sortedResults.length})</span>
            <span>SORT: {sortBy.toUpperCase()}</span>
          </div>

          {sortedResults.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white p-12 rounded-3xl border-3 border-dashed border-slate-900 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">No matches yet.</h3>
              <p className="text-xs font-extrabold text-slate-700">Try a broader search or reset your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {sortedResults.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-slate-900/10 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black shadow-[2px_2px_0px_0px_#0f172a] ${
                            item.type === 'Person' ? 'bg-amber-300' : 'bg-emerald-300'
                          }`}>
                            {item.type === 'Person' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                              {item.hasConfirmedProof && (
                                <span className="stamp-verified text-[9px] py-0.5 px-2">★ CONFIRMED PROOF ★</span>
                              )}
                            </div>
                            <p className="text-xs font-mono font-bold text-slate-600">{item.location} • {item.availability}</p>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-slate-900 shrink-0">
                          Score: {item.score}/100
                        </span>
                      </div>

                      {/* Headline */}
                      <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                        "{item.headline}"
                      </p>

                      {/* Top Capability Chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="bg-slate-100 text-slate-900 font-mono font-bold text-[11px] px-3 py-1 rounded-xl border border-slate-900"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* View Profile Action */}
                    <div className="pt-3 border-t-2 border-slate-900/10 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {item.proofCount} Verified Proof Artifacts
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.type === 'Person') {
                            setActivePage('public-profile');
                          } else {
                            setActivePage('public-business-profile');
                          }
                        }}
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View Verified Page</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
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
