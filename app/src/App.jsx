import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EvidenceModal from './components/EvidenceModal';
import AuthModal from './components/AuthModal';
import RealtimeStatusBar from './components/RealtimeStatusBar';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfileExplorerPage from './pages/ProfileExplorerPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingTypePage from './pages/OnboardingTypePage';
import OnboardingSlugPage from './pages/OnboardingSlugPage';
import OnboardingBasicsPage from './pages/OnboardingBasicsPage';
import OnboardingBasicsBusinessPage from './pages/OnboardingBasicsBusinessPage';
import OnboardingCapabilitiesPage from './pages/OnboardingCapabilitiesPage';
import OnboardingProofPage from './pages/OnboardingProofPage';
import OnboardingPreviewPage from './pages/OnboardingPreviewPage';
import OnboardingPublishedPage from './pages/OnboardingPublishedPage';
import DashboardHomePage from './pages/DashboardHomePage';
import DashboardProfilePage from './pages/DashboardProfilePage';
import DashboardProjectsPage from './pages/DashboardProjectsPage';
import DashboardProductsPage from './pages/DashboardProductsPage';
import DashboardEvidencePage from './pages/DashboardEvidencePage';
import DashboardVerificationsPage from './pages/DashboardVerificationsPage';
import DashboardInboxPage from './pages/DashboardInboxPage';
import DashboardInsightsPage from './pages/DashboardInsightsPage';
import DashboardSettingsPage from './pages/DashboardSettingsPage';
import PublicPersonProfilePage from './pages/PublicPersonProfilePage';
import PublicBusinessProfilePage from './pages/PublicBusinessProfilePage';
import ConfirmClaimPage from './pages/ConfirmClaimPage';
import PublicContactPage from './pages/PublicContactPage';
import DiscoverPage from './pages/DiscoverPage';
import AdminReportsPage from './pages/AdminReportsPage';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';

import { authService } from './lib/authService';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultType, setAuthDefaultType] = useState('person');
  const [currentUser, setCurrentUser] = useState(null);

  // Subscribe to real-time auth changes
  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    const unsubscribe = authService.onAuthChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleCreatePage = (type = 'person') => {
    setAuthDefaultType(type);
    setIsAuthOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (pageId) => {
    if (pageId === 'create' || pageId === 'signup') {
      setActivePage('signup');
    } else if (pageId === 'login') {
      setActivePage('login');
    } else if (pageId === 'for-business') {
      handleScrollToSection('for-business');
    } else if (pageId === 'how-it-works') {
      handleScrollToSection('how-it-works');
    } else {
      setActivePage(pageId);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
      case 'login':
        return <LoginPage setActivePage={handlePageChange} onOpenAuth={() => handleCreatePage('person')} />;
      case 'signup':
        return <SignUpPage setActivePage={handlePageChange} onOpenAuth={() => handleCreatePage('person')} />;
      case 'onboarding-type':
        return <OnboardingTypePage setActivePage={handlePageChange} onSelectType={(type) => setAuthDefaultType(type)} />;
      case 'onboarding-slug':
        return (
          <OnboardingSlugPage 
            setActivePage={(nextPage) => {
              if (nextPage === 'onboarding-basics' && authDefaultType === 'business') {
                setActivePage('onboarding-basics-business');
              } else {
                setActivePage(nextPage);
              }
            }} 
            onSaveSlug={(slug) => console.log('Saved slug:', slug)} 
          />
        );
      case 'onboarding-basics':
        return <OnboardingBasicsPage setActivePage={handlePageChange} onSaveBasics={(data) => console.log('Saved basics:', data)} />;
      case 'onboarding-basics-business':
        return <OnboardingBasicsBusinessPage setActivePage={handlePageChange} onSaveBusinessBasics={(data) => console.log('Saved business basics:', data)} />;
      case 'onboarding-capabilities':
        return <OnboardingCapabilitiesPage setActivePage={handlePageChange} onSaveCapabilities={(caps) => console.log('Saved capabilities:', caps)} />;
      case 'onboarding-proof':
        return <OnboardingProofPage setActivePage={handlePageChange} onAddProof={(proof) => console.log('Added proof:', proof)} />;
      case 'onboarding-preview':
        return <OnboardingPreviewPage setActivePage={handlePageChange} onPublish={() => console.log('Page Published!')} />;
      case 'onboarding-published':
        return <OnboardingPublishedPage setActivePage={handlePageChange} slug={currentUser?.slug || "alexrivera"} />;
      case 'dashboard':
        return <DashboardHomePage setActivePage={handlePageChange} userName={currentUser?.fullName?.split(' ')[0] || "Alex"} />;
      case 'dashboard-profile':
        return <DashboardProfilePage setActivePage={handlePageChange} onSaveProfile={(data) => console.log('Saved profile data:', data)} />;
      case 'dashboard-projects':
        return <DashboardProjectsPage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
      case 'dashboard-products':
        return <DashboardProductsPage setActivePage={handlePageChange} />;
      case 'dashboard-evidence':
        return <DashboardEvidencePage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
      case 'dashboard-verifications':
        return <DashboardVerificationsPage setActivePage={handlePageChange} />;
      case 'dashboard-inbox':
        return <DashboardInboxPage setActivePage={handlePageChange} />;
      case 'dashboard-insights':
        return <DashboardInsightsPage setActivePage={handlePageChange} />;
      case 'dashboard-settings':
        return <DashboardSettingsPage setActivePage={handlePageChange} />;
      case 'public-profile':
        return <PublicPersonProfilePage slug={currentUser?.slug || "alexrivera"} onOpenEvidence={setSelectedEvidence} />;
      case 'public-business-profile':
        return <PublicBusinessProfilePage slug="apex-dynamics" onOpenEvidence={setSelectedEvidence} />;
      case 'confirm-claim':
        return <ConfirmClaimPage token="token-99281" requesterName={currentUser?.fullName || "Alex Rivera"} claimText="I built the checkout flow for this project." setActivePage={handlePageChange} />;
      case 'public-contact':
        return <PublicContactPage name={currentUser?.fullName || "Alex Rivera"} slug={currentUser?.slug || "alexrivera"} setActivePage={handlePageChange} />;
      case 'discover':
        return <DiscoverPage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
      case 'admin-reports':
        return <AdminReportsPage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
      case '404':
        return <NotFoundPage setActivePage={handlePageChange} />;
      case 'error':
        return <ServerErrorPage setActivePage={handlePageChange} />;
      case 'products':
      case 'pricing':
        return <ProductsPage setActivePage={handlePageChange} />;
      case 'about':
        return <AboutPage setActivePage={handlePageChange} />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'explorer':
        return <ProfileExplorerPage onOpenEvidence={setSelectedEvidence} />;
      case 'faq':
        return <FaqPage />;
      default:
        return <HomePage setActivePage={handlePageChange} onOpenEvidence={setSelectedEvidence} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f0] text-slate-900 font-sans selection:bg-yellow-300 selection:text-slate-900">
      
      {/* Realtime Architecture Live Status & Testing Toolbar */}
      <RealtimeStatusBar profileId={currentUser?.slug || "alexrivera-id"} />

      {/* Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        onOpenAuth={() => handlePageChange('login')}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Evidence Inspector Modal */}
      <EvidenceModal
        isOpen={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
        evidence={selectedEvidence}
      />

      {/* Auth & Page Creation Wizard Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultType={authDefaultType}
        onComplete={(slug) => {
          setActivePage('onboarding-type');
        }}
      />

    </div>
  );
}
