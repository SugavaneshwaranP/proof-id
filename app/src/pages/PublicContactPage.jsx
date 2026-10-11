import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Send, CheckCircle2, Paperclip, MessageSquare, 
  User, Mail, FileText, Info, ArrowLeft, Shield, Zap
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';

export default function PublicContactPage({ name = 'Alex Rivera', slug = 'alexrivera', setActivePage }) {
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yourName || !yourEmail || !message) return;

    dbStore.sendMessage(slug, {
      sender_name: yourName,
      sender_email: yourEmail,
      subject: lookingFor ? `Inquiry regarding ${lookingFor}` : 'Direct Contact Form',
      message: message,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-20 max-w-xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      
      {/* Top Navigation Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActivePage ? setActivePage('public-profile') : window.history.back()}
          className="text-xs font-mono font-black text-slate-900 bg-white px-3 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <span className="stamp-verified text-xs py-0.5 px-3">★ DIRECT CONTACT ★</span>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-4 sm:p-8 md:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">

        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>CONTACT DOSSIER</span>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900">
          <span className="pill-header inline-block text-xs font-mono bg-slate-900 text-white">
            Direct Inquiry Form
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
            “Send a message to {name}”
          </h1>
          <p className="text-xs font-extrabold text-slate-800">
            Delivered in real-time directly to their Backed inbox.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 text-emerald-300 border-2 border-slate-900 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#0f172a]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Message Dispatched!</h3>
            <p className="text-xs font-bold text-slate-800 max-w-xs mx-auto">
              Your inquiry has been sent to {name}'s verified inbox with real-time websocket delivery.
            </p>

            <button
              type="button"
              onClick={() => setActivePage ? setActivePage('public-profile') : window.history.back()}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer"
            >
              Return to Page
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-6">
            
            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase">Your Name *</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase">Your Email *</label>
              <input
                type="email"
                required
                placeholder="jane@company.com"
                value={yourEmail}
                onChange={(e) => setYourEmail(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase">Looking for help with</label>
              <input
                type="text"
                placeholder="e.g., Technical Advisory / Custom Component Order"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase">Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Share project details, timelines, or RFP notes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl p-4 text-xs font-bold text-slate-900 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Send Message</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
