'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isSoundEnabled, toggleSound, subscribeSound } from '@/lib/soundEffects';

function SpeakerWaveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5L6 9H2v6h4l5 4V5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
      />
    </svg>
  );
}

function SpeakerMuteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
      />
    </svg>
  );
}

export default function SoundToggle({ className = '' }) {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isSoundEnabled());
    const unsubscribe = subscribeSound((val) => {
      setEnabled(val);
    });
    return unsubscribe;
  }, []);

  if (!mounted) {
    return (
      <div
        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card opacity-50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const handleToggle = () => {
    toggleSound();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-testid="sound-toggle-button"
      aria-label={enabled ? 'Mute harmonic sound effects' : 'Enable harmonic sound effects'}
      title={enabled ? 'Mute harmonic sounds' : 'Enable harmonic sounds'}
      className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card text-fg shadow-sm shadow-sunset-orange/10 transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.span
            key="sound-on"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center text-sunset-orange"
          >
            <SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.span>
        ) : (
          <motion.span
            key="sound-off"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center text-muted"
          >
            <SpeakerMuteIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
