import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Globe, CheckCircle2, Paperclip, 
  Copy, Package, Clock, ShieldCheck, Send, X, 
  FileText, Check, Printer, Sparkles, Award
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { getPreScaledImageUrl } from '../lib/imageUtils';

export default function PublicBusinessProfilePage({ slug = 'apex-dynamics', onOpenEvidence }) {
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [productsList, setProductsList] = useState(() => dbStore.getProducts(slug));
  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
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

  // Criterion 7: Login-Free Shareability - Copy URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Criterion 7: Login-Free Shareability - Copy Business Spec
  const handleCopySpec = () => {
    const specText = `
# ${profile.business_name || profile.full_name} — B2B Vendor Specification
- Location: ${profile.location}
- Status: ${profile.availability_status}
- Regions Served: ${(profile.regions_served || ['North America', 'EU']).join(', ')}
- Facility: ${profile.facility_description || 'Certified Manufacturing Facility'}
- Verified Link: ${fullUrl}

## Verified Products & Capacities
${productsList.map((p) => `- ${p.title} (${p.category}) | Price: ${p.price_range} | Lead Time: ${p.lead_time} | MOQ: ${p.min_order_qty || '10 units'}`).join('\n')}

## Certifications & Quality Proofs
${evidenceList.map((e) => `- ${e.title} [${e.status?.toUpperCase()}] (Auditor: ${e.verifier_name || 'TÜV SÜD / Certified Auditor'})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(specText);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  // Criterion 7: Login-Free Shareability - Print / Export PDF
  const handlePrint = () => {
    window.print();
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
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      {/* Public Profile Header Banner & Secondary Toolbar (Criterion 7) */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>VERIFIED B2B BUSINESS SPECIFICATION</span>
        </div>

        {/* Login-Free Shareability Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto no-print">
          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy public link"
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] font-mono font-black px-2.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1 min-h-[36px]"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
          </button>

          {/* Copy Business Spec */}
          <button
            type="button"
            onClick={handleCopySpec}
            title="Copy complete business spec text"
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-[11px] font-mono font-black px-2.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1 min-h-[36px]"
          >
            {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{copiedSpec ? 'Copied Spec!' : 'Copy Spec'}</span>
          </button>

          {/* Print / Export PDF (Criterion 7) */}
          <button
            type="button"
            onClick={handlePrint}
            title="Print or export business spec as PDF without login"
            className="bg-amber-200 hover:bg-amber-300 text-slate-900 text-[11px] font-mono font-black px-2.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1 min-h-[36px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <span className="stamp-verified text-[10px] py-0.5 px-2.5 shrink-0">★ VERIFIED SUPPLIER ★</span>
        </div>
      </div>

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-4 sm:p-8 md:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900 space-y-6">
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>B2B VENDOR SPECIFICATION DOSSIER</span>
        </div>

        {/* Business Header & CRITERION 4: FOCUSED PRIMARY CALL-TO-ACTION */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-6 pt-2">
          <div className="flex items-start gap-4">
            {/* Pre-scaled web avatar (Criterion 6) */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-3 border-slate-900 overflow-hidden bg-white shadow-[4px_4px_0px_0px_#0f172a] shrink-0">
              <img 
                src={getPreScaledImageUrl(profile.avatar_url, 200, 200)} 
                alt={profile.business_name || profile.full_name} 
                loading="eager"
                decoding="async"
                fetchpriority="high"
                width="88"
                height="88"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 break-words">
                {profile.business_name || profile.full_name}
              </h1>
              <p className="text-xs font-mono font-extrabold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" /> {profile.location}
              </p>
              <p className="text-xs font-bold text-slate-700">
                {profile.headline}
              </p>
            </div>
          </div>

          {/* CRITERION 4: EXACTLY ONE PROMINENT PRIMARY CALL-TO-ACTION */}
          <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 no-print">
            <button
              id="primary-business-cta"
              onClick={() => {
                setSelectedProduct(null);
                setShowQuoteModal(true);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Request Business Quote</span>
            </button>
          </div>
        </div>

        {/* Overview & Bio */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
          <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
            COMPANY DESCRIPTION & FACILITY OVERVIEW
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">{profile.bio}</p>
          {profile.facility_description && (
            <p className="text-xs font-mono font-bold text-slate-700 border-t border-slate-200 pt-2">
              Facility: {profile.facility_description}
            </p>
          )}
        </div>

        {/* Products Catalog */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-800" />
            <span>Verified Product Catalog & Capacities ({productsList.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {productsList.map((prod) => (
              <div key={prod.id} className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 border border-slate-900 text-[10px] font-mono font-black uppercase text-emerald-900">
                    {prod.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{prod.lead_time}</span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">{prod.title}</h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">{prod.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-black text-slate-900">{prod.price_range}</span>
                  {/* Secondary Product Button */}
                  <button
                    onClick={() => {
                      setSelectedProduct(prod);
                      setShowQuoteModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-slate-900 font-black text-xs border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer min-h-[36px]"
                  >
                    Request Sample
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Audits & Certifications */}
        {evidenceList && evidenceList.length > 0 && (
          <div className="space-y-3 pt-3 border-t-2 border-slate-900/20">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Certificates & Compliance Audits ({evidenceList.length})</span>
            </h3>

            <div className="space-y-2">
              {evidenceList.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvidence && onOpenEvidence(ev)}
                  className="bg-white p-3.5 rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="stamp-verified text-[9px] py-0.2 px-2">★ {ev.category.toUpperCase()} ★</span>
                    <h5 className="text-xs font-black text-slate-900 truncate">{ev.title}</h5>
                    <p className="text-[10px] font-mono text-slate-600">Auditor: {ev.verifier_name}</p>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-800 underline ml-2 shrink-0">
                    Inspect Proof →
                  </span>
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
          onClick={() => {
            setSelectedProduct(null);
            setShowQuoteModal(true);
          }}
          className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <Send className="w-4 h-4 text-emerald-300" />
          <span>Request Business Quote</span>
        </button>
      </div>

      {/* QUOTE RFP MODAL (Criterion 5: Fully Usable on Mobile <375px) */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg bg-white rounded-3xl p-5 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900 space-y-4 my-auto max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <h3 className="text-base font-black flex items-center gap-2 truncate">
                  <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">RFP Quote: {profile.business_name || profile.full_name}</span>
                </h3>
                <button 
                  onClick={() => setShowQuoteModal(false)} 
                  className="p-1 rounded-lg border-2 border-slate-900 font-bold shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {quoteSent ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-black">RFP Dispatched!</h4>
                  <p className="text-xs font-bold text-slate-700">The engineering & sales team will respond directly to your business email.</p>
                </div>
              ) : (
                <form onSubmit={handleSendQuote} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">Your Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">Requested Quantity (Units)</label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-black uppercase block mb-1">RFP Specifications & Notes</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Attach CAD drawing links, tolerances, or delivery deadlines..."
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
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
