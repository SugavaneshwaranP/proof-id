import React, { useState, useEffect } from 'react';
import { Wifi, Radio, Zap, ShieldCheck, RefreshCw, Send, Flag, CheckCircle2 } from 'lucide-react';
import { broadcastInboxMessage, broadcastEvidenceStatusUpdate, broadcastAdminReport } from '../lib/realtime';

export default function RealtimeStatusBar({ profileId = 'alexrivera-id' }) {
  const [status, setStatus] = useState('SUBSCRIBED');
  const [recentEvent, setRecentEvent] = useState(null);

  useEffect(() => {
    const handleRealtimeEvent = (e) => {
      const { channel, payload, timestamp } = e.detail;
      setRecentEvent({ channel, payload, timestamp });
      setTimeout(() => setRecentEvent(null), 5000);
    };

    window.addEventListener('backed-realtime-event', handleRealtimeEvent);
    return () => window.removeEventListener('backed-realtime-event', handleRealtimeEvent);
  }, []);

  const triggerTestMessage = () => {
    broadcastInboxMessage(profileId, {
      id: Date.now(),
      senderName: 'Sarah Jenkins',
      senderEmail: 'sarah@vertex-capital.com',
      dateReceived: 'Just now',
      capabilityTag: 'React 19 & High-Performance UI',
      messageText: 'Hello Alex, loved your verified proof for high-concurrency frontend systems. We want to hire you for a contract sprint.',
      isHandled: false,
      isUnread: true,
      created_at: new Date().toISOString()
    });
  };

  const triggerTestVerification = () => {
    broadcastEvidenceStatusUpdate(profileId, {
      id: 'proof-1',
      title: 'Distributed System Proof',
      status: 'verified',
      verifier_note: 'Confirmed by peer verifier on GitHub.',
      updated_at: new Date().toISOString()
    });
  };

  const triggerTestReport = () => {
    broadcastAdminReport({
      id: Date.now(),
      page: 'backed.app/alexrivera',
      reason: 'Fake or misleading proof',
      details: 'Audit requested by automated compliance bot.',
      reportedOn: 'Just now',
      status: 'Pending Review'
    });
  };

  return (
    <div className="bg-slate-900 text-white border-b-2 border-slate-900 px-4 py-2 font-mono text-[11px] shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>REALTIME WS</span>
          </div>

          <span className="text-slate-500">|</span>

          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800 text-[10px]">
            ● {status} (4 CHANNELS)
          </span>

          {recentEvent && (
            <span className="text-yellow-300 font-bold flex items-center gap-1 animate-fade-in">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              Event on <code className="bg-slate-800 px-1 rounded text-emerald-300">{recentEvent.channel}</code>
            </span>
          )}
        </div>

        {/* Right: End-to-End Test Triggers */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Simulate Event:</span>
          
          <button
            type="button"
            onClick={triggerTestMessage}
            className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer"
            title="Send test message to inbox"
          >
            <Send className="w-3 h-3" />
            <span>Incoming Message</span>
          </button>

          <button
            type="button"
            onClick={triggerTestVerification}
            className="px-2 py-1 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer"
            title="Trigger verifier confirmation event"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Verify Badge</span>
          </button>

          <button
            type="button"
            onClick={triggerTestReport}
            className="px-2 py-1 rounded bg-red-400 hover:bg-red-300 text-slate-900 font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer"
            title="File test moderation report"
          >
            <Flag className="w-3 h-3" />
            <span>File Report</span>
          </button>
        </div>

      </div>
    </div>
  );
}
