'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MemberCard, { MemberDetailModal } from '@/components/ui/MemberCard';
import { playClick } from '@/lib/soundEffects';

export default function TeamBrowser({ members }) {
  const [mounted, setMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [activeMember, setActiveMember] = useState(null);
  const modalTitleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique teams in preferred club order
  const teamCategories = useMemo(() => {
    const order = [
      'All',
      'Faculty',
      'Leadership',
      'Technical Team',
      'Creative & Media',
      'Event Management',
      'Photography',
      'Content & Documentation',
      'Innovation & Outreach',
      'Volunteers & Logistics',
      'Finance',
    ];
    const present = new Set(members.map((m) => m.team).filter(Boolean));
    const sorted = order.filter((cat) => cat === 'All' || present.has(cat));
    // Any remaining teams
    present.forEach((t) => {
      if (!sorted.includes(t)) sorted.push(t);
    });
    return sorted;
  }, [members]);

  const filteredMembers = useMemo(() => {
    if (selectedTeam === 'All') return members;
    return members.filter((m) => m.team === selectedTeam);
  }, [members, selectedTeam]);

  const handleSelectTeam = (team) => {
    playClick();
    setSelectedTeam(team);
  };

  return (
    <div data-hydrated={mounted ? "true" : undefined} className="space-y-8 sm:space-y-10">
      <h2 className="sr-only">Members Directory by Department & Domain</h2>

      {/* Team Filter Pills */}
      <div className="flex flex-col gap-3 pb-3 sm:pb-6 border-b border-fg/15">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Filter by Committee Domain ({filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'})
        </p>

        <div
          role="group"
          aria-label="Filter members by team domain"
          className="flex gap-2 overflow-x-auto no-scrollbar pt-1 sm:flex-wrap sm:gap-2.5 sm:overflow-visible"
        >
          {teamCategories.map((team) => {
            const active = team === selectedTeam;
            return (
              <button
                key={team}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelectTeam(team)}
                className={`shrink-0 sm:shrink rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${active
                    ? 'bg-sunset-orange text-white border border-sunset-orange shadow-lg shadow-sunset-orange/35 scale-[1.02]'
                    : 'bg-card border border-sunset-orange/35 text-fg/85 shadow-sm shadow-sunset-orange/5 hover:border-sunset-orange/70 hover:text-fg hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                {team}
                {team === 'All' ? (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-mono transition-colors ${active ? 'bg-white/25 text-white' : 'bg-fg/10 text-muted'
                      }`}
                  >
                    {members.length}
                  </span>
                ) : (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-mono transition-colors ${active ? 'bg-white/25 text-white' : 'bg-fg/10 text-muted'
                      }`}
                  >
                    {members.filter((m) => m.team === team).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Member Cards Grid with Dynamic Key Transition (Fixes Bug #2: Category Switching) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTeam}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6"
        >
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onOpen={(m) => setActiveMember(m)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Detailed Modal on Card Click */}
      <MemberDetailModal
        member={activeMember}
        open={Boolean(activeMember)}
        onClose={() => setActiveMember(null)}
        titleId={modalTitleId}
      />
    </div>
  );
}
