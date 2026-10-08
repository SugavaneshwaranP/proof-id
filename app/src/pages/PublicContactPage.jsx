import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Send, CheckCircle2, Paperclip, MessageSquare, 
  User, Mail, FileText, Info, ArrowLeft, Shield, Zap
} from 'lucide-react';
import { broadcastInboxMessage } from '../lib/realtime';

export default function PublicContactPage({ name = 'Alex Rivera', slug = 'alexrivera', profileId = 'alexrivera-id', setActivePage }) {
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yourName || !yourEmail || !message) return;
    setIsSubmitted(true);

    // Broadcast message real-time event to inbox:{profile_id} and profile:{profile_id}:activity channels
    broadcastInboxMessage(profileId, {
      id: Date.now(),
      senderName: yourName,
      senderEmail: yourEmail,
      dateReceived: 'Just now',
      capabilityTag: lookingFor || 'General Inquiry',
      messageText: message,
      isHandled: false,
      isUnread: true,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8 pb-20 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 font-sans desk-grid-background">
      
      {/* Top Navigation Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActivePage ? setActivePage('public-profile') : window.history.back()}
          className="text-xs font-mono font-black text-slate-900 bg-white px-3.5 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <span className="stamp-verified text-xs py-0.5 px-3">★ DIRECT CONTACT ★</span>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CONTACT DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Conversion Action
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
            “Get in touch with {name}”
          </h1>
        </div>

        {/* CONFIRMATION STATE */}
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-300 text-slate-900 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Sent. {name} usually replies within a few days.
            </h3>

            <p className="text-xs font-extrabold text-slate-800 max-w-sm mx-auto">
              Your message was signed and delivered directly to {name}'s verified Backed inbox.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-mono font-black text-slate-900 underline hover:text-emerald-800"
              >
                Send another message
              </button>
            </div>
          </motion.div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-5 pt-6">
            
            {/* Your name */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-800" />
                Your name
              </label>
              <input
                type="text"
                required
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Your email */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-800" />
                Your email
              </label>
              <input
                type="email"
                required
                value={yourEmail}
                onChange={(e) => setYourEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* What are you looking for? */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-800" />
                What are you looking for?
              </label>
              <input
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="A line or two (e.g. Contract project, supplier quote)"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-800" />
                Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them more"
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[3px_3px_0px_0px_#0f172a] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Send message</span>
            </button>

            {/* RATE-LIMIT NOTICE */}
            <div className="bg-white/80 p-3.5 rounded-xl border-2 border-slate-900 flex items-start gap-2 text-[11px] font-extrabold text-slate-700 shadow-[2px_2px_0px_0px_#0f172a] mt-4">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>Please don’t send more than a few messages a day — it helps keep things genuine.</p>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
