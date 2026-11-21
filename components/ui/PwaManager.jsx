'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function WifiOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-1.87M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </svg>
  );
}

function DownloadAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M12 7v6m0 0l-2-2m2 2l2-2" />
    </svg>
  );
}

export default function PwaManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  // Register service worker and monitor network status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial online/offline status
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker in browser
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Service worker successfully registered
          })
          .catch((err) => {
            console.warn('[PWA] Service worker registration failed:', err);
          });
      });
    }

    // Capture beforeinstallprompt event for PWA installation
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      window.dispatchEvent(new CustomEvent('infinitus:pwa-installable'));
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstalled(true);
    };

    const handleExternalInstallTrigger = async () => {
      if (installPrompt) {
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallPrompt(null);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('infinitus:trigger-pwa-install', handleExternalInstallTrigger);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('infinitus:trigger-pwa-install', handleExternalInstallTrigger);
    };
  }, [installPrompt]);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Status Floating Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            data-testid="pwa-offline-banner"
            className="fixed top-2.5 inset-x-4 max-w-md mx-auto z-[150] flex items-center justify-between gap-3 rounded-full border border-sunset-orange/50 bg-[#0D0F17]/95 px-4 py-2 text-xs text-fg shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange/20 text-sunset-orange">
                <WifiOffIcon className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-xs font-medium">
                Offline Mode • Browsing Cache
              </span>
            </div>
            <span className="rounded-full bg-sunset-orange/20 px-2 py-0.5 font-mono text-[10px] font-bold text-sunset-orange">
              PWA
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA 1-Tap Install Floating Pill (When browser supports installation) */}
      <AnimatePresence>
        {installPrompt && !installed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            data-testid="pwa-install-banner"
            className="fixed bottom-20 left-4 z-[55] hidden sm:flex items-center gap-2 rounded-full border border-sunset-orange/40 bg-card/90 px-3.5 py-1.5 shadow-xl backdrop-blur-md transition-all hover:border-sunset-orange/80"
          >
            <DownloadAppIcon className="h-4 w-4 text-sunset-orange" />
            <span className="font-mono text-xs font-medium text-fg">Install Infinitus App</span>
            <button
              type="button"
              onClick={triggerInstall}
              className="ml-1 rounded-full bg-sunset-orange px-2.5 py-0.5 font-mono text-[11px] font-bold text-white hover:bg-sunset-orange/90 transition-colors"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setInstallPrompt(null)}
              aria-label="Dismiss install prompt"
              className="text-muted hover:text-fg p-0.5 text-xs ml-0.5"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
