import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenAuth, onScrollToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    if (id === 'how-it-works') {
      onScrollToSection('how-it-works');
    } else if (id === 'for-business') {
      onScrollToSection('for-business');
    } else {
      setActivePage(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-3 border-slate-900 bg-[#f7f5f0]">
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

          {/* Desktop Navigation Links: EXACTLY "How it works" · "For Business" · "Log in" */}
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
            <span className="text-slate-400 font-bold">•</span>
            <button
              onClick={onOpenAuth}
              className="text-sm font-extrabold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Log in
            </button>
          </nav>

          {/* Right Action Button: Create your page */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setActivePage('create')}
              className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-black px-6 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 transition-all hover:translate-y-[-2px] flex items-center gap-2 text-sm cursor-pointer"
            >
              <span>Create your page</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
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
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:bg-slate-100"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setActivePage('create');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-amber-300 hover:bg-amber-400 text-slate-900 font-black py-3 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] border-2 border-slate-900 text-center flex items-center justify-center gap-2 mt-2"
            >
              <span>Create your page</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
