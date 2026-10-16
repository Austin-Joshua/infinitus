'use client';

import { useEffect, useId, useState } from 'react';
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

function InstagramIcon(props) {
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

export function Avatar({ name, photoUrl, className = '' }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt={name} className={`h-full w-full object-cover ${className}`} loading="lazy" />
    );
  }

  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'IN';

  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center bg-accent/10 font-heading text-lg font-bold text-accent sm:text-xl ${className}`}
    >
      {initials}
    </div>
  );
}

export function MemberDetailModal({ member, open, onClose, titleId }) {
  const meta = member ? metaOf(member) : '';

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-fg/15 bg-card p-6 shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-fg/60 transition-colors hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Member Header */}
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/30 sm:h-24 sm:w-24">
                <Avatar name={member.name} photoUrl={member.photoUrl} />
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/15 text-muted transition-colors hover:border-accent hover:text-accent"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/15 text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="INFINITUS on Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/15 text-muted transition-colors hover:border-accent hover:text-accent"
                    title="Connect on Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Restored card method with Avatar, role, and detail view */
export default function MemberCard({ member, onOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const titleId = useId();
  const meta = metaOf(member);

  const handleOpen = (e) => {
    if (onOpen) {
      onOpen(member, e.currentTarget);
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleOpen}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="card card-hover group flex h-full w-full cursor-pointer flex-col items-center p-5 text-center transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-6"
        aria-haspopup="dialog"
      >
        {/* Circular Avatar */}
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-2 ring-fg/15 transition-all duration-300 group-hover:ring-accent/50 group-hover:shadow-md sm:h-24 sm:w-24">
          <Avatar name={member.name} photoUrl={member.photoUrl} />
        </div>

        {/* Member Name */}
        <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
          {member.name}
        </h3>

        {/* Role */}
        <p className="mt-1 text-xs font-semibold text-gold sm:text-sm">
          {member.role}
        </p>

        {/* Department · Year */}
        {meta && <p className="mt-1 text-[11px] font-mono text-muted sm:text-xs">{meta}</p>}

        {/* Call-to-action prompt */}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors group-hover:text-accent">
            Role details <span aria-hidden="true" className="nudge">→</span>
          </span>
        </div>
      </motion.button>

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
