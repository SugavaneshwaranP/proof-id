import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Cpu, Target, Heart, Lock, Award, Users, 
  Sparkles, CheckCircle2, ArrowRight, Paperclip, CheckSquare
} from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  const values = [
    {
      title: 'Real Proof, No Exaggerations',
      desc: 'No buzzwords or inflated claims. Every skill, project, and certificate is backed by real work or colleague confirmations.',
      icon: Cpu,
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Privacy & Data Protection',
      desc: 'Your private files and contact info are always protected. You choose what is public and what stays private.',
      icon: Lock,
      color: 'from-cyan-500 to-emerald-500'
    },
    {
      title: 'Fast & Always Accessible',
      desc: 'Blazing fast load times with high reliability so your profile or business page is always open to clients and employers.',
      icon: Target,
      color: 'from-emerald-500 to-indigo-600'
    },
    {
      title: 'You Own Your Data',
      desc: 'You can export, update, or share your page anytime without vendor lock-in or hidden paywalls.',
      icon: Award,
      color: 'from-indigo-600 to-rose-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'Head of Engineering',
      bio: 'Experienced software engineer focused on building fast, reliable web applications and bulletproof privacy systems.',
      avatar: 'ER',
      badges: ['Lead Engineer', '10+ Yrs Systems Eng'],
      goalThisYear: 'Make verifying skills as simple as sending a text message.'
    },
    {
      name: 'Marcus Vance',
      role: 'Head of Business Partnerships',
      bio: 'Helps manufacturers and suppliers present verified quality certificates and capabilities clearly to commercial buyers.',
      avatar: 'MV',
      badges: ['Supply Chain Lead', 'Quality Specialist'],
      goalThisYear: 'Help 10,000+ businesses build trust with their customers.'
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'Product & Trust Lead',
      bio: 'Passionate about helping people prove their authentic skills and achievements through real work samples.',
      avatar: 'AT',
      badges: ['Researcher', 'Product Design'],
      goalThisYear: 'Build tools that help people get hired based on real work.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="dossier-stamp">
          ★ ABOUT US ★
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Real Proof for Your Real Work
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          We founded Backed to help talented individuals and reputable businesses stand out with verified proof, not empty words.
        </p>
      </div>

      {/* WHY WE STARTED / BRAND HISTORY */}
      <div className="dossier-card rounded-3xl p-8 sm:p-12 border-2 border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
          <span>OUR STORY</span>
        </div>

        <div className="space-y-4 pt-2">
          <span className="dossier-pill-bio">Why We Started:</span>
          <h2 className="text-3xl font-bold text-white">
            Why Proof Matters More Than Ever
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In today's digital world, social platforms and job boards are flooded with exaggerated claims, unverified credentials, and empty endorsements.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We built Backed on a straightforward idea: **Share your work, attach real proof, have colleagues confirm it, and share one link that speaks for itself**.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-cyan-400 font-bold">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Simple & Transparent</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified by Real People</span>
          </div>
        </div>

        {/* Visual Proof Architecture Diagram Box */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-semibold">How Trust Works on Backed</span>
            <span className="dossier-stamp">VERIFIED PROOF</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">1. Your Profile</span>
              <span className="text-emerald-400 font-bold">Personal Web Link</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">2. Skills & Services</span>
              <span className="text-emerald-400 font-bold">Clear List of What You Do</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">3. Work Samples</span>
              <span className="text-emerald-400 font-bold">Real Files & Links</span>
            </div>
            <div className="p-3 bg-blue-950/60 border border-blue-500/30 rounded-xl flex items-center justify-between">
              <span className="text-blue-300">4. Colleague Confirmation</span>
              <span className="text-cyan-300 font-bold">VERIFIED BADGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUES GRID */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="dossier-stamp">OUR CORE PRINCIPLES</span>
          <h2 className="text-3xl font-bold text-white">What We Believe</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const IconC = v.icon;
            return (
              <div key={idx} className="dossier-card p-6 flex flex-col justify-between space-y-4">
                <div className="dossier-clip">
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VALUE #{idx + 1}</span>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${v.color} flex items-center justify-center text-white shadow-md mt-2`}>
                  <IconC className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* TEAM FILES */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="dossier-stamp">OUR TEAM</span>
          <h2 className="text-3xl font-bold text-white">Meet Our Leadership Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="dossier-card rounded-3xl p-6 border-2 border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                <span>TEAM MEMBER</span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white text-xl shadow-lg ring-2 ring-blue-400/30">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-blue-400 font-mono font-bold">{member.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="dossier-pill-bio">About:</span>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {member.bio}
                </p>
              </div>

              <div className="space-y-2">
                <span className="dossier-pill-goal">Goal This Year:</span>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {member.goalThisYear}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                {member.badges.map((b, i) => (
                  <span key={i} className="dossier-stamp">
                    ★ {b} ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
