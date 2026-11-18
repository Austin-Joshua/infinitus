'use client';

import { useId, useMemo, useState } from 'react';
import MemberCard, { MemberDetailModal } from '@/components/ui/MemberCard';
import Reveal, { Stagger, StaggerItem } from '@/components/ui/Reveal';

export default function TeamBrowser({ members }) {
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [activeMember, setActiveMember] = useState(null);
  const modalTitleId = useId();

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

  return (
    <div className="space-y-10">
      <h2 className="sr-only">Members Directory by Department & Domain</h2>

      {/* Team Filter Pills: swipeable horizontal bar on mobile, wrapped grid on tablet/desktop */}
      <div
        role="group"
        aria-label="Filter members by team domain"
        className="flex gap-2 overflow-x-auto no-scrollbar pb-3 pt-1 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:pb-6 border-b border-fg/15"
      >
        {teamCategories.map((team) => {
          const active = team === selectedTeam;
          return (
            <button
              key={team}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedTeam(team)}
              className={`shrink-0 sm:shrink rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                active
                  ? 'bg-sunset-orange text-white border border-sunset-orange shadow-lg shadow-sunset-orange/35 scale-[1.02]'
                  : 'bg-card border border-sunset-orange/35 text-fg/85 shadow-sm shadow-sunset-orange/5 hover:border-sunset-orange/70 hover:text-fg hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {team}
              {team === 'All' ? (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-mono transition-colors ${
                    active ? 'bg-white/25 text-white' : 'bg-fg/10 text-muted'
                  }`}
                >
                  {members.length}
                </span>
              ) : (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-mono transition-colors ${
                    active ? 'bg-white/25 text-white' : 'bg-fg/10 text-muted'
                  }`}
                >
                  {members.filter((m) => m.team === team).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Member Cards Grid */}
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
        {filteredMembers.map((member) => (
          <StaggerItem key={member.id}>
            <MemberCard
              member={member}
              onOpen={(m) => setActiveMember(m)}
            />
          </StaggerItem>
        ))}
      </Stagger>

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
