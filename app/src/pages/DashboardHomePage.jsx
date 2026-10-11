import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, MessageSquare, Clock, ArrowRight, Paperclip, 
  Edit3, Plus, ExternalLink, CheckCircle2, TrendingUp, Sparkles, 
  BarChart3, UserCheck, Shield, FileText, Bell, LayoutDashboard, Settings, Mail
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardHomePage({ setActivePage }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const slug = currentUser?.slug || 'alexrivera';
  
  const [profile, setProfile] = useState(() => dbStore.getProfile(slug));
  const [evidenceList, setEvidenceList] = useState(() => dbStore.getEvidence(slug));
  const [inboxList, setInboxList] = useState(() => dbStore.getMessages(slug));
  const [analytics, setAnalytics] = useState(() => dbStore.getAnalytics(slug));

  useEffect(() => {
    const load = () => {
      const u = authService.getCurrentUser();
      setCurrentUser(u);
      const userSlug = u?.slug || 'alexrivera';
      setProfile(dbStore.getProfile(userSlug));
      setEvidenceList(dbStore.getEvidence(userSlug));
      setInboxList(dbStore.getMessages(userSlug));
      setAnalytics(dbStore.getAnalytics(userSlug));
    };

    load();
    const unsubStore = dbStore.onSync(load);
    const unsubAuth = authService.onAuthChange(load);

    return () => {
      unsubStore();
      unsubAuth();
    };
  }, []);

  const unreadCount = inboxList.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-slate-900 font-sans desk-grid-background pb-20">
      
      {/* Top Dashboard Navigation Header */}
      <div className="bg-white border-b-3 border-slate-900 px-4 sm:px-8 py-4 shadow-[0px_4px_0px_0px_#0f172a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-300 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_#0f172a]">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Owner Dashboard</h1>
              <p className="text-xs font-mono font-extrabold text-slate-600">backed.network/{slug}</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActivePage('dashboard-profile')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('dashboard-evidence')}
              className="px-3.5 py-2 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add proof</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('public-profile')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span>View my public page</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Main Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Welcome Banner Card */}
          <div className="dossier-card rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] bg-amber-200 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="pill-header inline-block text-xs font-mono bg-slate-900 text-white">
                  ★ DETERMINISTIC PROFILE ENGINE
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Welcome back, {profile.full_name || 'Alex'}!
                </h2>
                <p className="text-xs font-extrabold text-slate-800">
                  Your page completion status is <span className="font-mono text-emerald-900 font-black bg-white px-2 py-0.5 rounded border border-slate-900">{profile.completion_score || 90}% Complete</span>.
                </p>
              </div>

              <button
                onClick={() => setActivePage('dashboard-insights')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 cursor-pointer shrink-0"
              >
                Analytics Insights →
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-600" /> Page Views
              </span>
              <p className="text-2xl font-black text-slate-900 font-mono">{analytics.page_views || 1420}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Proofs
              </span>
              <p className="text-2xl font-black text-slate-900 font-mono">{evidenceList.length}</p>
            </div>

            <div 
              onClick={() => setActivePage('dashboard-inbox')}
              className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1 cursor-pointer hover:bg-amber-50"
            >
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-600" /> Inbox Messages
              </span>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-900 font-mono">{inboxList.length}</p>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Trust Score
              </span>
              <p className="text-2xl font-black text-slate-900 font-mono">98 / 100</p>
            </div>
          </div>

          {/* Active Verified Proof Cards */}
          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Active Verified Proof Cards ({evidenceList.length})</span>
              </h3>
              <button 
                onClick={() => setActivePage('dashboard-evidence')}
                className="text-xs font-mono font-extrabold text-slate-900 underline hover:text-emerald-700"
              >
                Manage all →
              </button>
            </div>

            <div className="space-y-3">
              {evidenceList.map((item) => (
                <div key={item.id} className="bg-emerald-50 p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded border border-slate-900">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    <p className="text-xs font-bold text-slate-600 italic">"{item.verifier_note || 'Peer verified claim'}"</p>
                  </div>
                  <span className="stamp-verified text-[10px] py-1 px-3 shrink-0">
                    ★ {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b-2 border-slate-900/20 pb-3">
              Dashboard Tools
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setActivePage('dashboard-profile')}
                className="w-full p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 text-left font-black text-xs text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <span>Edit Profile & Bio</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>

              <button
                onClick={() => setActivePage('dashboard-projects')}
                className="w-full p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-left font-black text-xs text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <span>Manage Key Projects</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>

              <button
                onClick={() => setActivePage('dashboard-inbox')}
                className="w-full p-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 border-2 border-slate-900 text-left font-black text-xs text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <span>Inquiries & Inbox ({unreadCount})</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>

              <button
                onClick={() => setActivePage('dashboard-settings')}
                className="w-full p-3 rounded-2xl bg-purple-100 hover:bg-purple-200 border-2 border-slate-900 text-left font-black text-xs text-slate-900 flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <span>Security & MFA Settings</span>
                <Settings className="w-4 h-4 text-slate-900" />
              </button>
            </div>
          </div>

          {/* Inbox Preview Card */}
          <div className="bg-[#fef08a] rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-3">
            <span className="text-[10px] font-mono font-black text-slate-900 uppercase tracking-wider block">
              RECENT INCOMING INQUIRY
            </span>
            {inboxList.length > 0 ? (
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1.5">
                <p className="text-xs font-black text-slate-900">{inboxList[0].sender_name}</p>
                <p className="text-[11px] font-bold text-slate-700 italic">"{inboxList[0].message}"</p>
                <button
                  onClick={() => setActivePage('dashboard-inbox')}
                  className="text-[11px] font-mono font-black text-slate-900 underline block pt-1"
                >
                  Reply in Inbox →
                </button>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-700">No new messages yet.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
