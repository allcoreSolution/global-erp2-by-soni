import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { TopHeader, SubHeader } from './Header';

const Layout = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);

  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  const [config, setConfig] = useState({
    company: localStorage.getItem('erp_company') || localStorage.getItem('companyName') || 'ALLCORE SOLUTION PVT. LTD.',
    user: localStorage.getItem('userName') || localStorage.getItem('erp_user') || 'ADMIN',
    fy: localStorage.getItem('erp_fy') || '2024-2025'
  });

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig({
        company: localStorage.getItem('erp_company') || localStorage.getItem('companyName') || 'ALLCORE SOLUTION PVT. LTD.',
        user: localStorage.getItem('userName') || localStorage.getItem('erp_user') || 'ADMIN',
        fy: localStorage.getItem('erp_fy') || '2024-2025'
      });
    };
    window.addEventListener('erp_config_changed', handleConfigChange);
    return () => window.removeEventListener('erp_config_changed', handleConfigChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-950 text-gray-800 dark:text-slate-100 font-sans relative transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarVisible ? 'lg:relative lg:translate-x-0' : 'lg:absolute lg:-translate-x-full'} transition-transform duration-300 ease-in-out flex-shrink-0 h-full`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f7fb] dark:bg-slate-950 w-full transition-colors">
        <header className="z-10">
          <TopHeader 
            onMenuClick={() => setIsSidebarOpen(prev => !prev)} 
            onToggleDesktopSidebar={() => setIsDesktopSidebarVisible(prev => !prev)} 
          />
          <SubHeader />
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <Outlet />
        </main>
        
        <footer className="bg-[#0a192f] dark:bg-[#071324] text-white dark:text-slate-400 text-[11px] py-1.5 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 tracking-wide font-medium border-t dark:border-slate-850 transition-colors">
          <div className="flex gap-4 md:gap-16 w-full md:w-auto justify-between md:justify-start">
            <span className="truncate">Company : {config.company}</span>
            <span>User : {config.user}</span>
          </div>
          <div className="hidden md:flex gap-16">
            <span>Version : 1.0.0.0</span>
            <span>Database : ALLCORE_DB</span>
            <span>Financial Year : {config.fy}</span>
          </div>
          <div className="w-full md:w-auto text-center md:text-right">
            <span>24-05-2024 <span className="mx-2">|</span> 11:30 AM</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
