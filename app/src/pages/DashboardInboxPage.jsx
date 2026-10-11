import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mail, Paperclip, CheckCircle2, Clock, 
  Inbox, Reply, Check, Trash2, Sparkles, Filter, ShieldCheck, Zap, Send, X
} from 'lucide-react';
import { subscribeToInboxChannel } from '../lib/realtime';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardInboxPage({ setActivePage }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'alexrivera';

  const [messages, setMessages] = useState(() => dbStore.getMessages(slug));
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    const load = () => {
      const fresh = dbStore.getMessages(slug);
      setMessages(fresh);
    };

    load();
    const unsubStore = dbStore.onSync(load);
    const unsubRealtime = subscribeToInboxChannel(slug, (newMsg) => {
      load();
      setLiveToast(`New inquiry from ${newMsg.sender_name || 'a visitor'}!`);
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
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText) return;

    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText('');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Realtime WebSocket Incoming Message Alert */}
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
              REAL-TIME WEBSOCKET INBOX
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-white text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="dossier-clip relative top-0 left-0">
            <Paperclip className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase font-mono font-black">INBOX & INQUIRIES DOSSIER</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-slate-600">
            {messages.filter(m => !m.read).length} UNREAD
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            “Visitor & Business Inquiries”
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Inbound contact requests for backed.network/{slug}
          </p>
        </div>

        {/* Message List & Reader Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          
          {/* List Column */}
          <div className="md:col-span-5 space-y-3">
            {messages.map((msg) => (
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
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-xs font-black text-slate-900 truncate">{msg.subject || 'Profile Contact'}</p>
                <p className="text-[11px] font-bold text-slate-600 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Reader / Response Column */}
          <div className="md:col-span-7">
            {selectedMessage ? (
              <div className="bg-[#fef9c3] p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
                <div className="border-b-2 border-slate-900/40 pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">{selectedMessage.sender_name}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-600">{selectedMessage.sender_email}</p>
                  {selectedMessage.company && (
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-900 inline-block font-bold">
                      {selectedMessage.company}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-black uppercase text-slate-900">Message Body:</h4>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed bg-white p-4 rounded-xl border border-slate-900">
                    "{selectedMessage.message}"
                  </p>
                </div>

                {/* Reply Box */}
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
                      Reply dispatched via email gateway!
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

              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-400 rounded-2xl p-10 text-center text-slate-500 font-extrabold text-xs">
                Select an inquiry from the list on the left to read and respond.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
