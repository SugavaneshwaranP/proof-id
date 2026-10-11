import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, ShieldAlert, Bell, Lock, User, Key, Globe, 
  Trash2, Paperclip, CheckCircle2, Save, AlertTriangle, Check
} from 'lucide-react';
import { authService } from '../lib/authService';

export default function DashboardSettingsPage({ setActivePage }) {
  const currentUser = authService.getCurrentUser();
  const [email, setEmail] = useState(currentUser?.email || 'you@example.com');
  const [newPassword, setNewPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u?.email) setEmail(u.email);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await authService.updateProfile({
      email: email,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setActivePage('home');
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Floating Save Toast */}
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-300 border-3 border-slate-900 px-5 py-3 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] flex items-center gap-3 font-black text-xs text-slate-900">
          <Check className="w-4 h-4 text-slate-900" />
          <span>Account Settings Saved!</span>
        </div>
      )}

      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>SETTINGS & SECURITY DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900/60">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            “Account Settings & Security”
          </h1>
          <p className="text-xs font-bold text-slate-800">
            Manage your credentials and security preferences for backed.network/{currentUser?.slug || 'user'}
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-mono font-black uppercase block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-black uppercase block mb-1">New Password (optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#ca8a04] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save Settings</span>
          </button>
        </form>

        <div className="pt-4 border-t-2 border-slate-900/30 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800">Session Controls</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 cursor-pointer"
          >
            Sign Out of Account
          </button>
        </div>

      </div>

    </div>
  );
}
