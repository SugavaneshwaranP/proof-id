import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, Eye, Server, UserX } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>Last Updated: October 8, 2026 • GDPR & CCPA Compliant</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Privacy Policy & Data Security</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          At PROOF::ID, transparency is our core foundation. We enforce strict data minimisation, Row Level Security (RLS) isolation, and zero AI-training policies.
        </p>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-cyan-400 font-bold block">0% AI Model Training</span>
          <p className="text-xs text-slate-400">Your profile data is never sold or used to train third-party LLM models.</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-emerald-400 font-bold block">Short-Lived Signed URLs</span>
          <p className="text-xs text-slate-400">Private evidence files expire automatically after 15 minutes.</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-xs font-mono text-blue-400 font-bold block">Allow-Listed Projections</span>
          <p className="text-xs text-slate-400">Public endpoints explicitly isolate allow-listed public fields.</p>
        </div>
      </div>

      {/* Main Privacy Text Sections */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">1.</span> Information We Collect
          </h2>
          <p>
            When you register for a Person or Business Profile on the PROOF::ID Network, we collect necessary account identifiers (Email Address, Display Name, Headline, Location) and optional proof evidence (Pull Requests, Certificate Links, PDF Documents).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Account Authentication Data (via Supabase Auth OAuth tokens or magic links).</li>
            <li>Profile Metadata (Capabilities taxonomy chips, project descriptions, MOQs).</li>
            <li>Verification Activity (Peer verification request logs and timestamp events).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">2.</span> How We Use Your Data
          </h2>
          <p>
            We process data strictly to provide deterministic profile rendering, peer verification link delivery, and aggregate platform analytics.
          </p>
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Deterministic matching scoring calculations</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Delivering secure verification emails</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Aggregate profile view tracking (without PII collection)</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">3.</span> Storage Security & Signed URLs
          </h2>
          <p>
            All evidence files stored in object storage are encrypted at rest. Private documents and internal certificates are accessible only through short-lived signed URLs with strict time-to-live expirations (under 15 minutes).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">4.</span> Your Rights & Data Export
          </h2>
          <p>
            Under GDPR and CCPA, you retain full ownership of your proof data. You may request a complete JSON export of your profile, revoke public visibility at any time, or delete your account permanently.
          </p>
        </section>

      </div>

    </div>
  );
}
