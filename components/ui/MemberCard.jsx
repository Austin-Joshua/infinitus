'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { metaOf } from '@/lib/format';
import { SOCIAL } from '@/lib/site';

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" />
      <path
        d="M8 10.5v5M8 8v.01M12 15.5v-3a1.8 1.8 0 0 1 3.6 0v3M12 12.2v3.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" />
      <path d="M16.2 7.8h.01" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** Professional vector icon tailored to each club committee role */
export function RoleIcon({ role, className = 'h-7 w-7' }) {
  const r = (role || '').toLowerCase().trim();

  // 1. Faculty Coordinator
  if (r.includes('faculty')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    );
  }

  // 2. President
  if (r === 'president') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M4 19h16M5 15l2-8 5 4 5-4 2 8H5z" />
        <circle cx="12" cy="5" r="1.5" />
      </svg>
    );
  }

  // 3. Vice President
  if (r.includes('vice president')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  // 4. Secretary & Joint Secretary
  if (r.includes('joint secretary')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }

  if (r.includes('secretary')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="15" y2="16" />
      </svg>
    );
  }

  // 5. Technical Head
  if (r.includes('technical') || r.includes('tech')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    );
  }

  // 6. Creative Director
  if (r.includes('creative')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 3.6 8 8 8 1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.9-.5-1.4 0-1.2 1-2.3 2.3-2.3H15c3.7 0 6.8-3 6.8-6.8C21.8 5 17.4 2 12 2z" />
        <circle cx="7.5" cy="10.5" r="1.25" fill="currentColor" />
        <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
        <circle cx="16.5" cy="10.5" r="1.25" fill="currentColor" />
      </svg>
    );
  }

  // 7. Poster Designer & Head
  if (r.includes('poster')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    );
  }

  // 8. Video Editor
  if (r.includes('video')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="5" width="14" height="14" rx="2" />
        <polygon points="22 8 16 12 22 16 22 8" />
      </svg>
    );
  }

  // 9. Photography Head & Photographer
  if (r.includes('photo')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
  }

  // 10. Social Media Manager
  if (r.includes('social media')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    );
  }

  // 11. Content Writer & Report Writing Team
  if (r.includes('content') || r.includes('writer') || r.includes('writing') || r.includes('report')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }

  // 12. Innovation Head
  if (r.includes('innovation')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    );
  }

  // 13. PRO (Public Relations Officer)
  if (r.includes('pro')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M3 11v3a1 1 0 0 0 1 1h2.2l5.4 3.6A1 1 0 0 0 13 18V6a1 1 0 0 0-1.4-.8L6.2 9H4a1 1 0 0 0-1 1z" />
        <path d="M16 8a5 5 0 0 1 0 8" />
        <path d="M19 5a9 9 0 0 1 0 14" />
      </svg>
    );
  }

  // 14. Volunteer Management Head
  if (r.includes('volunteer')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  // 15. Logistic and Discipline Coordinator
  if (r.includes('logistic') || r.includes('discipline')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }

  // 16. Treasurer
  if (r.includes('treasurer')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="16" cy="15" r="1.5" />
      </svg>
    );
  }

  // 17. Event Operations / Planning / Coordinator
  if (r.includes('event')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M12 14v4M10 16h4" />
      </svg>
    );
  }

  // Default fallback member icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Avatar({ name, photoUrl, role, className = '' }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt={name} className={`h-full w-full object-cover ${className}`} loading="lazy" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20 group-hover:text-sunset-orange ${className}`}
    >
      <RoleIcon role={role} className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
    </div>
  );
}

