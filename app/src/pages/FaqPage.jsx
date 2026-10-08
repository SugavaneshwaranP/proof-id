import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, Lock, Cpu, Sparkles, Paperclip } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What does "100% Deterministic and AI-Free" mean?',
      a: 'It means zero LLM calls, vector embeddings, or AI black-box algorithms are used in core profile scoring, capability matching, or verification. All completion scores (0–100 pts) and search match ratios are calculated using transparent, decomposable mathematical rules that can be explained in the UI.'
    },
    {
      q: 'How does peer and client evidence verification work?',
      a: 'When you attach a claim or proof item (e.g. GitHub PR, AWS Certificate, ISO audit report), you can send a secure token link to a manager or auditor. They confirm or reject the exact requested claim scope on a 1-click verifier page without needing an account.'
    },
    {
      q: 'What is the difference between a Person Profile and a Business Profile?',
      a: 'Person Profiles are built for individual professionals (engineers, designers, creators) showcasing skills and projects. Business Profiles are built for commercial suppliers (manufacturers, distributors, agencies) detailing production capacities, MOQs, lead times, and facility certificates.'
    },
    {
      q: 'How are private evidence files and documents secured?',
      a: 'All files are stored in encrypted object storage. Private documents are served exclusively through short-lived signed URLs with strict 15-minute expirations. Service-role credentials never ship to the browser.'
    },
    {
      q: 'What is Row Level Security (RLS) and how does it protect data?',
      a: 'Row Level Security is an architectural guarantee enforced directly inside PostgreSQL. Every database row is checked at the database kernel level to ensure anonymous users can only access published allow-listed fields.'
    },
    {
      q: 'Can viewers inspect my profile or business catalog without creating an account?',
      a: 'Yes! Public profiles and B2B product catalogs are 100% accessible via unique canonical URLs without requiring login, registration, or paywalls.'
    }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="dossier-stamp">
          ★ KNOWLEDGE DOSSIER ★
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Everything You Need To Know
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Got questions about deterministic proof verification, RLS policies, or pricing? Find clear answers below.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`dossier-card rounded-2xl border-2 transition-all overflow-hidden relative ${
                isOpen ? 'border-blue-500 bg-slate-900/95 shadow-xl' : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="dossier-clip">
                <Paperclip className="w-3 h-3 text-cyan-400" />
                <span>FAQ #{idx + 1}</span>
              </div>

              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 pt-7 text-left flex items-center justify-between gap-4 font-bold text-white text-base cursor-pointer focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
