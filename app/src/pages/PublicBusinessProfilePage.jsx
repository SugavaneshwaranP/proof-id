import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Globe, CheckCircle2, Paperclip, 
  Copy, Package, Clock, ShieldCheck, ExternalLink, Send, X, 
  FileCheck, Truck, CreditCard, Sparkles, Award, Factory
} from 'lucide-react';

export default function PublicBusinessProfilePage({ slug = 'apex-dynamics', onOpenEvidence }) {
  const [copied, setCopied] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [quoteSent, setQuoteSent] = useState(false);

  const fullUrl = `https://backed.app/business/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
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
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>BUSINESS FILE DOSSIER — PUBLIC</span>
        </div>

        {/* HEADER SECTION */}
        <div className="space-y-6 pb-8 border-b-3 border-slate-900/60 pt-2">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-3xl bg-emerald-200 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex items-center justify-center text-5xl shrink-0">
              🏢
            </div>

            <div className="space-y-2 text-center sm:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Apex Precision Dynamics
                </h1>
                
                {/* Tag & Badge */}
                <span className="bg-amber-300 text-slate-900 font-mono font-black text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  Manufacturer
                </span>

                <span className="bg-white text-slate-900 font-mono font-black text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  “Open for enquiries”
                </span>
              </div>

              <p className="text-sm font-extrabold text-slate-800">
                Precision CNC Machining & ISO-Certified Component Fabrication
              </p>

              {/* Location + Regions Served */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono font-bold text-slate-800 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-900" />
                  Based in Austin, TX
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-900" />
                  Serves: North America, EU, APAC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: WHAT WE OFFER */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-6">
          <div>
            <span className="pill-header text-xs bg-slate-900 text-white font-mono">
              SECTION: WHAT WE OFFER
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 pt-2">
              Product & Service Offerings
            </h2>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Product Card 1 */}
            <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-900 bg-amber-200 px-2 py-0.5 rounded-md border border-slate-900">
                    Manufacturing & Hardware
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-mono font-black px-2 py-0.5 rounded-md border border-slate-900">
                    Export Ready
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">Custom High-Precision CNC Machined Parts</h3>
                <p className="text-xs font-extrabold text-slate-700 leading-relaxed">
                  Aerospace-grade aluminum and stainless steel CNC components built to tight ISO 9001 tolerances.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono font-bold border-t-2 border-slate-900/10">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">MINIMUM ORDER</span>
                    <span className="text-slate-900 font-black">50 units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">LEAD TIME</span>
                    <span className="text-slate-900 font-black">14 business days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-900 bg-amber-200 px-2 py-0.5 rounded-md border border-slate-900">
                    Sustainable Packaging
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-mono font-black px-2 py-0.5 rounded-md border border-slate-900">
                    Private Label
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">Eco-Friendly Recyclable Packaging Sets</h3>
                <p className="text-xs font-extrabold text-slate-700 leading-relaxed">
                  FSC-certified biodegradable corrugated boxes with custom soy-ink printing for food brands.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono font-bold border-t-2 border-slate-900/10">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">MINIMUM ORDER</span>
                    <span className="text-slate-900 font-black">500 units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">LEAD TIME</span>
                    <span className="text-slate-900 font-black">7 business days</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: CAPACITY & FACILITIES */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-4">
          <span className="pill-header text-xs bg-yellow-300 text-slate-900 font-mono">
            SECTION: CAPACITY & FACILITIES
          </span>
          
          <div className="bg-white p-6 rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-2xl shrink-0">
                🏭
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">35,000 sq ft Advanced Production Facility</h3>
                <p className="text-xs font-bold text-slate-600">Austin, Texas Industrial Park</p>
              </div>
            </div>

            <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
              Equipped with 12 5-axis DMG MORI CNC milling machines, automated CMM quality inspection rigs, and cleanroom assembly lines operating 24/7.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs font-mono font-black">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 block">MONTHLY CAPACITY</span>
                <span>45,000 units</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 block">SHIFT MODEL</span>
                <span>3 Shifts / 24-7</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 block">TOLERANCE</span>
                <span>±0.005 mm</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[10px] text-slate-500 block">QUALITY STAFF</span>
                <span>8 Certified Aud.</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CERTIFICATES & REGISTRATIONS */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-4">
          <span className="pill-header text-xs bg-emerald-300 text-slate-900 font-mono">
            SECTION: CERTIFICATES & REGISTRATIONS
          </span>

          <div className="space-y-3">
            
            {/* Cert 1 */}
            <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="stamp-verified text-[9px] py-0.5 px-2">★ CONFIRMED BY AUDITOR ★</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">ISO 9001:2015</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">Quality Management System Certification</h4>
                <p className="text-xs font-mono font-bold text-slate-600">Issued: Jan 2024 • Expires: Dec 2027 • TÜV SÜD Audit</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenEvidence) {
                    onOpenEvidence({
                      title: 'ISO 9001:2015 Quality Certification',
                      type: 'Audited Registration',
                      issuer: 'TÜV SÜD Quality Bureau',
                      date: 'Valid through Dec 2027',
                      link: 'https://tuv.com/cert/9001-cnc'
                    });
                  } else {
                    alert('Viewing audited ISO certificate: https://tuv.com/cert/9001-cnc');
                  }
                }}
                className="bg-amber-200 hover:bg-amber-300 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] shrink-0"
              >
                Inspect Cert
              </button>
            </div>

            {/* Cert 2 */}
            <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="stamp-verified text-[9px] py-0.5 px-2">★ CONFIRMED BY ISSUER ★</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">FDA Facility Reg.</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">Food & Medical Grade Component Registration</h4>
                <p className="text-xs font-mono font-bold text-slate-600">Issued: March 2025 • Active Registration • US FDA Reg #399201</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenEvidence) {
                    onOpenEvidence({
                      title: 'FDA Medical Component Registration',
                      type: 'Federal Registration',
                      issuer: 'US Food & Drug Administration',
                      date: 'Active 2025',
                      link: 'https://fda.gov/registration/399201'
                    });
                  } else {
                    alert('Viewing FDA Registration evidence');
                  }
                }}
                className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] shrink-0"
              >
                Inspect Cert
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 4: HOW WE WORK */}
        <div className="py-8 border-b-3 border-slate-900/60 space-y-4">
          <span className="pill-header text-xs bg-amber-300 text-slate-900 font-mono">
            SECTION: HOW WE WORK
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Payment Terms */}
            <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>PAYMENT TERMS</span>
              </div>
              <p className="text-xs font-extrabold text-slate-800">
                Net 30 for approved corporate buyers. Wire transfer & Letter of Credit accepted.
              </p>
            </div>

            {/* Sample Availability */}
            <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
                <Package className="w-4 h-4 text-amber-600" />
                <span>SAMPLES</span>
              </div>
              <p className="text-xs font-extrabold text-slate-800">
                Paid prototype samples dispatched within 3 business days upon request.
              </p>
            </div>

            {/* Shipping Regions */}
            <div className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 uppercase">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>SHIPPING REGIONS</span>
              </div>
              <p className="text-xs font-extrabold text-slate-800">
                DDP & FOB air/sea freight shipping to North America, EU, and APAC hubs.
              </p>
            </div>

          </div>
        </div>

        {/* ACTION BUTTON & FRESHNESS NOTE */}
        <div className="pt-8 space-y-4 text-center">
          
          {/* Action Button */}
          <button
            type="button"
            onClick={() => setShowQuoteModal(true)}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5 text-emerald-300" />
            <span>Request a quote</span>
          </button>

          {/* Freshness Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-700 pt-2">
            <Clock className="w-3.5 h-3.5 text-slate-900" />
            <span>Details updated 12 days ago</span>
          </div>

        </div>

      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
              <span className="text-xs font-mono font-black uppercase">REQUEST COMMERCIAL QUOTE</span>
              <button onClick={() => setShowQuoteModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-slate-900">Quote Request Sent!</h4>
                <p className="text-xs font-bold text-slate-700">Apex Precision Dynamics will respond with commercial terms.</p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Buyer Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Estimated Order Quantity</label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 250 units"
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 block">Project Requirements / Notes</label>
                  <textarea
                    rows={3}
                    required
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Specify part numbers, drawings, or CAD specs..."
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>Submit Quote Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
