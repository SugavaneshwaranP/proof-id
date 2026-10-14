import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mail, Paperclip, CheckCircle2, Clock, 
  Inbox, Reply, Check, Trash2, Sparkles, Filter, ShieldCheck, Zap, Send, X, FileText, DollarSign
} from 'lucide-react';
import { subscribeToInboxChannel } from '../lib/realtime';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';
import { inboxRepository } from '../lib/repositories/inboxRepository';

export default function DashboardInboxPage({ setActivePage }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'profile';

  const [messages, setMessages] = useState(() => dbStore.getMessages(slug));
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  // Quotation Composer States
  const [showQuoteComposer, setShowQuoteComposer] = useState(false);
  const [quoteUnitPrice, setQuoteUnitPrice] = useState('25.00');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [quoteMoq, setQuoteMoq] = useState('100');
  const [quoteLeadTime, setQuoteLeadTime] = useState('14');
  const [quotePaymentTerms, setQuotePaymentTerms] = useState('Net 30');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    const load = () => {
      const fresh = dbStore.getMessages(slug);
      setMessages(fresh);
    };

    load();
    const unsubStore = dbStore.onSync(load);
    const unsubRealtime = subscribeToInboxChannel(slug, (newMsg) => {
      load();
      setLiveToast(`New message from ${newMsg.sender_name || 'a visitor'}!`);
      setTimeout(() => setLiveToast(null), 5000);
    });

    return () => {
      unsubStore();
      if (typeof unsubRealtime === 'function') unsubRealtime();
    };
  }, [slug]);

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      dbStore.markMessageRead(msg.id);
      msg.read = true;
      if (!msg.status || msg.status === 'new') msg.status = 'read';
    }
  };

  const handleUpdateStatus = (msgId, newStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
    );
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText) return;

    if (selectedMessage) {
      handleUpdateStatus(selectedMessage.id, 'responding');
    }

    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText('');
    }, 1500);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      await inboxRepository.createQuoteResponse({
        contactRequestId: selectedMessage.id,
        supplierProfileId: currentUser?.id || '00000000-0000-0000-0000-000000000001',
        unitPrice: quoteUnitPrice,
        currency: quoteCurrency,
        moq: quoteMoq,
        leadTimeDays: quoteLeadTime,
        paymentTerms: quotePaymentTerms,
        quoteNotes: quoteNotes,
      });
    } catch (err) {
      console.warn("Quote creation fallback:", err);
    }

    handleUpdateStatus(selectedMessage.id, 'quoted');
    setQuoteSent(true);
    setTimeout(() => {
      setQuoteSent(false);
      setShowQuoteComposer(false);
    }, 1500);
  };

  const filteredMessages = messages.filter((m) => {
    const msgStatus = m.status || (!m.read ? 'new' : 'read');
    if (statusFilter === 'all') return true;
    return msgStatus === statusFilter;
  });

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Realtime Incoming Message Alert */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-300 text-slate-900 p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex items-center justify-between gap-3 font-black text-sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-900 fill-slate-900 animate-bounce" />
              <span>{liveToast}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg uppercase">
              NEW MESSAGE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="dossier-clip relative top-0 left-0">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase font-mono font-black">INBOX & MESSAGES</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-slate-600">
            {messages.filter(m => !m.read).length} UNREAD
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Messages sent to your profile
          </p>
        </div>

        {/* State Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200">
          {['all', 'new', 'read', 'responding', 'quoted', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#059669]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {st} {st !== 'all' && `(${messages.filter(m => (m.status || (!m.read ? 'new' : 'read')) === st).length})`}
            </button>
          ))}
        </div>

        {/* Message List & Reader Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          
          {/* List Column */}
          <div className="md:col-span-5 space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono font-bold text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                No messages found in '{statusFilter}' status.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const currStatus = msg.status || (!msg.read ? 'new' : 'read');
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1.5 ${
                      selectedMessage?.id === msg.id
                        ? 'bg-amber-200 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
                        : !msg.read
                        ? 'bg-emerald-50 border-slate-900 font-extrabold shadow-[2px_2px_0px_0px_#0f172a]'
                        : 'bg-white border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{msg.sender_name}</span>
                      <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${
                        currStatus === 'new' ? 'bg-emerald-200 text-emerald-950 border-emerald-400' :
                        currStatus === 'quoted' ? 'bg-purple-200 text-purple-950 border-purple-400' :
                        currStatus === 'responding' ? 'bg-blue-200 text-blue-950 border-blue-400' :
                        currStatus === 'closed' ? 'bg-slate-200 text-slate-700 border-slate-400' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {currStatus}
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900 truncate">{msg.subject || 'Profile Contact'}</p>
                    <p className="text-[11px] font-bold text-slate-600 line-clamp-2">{msg.message}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Reader / Response Column */}
          <div className="md:col-span-7">
            {selectedMessage ? (
              <div className="bg-[#fef9c3] p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                <div className="border-b-2 border-slate-900/40 pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">{selectedMessage.sender_name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-600">{selectedMessage.sender_email}</p>
                  {selectedMessage.company && (
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-900 inline-block font-bold">
                      {selectedMessage.company}
                    </span>
                  )}
                  {/* Supplier Stage Transition Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] font-mono font-black uppercase text-slate-600">Stage:</span>
                    {['responding', 'quoted', 'closed'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedMessage.id, st)}
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border cursor-pointer transition-all ${
                          (selectedMessage.status || 'read') === st
                            ? 'bg-slate-900 text-white border-slate-900 font-black'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-400'
                        }`}
                      >
                        Mark as {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-black uppercase text-slate-900">Message Body:</h4>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed bg-white p-4 rounded-xl border border-slate-900 whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Action Mode Switcher: Email Reply vs Formal B2B Quotation */}
                <div className="flex border-b-2 border-slate-900 gap-2 pt-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setShowQuoteComposer(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      !showQuoteComposer
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                        : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Reply</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuoteComposer(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      showQuoteComposer
                        ? 'bg-emerald-300 text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                        : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Send Price Quote</span>
                  </button>
                </div>

                {!showQuoteComposer ? (
                  /* Standard Reply Box */
                  <form onSubmit={handleSendReply} className="space-y-2 pt-2">
                    <label className="text-xs font-mono font-black uppercase block">Reply to {selectedMessage.sender_name}</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={`Type your reply to ${selectedMessage.sender_email}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
                    />
                    {replySent ? (
                      <div className="p-2.5 bg-emerald-200 border-2 border-slate-900 rounded-xl text-center text-xs font-black text-emerald-900">
                        Reply sent!
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-emerald-300" />
                        <span>Send Response</span>
                      </button>
                    )}
                  </form>
                ) : (
                  /* Price Quote Form */
                  <form onSubmit={handleSubmitQuote} className="space-y-3 pt-2 bg-emerald-50/80 p-4 rounded-xl border-2 border-slate-900">
                    <div className="flex items-center justify-between border-b border-emerald-900/20 pb-2">
                      <span className="text-xs font-black text-slate-900 uppercase font-mono flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        Price & Delivery Quote
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded border border-emerald-900">
                        VALID 30 DAYS
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Unit Price</label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={quoteUnitPrice}
                            onChange={(e) => setQuoteUnitPrice(e.target.value)}
                            className="w-full bg-white border-2 border-slate-900 rounded-lg pl-7 pr-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Currency</label>
                        <select
                          value={quoteCurrency}
                          onChange={(e) => setQuoteCurrency(e.target.value)}
                          className="w-full mt-1 bg-white border-2 border-slate-900 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Minimum Order Quantity</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quoteMoq}
                          onChange={(e) => setQuoteMoq(e.target.value)}
                          className="w-full mt-1 bg-white border-2 border-slate-900 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Delivery Time (Days)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quoteLeadTime}
                          onChange={(e) => setQuoteLeadTime(e.target.value)}
                          className="w-full mt-1 bg-white border-2 border-slate-900 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Payment Terms</label>
                      <select
                        value={quotePaymentTerms}
                        onChange={(e) => setQuotePaymentTerms(e.target.value)}
                        className="w-full mt-1 bg-white border-2 border-slate-900 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="Net 30">Net 30 Days</option>
                        <option value="50% Upfront, 50% on Delivery">50% Upfront, 50% on Delivery</option>
                        <option value="100% Upfront Wire">100% Upfront Wire</option>
                        <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black uppercase text-slate-700 block">Terms & Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Add any terms, shipping notes, or timeline details..."
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        className="w-full mt-1 bg-white border-2 border-slate-900 rounded-lg p-2.5 text-xs font-bold focus:outline-none resize-none"
                      />
                    </div>

                    {quoteSent ? (
                      <div className="p-2.5 bg-emerald-200 border-2 border-slate-900 rounded-xl text-center text-xs font-black text-emerald-900">
                        Quote Sent!
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <FileText className="w-4 h-4 text-slate-900" />
                        <span>Send Price Quote</span>
                      </button>
                    )}
                  </form>
                )}

              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-400 rounded-2xl p-10 text-center text-slate-500 font-extrabold text-xs">
                Select a message from the list on the left to read and reply.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
