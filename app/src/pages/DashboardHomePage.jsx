import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, MessageSquare, Clock, ArrowRight, Paperclip, 
  Edit3, Plus, ExternalLink, CheckCircle2, TrendingUp, Sparkles, 
  BarChart3, UserCheck, Shield, FileText, Bell, LayoutDashboard, Settings
} from 'lucide-react';

export default function DashboardHomePage({ setActivePage, userName = 'Alex' }) {
  const [activeTab, setActiveTab] = useState('overview');

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
              <p className="text-xs font-mono font-extrabold text-slate-600">backed.app/alexrivera</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActivePage('onboarding-basics')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('onboarding-proof')}
              className="px-3.5 py-2 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add proof</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('explorer')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span>View my public page</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-4 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-2">
            <span className="text-[11px] font-mono font-black text-slate-500 uppercase px-3 block">
              DASHBOARD NAVIGATION
            </span>
            
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'profile', label: 'Edit Profile', icon: Edit3, page: 'onboarding-basics' },
              { id: 'capabilities', label: 'Capabilities', icon: Sparkles, page: 'onboarding-capabilities' },
              { id: 'proof', label: 'Proof Artifacts', icon: Shield, page: 'onboarding-proof' },
              { id: 'public', label: 'View Public Page', icon: ExternalLink, page: 'explorer' }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.page) setActivePage(item.page);
                  }}
                  className={`w-full px-4 py-3 rounded-2xl font-black text-xs border-2 transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_0px_#059669]'
                      : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-900/40 hover:border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="bg-[#ffedd5] p-5 rounded-3xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-2 text-slate-900">
            <span className="pill-header text-[10px] bg-amber-300 text-slate-900">PRO TIP</span>
            <h4 className="text-xs font-black">Want to boost your page score?</h4>
            <p className="text-[11px] font-extrabold text-slate-800 leading-relaxed">
              Adding verified certificates increases client trust by 45%.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Headline Greeting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="pill-header text-xs bg-yellow-300 text-slate-900 font-mono">Owner Portal</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 pt-1">
                “Welcome back, {userName}”
              </h2>
              <p className="text-xs font-extrabold text-slate-700">
                Keep your page true and current.
              </p>
            </div>

            <span className="stamp-verified text-xs py-1 px-3">★ STATUS: ACTIVE ★</span>
          </div>

          {/* Completion Card */}
          <div className="dossier-card rounded-3xl p-6 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#fef08a] text-slate-900 space-y-4">
            <div className="dossier-clip">
              <Paperclip className="w-3.5 h-3.5 text-amber-300" />
              <span>PAGE STRENGTH DOSSIER</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-slate-700 uppercase">COMPLETION CARD</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Your page is <span className="text-emerald-800">80% strong.</span>
                </h3>
                <p className="text-xs font-extrabold text-slate-800">
                  Add one more verifiable proof artifact to achieve 100% maximum trust.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePage('onboarding-proof')}
                className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_0px_#059669] transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <span>Finish it up</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

            {/* Progress Meter */}
            <div className="w-full bg-white rounded-full h-3 border-2 border-slate-900 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[80%] transition-all duration-500 rounded-full" />
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Stat 1: Page views */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-xs font-mono font-black uppercase text-slate-700">PAGE VIEWS THIS WEEK</span>
                <div className="p-2 rounded-xl bg-amber-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <Eye className="w-4 h-4 text-slate-900" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">342</span>
                <span className="text-xs font-black text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +18%
                </span>
              </div>
              <p className="text-[11px] font-extrabold text-slate-600">Views across desktop & mobile</p>
            </div>

            {/* Stat 2: New messages */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-xs font-mono font-black uppercase text-slate-700">NEW MESSAGES</span>
                <div className="p-2 rounded-xl bg-emerald-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <MessageSquare className="w-4 h-4 text-slate-900" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">5</span>
                <span className="text-xs font-mono font-black text-amber-700">Unread</span>
              </div>
              <p className="text-[11px] font-extrabold text-slate-600">Direct proof inquiries</p>
            </div>

            {/* Stat 3: Verifications pending */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-xs font-mono font-black uppercase text-slate-700">VERIFICATIONS PENDING</span>
                <div className="p-2 rounded-xl bg-sky-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <Clock className="w-4 h-4 text-slate-900" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">2</span>
                <span className="text-xs font-mono font-black text-sky-700">In audit</span>
              </div>
              <p className="text-[11px] font-extrabold text-slate-600">Issuers confirming claim</p>
            </div>

          </div>

          {/* Activity Feed & Shortcuts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Activity Feed */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
                <span className="text-xs font-mono font-black text-slate-900 uppercase flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  RECENT ACTIVITY FEED
                </span>
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase">REAL-TIME LOG</span>
              </div>

              <div className="space-y-3">
                
                {/* Activity Item 1 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-200 border-2 border-slate-900 flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Someone viewed your page from Bengaluru</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500">2 hours ago • Direct search link</p>
                    </div>
                  </div>
                  <span className="stamp-verified text-[9px] py-0.5 px-1.5">VIEWED</span>
                </div>

                {/* Activity Item 2 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Your certificate was confirmed</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500">Yesterday • Verified by Issuer</p>
                    </div>
                  </div>
                  <span className="stamp-verified text-[9px] py-0.5 px-1.5">CONFIRMED</span>
                </div>

                {/* Activity Item 3 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-200 border-2 border-slate-900 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">New inquiry for Rust Architecture</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500">3 days ago • From San Francisco, CA</p>
                    </div>
                  </div>
                  <span className="stamp-verified text-[9px] py-0.5 px-1.5">INQUIRY</span>
                </div>

              </div>
            </div>

            {/* Shortcuts Box */}
            <div className="lg:col-span-5 bg-[#bae6fd] rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4 text-slate-900">
              <div className="border-b-2 border-slate-900/40 pb-3">
                <span className="pill-header text-[10px] bg-slate-900 text-white">ACTIONS</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight pt-1">Shortcuts</h3>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActivePage('onboarding-basics')}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>Edit profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage('onboarding-proof')}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Add proof</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage('explorer')}
                  className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#059669] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-emerald-300" />
                    <span>View my public page</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
