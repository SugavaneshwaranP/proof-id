import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Camera, CheckCircle2, User, MapPin, 
  Briefcase, FileText, Clock, Globe, Lock, EyeOff, Save, Check
} from 'lucide-react';

export default function DashboardProfilePage({ setActivePage, onSaveProfile }) {
  const [name, setName] = useState('Alex Rivera');
  const [headline, setHeadline] = useState('Backend developer who ships fast');
  const [location, setLocation] = useState('San Francisco, CA');
  const [about, setAbout] = useState('Building resilient microservices, distributed ledger verifications, and high-performance Rust web backends.');
  const [availability, setAvailability] = useState('Open to work');
  const [visibility, setVisibility] = useState('public');
  const [photoUrl, setPhotoUrl] = useState('/avatar_hero.png');
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({ name, headline, location, about, availability, visibility, photoUrl });
    }
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCycleAvatar = () => {
    const avatarOptions = ['/avatar_hero.png', '/avatar_engineer.png', '/avatar_verifier.png'];
    const currentIndex = avatarOptions.indexOf(photoUrl);
    const nextIndex = (currentIndex + 1) % avatarOptions.length;
    setPhotoUrl(avatarOptions[nextIndex]);
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
            <span>Saved. Your page is up to date</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>EDIT PROFILE DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Account Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Edit your profile”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Where you keep your basic details up to date.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto no-scrollbar pb-2">
          {['Basics', 'About you', 'Availability', 'Visibility'].map((sec) => (
            <span
              key={sec}
              className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-slate-900 font-mono text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] whitespace-nowrap"
            >
              • {sec}
            </span>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-6 pt-4">
          
          {/* Photo / Logo Upload Section */}
          <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-center gap-5">
            <div className="relative cursor-pointer" onClick={handleCycleAvatar}>
              <img
                src={photoUrl}
                alt="Profile avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
                Profile Photo / Logo
              </label>
              <p className="text-xs font-extrabold text-slate-700">
                Click photo to change or upload new media
              </p>
              <button
                type="button"
                onClick={handleCycleAvatar}
                className="text-xs font-mono font-black text-slate-900 bg-amber-300 hover:bg-amber-400 px-3 py-1 rounded-lg border-2 border-slate-900 inline-block shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer mt-1"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* SECTION 1: BASICS */}
          <div className="space-y-4 pt-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-1">
              1. BASICS
            </span>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-800" />
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or business name"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-800" />
                Headline
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="One line that sums you up"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-800" />
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where you’re based"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          {/* SECTION 2: ABOUT YOU */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-1">
              2. ABOUT YOU
            </span>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-800" />
                About
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="A few honest sentences"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a] resize-none"
              />
            </div>
          </div>

          {/* SECTION 3: AVAILABILITY */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-1">
              3. AVAILABILITY
            </span>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-800" />
                Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder='e.g. “Open to work” or “Booked until March”'
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          {/* SECTION 4: VISIBILITY */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-1">
              4. VISIBILITY OPTIONS
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Public */}
              <div
                onClick={() => setVisibility('public')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all space-y-1 ${
                  visibility === 'public'
                    ? 'bg-emerald-100 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]'
                    : 'bg-white border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    Public
                  </span>
                  {visibility === 'public' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </div>
                <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                  Public pages can be found and shared.
                </p>
              </div>

              {/* Unlisted */}
              <div
                onClick={() => setVisibility('unlisted')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all space-y-1 ${
                  visibility === 'unlisted'
                    ? 'bg-amber-100 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]'
                    : 'bg-white border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-amber-700" />
                    Unlisted
                  </span>
                  {visibility === 'unlisted' && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
                </div>
                <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                  Unlisted pages only open from a direct link.
                </p>
              </div>

              {/* Private */}
              <div
                onClick={() => setVisibility('private')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all space-y-1 ${
                  visibility === 'private'
                    ? 'bg-red-100 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]'
                    : 'bg-white border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-red-700" />
                    Private
                  </span>
                  {visibility === 'private' && <CheckCircle2 className="w-4 h-4 text-red-700" />}
                </div>
                <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                  Only visible to you when logged in.
                </p>
              </div>

            </div>
          </div>

          {/* Submit Save Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5 text-emerald-300" />
              <span>Save changes</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
