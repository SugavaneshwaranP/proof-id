import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mail, Paperclip, CheckCircle2, Clock, 
  Inbox, Reply, Check, Trash2, Sparkles, Filter, ShieldCheck 
} from 'lucide-react';

export default function DashboardInboxPage({ setActivePage }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderName: 'David Chen',
      senderEmail: 'david.chen@apex-labs.com',
      dateReceived: '2 hours ago',
      capabilityTag: 'Rust Architecture',
      messageText: 'Hi Alex, saw your verified proof for high-throughput API microservices. We have an upcoming contract project for a high-concurrency gateway. Are you available for a 15-min call next week?',
      isHandled: false,
      isUnread: true
    },
    {
      id: 2,
      senderName: 'Elena Rostova',
      senderEmail: 'elena@vanguard-industrial.de',
      dateReceived: 'Yesterday',
      capabilityTag: 'ISO 9001 Precision Machining',
      messageText: 'Hello, we are looking for a certified supplier for CNC aluminum parts (MOQ ~500 units). Can you share lead times for EU export orders?',
      isHandled: true,
      isUnread: false
    },
    {
      id: 3,
      senderName: 'Priya Sharma',
      senderEmail: 'psharma@fintech-core.io',
      dateReceived: '3 days ago',
      capabilityTag: 'Backend Systems',
      messageText: 'Great portfolio! Would love to discuss a full-time lead backend engineer role with our distributed ledger team.',
      isHandled: false,
      isUnread: false
    }
  ]);

  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === 'Unread') return msg.isUnread;
    if (activeFilter === 'Handled') return msg.isHandled;
    return true;
  });

  const handleToggleHandled = (id) => {
    setMessages(messages.map((m) => m.id === id ? { ...m, isHandled: !m.isHandled, isUnread: false } : m));
  };

  const handleRemoveMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>INBOX DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-emerald-300 text-slate-900">
            Direct Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Messages”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            People who reached out after seeing your page.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="pt-6 flex items-center justify-between gap-4 border-b-2 border-slate-900/20 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Unread', 'Handled'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_0px_#059669]'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                • {filter}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono font-black text-slate-700 hidden sm:inline-block uppercase">
            {filteredMessages.length} MESSAGES
          </span>
        </div>

        {/* Message List & Empty State */}
        <div className="pt-6 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Inbox className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-base font-black text-slate-900">No messages yet.</p>
              <p className="text-xs font-bold text-slate-700">Once your page is out there, enquiries land here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`bg-white p-6 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-4 relative ${
                      msg.isUnread ? 'ring-2 ring-emerald-400' : ''
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-slate-900/10 pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">{msg.senderName}</h4>
                          {msg.isUnread && (
                            <span className="bg-emerald-300 text-slate-900 text-[9px] font-mono font-black px-2 py-0.5 rounded-md border border-slate-900">
                              NEW
                            </span>
                          )}
                          {msg.isHandled && (
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-mono font-black px-2 py-0.5 rounded-md border border-slate-900 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> Handled
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-slate-600">{msg.senderEmail}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-slate-900 bg-yellow-200 px-2.5 py-1 rounded-lg border border-slate-900">
                          {msg.capabilityTag}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">{msg.dateReceived}</span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs font-extrabold text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-900/20">
                      "{msg.messageText}"
                    </p>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-900/10">
                      <div className="flex items-center gap-2">
                        
                        {/* Reply by Email */}
                        <a
                          href={`mailto:${msg.senderEmail}?subject=Re: Inquiry regarding ${encodeURIComponent(msg.capabilityTag)}`}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] transition-all flex items-center gap-1.5"
                        >
                          <Reply className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Reply by email</span>
                        </a>

                        {/* Mark as Handled */}
                        <button
                          type="button"
                          onClick={() => handleToggleHandled(msg.id)}
                          className={`px-3.5 py-2 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0f172a] ${
                            msg.isHandled
                              ? 'bg-slate-200 text-slate-700 border-slate-900'
                              : 'bg-emerald-200 hover:bg-emerald-300 text-slate-900 border-slate-900'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{msg.isHandled ? 'Handled' : 'Mark as handled'}</span>
                        </button>

                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMessage(msg.id)}
                        className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
