import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, ShieldAlert, Bell, Lock, User, Key, Globe, 
  Trash2, Paperclip, CheckCircle2, Save, AlertTriangle 
} from 'lucide-react';

export default function DashboardSettingsPage({ setActivePage }) {
  const [email, setEmail] = useState('you@email.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Notification options
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyVerifications, setNotifyVerifications] = useState(true);
  const [notifyWeeklyViews, setNotifyWeeklyViews] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    alert('Account deleted. Redirecting to home page.');
    setActivePage('home');
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>SETTINGS DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-yellow-300 text-slate-900">
            Account & System Controls
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Settings”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Account, notifications, privacy, and account deletion.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto no-scrollbar pb-2">
          {['Account', 'Notifications', 'Privacy', 'Danger zone'].map((sec) => (
            <span
              key={sec}
              className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-slate-900 font-mono text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] whitespace-nowrap"
            >
              • {sec}
            </span>
          ))}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8 pt-6">
          
          {/* SECTION 1: ACCOUNT & PASSWORD */}
          <div className="bg-white p-6 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-4">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              1. ACCOUNT & SECURITY
            </span>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: NOTIFICATION OPTIONS */}
          <div className="bg-white p-6 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-4">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              2. NOTIFICATION OPTIONS
            </span>

            <div className="space-y-3">
              {/* New messages */}
              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-900 bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-900 block">• New messages</span>
                  <span className="text-[11px] font-extrabold text-slate-600">Get notified when someone sends you an inquiry</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMessages}
                  onChange={(e) => setNotifyMessages(e.target.checked)}
                  className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                />
              </label>

              {/* Verification updates */}
              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-900 bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-900 block">• Verification updates</span>
                  <span className="text-[11px] font-extrabold text-slate-600">Get notified when an issuer or client confirms proof</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyVerifications}
                  onChange={(e) => setNotifyVerifications(e.target.checked)}
                  className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                />
              </label>

              {/* Weekly page views */}
              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-900 bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-slate-900 block">• Weekly page views</span>
                  <span className="text-[11px] font-extrabold text-slate-600">Receive a weekly traffic summary report</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWeeklyViews}
                  onChange={(e) => setNotifyWeeklyViews(e.target.checked)}
                  className="w-5 h-5 accent-slate-900 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* SECTION 3: PRIVACY & VISIBILITY */}
          <div className="bg-white p-6 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3">
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider block border-b-2 border-slate-900/20 pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              3. PRIVACY CONTROLS
            </span>
            <p className="text-xs font-extrabold text-slate-800">
              Control search engine indexing and direct link access rights on your public page.
            </p>
            <button
              type="button"
              onClick={() => setActivePage('dashboard-profile')}
              className="text-xs font-mono font-black text-slate-900 bg-amber-200 hover:bg-amber-300 px-3.5 py-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all inline-block cursor-pointer"
            >
              Configure Public / Unlisted Mode
            </button>
          </div>

          {/* SECTION 4: DANGER ZONE */}
          <div className="bg-red-50 p-6 rounded-2xl border-3 border-red-900 shadow-[5px_5px_0px_0px_#991b1b] space-y-4 text-slate-900">
            <span className="text-xs font-mono font-black text-red-900 uppercase tracking-wider block border-b-2 border-red-900/20 pb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-700" />
              4. DANGER ZONE
            </span>
            <div>
              <h4 className="text-sm font-black text-red-950">Delete my account</h4>
              <p className="text-xs font-extrabold text-red-900 leading-relaxed pt-0.5">
                This removes your page and everything on it. It can’t be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete my account</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[5px_5px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5 text-emerald-300" />
              <span>{savedSuccess ? 'Settings Saved!' : 'Save settings'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* Delete Account Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-6 max-w-md w-full text-center space-y-4 shadow-[8px_8px_0px_0px_#0f172a] text-slate-900">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl border-2 border-slate-900 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Are you absolutely sure?</h3>
            <p className="text-xs font-extrabold text-slate-700 leading-relaxed">
              This action <span className="font-black text-red-700">cannot be undone</span>. This will permanently delete your account, your handle <span className="font-mono font-black text-slate-900">backed.app/alexrivera</span>, and all verified proof items.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-3 rounded-xl bg-white border-2 border-slate-900 text-slate-900 font-black text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-1/2 py-3 rounded-xl bg-red-600 border-2 border-slate-900 text-white font-black text-xs shadow-[3px_3px_0px_0px_#0f172a]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
