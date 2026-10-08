import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Paperclip, Edit3, Sparkles, CheckCircle2, Star, Eye, Share2, Layers } from 'lucide-react';

export default function OnboardingPreviewPage({ setActivePage, onPublish }) {
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublished(true);
    if (onPublish) onPublish();
    setTimeout(() => {
      setActivePage('onboarding-published');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Top Banner / Completion Meter */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0px_0px_#0f172a] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-900/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-300 text-slate-900 border-2 border-slate-900 flex items-center justify-center font-black">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-black uppercase text-slate-500 block">COMPLETION METER</span>
              <p className="text-sm font-black text-slate-900">
                Page strength: <span className="text-emerald-700">Good</span> — add one more proof to make it great.
              </p>
            </div>
          </div>
          <span className="stamp-verified text-xs py-1 px-3">★ 78% VERIFIED STRENGTH ★</span>
        </div>

        {/* Tactile Progress Score Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-[78%] transition-all duration-500 rounded-full" />
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#f7f5f0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PRE-PUBLISH PREVIEW</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Live Preview Mode
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Here’s how your page looks”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Take a look. You can tweak anything before it goes live.
          </p>
        </div>

        {/* Published Success Overlay Animation */}
        {isPublished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Your Page is Live!</h2>
            <p className="text-sm font-extrabold text-slate-800">Redirecting to your public URL: <span className="font-mono text-emerald-800 font-black">backed.app/alexrivera</span></p>
          </motion.div>
        ) : (
          <div className="space-y-8 pt-6">
            
            {/* Live Profile Card Mock Preview */}
            <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-6 relative">
              
              {/* Floating Edit Shortcuts */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePage('onboarding-basics')}
                  className="bg-amber-200 hover:bg-amber-300 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                <img
                  src="/avatar_hero.png"
                  alt="Alex Rivera"
                  className="w-24 h-24 rounded-2xl object-cover border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-2xl font-black text-slate-900">Alex Rivera</h3>
                    <span className="stamp-verified text-[9px] py-0.5 px-2">★ VERIFIED ★</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">Backend developer who ships fast</p>
                  <p className="text-xs font-mono font-bold text-slate-600">San Francisco, CA • backed.app/alexrivera</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
                <span className="pill-header text-[10px]">My Bio</span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  Building resilient microservices, distributed ledger verifications, and high-performance Rust web backends.
                </p>
              </div>

              {/* Capabilities Chips */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
                <div className="flex items-center justify-between">
                  <span className="pill-header text-[10px]">Capabilities</span>
                  <button
                    type="button"
                    onClick={() => setActivePage('onboarding-capabilities')}
                    className="text-[11px] font-mono font-black text-slate-700 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Backend Systems', 'Rust Architecture', 'API Verification'].map((cap) => (
                    <span
                      key={cap}
                      className="bg-yellow-300 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Proof Preview Card */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-900/20">
                <div className="flex items-center justify-between">
                  <span className="pill-header text-[10px]">Proof Artifacts</span>
                  <button
                    type="button"
                    onClick={() => setActivePage('onboarding-proof')}
                    className="text-[11px] font-mono font-black text-slate-700 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Add Proof
                  </button>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="stamp-verified text-[9px] py-0.5 px-2">★ PROOF ATTACHED ★</span>
                    <span className="text-[10px] font-mono font-black text-slate-600">June 2025</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">E-commerce site for a local bakery</h4>
                  <p className="text-[11px] font-mono font-bold text-slate-600">github.com/alexrivera/bakery-storefront</p>
                </div>
              </div>

            </div>

            {/* Bottom Actions: Publish Button & Keep Editing Link */}
            <div className="pt-4 space-y-4 text-center">
              <button
                type="button"
                onClick={handlePublish}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <span>Looks good, publish it</span>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => setActivePage('onboarding-basics')}
                  className="text-xs font-mono font-black text-slate-800 hover:text-slate-900 underline cursor-pointer"
                >
                  Keep editing
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
