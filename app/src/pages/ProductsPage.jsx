import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Check, Zap, Sparkles, Building2, User, Lock, 
  HelpCircle, ArrowRight, FileCheck, Search, Database, Layers, Paperclip
} from 'lucide-react';

export default function ProductsPage({ setActivePage }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const offerings = [
    {
      id: 'person-verification',
      badge: 'Person Primitive',
      title: 'Individual Proof Verification',
      desc: 'For software engineers, creators, consultants, and individual professionals seeking verifiable proof.',
      icon: User,
      color: 'from-blue-600 to-indigo-600',
      features: [
        'Normalized capability taxonomy chips',
        'Project portfolio items & proof links',
        'Peer verification request generator',
        '100% deterministic profile completion score',
        'Zero-login shareable profile URL'
      ]
    },
    {
      id: 'b2b-vault',
      badge: 'Business Primitive',
      title: 'B2B Supplier Verification Vault',
      desc: 'For manufacturers, wholesalers, exporters, and agencies detailing capacities, MOQs, and lead times.',
      icon: Building2,
      color: 'from-cyan-600 to-blue-600',
      features: [
        'Standardized product catalogs with MOQs',
        'ISO & registration certificate vault',
        'Production unit & capacity specifications',
        'Commercial & payment terms display',
        'Direct inquiry & quote request CTA'
      ]
    },
    {
      id: 'matching-engine',
      badge: 'Discovery Engine',
      title: 'Deterministic Matching Engine',
      desc: 'Connect buyers to suppliers and recruiters to talent using a transparent, decomposable match algorithm.',
      icon: Search,
      color: 'from-indigo-600 to-cyan-500',
      features: [
        'Capability overlap ratio calculation (40%)',
        'Evidence match ratio calculation (25%)',
        'Availability & location proximity filter',
        'Decomposable match reason explanation',
        'Postgres GIN index search query'
      ]
    }
  ];

  const pricingPlans = [
    {
      name: 'Individual Free',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'forever free',
      desc: 'Essential proof verification for individuals and open source creators.',
      popular: false,
      buttonText: 'Start Free Profile',
      features: [
        '1 Person Profile',
        'Up to 8 Capability Chips',
        'Unlimited Proof Links',
        '3 Peer Verification Requests/mo',
        'Standard Public Profile URL',
        'Deterministic Completion Engine'
      ]
    },
    {
      name: 'Pro Verifier',
      priceMonthly: '$29',
      priceAnnual: '$22',
      period: 'per month, billed annually',
      desc: 'For active consultants, senior engineers, and growing agencies.',
      popular: true,
      buttonText: 'Get Pro Verifier',
      features: [
        'Everything in Individual Free',
        'Unlimited Peer Verification Requests',
        'Supabase Storage Document Vault (5GB)',
        'Short-lived Signed URLs with Expiration',
        'Custom Domain & Custom Slug Reservation',
        'Dynamic QR Code & Open Graph Generator',
        'Priority Peer Verification Processing'
      ]
    },
    {
      name: 'Enterprise Business',
      priceMonthly: '$99',
      priceAnnual: '$79',
      period: 'per month, billed annually',
      desc: 'For manufacturers, suppliers, and enterprise procurement teams.',
      popular: false,
      buttonText: 'Contact Enterprise',
      features: [
        'Full B2B Business Profile Schema',
        'Standardized Product Catalog & MOQs',
        'ISO & Facility Document Verification',
        'Deterministic Buyer Matching Engine',
        'Row Level Security (RLS) Sub-Accounts',
        'Dedicated SLA & Verification Support',
        'API Access for Automated Verification'
      ]
    }
  ];

  const featureComparison = [
    { feature: 'Deterministic Completion Score', free: true, pro: true, enterprise: true },
    { feature: 'Capability Taxonomy Chips', free: '8 Max', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Signed Storage URLs', free: false, pro: true, enterprise: true },
    { feature: 'B2B Product Catalogs & MOQs', free: false, pro: false, enterprise: true },
    { feature: 'Deterministic Matching Score', free: false, pro: true, enterprise: true },
    { feature: 'Zero AI Hallucination Guarantee', free: true, pro: true, enterprise: true },
    { feature: 'Row Level Security Isolation', free: true, pro: true, enterprise: true }
  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="dossier-stamp font-mono">
          ★ SPECIFICATION PLANS ★
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Verifiable Identity Solutions
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Clear, transparent offerings with 100% deterministic rules. No hidden fees or AI black-box scoring.
        </p>
      </div>

      {/* CORE OFFERINGS BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offerings.map((item) => {
          const IconComp = item.icon;
          return (
            <div key={item.id} className="dossier-card p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all">
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                <span>OFFERING SPEC FILE</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="dossier-pill-bio">{item.badge}</span>
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6">
                <button 
                  onClick={() => setActivePage('explorer')}
                  className="w-full bg-slate-950 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Offering</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRICING TOGGLE & TIERS */}
      <div className="space-y-10 pt-10">
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Transparent Pricing Plans</h2>
          <p className="text-slate-400 text-sm">Choose the tier that fits your verification scale.</p>
          
          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-sm ${!isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 border-2 border-slate-700 transition-colors relative cursor-pointer"
            >
              <motion.div
                layout
                className="w-6 h-6 bg-blue-500 rounded-full shadow-md"
                animate={{ x: isAnnual ? 24 : 0 }}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Annual Billing
              <span className="dossier-stamp">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`dossier-card rounded-3xl p-8 border-2 flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'border-blue-500 bg-slate-900/95 shadow-2xl shadow-blue-500/25 scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="dossier-clip">
                <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                <span>PLAN DOSSIER</span>
              </div>

              {plan.popular && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-mono text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> MOST POPULAR
                </div>
              )}

              <div className="space-y-6 pt-2">
                <div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/{isAnnual ? 'mo (annual)' : 'mo'}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setActivePage('contact')}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* DETAILED FEATURE COMPARISON TABLE */}
      <div className="pt-12 space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Feature Breakdown Matrix</h3>
        <div className="dossier-card rounded-3xl border-2 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-slate-950 border-b-2 border-slate-800 text-slate-400 font-mono text-xs uppercase">
                <tr>
                  <th className="p-4 sm:p-5">Platform Feature</th>
                  <th className="p-4 sm:p-5 text-center">Free</th>
                  <th className="p-4 sm:p-5 text-center">Pro Verifier</th>
                  <th className="p-4 sm:p-5 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {featureComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : <span className="text-xs font-mono">{row.free}</span>}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : <span className="text-xs font-mono">{row.pro}</span>}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>
                      ) : <span className="text-xs font-mono">{row.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
