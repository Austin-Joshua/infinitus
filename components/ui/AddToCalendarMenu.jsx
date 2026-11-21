'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateYahooCalendarUrl,
  downloadIcsFile,
} from '@/lib/calendar';

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ExternalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

export default function AddToCalendarMenu({ event, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!event) return null;

  const handleAppleIcal = () => {
    downloadIcsFile(event);
    setIsOpen(false);
  };

  const calendarOptions = [
    {
      id: 'google',
      label: 'Google Calendar',
      icon: ExternalIcon,
      action: () => {
        window.open(generateGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
        setIsOpen(false);
      },
    },
    {
      id: 'apple',
      label: 'Apple Calendar / iCal (.ics)',
      icon: DownloadIcon,
      action: handleAppleIcal,
    },
    {
      id: 'outlook',
      label: 'Outlook Calendar',
      icon: ExternalIcon,
      action: () => {
        window.open(generateOutlookCalendarUrl(event), '_blank', 'noopener,noreferrer');
        setIsOpen(false);
      },
    },
    {
      id: 'yahoo',
      label: 'Yahoo Calendar',
      icon: ExternalIcon,
      action: () => {
        window.open(generateYahooCalendarUrl(event), '_blank', 'noopener,noreferrer');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        data-testid="add-to-calendar-button"
        className="btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-xs sm:text-sm font-semibold rounded-full border border-sunset-orange/40 bg-card hover:bg-sunset-orange/15 hover:border-sunset-orange/70 text-fg transition-all shadow-sm"
      >
        <CalendarIcon className="h-4 w-4 text-sunset-orange" />
        <span>Add to Calendar</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-sunset-orange' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="menu"
            aria-orientation="vertical"
            data-testid="calendar-dropdown-menu"
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 origin-top-left sm:origin-top-right rounded-2xl border border-sunset-orange/30 bg-[#FBF8F2] dark:bg-[#0D0F17] p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl z-50 divide-y divide-border/40"
          >
            <div className="px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
                Sync Event Schedule
              </p>
              <p className="font-sans text-xs font-semibold text-fg truncate mt-0.5">
                {event.title}
              </p>
            </div>

            <div className="py-1">
              {calendarOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="menuitem"
                    data-testid={`calendar-opt-${opt.id}`}
                    onClick={opt.action}
                    className="group flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg hover:bg-sunset-orange/15 hover:text-sunset-orange transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sunset-orange/10 text-sunset-orange group-hover:bg-sunset-orange/20">
                        <CalendarIcon className="h-3 w-3" />
                      </span>
                      <span>{opt.label}</span>
                    </span>
                    <Icon className="h-3.5 w-3.5 text-muted group-hover:text-sunset-orange shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="px-3 py-2 bg-card/40 rounded-b-xl flex items-center justify-between font-mono text-[10px] text-muted">
              <span>Automatic Timezone</span>
              <span className="text-sunset-orange font-semibold">IST (UTC+5:30)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
