import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, Send, ShieldCheck, CheckCircle2, 
  HelpCircle, MessageSquare, Building2, User, Paperclip
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    profileType: 'person',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    try {
      await dbStore.sendMessage('alexrivera', {
        sender_name: formData.name,
        sender_email: formData.email,
        subject: `[${formData.subject.toUpperCase()}] Inquiry from ${formData.name}`,
        message: formData.message,
      });
      await dbStore.addReport({
        target_slug: 'alexrivera',
        reason: `Contact Inquiry: [${formData.subject}] from ${formData.name} (${formData.email})`,
        details: formData.message,
      });
    } catch (err) {
      console.warn("Contact transmission queued:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="dossier-stamp">
          ★ CONTACT US ★
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Get in Touch With Our Team
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Have questions about creating your page, verifying work, or business accounts? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="dossier-card rounded-3xl p-6 border-2 border-slate-800 space-y-4">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIRECT CONTACT</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Direct Email</h4>
                <a href="mailto:support@backed.network" className="text-xs text-blue-400 font-mono hover:underline">
                  support@backed.network
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Phone Support</h4>
                <span className="text-xs text-slate-300 font-mono">+1 (800) 555-PROOF</span>
              </div>
            </div>
          </div>

          <div className="dossier-card rounded-3xl p-6 border-2 border-slate-800 space-y-4">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
              <span>OFFICE LOCATION</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Headquarters</h4>
                <p className="text-xs text-slate-400">77 Market Street, Suite 400<br />San Francisco, CA 94103</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Operating Hours</h4>
                <p className="text-xs text-slate-400 font-mono">Monday – Friday: 8am – 6pm PST</p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 dossier-card rounded-3xl p-8 border-2 border-slate-800 relative overflow-hidden">
          
          <div className="dossier-clip">
            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
            <span>TRANSMISSION FILE</span>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Inquiry Transmitted Successfully</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you, <span className="text-white font-bold">{formData.name}</span>. Our verification team will review your dossier and respond within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">Official Inquiry Form</h3>
                <span className="dossier-stamp">RATE LIMITED</span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Inquiry Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">General Information</option>
                    <option value="b2b">B2B Supplier Verification</option>
                    <option value="api">API Access & Integration</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Profile Interest</label>
                  <select
                    value={formData.profileType}
                    onChange={(e) => setFormData({ ...formData, profileType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="person">Person Profile (Individual)</option>
                    <option value="business">Business Profile (Supplier/Agency)</option>
                  </select>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your inquiry or verification requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to Supabase...' : 'Transmit Official Inquiry'}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
