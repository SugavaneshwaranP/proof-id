import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Paperclip, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ setActivePage, onOpenAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoggedIn(true);
    setTimeout(() => {
      setActivePage('explorer');
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-20 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 font-sans desk-grid-background">
      
      {/* Tactile Login Dossier Card */}
      <div className="dossier-card-yellow rounded-3xl p-8 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>AUTHENTICATION DOSSIER</span>
        </div>

        {/* Logo & Header */}
        <div className="text-center space-y-3 pt-2 pb-6 border-b-2 border-slate-900">
          <div 
            className="inline-flex items-center gap-2 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_#0f172a]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="font-black text-3xl tracking-tight text-slate-900 font-sans">
              Backed
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
            “Welcome back”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            Log in to manage your page.
          </p>
        </div>

        {loggedIn ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-200 text-emerald-900 border-2 border-slate-900 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#0f172a]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Authentication Verified</h3>
            <p className="text-xs font-bold text-slate-800">Redirecting to your page dashboard...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-6">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-extrabold text-slate-900 uppercase tracking-wider block">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Password Input & Forgot Link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-extrabold text-slate-900 uppercase tracking-wider block">
                  Password
                </label>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert("Password reset link dispatched."); }}
                  className="text-xs font-mono font-extrabold text-slate-900 underline hover:text-amber-800"
                >
                  Forgot your password?
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[3px_3px_0px_0px_#0f172a]"
              />
            </div>

            {/* Primary Log in Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-[4px_4px_0px_0px_#ca8a04] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Log in</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t-2 border-slate-900/30" />
              <span className="absolute bg-[#fef08a] px-3 font-mono font-extrabold text-xs text-slate-800 uppercase">
                or
              </span>
            </div>

            {/* Secondary OAuth Button */}
            <button
              type="button"
              onClick={() => {
                setEmail('google.user@example.com');
                setPassword('googlepass');
                setLoggedIn(true);
                setTimeout(() => setActivePage('explorer'), 1200);
              }}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Footer Link */}
            <div className="text-center pt-4 border-t-2 border-slate-900/40">
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                }}
                className="text-xs font-mono font-extrabold text-slate-900 hover:underline inline-flex items-center gap-1"
              >
                <span>New here? Create your page</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-900" />
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
