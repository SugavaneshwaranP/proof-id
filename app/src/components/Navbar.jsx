import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, ArrowRight, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { authService } from '../lib/authService';

export default function Navbar({ activePage, setActivePage, onOpenAuth, onScrollToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    setCurrentUser(authService.getCurrentUser());

    // Real-time listener
    const unsubscribe = authService.onAuthChange((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleNavClick = (id) => {
    if (id === 'how-it-works') {
      onScrollToSection('how-it-works');
    } else if (id === 'for-business') {
      onScrollToSection('for-business');
    } else {
      setActivePage(id);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setUserDropdownOpen(false);
    setActivePage('home');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-3 border-slate-900 bg-[#f7f5f0] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_#0f172a] group-hover:translate-y-[-2px] transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-slate-900" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 font-sans">
              Backed
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-extrabold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <span className="text-slate-400 font-bold">•</span>
            <button
              onClick={() => handleNavClick('for-business')}
              className="text-sm font-extrabold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
            >
              For Business
            </button>
            <span className="text-slate-400 font-bold">•</span>
            <button
              onClick={() => handleNavClick('discover')}
              className="text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              Discover
            </button>

            {!currentUser ? (
              <>
                <span className="text-slate-400 font-bold">•</span>
                <button
                  onClick={() => setActivePage('login')}
                  className="text-sm font-extrabold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  Log in
                </button>
              </>
            ) : null}
          </nav>

          {/* Right Action Button or Logged In User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="bg-emerald-300 hover:bg-emerald-400 text-slate-900 font-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 transition-all flex items-center gap-2.5 cursor-pointer text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span>{currentUser.fullName || currentUser.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-900" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <p className="text-xs font-black text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePage('dashboard');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-black text-slate-900 hover:bg-amber-100 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-900" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePage('public-profile');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-black text-slate-900 hover:bg-emerald-100 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-900" />
                      <span>View Public Page</span>
                    </button>

                    <div className="border-t border-slate-200 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActivePage('signup')}
                className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-black px-6 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 transition-all hover:translate-y-[-2px] flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>Create your page</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-900 hover:bg-slate-200 border-2 border-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-2 border-slate-900 px-4 pt-3 pb-6 space-y-3"
          >
            <button
              onClick={() => {
                handleNavClick('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:bg-amber-100"
            >
              How it works
            </button>
            <button
              onClick={() => {
                handleNavClick('for-business');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:bg-emerald-100"
            >
              For Business
            </button>
            
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setActivePage('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:bg-amber-100 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5 text-slate-900" />
                  <span>My Dashboard ({currentUser.fullName})</span>
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActivePage('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:bg-slate-100"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setActivePage('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-300 hover:bg-amber-400 text-slate-900 font-black py-3 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 text-center flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create your page</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
