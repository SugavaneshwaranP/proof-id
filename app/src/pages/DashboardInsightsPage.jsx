import React, { useState, useEffect } from 'react';
import { Paperclip, TrendingUp, Eye, Users, MessageSquare, Share2, BarChart2 } from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';
import { analyticsRepository } from '../lib/repositories/analyticsRepository';
import { supabase } from '../lib/supabaseClient';

export default function DashboardInsightsPage({ setActivePage }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const slug = currentUser?.slug || '';

  const [analytics, setAnalytics] = useState(() => dbStore.getAnalytics(slug));
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const u = authService.getCurrentUser();
    if (u) setCurrentUser(u);
    const activeSlug = u?.slug || slug;

    async function loadAnalytics() {
      if (!activeSlug) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const profileId = user?.id || (await dbStore.fetchProfile(activeSlug))?.id;

        if (profileId) {
          const [summary, tl] = await Promise.all([
            analyticsRepository.getSummary(profileId, 30),
            analyticsRepository.getTimeline(profileId, 7),
          ]);
          if (isMounted) {
            setAnalytics(summary);
            setTimeline(tl);
          }
        }
      } catch (err) {
        console.warn("Failed to load analytics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalytics();
    const unsub = dbStore.onSync(() => {
      setAnalytics(dbStore.getAnalytics(activeSlug));
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [slug]);

  // Format 7-day timeline dates
  const daysDisplay = timeline.length > 0 ? timeline.map(t => ({
    date: new Date(t.log_date).toLocaleDateString(undefined, { weekday: 'short' }),
    views: t.page_views || 0,
  })) : [
    { date: 'Mon', views: 0 },
    { date: 'Tue', views: 0 },
    { date: 'Wed', views: 0 },
    { date: 'Thu', views: 0 },
    { date: 'Fri', views: 0 },
    { date: 'Sat', views: 0 },
    { date: 'Sun', views: 0 },
  ];

  const maxViews = Math.max(...daysDisplay.map(d => d.views), 10);

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#bae6fd] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PAGE VIEWS & INSIGHTS</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Traffic & Activity Analytics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            Page Views & Performance
          </h1>
          <p className="text-xs font-bold text-slate-800">
            Real-time activity on your profile page {currentUser?.slug ? `(@${currentUser.slug})` : ''}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              <span>Total Page Views</span>
            </span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {analytics.page_views ?? 0}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-500" />
              <span>Unique Visitors</span>
            </span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {analytics.unique_visitors ?? 0}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span>Inquiries Received</span>
            </span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {analytics.messages_received ?? 0}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
              <Share2 className="w-3 h-3 text-slate-500" />
              <span>Link Shares</span>
            </span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {analytics.link_shares ?? 0}
            </p>
          </div>
        </div>

        {/* Views Over Time Chart */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 font-mono uppercase flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span>Visitor Activity (Last 7 Days)</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              Updated daily
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-40 pt-4 border-b-2 border-slate-900">
            {daysDisplay.map((t, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono font-black text-slate-700">{t.views}</span>
                <div 
                  className="w-full bg-emerald-400 border-2 border-slate-900 rounded-t-lg transition-all"
                  style={{ height: `${Math.min(100, Math.max(8, (t.views / maxViews) * 100))}%` }}
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
