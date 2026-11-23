'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';
import { playSuccess } from '@/lib/soundEffects';

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Smart 1-Click Calendar Sync Button.
 * Automatically identifies device and network status:
 *  - Apple devices (iPhone, iPad, macOS) -> Triggers native Apple Calendar (.ics) download & launch
 *  - Android, Windows & Web -> Directly launches Google Calendar template
 *  - Offline sessions -> Automatically saves native offline .ics iCalendar file
 */
export default function AddToCalendarMenu({ event, className = '' }) {
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!event) return null;

  const handleSmartSync = () => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(ua) && !/Windows/i.test(ua);
    const isOffline = typeof navigator.onLine !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      downloadIcsFile(event);
      setToast('Offline: Saved calendar file (.ics)');
    } else if (isApple) {
      // Apple devices (iOS, macOS) use native .ics iCalendar which system opens directly
      downloadIcsFile(event);
      setToast('Synced to Apple Calendar (.ics)');
    } else {
      // Android, Windows, and Linux open Google Calendar directly
      try {
        window.open(generateGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
      } catch (err) {
        // Fallback to .ics if popup blocked
        downloadIcsFile(event);
      }
      setToast('Opening Google Calendar...');
    }

    setSynced(true);
    playSuccess();
    setTimeout(() => {
      setSynced(false);
      setToast(null);
    }, 2800);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleSmartSync}
        data-testid="add-to-calendar-button"
        data-hydrated={mounted ? "true" : undefined}
        aria-label={`Add ${event.title} to calendar`}
        className="btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-xs sm:text-sm font-semibold rounded-full border border-sunset-orange/40 bg-card hover:bg-sunset-orange/15 hover:border-sunset-orange/70 text-fg transition-all shadow-sm active:scale-95"
      >
        {synced ? (
          <>
            <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-emerald-500 font-bold">Synced!</span>
          </>
        ) : (
          <>
            <CalendarIcon className="h-4 w-4 text-sunset-orange shrink-0" />
            <span>Add to Calendar</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            data-testid="calendar-sync-toast"
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 whitespace-nowrap rounded-xl border border-sunset-orange/30 bg-[#FBF8F2] dark:bg-[#0D0F17] px-3.5 py-1.5 font-mono text-[11px] text-fg shadow-xl"
          >
            <span className="text-sunset-orange font-bold mr-1.5">✓</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
