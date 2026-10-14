import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, ShieldAlert, Bell, Lock, User, Key, Globe, 
  Trash2, Paperclip, CheckCircle2, Save, AlertTriangle, Check, Loader2, Shield
} from 'lucide-react';
import { authService } from '../lib/authService';
import { dbStore } from '../lib/dbStore';
import { supabase } from '../lib/supabaseClient';

export default function DashboardSettingsPage({ setActivePage }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const slug = currentUser?.slug || 'profile';

  const [email, setEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyVerifications, setNotifyVerifications] = useState(true);
  const [visibility, setVisibility] = useState('public');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) {
      setCurrentUser(u);
      if (u.email) setEmail(u.email);
    }
    const activeSlug = u?.slug || slug;

    async function loadSettings() {
      try {
        const settings = await dbStore.getUserSettings(activeSlug);
        if (settings) {
          if (settings.notify_new_messages !== undefined) setNotifyMessages(settings.notify_new_messages);
          if (settings.notify_verifications !== undefined) setNotifyVerifications(settings.notify_verifications);
          if (settings.visibility) setVisibility(settings.visibility);
        }
      } catch (err) {
        console.warn("Failed to load settings:", err);
      }
    }

    loadSettings();
  }, [slug]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (newPassword.trim()) {
        const { error: passErr } = await supabase.auth.updateUser({
          password: newPassword.trim(),
        });
        if (passErr) throw passErr;
        setNewPassword('');
      }

      await dbStore.updateUserSettings(slug, {
        notify_new_messages: notifyMessages,
        notify_verifications: notifyVerifications,
        visibility: visibility,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
      setErrorMessage(err.message || "Failed to update account settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setActivePage('home');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke("delete-account", {
        method: "POST",
      });

      if (error) {
        throw error;
      }

      await authService.signOut();
      setActivePage('home');
    } catch (err) {
      console.error("Delete account error:", err);
      setErrorMessage(err.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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

      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900 space-y-6">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>ACCOUNT SETTINGS</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-slate-900/60">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs font-bold text-slate-800">
            Manage your account and preferences for backed.network/{currentUser?.slug || slug}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-100 border-2 border-red-900 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5 pt-2">
          
          {/* Email */}
          <div>
            <label className="text-xs font-mono font-black uppercase block mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-slate-100 border-2 border-slate-900 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none shadow-[2px_2px_0px_0px_#0f172a] text-slate-600 cursor-not-allowed"
            />
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 block">
              Your primary account email address.
            </span>
          </div>

          {/* New Password */}
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

          {/* Preferences */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
            <span className="text-xs font-mono font-black uppercase text-slate-900 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Notifications & Visibility</span>
            </span>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyMessages}
                  onChange={(e) => setNotifyMessages(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Notify me when I receive new messages
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyVerifications}
                  onChange={(e) => setNotifyVerifications(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Notify me when work confirmations are updated
                </span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-900 block mb-1">Profile Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
              >
                <option value="public">Public (Visible in search and community showcase)</option>
                <option value="unlisted">Unlisted (Accessible only via direct link)</option>
                <option value="private">Private (Restricted to account owner)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#ca8a04] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Save className="w-4 h-4 text-amber-300" />}
            <span>{isSaving ? "Saving settings..." : "Save Settings"}</span>
          </button>
        </form>

        {/* Session & Account Actions */}
        <div className="pt-6 border-t-2 border-slate-900/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Session</span>
              <span className="text-[11px] text-slate-600 font-medium">Log out of this device</span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 cursor-pointer"
            >
              Log Out
            </button>
          </div>

          <div className="pt-4 border-t border-slate-900/20 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-black text-red-700 block">Delete Account</span>
              <span className="text-[11px] text-slate-600 font-medium">Permanently delete your profile and account</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-[3px_3px_0px_0px_#991b1b] border-2 border-slate-900 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Account Deletion */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-w-md w-full space-y-4 text-slate-900"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 border-2 border-slate-900 flex items-center justify-center text-red-600 shadow-[3px_3px_0px_0px_#0f172a]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black">Permanently Delete Account?</h3>
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                This action is irreversible. It will invoke the privileged <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">delete-account</code> Edge Function to wipe all evidence vault storage assets, profiles, project case studies, and verification history.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] cursor-pointer"
                >
                  {isDeleting ? "Wiping Data..." : "Yes, Permanently Delete"}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs border-2 border-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
