import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, User, MapPin, Briefcase, FileText, 
  Save, Check, Camera
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';
import { getPreScaledImageUrl } from '../lib/imageUtils';

export default function DashboardProfilePage({ setActivePage, onSaveProfile }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'alexrivera';
  
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [name, setName] = useState(profile.full_name || '');
  const [headline, setHeadline] = useState(profile.headline || '');
  const [location, setLocation] = useState(profile.location || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [availability, setAvailability] = useState(profile.availability_status || 'Open to work');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '/avatar_hero.png');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fresh = dbStore.getProfile(slug);
    setProfile(fresh);
    setName(fresh.full_name || '');
    setHeadline(fresh.headline || '');
    setLocation(fresh.location || '');
    setBio(fresh.bio || '');
    setAvailability(fresh.availability_status || 'Open to work');
    setAvatarUrl(fresh.avatar_url || '/avatar_hero.png');
  }, [slug]);

  // Criterion 2: Missing optional data never blocks form submission or page navigation
  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const updated = dbStore.updateProfile(slug, {
      full_name: name.trim(),
      headline: headline.trim(),
      location: location.trim(),
      bio: bio.trim(),
      availability_status: availability,
      avatar_url: avatarUrl,
    });

    authService.updateProfile({
      fullName: name.trim(),
    });

    if (onSaveProfile) onSaveProfile(updated);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleCycleAvatar = () => {
    const avatarList = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      '/avatar_hero.png'
    ];
    const currentIndex = avatarList.indexOf(avatarUrl);
    const nextIndex = (currentIndex + 1) % avatarList.length;
    setAvatarUrl(avatarList[nextIndex]);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Floating Animated Save Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-300 text-slate-900 border-3 border-slate-900 px-4 py-3 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] flex items-center gap-2.5 font-black text-xs"
          >
            <div className="w-5 h-5 rounded-full bg-slate-900 text-emerald-300 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Profile Synchronized Live!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tactile Dossier Container (Criterion 5: Fully Usable on Mobile <375px) */}
      <div className="dossier-card rounded-3xl p-4 sm:p-8 md:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PROFILE EDITOR DOSSIER</span>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center space-y-2 pb-5 border-b-2 border-slate-900">
          <span className="pill-header inline-block text-xs font-mono bg-slate-900 text-white">
            Live Page Settings • backed.network/{slug}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
            “Edit Profile Details”
          </h1>
          <p className="text-xs font-extrabold text-slate-800">
            Changes update instantly on your public page. Missing optional fields never blocks saving.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5 pt-5">
          {/* Photo & Basic Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <div 
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-slate-900 overflow-hidden bg-amber-200 shrink-0 cursor-pointer"
              onClick={handleCycleAvatar}
              title="Click to cycle avatar"
            >
              <img 
                src={getPreScaledImageUrl(avatarUrl, 160, 160)} 
                alt="Profile" 
                loading="lazy"
                decoding="async"
                width="80"
                height="80"
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-1 right-1 bg-amber-400 p-1 rounded-md border border-slate-900">
                <Camera className="w-3 h-3 text-slate-900" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <p className="text-xs font-mono font-black uppercase text-slate-900">PROFILE AVATAR</p>
              <p className="text-[11px] font-bold text-slate-600">Pre-scaled responsive web asset for rapid mobile loading (&lt;1.5s)</p>
              <button
                type="button"
                onClick={handleCycleAvatar}
                className="text-[11px] font-mono font-black text-slate-900 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-lg border border-slate-900 inline-block transition-all cursor-pointer mt-1"
              >
                Change Avatar
              </button>
            </div>
          </div>

          {/* Full Name (Required) */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-800" />
                Full Name *
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-black">REQUIRED</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a] min-h-[44px]"
            />
          </div>

          {/* Headline (Optional - Criterion 2: Missing optional data never blocks form submission) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black uppercase flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-800" />
                Professional Headline
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Staff Product Engineer & Frontend Architect"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a] min-h-[44px]"
            />
          </div>

          {/* Location (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-800" />
                Location
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a] min-h-[44px]"
            />
          </div>

          {/* Availability Status */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-black uppercase block">Availability Status</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a] min-h-[44px]"
            >
              <option value="Open to work">Open to work</option>
              <option value="Open for Advisory & Select Projects">Open for Advisory & Select Projects</option>
              <option value="Taking Q4 2026 Production Runs">Taking Q4 2026 Production Runs</option>
              <option value="Not currently available">Not currently available</option>
            </select>
          </div>

          {/* Bio (Optional - Criterion 2) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-800" />
                Verified Bio
              </label>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">(Optional)</span>
            </div>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Add your background or leave blank..."
              className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#ca8a04] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save Profile Updates</span>
          </button>
        </form>
      </div>
    </div>
  );
}
