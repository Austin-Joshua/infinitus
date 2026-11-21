'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SYMPOSIUM_INFO,
  SYMPOSIUM_ROUNDS,
  CAMPUS_VENUES,
  LIVE_STANDINGS,
  getFilteredStandings,
} from '@/lib/liveHubData';
import { playClick } from '@/lib/soundEffects';

const TABS = [
  { id: 'rounds', label: 'Active Rounds & Schedule', badge: 'Round 2 Live' },
  { id: 'venues', label: 'Campus Venue & Floor Map', badge: 'Wozniak & Green' },
  { id: 'standings', label: 'Live Scores & Finalists', badge: 'Top 8 Cutoff' },
];

export default function LiveHubView() {
  const [activeTab, setActiveTab] = useState('rounds');
  const [selectedRound, setSelectedRound] = useState('round-2');
  const [selectedVenue, setSelectedVenue] = useState('wozniak');
  const [standingsFilter, setStandingsFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  const activeVenueData = CAMPUS_VENUES.find((v) => v.id === selectedVenue) || CAMPUS_VENUES[0];
  const activeRoundData = SYMPOSIUM_ROUNDS.find((r) => r.id === selectedRound) || SYMPOSIUM_ROUNDS[1];
  const filteredStandings = getFilteredStandings(standingsFilter);

  return (
    <section
      id="live-hub"
      className="section relative overflow-hidden !pt-2 sm:!pt-4 pb-16 sm:pb-20"
      aria-label="Live Symposium Operations Hub"
    >
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0 opacity-25" />

      <div className="container-x relative">
        {/* Live Top Banner: Single Clean Element */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-sunset-orange/30 bg-card/90 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <span className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">
                  Symposium Day Live Mode
                </span>
                <span className="text-muted text-xs">·</span>
                <span className="font-mono text-xs text-muted">
                  {SYMPOSIUM_INFO.date} ({SYMPOSIUM_INFO.time})
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-fg mt-0.5">
                {SYMPOSIUM_INFO.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-5">
            <div>
              <p className="uppercase tracking-wider text-[10px]">Registered Teams</p>
              <p className="font-bold text-fg text-sm">{SYMPOSIUM_INFO.totalTeams} Teams</p>
            </div>
            <div>
              <p className="uppercase tracking-wider text-[10px]">Colleges</p>
              <p className="font-bold text-fg text-sm">{SYMPOSIUM_INFO.participatingInstitutions} Institutions</p>
            </div>
            <div>
              <p className="uppercase tracking-wider text-[10px]">Active Venue</p>
              <p className="font-bold text-sunset-orange text-sm">Wozniak Arena</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 pb-3 mb-8" role="tablist">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                data-testid={`tab-${tab.id}`}
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono font-medium transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-sunset-orange text-white font-semibold shadow-md shadow-sunset-orange/25'
                    : 'border border-border/60 bg-card text-muted hover:text-fg hover:border-sunset-orange/40'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-black/20 text-white' : 'bg-bg text-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Active Rounds & Schedule Tracker */}
        {activeTab === 'rounds' && (
          <div className="space-y-6" data-testid="section-rounds">
            {/* Round Switcher */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SYMPOSIUM_ROUNDS.map((round) => {
                const isSelected = selectedRound === round.id;
                const isLive = round.status === 'active';
                const isCompleted = round.status === 'completed';

                return (
                  <button
                    key={round.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedRound(round.id);
                    }}
                    className={`text-left rounded-2xl p-5 border transition-all ${
                      isSelected
                        ? 'border-sunset-orange bg-card shadow-lg shadow-sunset-orange/10 ring-2 ring-sunset-orange/20'
                        : 'border-border/60 bg-card/70 hover:border-sunset-orange/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-muted">
                        ROUND 0{round.number}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isLive
                            ? 'bg-sunset-orange text-white animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted/15 text-muted'
                        }`}
                      >
                        {round.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-fg line-clamp-1">
                      {round.title}
                    </h3>
                    <p className="font-mono text-xs text-sunset-orange font-medium mt-1">
                      {round.time}
                    </p>
                    <p className="font-sans text-xs text-muted mt-2 line-clamp-2">
                      {round.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Round Card */}
            <AnimatePresence mode="wait">
              <motion.article
                key={activeRoundData.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                data-testid="active-round-card"
                className="rounded-2xl border border-sunset-orange/30 bg-card p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sunset-orange/15 px-3 py-0.5 font-mono text-xs font-bold text-sunset-orange">
                        Round {activeRoundData.number}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        Venue: {activeRoundData.venueName}
                      </span>
                      {activeRoundData.status === 'active' && (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          Live Contest in Progress
                        </span>
                      )}
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-fg">
                      {activeRoundData.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-muted">
                      {activeRoundData.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-border/60 bg-bg/60 p-3.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
                          Competition Format
                        </p>
                        <p className="font-sans text-xs sm:text-sm font-semibold text-fg mt-1">
                          {activeRoundData.format}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/60 bg-bg/60 p-3.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
                          Advancement Criteria
                        </p>
                        <p className="font-sans text-xs sm:text-sm font-semibold text-sunset-orange mt-1">
                          {activeRoundData.qualifiers}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Round Metrics */}
                  <div className="w-full lg:w-80 rounded-xl border border-border/70 bg-bg/50 p-5 shrink-0">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted font-bold">
                      Round Telemetry & Metrics
                    </p>

                    {activeRoundData.status === 'active' && (
                      <div className="mt-4">
                        <div className="flex justify-between font-mono text-xs mb-1.5">
                          <span className="text-muted">Round Progress</span>
                          <span className="font-bold text-sunset-orange">{activeRoundData.activeProgressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full bg-sunset-orange transition-all duration-500"
                            style={{ width: `${activeRoundData.activeProgressPercent}%` }}
                          />
                        </div>
                        <p className="font-mono text-xs text-muted mt-2 text-right">
                          ⏱ {activeRoundData.timeRemaining}
                        </p>
                      </div>
                    )}

                    <dl className="mt-4 space-y-3 border-t border-border/60 pt-4 font-mono text-xs">
                      {Object.entries(activeRoundData.keyStats).map(([key, val]) => (
                        <div key={key} className="flex justify-between gap-2">
                          <dt className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                          <dd className="font-bold text-fg text-right">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        )}

        {/* Tab 2: Interactive Campus & Venue Floor Map */}
        {activeTab === 'venues' && (
          <div className="space-y-6" data-testid="section-venues">
            {/* Venue Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
              {CAMPUS_VENUES.map((venue) => {
                const isSelected = selectedVenue === venue.id;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedVenue(venue.id);
                      setSelectedZone(null);
                    }}
                    className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-mono font-medium transition-all whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? 'bg-sunset-orange text-white font-bold shadow-md shadow-sunset-orange/20'
                        : 'border border-border/60 bg-card text-muted hover:text-fg'
                    }`}
                  >
                    {venue.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Venue Overview */}
            <article className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sunset-orange uppercase tracking-wider">
                      {activeVenueData.floor}
                    </span>
                    <span className="text-muted text-xs">·</span>
                    <span className="rounded-md bg-sunset-orange/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sunset-orange">
                      Capacity: {activeVenueData.capacity}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-fg mt-1">
                    {activeVenueData.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl">
                    {activeVenueData.description}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 shrink-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                    Live Venue Status
                  </p>
                  <p className="font-heading text-sm font-bold text-fg mt-0.5">
                    {activeVenueData.currentActivity}
                  </p>
                </div>
              </div>

              {/* Interactive Floor Plan Zones */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-fg">
                    Auditorium & Floor Plan Zones
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    Click any zone to inspect live station details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeVenueData.zones.map((zone) => {
                    const isZoneSelected = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          playClick();
                          setSelectedZone(zone);
                        }}
                        className={`text-left rounded-xl p-4 border transition-all ${
                          isZoneSelected
                            ? 'border-sunset-orange bg-sunset-orange/5 ring-2 ring-sunset-orange/30 shadow-md'
                            : 'border-border/60 bg-bg/50 hover:border-sunset-orange/50 hover:bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] uppercase font-bold text-sunset-orange">
                            {zone.role}
                          </span>
                          <span className="rounded-full bg-card px-2 py-0.5 font-mono text-[10px] text-muted border border-border/50">
                            {zone.status}
                          </span>
                        </div>
                        <h4 className="font-heading text-sm font-bold text-fg">
                          {zone.name}
                        </h4>
                        <p className="text-xs text-muted mt-1.5 line-clamp-2">
                          {zone.activity}
                        </p>
                        <p className="font-mono text-[10px] text-fg/80 mt-3 pt-2 border-t border-border/40 font-medium">
                          Lead: {zone.lead}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Venue Amenities */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <p className="font-mono text-xs uppercase tracking-wider text-muted font-bold mb-3">
                  Campus Facilities & Tech Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeVenueData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-lg border border-border/60 bg-bg/70 px-3 py-1 font-mono text-xs text-fg/90"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Tab 3: Live Standings & Finalists Board */}
        {activeTab === 'standings' && (
          <div className="space-y-6" data-testid="section-standings">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-fg">
                  Symposium Leaderboard & Finalist Standings
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  Live scoring across algorithmic problem sets, cryptanalysis, and proof validations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setStandingsFilter('all');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                    standingsFilter === 'all'
                      ? 'bg-sunset-orange text-white'
                      : 'border border-border/60 text-muted hover:text-fg'
                  }`}
                >
                  All Standings (Top 10)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setStandingsFilter('finalists');
                  }}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                    standingsFilter === 'finalists'
                      ? 'bg-sunset-orange text-white'
                      : 'border border-border/60 text-muted hover:text-fg'
                  }`}
                >
                  Top 8 Finalists Only
                </button>
              </div>
            </div>

            {/* Score Table Card */}
            <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
              <table className="w-full text-left border-collapse" data-testid="leaderboard-table">
                <thead>
                  <tr className="border-b border-border/60 bg-bg/50 font-mono text-[11px] uppercase tracking-wider text-muted">
                    <th className="py-3.5 px-4 font-bold">Rank</th>
                    <th className="py-3.5 px-4 font-bold">Team & Institution</th>
                    <th className="py-3.5 px-4 font-bold text-center">Score</th>
                    <th className="py-3.5 px-4 font-bold text-center">Solved</th>
                    <th className="py-3.5 px-4 font-bold text-center">Accuracy</th>
                    <th className="py-3.5 px-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                  {filteredStandings.map((team) => {
                    const isTop3 = team.rank <= 3;
                    const isFinalist = team.status === 'finalist';

                    return (
                      <tr
                        key={team.rank}
                        className={`transition-colors hover:bg-bg/40 ${
                          isTop3 ? 'bg-sunset-orange/[0.03]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                              team.rank === 1
                                ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                                : team.rank === 2
                                ? 'bg-slate-300 text-black font-bold'
                                : team.rank === 3
                                ? 'bg-amber-600 text-white font-bold'
                                : 'text-muted'
                            }`}
                          >
                            {team.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-heading font-bold text-fg flex items-center gap-2">
                            <span>{team.team}</span>
                            <span className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted border border-border/50">
                              {team.tag}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-muted">{team.institution}</p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sunset-orange text-base">
                          {team.score}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-fg font-semibold">
                          {team.solved} / {team.total}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-muted">
                          {team.accuracy}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                              isFinalist
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-muted/15 text-muted border border-border/40'
                            }`}
                          >
                            {team.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
