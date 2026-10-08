import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Cpu, Target, Heart, Lock, Award, Users, 
  Sparkles, CheckCircle2, ArrowRight, Paperclip, CheckSquare
} from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  const values = [
    {
      title: '100% Deterministic Truth',
      desc: 'No LLMs or AI hallucinations in core matching or completion logic. Every calculation is transparent, rule-based, and decomposable.',
      icon: Cpu,
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Security & Row-Level Privacy',
      desc: 'Service-role keys never ship to the browser. Every table enforces Row Level Security (RLS) and short-lived signed document URLs.',
      icon: Lock,
      color: 'from-cyan-500 to-emerald-500'
    },
    {
      title: 'Free Managed Infrastructure',
      desc: 'Engineered for extreme performance and cost efficiency on Cloudflare Workers and Supabase free tiers without server overhead.',
      icon: Target,
      color: 'from-emerald-500 to-indigo-600'
    },
    {
      title: 'Open Standards & Transparency',
      desc: 'Identity, claims, and verification structures are transparently documented to support future epics without vendor lock-in.',
      icon: Award,
      color: 'from-indigo-600 to-rose-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'Core Systems Architect',
      bio: 'Lead engineer on distributed state networks. Specialized in deterministic verifier protocols and database RLS security.',
      avatar: 'ER',
      badges: ['Verified Architect', '10+ Yrs Systems Eng'],
      goalThisYear: 'Architect 100% deterministic RLS policies for global monorepos.'
    },
    {
      name: 'Marcus Vance',
      role: 'Head of B2B Verification',
      bio: 'Pioneered supplier capacity validation and ISO certificate verification frameworks across industrial supply chains.',
      avatar: 'MV',
      badges: ['Supply Chain Lead', 'ISO Specialist'],
      goalThisYear: 'Verify 10,000+ manufacturing facility capacity reports.'
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'Verification Engine Researcher',
      bio: 'Author of deterministic capability matching algorithms. Dedicated to eliminating black-box AI hallucinations in resume screening.',
      avatar: 'AT',
      badges: ['PhD Computer Science', 'Logic Author'],
      goalThisYear: 'Publish transparent matching algorithm specifications.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="dossier-stamp">
          ★ OUR MISSION DOSSIER ★
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Eliminating Resume Fluff & Unverified Claims
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          We founded Backed to replace unverified resume claims and dubious marketing copy with an immutable, proof-backed identity primitive.
        </p>
      </div>

      {/* WHY WE STARTED / BRAND HISTORY */}
      <div className="dossier-card rounded-3xl p-8 sm:p-12 border-2 border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
          <span>ORIGIN & MISSION FILE</span>
        </div>

        <div className="space-y-4 pt-2">
          <span className="dossier-pill-bio">Why We Started:</span>
          <h2 className="text-3xl font-bold text-white">
            The Problem With AI-Generated Hype & Unverified Profiles
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In today's digital landscape, social platforms and job boards are flooded with AI-written resume exaggerations, fake supplier credentials, and ungrounded endorsements.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We built Backed on a simple engineering mandate: **Identity → Claims → Evidence → Verification → Share**. By enforcing strict deterministic rules, every skill chip and capacity metric is backed by actual evidence.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-cyan-400 font-bold">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Modular Monolith</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero AI Black-Boxes</span>
          </div>
        </div>

        {/* Visual Proof Architecture Diagram Box */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-semibold">Core Verification Contract</span>
            <span className="dossier-stamp">PROVENANCE VERIFIED</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">1. Identity Primitive</span>
              <span className="text-emerald-400 font-bold">Unique Slug</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">2. Claims Taxonomy</span>
              <span className="text-emerald-400 font-bold">Normalized Skills</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">3. Proof Attachment</span>
              <span className="text-emerald-400 font-bold">Signed File URLs</span>
            </div>
            <div className="p-3 bg-blue-950/60 border border-blue-500/30 rounded-xl flex items-center justify-between">
              <span className="text-blue-300">4. Peer Confirmation</span>
              <span className="text-cyan-300 font-bold">VERIFIED BADGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUES GRID */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="dossier-stamp">OUR CORE PRINCIPLES</span>
          <h2 className="text-3xl font-bold text-white">Engineering Values</h2>
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

      {/* TEAM CHARACTER FILES */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="dossier-stamp">TEAM CHARACTER FILES</span>
          <h2 className="text-3xl font-bold text-white">Meet Our Leadership Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="dossier-card rounded-3xl p-6 border-2 border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                <span>TEAM DOSSIER</span>
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
                <span className="dossier-pill-bio">My Bio:</span>
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
