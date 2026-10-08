import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, Share2, QrCode, ArrowRight, Paperclip, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export default function OnboardingPublishedPage({ setActivePage, slug = 'alexrivera' }) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fullUrl = `https://backed.app/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out my verified Backed page: ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(fullUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Published Banner Status */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          PAGE PUBLISHED & VERIFIED
        </span>
        <span className="stamp-verified text-xs py-0.5 px-3">★ LIVE ★</span>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PUBLISHED PAGE DOSSIER</span>
        </div>

        {/* Success Icon & Header */}
        <div className="text-center space-y-3 pb-6 border-b-2 border-slate-900/60">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-20 h-20 bg-emerald-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
            “You’re live.”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Your page is out in the world — here’s your link.
          </p>
        </div>

        {/* Link Display with Copy Button */}
        <div className="space-y-6 pt-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-2">
            <span className="text-[11px] font-mono font-black text-slate-500 uppercase tracking-wider block">
              YOUR SHAREABLE PAGE ADDRESS
            </span>
            <div className="flex items-center justify-between gap-3 bg-slate-100 p-3.5 rounded-xl border-2 border-slate-900 font-mono text-sm font-black text-slate-900">
              <span className="truncate">{fullUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-xs font-mono font-black px-3.5 py-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              SHARE YOUR PAGE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4 text-emerald-600" />
                <span>Copy link</span>
              </button>

              {/* Share on WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Share on WhatsApp</span>
              </button>

              {/* Share on LinkedIn */}
              <button
                type="button"
                onClick={handleLinkedInShare}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>Share on LinkedIn</span>
              </button>

              {/* Download QR Code */}
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>Download QR code</span>
              </button>

            </div>
          </div>

          {/* Go to my dashboard Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Go to my dashboard</span>
              <ArrowRight className="w-5 h-5 text-emerald-300" />
            </button>
          </div>

        </div>

      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 max-w-sm w-full text-center space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-2">
              <span className="text-xs font-mono font-black uppercase">PAGE QR CODE</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-xs font-black hover:underline"
              >
                Close
              </button>
            </div>
            <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <p className="text-xs font-bold text-slate-700">Scan to view <span className="font-mono text-slate-900 font-black">{fullUrl}</span></p>
            <button
              onClick={() => {
                alert('QR Code SVG Downloaded');
                setShowQrModal(false);
              }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669]"
            >
              Save QR Code Image
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
