import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Eye, Users, Building2, CheckSquare, 
  Paperclip, FileText, Award, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function HomePage({ setActivePage, onOpenEvidence }) {

  const proofExamples = [
    {
      id: 'SAMPLE-01',
      title: 'Web Application & Systems',
      type: 'Code & Architecture',
      status: 'verified',
      relationship: 'Engineering Manager',
      date: '2026-09-20',
      scope: 'Confirmed production code contribution and architecture.',
      url: 'https://github.com',
      cardClass: 'dossier-card-yellow'
    },
    {
      id: 'SAMPLE-02',
      title: 'ISO Quality Certificate',
      type: 'Quality Management',
      status: 'verified',
      relationship: 'Accredited Auditor',
      date: '2026-07-01',
      scope: 'Verified active audit compliance certificate.',
      url: 'https://example.com',
      cardClass: 'dossier-card-mint'
    },
    {
      id: 'SAMPLE-03',
      title: 'Client Project Delivery',
      type: 'Design & Development',
      status: 'verified',
      relationship: 'Verified Client',
      date: '2026-08-15',
      scope: 'Confirmed client deliverable quality and on-time delivery.',
      url: 'https://example.com',
      cardClass: 'dossier-card-pink'
    },
    {
      id: 'SAMPLE-04',
      title: 'Professional License',
      type: 'Official Registration',
      status: 'verified',
      relationship: 'Licensing Registry',
      date: '2026-09-12',
      scope: 'Verified active professional credentials and registration.',
      url: 'https://example.com',
      cardClass: 'dossier-card-peach'
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden font-sans desk-grid-background">
      
      {/* 1. HERO SECTION WITH BIG CARTOONS & THOUGHT BUBBLES */}
      <section className="relative pt-10 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          
          {/* HERO HEADLINE */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.05]"
          >
            “Prove it. <br className="hidden sm:inline" />
            <span className="text-amber-500 underline decoration-slate-900 decoration-wavy decoration-2">Don’t just say it.”</span>
          </motion.h1>

          {/* HERO SUBHEAD */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-800 max-w-2xl mx-auto leading-relaxed font-semibold"
          >
            Backed turns your skills, your work and your credentials into one page people actually trust — because it’s backed by real proof, not just words.
          </motion.p>

          {/* HERO BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setActivePage('create')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-extrabold text-base shadow-[5px_5px_0px_0px_#0f172a] border-2 border-slate-900 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Create your free page</span>
              <ArrowRight className="w-5 h-5 text-slate-900" />
            </button>
            <button
              onClick={() => setActivePage('explorer')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base border-2 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-900" />
              <span>Explore community profiles</span>
            </button>
          </motion.div>

        </div>

        {/* HERO PROOF DISPLAY */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto relative pt-4 pb-4"
        >
          {/* MAIN BIG CARTOON CARD DISPLAY */}
          <div className="dossier-card-yellow rounded-3xl p-8 sm:p-12 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-center relative overflow-hidden">
            
            {/* Binder clip */}
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-amber-300" />
              <span>BACKED PROFILE PAGE</span>
            </div>

            {/* Big Cartoon Character Center Image */}
            <div className="max-w-md mx-auto space-y-4 pt-2">
              <div className="w-36 h-36 mx-auto rounded-3xl bg-white border-3 border-slate-900 p-2 shadow-[5px_5px_0px_0px_#0f172a] overflow-hidden">
                <img src="/avatar_hero.png" alt="Big Cartoon Hero Character" className="w-full h-full object-cover rounded-2xl" />
              </div>
              <div className="space-y-1">
                <span className="dossier-stamp">★ REAL VERIFIED PROOF ★</span>
                <h3 className="text-2xl font-black text-slate-900 pt-2">One Page People Actually Trust</h3>
                <p className="text-xs font-bold text-slate-800">
                  Backed by real proof, not just words.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* 2. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="dossier-stamp">HOW IT WORKS</span>
          <h2 className="text-4xl font-black text-slate-900">
            Three Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* STEP 1 */}
          <div className="dossier-card-yellow p-8 flex flex-col justify-between">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>STEP 1: ADD WHAT YOU DO</span>
            </div>
            <div className="space-y-4 pt-2">
              <span className="dossier-pill-bio">1. Add what you do</span>
              <p className="text-slate-900 text-lg font-black leading-relaxed">
                List your skills, or what your business offers, in plain language.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="dossier-card-mint p-8 flex flex-col justify-between">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>STEP 2: ADD PROOF</span>
            </div>
            <div className="space-y-4 pt-2">
              <span className="dossier-pill-about">2. Back it up</span>
              <p className="text-slate-900 text-lg font-black leading-relaxed">
                Attach a real project, a certificate, or a work sample as proof.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="dossier-card-blue p-8 flex flex-col justify-between">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>STEP 3: SHARE YOUR LINK</span>
            </div>
            <div className="space-y-4 pt-2">
              <span className="dossier-pill-proof">3. Share one link</span>
              <p className="text-slate-900 text-lg font-black leading-relaxed">
                Send a single page that shows what you can do, and proves it.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* 3. INDIVIDUAL / BUSINESS SPLIT */}
      <section id="for-business" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* INDIVIDUAL PROFILE */}
          <div className="dossier-card-pink p-8 sm:p-10 flex flex-col justify-between">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>INDIVIDUAL PROFILE</span>
            </div>

            <div className="space-y-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-900 p-1 shadow-[3px_3px_0px_0px_#0f172a]">
                <img src="/avatar_female_engineer.png" alt="Person Cartoon Avatar" className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="dossier-pill-likes">For individuals</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Turn your experience into a page that speaks for itself.
              </h3>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setActivePage('create')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>Build my page</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BUSINESS PROFILE */}
          <div className="dossier-card-peach p-8 sm:p-10 flex flex-col justify-between">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>BUSINESS PROFILE</span>
            </div>

            <div className="space-y-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-900 p-1 shadow-[3px_3px_0px_0px_#0f172a]">
                <img src="/avatar_verifier.png" alt="Business Cartoon Avatar" className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="dossier-pill-goal">For businesses</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Show buyers what you make, how much, and how fast — with the proof to match.
              </h3>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setActivePage('explorer')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>List my business</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 4. PROOF EXAMPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="dossier-stamp">REAL WORK SAMPLES</span>
          <h2 className="text-4xl font-black text-slate-900">
            Work Samples & Proof
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofExamples.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenEvidence(item)}
              className={`${item.cardClass} p-6 flex flex-col justify-between cursor-pointer group`}
            >
              <div className="dossier-clip">
                <Paperclip className="w-3 h-3 text-slate-900" />
                <span>{item.id}</span>
              </div>

              <div className="space-y-3 pt-2">
                <span className="dossier-stamp">VERIFIED</span>
                <h4 className="text-lg font-black text-slate-900 leading-tight">{item.title}</h4>
                <p className="text-xs text-slate-800 font-semibold">{item.type}</p>
              </div>

              <div className="pt-4 border-t-2 border-slate-900/40 flex items-center justify-between text-xs text-slate-900 font-mono font-black">
                <span>VIEW DETAILS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. TRUST BANNER */}
      <section className="border-y-3 border-slate-900 bg-[#bae6fd] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="dossier-stamp bg-white text-slate-900 border-slate-900 font-mono">
            SIMPLE & TRUSTED
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Every claim can be backed. Every proof can be checked.
          </h2>
        </div>
      </section>

      {/* 6. CLOSING CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="dossier-card-yellow rounded-3xl p-8 sm:p-14 border-3 border-slate-900 relative overflow-hidden text-center space-y-6 shadow-[8px_8px_0px_0px_#0f172a]">
          
          <div className="dossier-clip">
            <Paperclip className="w-3.5 h-3.5 text-slate-900" />
            <span>GET STARTED TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight pt-2">
            Your work speaks. Let it be heard.
          </h2>

          <div className="pt-4 relative z-10">
            <button
              onClick={() => setActivePage('create')}
              className="px-10 py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xl shadow-[5px_5px_0px_0px_#ca8a04] border-2 border-slate-900 hover:translate-y-[-2px] transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <span>Get started — it’s free</span>
              <ArrowRight className="w-6 h-6 text-amber-300" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
