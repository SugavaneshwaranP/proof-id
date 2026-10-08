import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, MapPin, Briefcase, CheckCircle2, Paperclip, 
  ExternalLink, Copy, Share2, MessageSquare, AlertCircle, Eye, 
  Sparkles, Calendar, Award, User, Clock, Flag, Send, X
} from 'lucide-react';

export default function PublicPersonProfilePage({ slug = 'alexrivera', onOpenEvidence }) {
  const [copied, setCopied] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const fullUrl = `https://backed.app/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowContactModal(false);
      setContactMessage('');
      setSenderEmail('');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Public Profile Header Banner */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>VERIFIED BACKED PERSON PROFILE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share Page'}</span>
          </button>
          <span className="stamp-verified text-xs py-0.5 px-3">★ 100% PROOF ★</span>
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PERSON DOSSIER — PUBLIC</span>
        </div>

        {/* HEADER SECTION */}
        <div className="space-y-6 pb-8 border-b-3 border-slate-900/60 pt-2">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src="/avatar_hero.png"
              alt="Alex Rivera"
              className="w-28 h-28 rounded-3xl object-cover border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] shrink-0"
            />

            <div className="space-y-2 text-center sm:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Alex Rivera
                </h1>
                
                {/* Availability Badge */}
                <span className="bg-emerald-300 text-slate-900 font-mono font-black text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  “Open to work”
                </span>
              </div>

              {/* Headline in their own words */}
              <p className="text-base font-black text-slate-800 leading-snug">
                “Backend developer who ships fast”
              </p>

              {/* Location */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-900" />
                <span>San Francisco, CA • backed.app/alexrivera</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: WHAT I DO */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="pill-header text-xs bg-slate-900 text-white font-mono">
              SECTION: WHAT I DO
            </span>
            <span className="text-xs font-mono font-black text-slate-700 uppercase">6 CORE CAPABILITIES</span>
          </div>

          {/* Capability Chips (3–8) */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[
              'Backend Systems',
              'Rust Architecture',
              'API Verification',
              'Distributed Ledgers',
              'Microservices',
              'CI/CD Automation'
            ].map((cap) => (
              <span
                key={cap}
                className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 2: PROOF OF WORK */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-6">
          <div>
            <span className="pill-header text-xs bg-emerald-300 text-slate-900 font-mono">
              SECTION: PROOF OF WORK
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 pt-2">
              Real projects. Real evidence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Project Card 1 */}
            <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                
                {/* Verification Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="stamp-verified text-[9px] py-0.5 px-2">★ CONFIRMED BY A CLIENT ★</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">June 2025</span>
                </div>

                <h3 className="text-lg font-black text-slate-900">E-commerce site for a local bakery</h3>
                <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                  Handled 50k peak requests/min with zero downtime and verified receipt artifacts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenEvidence) {
                    onOpenEvidence({
                      title: 'E-commerce site for a local bakery',
                      type: 'Project Proof',
                      issuer: 'Confirmed by Bakery Client',
                      date: 'June 2025',
                      link: 'https://github.com/alexrivera/bakery-storefront'
                    });
                  } else {
                    alert('Viewing proof artifact details: https://github.com/alexrivera/bakery-storefront');
                  }
                }}
                className="w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-slate-900" />
                <span>View evidence</span>
              </button>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                
                {/* Verification Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="stamp-verified text-[9px] py-0.5 px-2">★ ISSUER CONFIRMED ★</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Oct 2025</span>
                </div>

                <h3 className="text-lg font-black text-slate-900">Rust Enterprise System Certification</h3>
                <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                  Official CNCF certified auditor seal for high-throughput distributed memory safety.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenEvidence) {
                    onOpenEvidence({
                      title: 'Rust Enterprise System Certification',
                      type: 'Certification Seal',
                      issuer: 'CNCF / Linux Foundation',
                      date: 'Oct 2025',
                      link: 'https://cncf.io/verify/rust-9921'
                    });
                  } else {
                    alert('Viewing certification evidence: https://cncf.io/verify/rust-9921');
                  }
                }}
                className="w-full py-3 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-slate-900" />
                <span>View evidence</span>
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 3: BACKGROUND */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-4">
          <span className="pill-header text-xs bg-amber-300 text-slate-900 font-mono">
            SECTION: BACKGROUND
          </span>
          
          <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <div>
              <h4 className="text-xs font-mono font-black text-slate-500 uppercase">EXPERIENCE & ROLES</h4>
              <p className="text-sm font-black text-slate-900 pt-1">Senior Backend Engineer • Apex Labs (2023 – Present)</p>
              <p className="text-xs font-extrabold text-slate-700">Rust Core Contributor & Microservices Architect</p>
            </div>

            <div className="border-t-2 border-slate-900/10 pt-3">
              <h4 className="text-xs font-mono font-black text-slate-500 uppercase">EDUCATION</h4>
              <p className="text-sm font-black text-slate-900 pt-1">B.S. Computer Science • University of California, Berkeley</p>
            </div>

            <div className="border-t-2 border-slate-900/10 pt-3 flex flex-wrap items-center gap-4 text-xs font-mono font-black text-slate-900">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="underline hover:text-emerald-700 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> GitHub Profile
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="underline hover:text-emerald-700 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON & FRESHNESS NOTE */}
        <div className="pt-8 space-y-4 text-center">
          
          {/* Action Button */}
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-5 h-5 text-emerald-300" />
            <span>Get in touch</span>
          </button>

          {/* Freshness Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-700 pt-2">
            <Clock className="w-3.5 h-3.5 text-slate-900" />
            <span>Last updated 3 weeks ago</span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="pt-10 border-t-2 border-slate-900/40 flex items-center justify-between text-xs font-mono font-black text-slate-800">
          <span>Made with Backed</span>
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="underline hover:text-red-700 flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5 text-slate-600" />
            <span>Report this page</span>
          </button>
        </div>

      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
              <span className="text-xs font-mono font-black uppercase">GET IN TOUCH WITH ALEX</span>
              <button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-slate-900">Message Delivered!</h4>
                <p className="text-xs font-bold text-slate-700">Alex will receive your message in their Backed inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Your Email</label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Your Message</label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Hi Alex, saw your page..."
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 max-w-sm w-full text-center space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl border-2 border-slate-900 mx-auto flex items-center justify-center">
              <Flag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Report this page</h3>
            <p className="text-xs font-extrabold text-slate-700">
              If you believe claims or proof artifacts on this page are misleading, report it to our trust and safety audit team.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 font-black text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Report submitted to Trust & Safety Team.');
                  setShowReportModal(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-amber-300 border-2 border-slate-900 text-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#0f172a]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
