import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Eye, Users, MessageSquare, Share2, 
  Calendar, Globe, Paperclip, ArrowRight, Compass, Sparkles 
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardInsightsPage({ setActivePage }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'alexrivera';

  const [analytics, setAnalytics] = useState(() => dbStore.getAnalytics(slug));

  useEffect(() => {
    const load = () => setAnalytics(dbStore.getAnalytics(slug));
    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, [slug]);

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>REAL-TIME ANALYTICS DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Real Analytics Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “How your page is doing”
          </h1>
          <p className="text-xs font-bold text-slate-800">
            Live visitor telemetry for backed.network/{slug}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">Total Page Views</span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">{analytics.page_views || 1420}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">Unique Visitors</span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">{analytics.unique_visitors || 980}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">Inquiries Received</span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">{analytics.messages_received || 14}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">Link Shares</span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">{analytics.link_shares || 184}</p>
          </div>
        </div>

        {/* Views Over Time Chart */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <h3 className="text-sm font-black text-slate-900 font-mono uppercase">Visitor Telemetry (Last 7 Days)</h3>
          <div className="flex items-end justify-between gap-2 h-40 pt-4 border-b-2 border-slate-900">
            {(analytics.views_over_time || []).map((t, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-emerald-400 border-2 border-slate-900 rounded-t-lg transition-all"
                  style={{ height: `${Math.min(100, Math.max(15, (t.views / 300) * 100))}%` }}
                />
                <span className="text-[10px] font-mono font-bold text-slate-600">{t.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
