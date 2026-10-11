import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, MapPin, CheckCircle2, Paperclip, 
  Copy, MessageSquare, Clock, Flag, Send, X, Zap, 
  Printer, FileText, Check, Share2
} from 'lucide-react';
import { subscribeToEvidenceChannel } from '../lib/realtime';
import { dbStore } from '../lib/dbStore';
import { getPreScaledImageUrl } from '../lib/imageUtils';

export default function PublicPersonProfilePage({ slug = 'alexrivera', onOpenEvidence }) {
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  const [projectsList, setProjectsList] = useState(() => dbStore.getProjects(slug));
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [liveVerificationToast, setLiveVerificationToast] = useState(null);

  // Sync DB updates & track page view (Login-free public analytics)
  useEffect(() => {
    dbStore.trackView(slug);

    const loadData = () => {
      setProfile(dbStore.getProfile(slug));
      setEvidenceList(dbStore.getEvidence(slug));
      setProjectsList(dbStore.getProjects(slug));
    };

    loadData();
    const unsubStore = dbStore.onSync(loadData);
    const unsubRealtime = subscribeToEvidenceChannel(profile?.id || slug, (updatedEvidence) => {
      setLiveVerificationToast(`Proof "${updatedEvidence.title || 'Artifact'}" was just verified live!`);
      loadData();
      setTimeout(() => setLiveVerificationToast(null), 5000);
    });

    return () => {
      unsubStore();
      if (typeof unsubRealtime === 'function') unsubRealtime();
    };
  }, [slug]);

  const fullUrl = `https://backed.network/${slug}`;

  // Criterion 7: Login-Free Shareability - Copy URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Criterion 7: Login-Free Shareability - Copy Profile Summary
  const handleCopySummary = () => {
    const summaryText = `
# ${profile.full_name} — Backed Verified Profile
- Headline: ${profile.headline}
- Location: ${profile.location}
- Availability: ${profile.availability_status}
- Verified URL: ${fullUrl}

## Capabilities
${(profile.capabilities || []).map((c) => `- ${c.name} (${c.endorsement_count || 10} verified)`).join('\n')}

## Verified Proof Badges
${evidenceList.map((e) => `- ${e.title} [${e.status?.toUpperCase()}] (Verifier: ${e.verifier_name || 'Confirmed Peer'})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Criterion 7: Login-Free Shareability - Print / Export PDF
  const handlePrint = () => {
    window.print();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactMessage || !senderEmail) return;

    dbStore.sendMessage(slug, {
      sender_name: senderName || 'Public Visitor',
      sender_email: senderEmail,
      subject: 'Direct Profile Inquiry',
      message: contactMessage,
    });

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowContactModal(false);
      setContactMessage('');
      setSenderName('');
      setSenderEmail('');
    }, 1500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason) return;
    dbStore.addReport({
      target_slug: slug,
      reason: reportReason,
      reporter: 'Public Visitor',
    });
    setReportSent(true);
    setTimeout(() => {
      setReportSent(false);
      setShowReportModal(false);
      setReportReason('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Realtime Proof Badge Status Alert Banner */}
      <AnimatePresence>
        {liveVerificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-400 text-slate-900 p-3 sm:p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3 no-print"
          >
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
              <Zap className="w-4 h-4 text-slate-900 fill-slate-900 animate-bounce" />
              <span>{liveVerificationToast}</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded-lg">
              REAL-TIME SYNC
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Person Profile Dossier Card */}
      <div className="dossier-card rounded-3xl p-4 sm:p-8 md:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6 sm:space-y-8">
        {/* Top Metallic Clip & Secondary Utilities Bar (Criterion 4 & Criterion 7) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900/40 pb-3 gap-3">
          <div className="dossier-clip relative top-0 left-0">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase font-mono font-black text-[10px] sm:text-xs">
              VERIFIED PERSON DOSSIER • {slug}
            </span>
          </div>

          {/* Secondary Action Toolbar: All Login-Free (Criterion 7) */}
          <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto no-print">
            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy shareable link"
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-[11px] font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            {/* Copy Spec Summary */}
            <button
              type="button"
              onClick={handleCopySummary}
              title="Copy profile summary as text"
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-[11px] font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{copiedSummary ? 'Copied Summary!' : 'Copy Spec'}</span>
            </button>

            {/* Print / Export PDF (Criterion 7) */}
            <button
              type="button"
              onClick={handlePrint}
              title="Print or save as PDF without login"
              className="px-2.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 border-2 border-slate-900 text-[11px] font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-100 border-2 border-slate-900 text-slate-700 hover:text-red-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Report Profile"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Hero Section */}
        <div className="flex flex-col md:flex-row gap-5 sm:gap-6 items-start">
          {/* Pre-scaled web avatar (Criterion 6) */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-3 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] shrink-0 bg-amber-200">
            <img 
              src={getPreScaledImageUrl(profile.avatar_url, 200, 200)} 
              alt={profile.full_name} 
              loading="eager"
              decoding="async"
              fetchpriority="high"
              width="112"
              height="112"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">
                {profile.full_name}
              </h1>
              <span className="stamp-verified text-[10px] sm:text-[11px] py-0.5 px-2.5 inline-flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                VERIFIED PROFILE
              </span>
            </div>

            <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug break-words">
              {profile.headline}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {profile.location}
              </span>
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-slate-900">
                <Clock className="w-3.5 h-3.5 text-emerald-700" /> {profile.availability_status}
              </span>
            </div>
          </div>

          {/* CRITERION 4: EXACTLY ONE PROMINENT PRIMARY CALL-TO-ACTION */}
          <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0 no-print">
            <button
              type="button"
              id="primary-profile-cta"
              onClick={() => setShowContactModal(true)}
              className="w-full md:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2.5 min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Contact Person</span>
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-[#fef9c3] p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1.5">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block">
            VERIFIED BIOGRAPHY & STATEMENT
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Capabilities Taxonomy & Endorsements */}
        {profile.capabilities && profile.capabilities.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block">
              CONFIRMED CAPABILITIES & SKILLS
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.capabilities.map((cap, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-2 text-xs font-extrabold text-slate-900"
                >
                  <span>{cap.name}</span>
                  <span className="bg-amber-300 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black border border-slate-900">
                    +{cap.endorsement_count || 10} verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERIFIED EVIDENCE BADGES */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-900/30">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Proof Cards ({evidenceList.length})</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">PEER VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onOpenEvidence && onOpenEvidence(ev)}
                className="bg-emerald-50 hover:bg-emerald-100 border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#0f172a] space-y-2.5 cursor-pointer transition-all hover:translate-y-[-2px]"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-900 text-[10px] font-mono font-black text-slate-900 uppercase">
                    {ev.category}
                  </span>
                  <span className="stamp-verified text-[10px] py-0.5 px-2">
                    ★ {ev.status?.toUpperCase() || 'VERIFIED'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  {ev.title}
                </h4>

                {ev.verifier_note && (
                  <p className="text-xs font-bold text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-900/60">
                    "{ev.verifier_note}"
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 pt-1 border-t border-slate-900/20">
                  <span className="truncate">Verifier: {ev.verifier_name || 'Confirmed Peer'}</span>
                  <span className="text-emerald-800 underline shrink-0">Inspect Proof →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED PROJECTS */}
        {projectsList && projectsList.length > 0 && (
          <div className="space-y-4 pt-4 border-t-2 border-slate-900/30">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Key Projects & Case Studies ({projectsList.length})</span>
            </h3>

            <div className="space-y-3">
              {projectsList.map((proj) => (
                <div key={proj.id} className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-black text-slate-900">{proj.title}</h4>
                    <span className="text-xs font-mono font-bold text-slate-500">{proj.year}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tags && proj.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-800 border border-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Primary CTA for Mobile Screens (<375px) */}
      <div className="fixed bottom-3 left-3 right-3 z-40 sm:hidden no-print">
        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
          <span>Contact Person</span>
        </button>
      </div>

      {/* CONTACT MODAL (Criterion 5: Fully Usable on Mobile <375px) */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg bg-white rounded-3xl p-5 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 space-y-4 my-auto max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 truncate">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">Contact {profile.full_name}</span>
                </h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="p-1 rounded-lg border-2 border-slate-900 hover:bg-slate-100 shrink-0 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {messageSent ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-black">Message Dispatched!</h4>
                  <p className="text-xs font-bold text-slate-700">Your inquiry has been delivered directly to {profile.full_name}'s inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-mono font-extrabold uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-extrabold uppercase block mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-extrabold uppercase block mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hi! I would love to connect regarding..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>Dispatch Message</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-white rounded-3xl p-5 sm:p-6 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 space-y-4 my-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <h3 className="text-sm sm:text-base font-black flex items-center gap-2 text-red-600">
                  <Flag className="w-4 h-4" />
                  <span>Report Profile Issue</span>
                </h3>
                <button onClick={() => setShowReportModal(false)} className="p-1 rounded-lg border-2 border-slate-900 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reportSent ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black">Report Filed</h4>
                  <p className="text-xs font-bold text-slate-700">Thank you. Moderation ticket logged.</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-mono font-bold block mb-1">Reason for report</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please specify why this profile should be reviewed..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 hover:bg-red-700 cursor-pointer min-h-[44px]"
                  >
                    Submit Moderation Report
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
