import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Globe, CheckCircle2, Paperclip, 
  Copy, Package, Clock, ShieldCheck, ExternalLink, Send, X, 
  FileCheck, Truck, CreditCard, Sparkles, Award, Factory
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';

export default function PublicBusinessProfilePage({ slug = 'apex-dynamics', onOpenEvidence }) {
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [productsList, setProductsList] = useState(() => dbStore.getProducts(slug));
  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  
  const [copied, setCopied] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    dbStore.trackView(slug);

    const load = () => {
      setProfile(dbStore.getProfile(slug));
      setProductsList(dbStore.getProducts(slug));
      setEvidenceList(dbStore.getEvidence(slug));
    };

    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, [slug]);

  const fullUrl = `https://backed.network/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!buyerEmail || !quoteNotes) return;

    dbStore.sendMessage(slug, {
      sender_name: buyerEmail.split('@')[0],
      sender_email: buyerEmail,
      subject: `RFP Quote Request (${quantity} units)`,
      message: `Product: ${selectedProduct?.title || 'General RFP'}\nQuantity: ${quantity}\nNotes: ${quoteNotes}`,
    });

    setQuoteSent(true);
    setTimeout(() => {
      setQuoteSent(false);
      setShowQuoteModal(false);
      setQuoteNotes('');
      setBuyerEmail('');
      setQuantity('100');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Public Profile Header Banner */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>VERIFIED B2B BUSINESS FILE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share Business File'}</span>
          </button>
          <span className="stamp-verified text-xs py-0.5 px-3">★ VERIFIED SUPPLIER ★</span>
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>B2B VENDOR DOSSIER</span>
        </div>

        {/* Business Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-3 border-slate-900 overflow-hidden bg-white shadow-[4px_4px_0px_0px_#0f172a] shrink-0">
              <img src={profile.avatar_url} alt={profile.business_name || profile.full_name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{profile.business_name || profile.full_name}</h1>
              <p className="text-xs font-mono font-extrabold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" /> {profile.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowQuoteModal(true);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 cursor-pointer"
          >
            Request RFP Quote
          </button>
        </div>

        {/* Overview & Bio */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase">COMPANY DESCRIPTION & FACILITY OVERVIEW</span>
          <p className="text-sm font-bold text-slate-900 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Products Catalog */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-800" />
            <span>Verified Product Catalog ({productsList.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsList.map((prod) => (
              <div key={prod.id} className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 border border-slate-900 text-[10px] font-mono font-black uppercase text-emerald-900">
                    {prod.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{prod.lead_time}</span>
                </div>

                <h4 className="text-base font-black text-slate-900">{prod.title}</h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">{prod.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-black text-slate-900">{prod.price_range}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(prod);
                      setShowQuoteModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-300 text-slate-900 font-black text-xs border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                  >
                    Request Sample / Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUOTE RFP MODAL */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>Request RFP Quote from {profile.business_name || profile.full_name}</span>
                </h3>
                <button onClick={() => setShowQuoteModal(false)} className="p-1 rounded-lg border-2 border-slate-900 font-bold">✕</button>
              </div>

              {quoteSent ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-black">RFP Dispatched!</h4>
                  <p className="text-xs font-bold text-slate-700">The sales engineering team will respond directly to your email.</p>
                </div>
              ) : (
                <form onSubmit={handleSendQuote} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">Your Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">Requested Quantity (Units)</label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">RFP Specifications & Notes</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Attach CAD drawing links, material tolerances, or delivery deadlines..."
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>Submit RFP Quote Request</span>
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
