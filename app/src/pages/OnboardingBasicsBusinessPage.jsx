import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Paperclip, Building2, MapPin, Globe, Briefcase, UploadCloud } from 'lucide-react';

export default function OnboardingBasicsBusinessPage({ setActivePage, onSaveBusinessBasics }) {
  const [businessName, setBusinessName] = useState('Apex Dynamics Corp');
  const [whatYouDo, setWhatYouDo] = useState('We manufacture packaging for food brands');
  const [location, setLocation] = useState('Austin, TX');
  const [operatingRegions, setOperatingRegions] = useState('North America, EU, APAC');
  const [logoPreview, setLogoPreview] = useState('🏢');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveBusinessBasics) {
      onSaveBusinessBasics({ businessName, whatYouDo, location, operatingRegions, logoPreview });
    }
    // Navigate to capabilities & services selection
    setActivePage('onboarding-capabilities');
  };

  const handleLogoSimulate = () => {
    const logoIcons = ['🏢', '🏭', '⚙️', '📦', '🛡️'];
    const currentIndex = logoIcons.indexOf(logoPreview);
    const nextIndex = (currentIndex + 1) % logoIcons.length;
    setLogoPreview(logoIcons[nextIndex]);
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Onboarding Progress Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-slate-900">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            STEP 3 OF 3 — BUSINESS BASICS
          </span>
          <span className="text-emerald-700 font-extrabold">100% COMPLETED</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-slate-900 overflow-hidden">
          <div className="bg-emerald-400 h-full w-full transition-all duration-500 rounded-full" />
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>BUSINESS FILE DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-amber-300 text-slate-900">
            Company Credentials
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Tell us about your business”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Just the basics for now — you can fill in the rest later.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          
          {/* Logo Upload Section */}
          <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-center gap-5">
            <div 
              className="w-20 h-20 rounded-2xl bg-emerald-200 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center text-4xl cursor-pointer hover:bg-emerald-300 transition-all select-none"
              onClick={handleLogoSimulate}
            >
              {logoPreview}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
                Logo
              </label>
              <p className="text-xs font-extrabold text-slate-700">
                Add your business logo
              </p>
              <button
                type="button"
                onClick={handleLogoSimulate}
                className="text-xs font-mono font-black text-slate-900 bg-amber-300 hover:bg-amber-400 px-3 py-1 rounded-lg border-2 border-slate-900 inline-flex items-center gap-1 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer mt-1"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-900" />
                <span>Upload Logo</span>
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-800" />
              Business name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your company’s name"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* What You Do */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-800" />
              What you do
            </label>
            <input
              type="text"
              required
              value={whatYouDo}
              onChange={(e) => setWhatYouDo(e.target.value)}
              placeholder='One line, e.g. “We manufacture packaging for food brands”'
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Based In */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-800" />
              Based in
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, country"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Where You Operate */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-800" />
              Where you operate
            </label>
            <input
              type="text"
              required
              value={operatingRegions}
              onChange={(e) => setOperatingRegions(e.target.value)}
              placeholder="Regions you serve"
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
            />
          </div>

          {/* Navigation Controls: Back & Continue */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActivePage('onboarding-slug')}
              className="w-1/3 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-900" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="w-2/3 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 text-emerald-300" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
