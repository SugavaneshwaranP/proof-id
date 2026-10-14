import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Building2, ShieldCheck, Award, ExternalLink, Calendar, MapPin, 
  CheckCircle2, Clock, FileText, Send, Share2, BarChart3, Info, Sparkles,
  Paperclip, CheckSquare, Star, ArrowUpRight
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';

export default function ProfileExplorerPage({ onOpenEvidence, setActivePage }) {
  const [profileType, setProfileType] = useState('person'); // 'person' | 'business'
  const [quoteSent, setQuoteSent] = useState(false);

  const handleRequestQuote = async () => {
    try {
      await dbStore.sendMessage('apex-dynamics', {
        sender_name: 'Explorer Visitor',
        sender_email: 'inquiries@apexindustrial.example',
        subject: 'Commercial Quote Request for Precision Parts',
        message: 'Requesting RFQ quotation on standard catalog components.',
        rfqData: { quantity: '50', unit: 'units', deliveryRegion: 'North America' }
      });
    } catch (err) {
      console.warn("Quote request queued:", err);
    }
    setQuoteSent(true);
  };

  // Demo Person Data
  const personProfile = {
    name: 'Alex Rivera',
    headline: 'Senior Distributed Systems & React Architect',
    location: 'San Francisco, CA (Remote Open)',
    availability: 'Available Now',
    summary: '10+ years engineering high-concurrency web applications, micro-frontend design systems, and deterministic verification protocols.',
    slug: 'alex-rivera',
    score: 95,
    goalThisYear: 'Deploy 100% deterministic identity verification primitives across global open-source monorepos.',
    capabilities: [
      { name: 'React 19', category: 'Frontend', claim: 'Built enterprise component primitive library with 50+ accessible components.' },
      { name: 'PostgreSQL', category: 'Database', claim: 'Designed RLS policies and optimized query execution plans for 5M+ row datasets.' },
      { name: 'Tailwind CSS', category: 'Styling', claim: 'Engineered custom responsive design tokens and dark mode themes.' },
      { name: 'Cloudflare Workers', category: 'Edge Compute', claim: 'Deployed edge API middleware handling 100k daily requests at low latency.' },
      { name: 'TypeScript', category: 'Language', claim: 'Maintains end-to-end strict type definitions across monorepo packages.' }
    ],
    projects: [
      {
        title: 'Proof-Backed Identity Engine',
        role: 'Lead Architect',
        desc: 'Built deterministic profile completion engine and peer verification request workflow.',
        tech: ['React', 'Supabase', 'Tailwind CSS', 'Vitest'],
        url: 'https://github.com'
      },
      {
        title: 'High-Throughput State Queue',
        role: 'Core Contributor',
        desc: 'Optimized state synchronization queue reducing main looper thread lock contention by 40%.',
        tech: ['TypeScript', 'Cloudflare Workers'],
        url: 'https://github.com'
      }
    ],
    evidenceItems: [
      {
        id: 'EV-8821',
        title: 'GitHub PR #409 — State Queue Optimization',
        status: 'verified',
        relationship: 'VP of Engineering',
        date: '2026-09-20',
        scope: 'Verified core architectural optimization improving transaction throughput.',
        url: 'https://github.com'
      },
      {
        id: 'EV-4902',
        title: 'AWS Certified Solutions Architect (Professional)',
        status: 'verified',
        relationship: 'AWS Credential Registry',
        date: '2026-08-15',
        scope: 'Verified active certification credential ID AWS-883921.',
        url: 'https://aws.amazon.com'
      }
    ]
  };

  // Demo Business Data
  const businessProfile = {
    companyName: 'Apex Precision Manufacturing Co.',
    businessType: 'Custom CNC & Component Supplier',
    legalName: 'Apex Industrial Solutions LLC',
    location: 'Austin, TX • Operating Region: North America & EU',
    yearStarted: 2012,
    employeeBand: '50 – 200 Employees',
    gstin: 'TX-9402',
    website: 'https://apexprecision.example',
    score: 98,
    summary: 'ISO 9001 certified precision manufacturing partner specializing in custom CNC machining, rapid prototyping, and private label assembly.',
    capabilities: [
      { name: 'CNC Precision Milling', category: 'Manufacturing', claim: '5-axis CNC milling machines with 0.005mm tolerance precision.' },
      { name: 'Rapid Prototyping', category: 'R&D', claim: '72-hour turn-around for initial functional aluminum and steel prototypes.' },
      { name: 'Private Labeling', category: 'OEM', claim: 'Custom branding, laser etching, and custom packaging support.' },
      { name: 'ISO 9001:2015', category: 'Quality', claim: 'Annual third-party audit certified quality management system.' }
    ],
    products: [
      {
        name: 'Aerospace Grade Aluminum Bracket A-40',
        category: 'Precision Parts',
        moq: '50 Units',
        leadTime: '7 - 10 Business Days',
        capacity: '5,000 Units / Month',
        privateLabel: true
      },
      {
        name: 'Custom Titanium Enclosure Series-X',
        category: 'Electronics Housing',
        moq: '100 Units',
        leadTime: '14 Business Days',
        capacity: '2,000 Units / Month',
        privateLabel: true
      }
    ],
    evidenceItems: [
      {
        id: 'EV-9901',
        title: 'ISO 9001:2015 Quality Management Certificate',
        status: 'verified',
        relationship: 'TÜV Rheinland Auditor',
        date: '2026-07-01',
        scope: 'Verified active ISO 9001:2015 certificate audit compliance.',
        url: 'https://example.com'
      },
      {
        id: 'EV-9902',
        title: 'Facility Inspection & Machinery Audit Report',
        status: 'verified',
        relationship: 'Industrial Safety Inspector',
        date: '2026-09-05',
        scope: 'Verified 45,000 sq ft facility operating safety and equipment compliance.',
        url: 'https://example.com'
      }
    ]
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      
      {/* Header & Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
        <div>
          <span className="dossier-stamp">
            ★ COMMUNITY SHOWCASE ★
          </span>
          <h1 className="text-3xl font-black text-slate-900 pt-1">
            {profileType === 'person' ? 'Individual Profile Example' : 'Business Profile Example'}
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Browse verified profiles, certificates, and work samples.
          </p>
        </div>

        {/* Profile Type Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white p-1.5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-1">
            <button
              onClick={() => setProfileType('person')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                profileType === 'person'
                  ? 'bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-slate-900" />
              <span>Individual Profile</span>
            </button>
            <button
              onClick={() => setProfileType('business')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                profileType === 'business'
                  ? 'bg-emerald-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-900" />
              <span>Business Profile</span>
            </button>
          </div>

          {setActivePage && (
            <button
              type="button"
              onClick={() => setActivePage(profileType === 'business' ? 'public-business-profile' : 'public-profile', profileType === 'business' ? 'apex-dynamics' : 'alexrivera')}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-black text-slate-900 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
            >
              <span>View Live Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-900" />
            </button>
          )}
        </div>
      </div>

      {/* PERSON PROFILE CHARACTER DOSSIER VIEW */}
      {profileType === 'person' && (
        <div className="space-y-8">
          
          {/* Main Character Header Dossier Card */}
          <div className="dossier-card-yellow rounded-3xl p-8 border-3 border-slate-900 relative overflow-hidden shadow-[8px_8px_0px_0px_#0f172a]">
            
            {/* Top Clip */}
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-amber-300" />
              <span>PROFILE PREVIEW</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-white border-3 border-slate-900 p-1 shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden flex-shrink-0">
                  <img src="/avatar_hero.png" alt="Profile Avatar" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black text-slate-900">{personProfile.name}</h2>
                    <span className="dossier-stamp">
                      ★ VERIFIED PROFILE ★
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{personProfile.headline}</p>
                  <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-700" /> {personProfile.location}</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-black"><Clock className="w-3.5 h-3.5" /> {personProfile.availability}</span>
                  </div>
                </div>
              </div>

              {/* Completion Score */}
              <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-[4px_4px_0px_0px_#0f172a]">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-600 font-extrabold uppercase tracking-wider block">Proof Score</span>
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {personProfile.score} / 100
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Tactile Pill Sections (My Bio, Goal) */}
            <div className="mt-8 pt-6 border-t-2 border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <span className="dossier-pill-bio">My Bio & Story:</span>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-xs font-bold text-slate-900 leading-relaxed">
                  {personProfile.summary}
                </div>
              </div>

              <div className="space-y-2">
                <span className="dossier-pill-goal">My Goal This Year:</span>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-xs font-bold text-slate-900 leading-relaxed">
                  {personProfile.goalThisYear}
                </div>
              </div>

            </div>
          </div>

          {/* Grid: Capabilities & Verified Proof */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Skills / Capabilities Column */}
            <div className="lg:col-span-2 dossier-card-pink rounded-3xl p-6 border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a]">
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-slate-900" />
                <span>SKILLS & SERVICES</span>
              </div>

              <div className="pt-2">
                <span className="dossier-pill-likes">Skills & Capabilities (5)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {personProfile.capabilities.map((cap, i) => (
                  <div key={i} className="bg-white border-2 border-slate-900 p-4 rounded-2xl space-y-1.5 shadow-[3px_3px_0px_0px_#0f172a]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{cap.name}</span>
                      <span className="text-[10px] font-mono bg-pink-200 text-slate-900 px-2 py-0.5 rounded-md font-bold border border-slate-900">{cap.category}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{cap.claim}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof Column */}
            <div className="dossier-card-blue rounded-3xl p-6 border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a]">
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-slate-900" />
                <span>WORK SAMPLES</span>
              </div>

              <div className="pt-2">
                <span className="dossier-pill-proof">Verified Work Samples (2)</span>
              </div>

              <div className="space-y-3 pt-2">
                {personProfile.evidenceItems.map((ev, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenEvidence(ev)}
                    className="w-full text-left bg-white hover:bg-sky-50 border-2 border-slate-900 p-4 rounded-2xl space-y-2 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#0f172a]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-900 font-black">{ev.id}</span>
                      <span className="dossier-stamp">VERIFIED</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{ev.title}</h4>
                    <p className="text-[11px] font-bold text-slate-700">Confirmed by: {ev.relationship}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Projects Section */}
          <div className="dossier-card-mint rounded-3xl p-6 border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a]">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>FEATURED PROJECTS</span>
            </div>

            <div className="pt-2">
              <span className="dossier-pill-about">Featured Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {personProfile.projects.map((proj, i) => (
                <div key={i} className="bg-white border-2 border-slate-900 p-5 rounded-2xl space-y-3 shadow-[3px_3px_0px_0px_#0f172a]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900">{proj.title}</h4>
                    <span className="text-xs font-mono text-slate-900 bg-emerald-200 px-2.5 py-1 rounded-lg font-black border border-slate-900">{proj.role}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-900 text-[11px] font-mono px-2 py-0.5 rounded font-bold border border-slate-900">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* BUSINESS PROFILE FILE VIEW */}
      {profileType === 'business' && (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="dossier-card-peach rounded-3xl p-8 border-3 border-slate-900 relative overflow-hidden shadow-[8px_8px_0px_0px_#0f172a]">
            
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-slate-900" />
              <span>BUSINESS PROFILE</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-slate-900 text-orange-300 flex items-center justify-center font-black text-3xl shadow-[4px_4px_0px_0px_#0f172a]">
                  AP
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{businessProfile.companyName}</h2>
                    <span className="dossier-stamp">
                      ★ VERIFIED BUSINESS ★
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">{businessProfile.businessType}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-800 font-mono font-bold pt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-700" /> {businessProfile.location}</span>
                    <span>Est: {businessProfile.yearStarted}</span>
                    <span>Scale: {businessProfile.employeeBand}</span>
                  </div>
                </div>
              </div>

              {/* Quote CTA */}
              <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl space-y-2 shadow-[4px_4px_0px_0px_#0f172a]">
                <button
                  onClick={handleRequestQuote}
                  className="w-full px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-sm shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-slate-900"
                >
                  <Send className="w-4 h-4 text-slate-900" />
                  <span>{quoteSent ? 'Quote Requested ✓' : 'Request a Quote'}</span>
                </button>
                <span className="text-[10px] font-mono text-slate-700 font-extrabold text-center block">Direct messaging enabled</span>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t-2 border-slate-900">
              <span className="dossier-pill-bio">Company Overview:</span>
              <div className="text-slate-900 text-xs font-bold leading-relaxed mt-2 bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                {businessProfile.summary}
              </div>
            </div>
          </div>

          {/* Product Catalog Grid */}
          <div className="dossier-card rounded-3xl p-6 border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a]">
            <span className="dossier-pill-proof">Products & Services Catalog</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {businessProfile.products.map((prod, i) => (
                <div key={i} className="bg-amber-50 border-2 border-slate-900 p-5 rounded-2xl space-y-3 shadow-[3px_3px_0px_0px_#0f172a]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900">{prod.name}</h4>
                    <span className="text-[10px] font-mono bg-amber-200 text-slate-900 px-2 py-0.5 rounded font-black border border-slate-900">{prod.category}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-900 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border-2 border-slate-900">
                      <span className="text-slate-600 block text-[10px] font-extrabold">MIN ORDER</span>
                      <span className="font-black text-slate-900">{prod.moq}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border-2 border-slate-900">
                      <span className="text-slate-600 block text-[10px] font-extrabold">LEAD TIME</span>
                      <span className="font-black text-emerald-800">{prod.leadTime}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-800 font-mono font-bold">
                    Capacity: <span className="text-slate-900 font-black">{prod.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="dossier-card rounded-3xl p-6 border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a]">
            <span className="dossier-pill-about">Certificates & Quality Documents (2)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {businessProfile.evidenceItems.map((ev, i) => (
                <button
                  key={i}
                  onClick={() => onOpenEvidence(ev)}
                  className="text-left bg-emerald-50 hover:bg-emerald-100 border-2 border-slate-900 p-4 rounded-2xl space-y-2 transition-all cursor-pointer shadow-[3px_3px_0px_0px_#0f172a]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-900 font-black">{ev.id}</span>
                    <span className="dossier-stamp">VERIFIED</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{ev.title}</h4>
                  <p className="text-[11px] font-bold text-slate-700">Confirmed by: {ev.relationship}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