export function MemberDetailModal({ member, open, onClose, titleId }) {
  const [mounted, setMounted] = useState(false);
  const meta = member ? metaOf(member) : '';
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    lastFocusedRef.current = document.activeElement;

    // Auto-focus close button when modal mounts
    const timer = setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    }, 50);

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      // Keyboard focus trap
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
        lastFocusedRef.current.focus();
      }
    };
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence>
      {open && member && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close member details"
            className="absolute inset-0 bg-black/80 cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`relative z-10 w-full ${
              member.posterUrl ? 'max-w-2xl' : 'max-w-lg'
            } max-h-[90vh] overflow-y-auto rounded-2xl border border-sunset-orange/40 bg-card p-6 shadow-2xl shadow-sunset-orange/15 sm:p-8`}
          >
            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/70 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {member.posterUrl ? (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
                {/* Official Member Poster */}
                <div className="mx-auto w-full max-w-[220px] shrink-0 sm:max-w-[240px]">
                  <div className="relative aspect-[240/309] w-full overflow-hidden rounded-xl border border-sunset-orange/30 bg-bg/60 shadow-lg shadow-sunset-orange/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.posterUrl}
                      alt={`${member.name} official poster`}
                      width={240}
                      height={309}
                      className="h-full w-full object-contain"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Details Column */}
                <div className="flex-1 min-w-0">
                  <div className="pr-8 sm:pr-0">
                    <h3 id={titleId} className="font-heading text-xl font-bold text-fg sm:text-2xl">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-gold">
                      {member.role}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {member.team && (
                        <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                          {member.team}
                        </span>
                      )}
                      {meta && <span className="text-xs font-mono text-muted">{meta}</span>}
                    </div>
                  </div>

                  {/* Role Responsibilities */}
                  <div className="mt-5 border-t border-fg/10 pt-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">
                      Role Responsibilities
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-fg/80">
                      {member.responsibilities ||
                        'Active coordinator contributing to INFINITUS club initiatives, event execution, and mathematical community engagement.'}
                    </p>
                  </div>

                  {/* Social & Connect Links */}
                  <div className="mt-6 flex items-center justify-between border-t border-fg/10 pt-4">
                    <div className="flex items-center gap-2">
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${member.name} on LinkedIn`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/80 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange hover:shadow-md hover:shadow-sunset-orange/20"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      ) : null}
                      {member.instagramUrl ? (
                        <a
                          href={member.instagramUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${member.name} on Instagram`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/80 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange hover:shadow-md hover:shadow-sunset-orange/20"
                        >
                          <InstagramIcon className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-ghost !px-4 !py-2 text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Member Header */}
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/30 sm:h-24 sm:w-24">
                    <Avatar name={member.name} photoUrl={member.photoUrl} role={member.role} />
                  </div>

                  <div className="mt-4 sm:ml-5 sm:mt-0 sm:flex-1">
                    <h3 id={titleId} className="font-heading text-xl font-bold text-fg sm:text-2xl">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-gold">
                      {member.role}
                    </p>
                    {member.team && (
                      <span className="mt-1.5 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                        {member.team}
                      </span>
                    )}
                    {meta && <p className="mt-1.5 text-xs font-mono text-muted">{meta}</p>}
                  </div>
                </div>

                {/* Role Responsibilities */}
                <div className="mt-6 border-t border-fg/10 pt-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">
                    Role Responsibilities
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg/80">
                    {member.responsibilities ||
                      'Active coordinator contributing to INFINITUS club initiatives, event execution, and mathematical community engagement.'}
                  </p>
                </div>

                {/* Social & Connect Links */}
                <div className="mt-6 flex items-center justify-between border-t border-fg/10 pt-4">
                  <div className="flex items-center gap-2">
                    {member.linkedinUrl ? (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${member.name} on LinkedIn`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/80 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange hover:shadow-md hover:shadow-sunset-orange/20"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    ) : null}
                    {member.instagramUrl ? (
                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${member.name} on Instagram`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/80 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange hover:shadow-md hover:shadow-sunset-orange/20"
                      >
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-ghost !px-4 !py-2 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

/** 3D Flip Card displaying personalized Role Icon on front and revealed member poster & details on back */
export default function MemberCard({ member, onOpen }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const titleId = useId();
  const meta = metaOf(member);

  const handleCardClick = (e) => {
    // If click originated from a link or specific interactive button, don't trigger flip
    if (e.target.closest('a') || e.target.closest('button[data-action]')) {
      return;
    }
    setIsFlipped((prev) => !prev);
  };

  const handleOpenDetail = (e) => {
    if (e) e.stopPropagation();
    if (onOpen) {
      onOpen(member);
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      <div
        className="perspective-1000 group relative h-full w-full min-h-[300px] sm:min-h-[330px]"
        onClick={handleCardClick}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-full w-full"
        >
          {/* FRONT FACE */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className={`card card-hover flex h-full w-full cursor-pointer flex-col items-center p-4 sm:p-5 lg:p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isFlipped ? 'pointer-events-none select-none' : 'pointer-events-auto'
            }`}
            role="button"
            tabIndex={0}
            aria-label={`${member.name}, ${member.role}. Click to flip card.`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(true);
              }
            }}
          >
            {/* Circular Avatar with Personalized Role Icon */}
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22 overflow-hidden rounded-full ring-2 ring-fg/15 transition-all duration-300 group-hover:ring-accent/50 group-hover:shadow-md">
              <Avatar name={member.name} photoUrl={member.photoUrl} role={member.role} />
            </div>

            {/* Member Name */}
            <h3 className="mt-3 sm:mt-4 font-heading text-sm sm:text-base font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
              {member.name}
            </h3>

            {/* Role */}
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-gold">
              {member.role}
            </p>

            {/* Department · Year */}
            {meta && <p className="mt-1 text-[10px] sm:text-[11px] font-mono text-muted">{meta}</p>}

            {/* Call-to-action prompt */}
            <div className="mt-auto pt-3 sm:pt-4">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-muted transition-colors group-hover:text-accent">
                {member.posterUrl ? 'View poster & role' : 'Role details'}{' '}
                <span aria-hidden="true" className="nudge">↻</span>
              </span>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className={`absolute inset-0 card flex h-full w-full cursor-pointer flex-col items-center justify-between p-3.5 sm:p-4 text-center border-sunset-orange/40 bg-card shadow-lg ${
              isFlipped ? 'pointer-events-auto' : 'pointer-events-none select-none'
            }`}
            role="button"
            tabIndex={isFlipped ? 0 : -1}
            aria-label={`${member.name} details. Click to flip back.`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(false);
              }
            }}
          >
            {member.posterUrl ? (
              /* Core Member with Official Poster */
              <div className="flex h-full w-full flex-col items-center justify-between">
                <div
                  className="relative aspect-[240/309] w-full max-w-[155px] sm:max-w-[170px] shrink-0 overflow-hidden rounded-lg border border-sunset-orange/30 bg-bg/60 shadow-md group/poster cursor-pointer"
                  onClick={handleOpenDetail}
                  title="Click to view full poster"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.posterUrl}
                    alt={`${member.name} poster`}
                    width={240}
                    height={309}
                    className="h-full w-full object-contain transition-transform duration-200 group-hover/poster:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="mt-2 w-full px-1">
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-fg truncate">
                    {member.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-gold truncate">
                    {member.role}
                  </p>
                </div>

                <div className="mt-2 flex w-full items-center justify-between border-t border-fg/10 pt-2 text-[10px] sm:text-[11px] font-mono">
                  <button
                    type="button"
                    data-action="flip"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="text-muted hover:text-fg transition-colors px-1.5 py-1"
                  >
                    ↺ Flip
                  </button>
                  <button
                    type="button"
                    data-action="details"
                    onClick={handleOpenDetail}
                    className="font-semibold text-sunset-orange hover:text-accent transition-colors px-1.5 py-1"
                  >
                    Full view ↗
                  </button>
                </div>
              </div>
            ) : (
              /* Member without Poster (Faculty / Staff) */
              <div className="flex h-full w-full flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <RoleIcon role={member.role} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h4 className="mt-2 font-heading text-xs sm:text-sm font-bold text-fg">
                    {member.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-gold">
                    {member.role}
                  </p>
                  {meta && <p className="text-[9px] sm:text-[10px] font-mono text-muted">{meta}</p>}
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-fg/80 line-clamp-4 px-2">
                  {member.responsibilities ||
                    'Active coordinator contributing to INFINITUS club initiatives and mathematics activities.'}
                </p>

                <div className="mt-2 flex w-full items-center justify-between border-t border-fg/10 pt-2 text-[10px] sm:text-[11px] font-mono">
                  <button
                    type="button"
                    data-action="flip"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="text-muted hover:text-fg transition-colors px-1.5 py-1"
                  >
                    ↺ Flip
                  </button>
                  <button
                    type="button"
                    data-action="details"
                    onClick={handleOpenDetail}
                    className="font-semibold text-sunset-orange hover:text-accent transition-colors px-1.5 py-1"
                  >
                    Full view ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Internal Modal if onOpen not provided */}
      {!onOpen && (
        <MemberDetailModal
          member={member}
          open={internalOpen}
          onClose={() => setInternalOpen(false)}
          titleId={titleId}
        />
      )}
    </>
  );
}
