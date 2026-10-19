import { useState, useEffect } from 'react';
import LandingPage from './components/spendwise/LandingPage';
import DarkFinanceApp from './components/dark_finance/DarkFinanceApp';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    return window.location.hash === '#dashboard' ? 'dashboard' : 'landing';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openDashboard = () => {
    window.location.hash = '#dashboard';
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToLanding = () => {
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch {}
    window.location.hash = '';
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen">
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={openDashboard} />
      ) : (
        <DarkFinanceApp onLogout={backToLanding} />
      )}
    </div>
  );
}
