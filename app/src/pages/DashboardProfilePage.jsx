import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Camera, CheckCircle2, User, MapPin, 
  Briefcase, FileText, Clock, Globe, Lock, EyeOff, Save, Check
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardProfilePage({ setActivePage, onSaveProfile }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'alexrivera';
  
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [name, setName] = useState(profile.full_name || '');
  const [headline, setHeadline] = useState(profile.headline || '');
  const [location, setLocation] = useState(profile.location || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [availability, setAvailability] = useState(profile.availability_status || 'Open to work');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fresh = dbStore.getProfile(slug);
    setProfile(fresh);
    setName(fresh.full_name || '');
    setHeadline(fresh.headline || '');
    setLocation(fresh.location || '');
    setBio(fresh.bio || '');
    setAvailability(fresh.availability_status || 'Open to work');
  }, [slug]);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = dbStore.updateProfile(slug, {
      full_name: name,
      headline: headline,
      location: location,
      bio: bio,
      availability_status: availability,
    });

    authService.updateProfile({
      fullName: name,
    });

    if (onSaveProfile) onSaveProfile(updated);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Floating Animated Save Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-300 text-slate-900 border-3 border-slate-900 px-5 py-3.5 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] flex items-center gap-3 font-black text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-emerald-300 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span>Profile Updated & Synchronized!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PROFILE EDITOR DOSSIER</span>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900">
          <span className="pill-header inline-block text-xs font-mono bg-slate-900 text-white">
            Live Page Settings • backed.network/{slug}
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-1">
            “Edit Your Profile Details”
          </h1>
          <p className="text-xs font-extrabold text-slate-800">
            Changes update instantly on your public page.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pt-6">

          {/* Photo & Basic Identity */}
          <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="w-16 h-16 rounded-2xl border-2 border-slate-900 overflow-hidden bg-amber-200">
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-mono font-black uppercase text-slate-900">PROFILE AVATAR</p>
              <p className="text-[11px] font-bold text-slate-600">Deterministic DiceBear / Unsplash Avatar</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black uppercase block">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black uppercase block">Professional Headline</label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black uppercase block">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          {/* Availability Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black uppercase block">Availability Status</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <option value="Open to work">Open to work</option>
              <option value="Open for Advisory & Select Projects">Open for Advisory & Select Projects</option>
              <option value="Taking Q4 2026 Production Runs">Taking Q4 2026 Production Runs</option>
              <option value="Not currently available">Not currently available</option>
            </select>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black uppercase block">Verified Bio</label>
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl p-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#ca8a04] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save Profile Updates</span>
          </button>

        </form>
      </div>
    </div>
  );
}
