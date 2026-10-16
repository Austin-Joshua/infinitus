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
      {/* Team Filter Pills for native-app experience on mobile/tablet/desktop */}
      <div className="flex flex-wrap gap-2 border-b border-fg/15 pb-6">
        {teamCategories.map((team) => {
          const active = team === selectedTeam;
          return (
            <button
              key={team}
              type="button"
              onClick={() => setSelectedTeam(team)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                active
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-card border border-fg/15 text-muted hover:border-fg/30 hover:text-fg'
              }`}
            >
              {team}
              {team === 'All' ? (
                <span className="ml-1.5 opacity-60">({members.length})</span>
              ) : (
                <span className="ml-1.5 opacity-60">
                  ({members.filter((m) => m.team === team).length})
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
