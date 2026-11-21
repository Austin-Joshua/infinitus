import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  SYMPOSIUM_INFO,
  SYMPOSIUM_ROUNDS,
  CAMPUS_VENUES,
  LIVE_STANDINGS,
  getFilteredStandings,
  getVenueById,
  getRoundById,
} from '../lib/liveHubData.js';
import { buildSearchIndex, searchIndex } from '../lib/commandIndex.js';
import { EVENTS, MEMBERS } from '../lib/data.js';

describe('Live Event-Day Mode / Symposium Live Hub (Feature 4A)', () => {
  test('exports valid symposium metadata and rounds', () => {
    assert.ok(SYMPOSIUM_INFO.title, 'Symposium title required');
    assert.ok(SYMPOSIUM_INFO.activeRoundId, 'Active round id required');
    assert.equal(SYMPOSIUM_ROUNDS.length, 3, 'Must have 3 structured symposium rounds');

    for (const round of SYMPOSIUM_ROUNDS) {
      assert.ok(round.id, `Missing id: ${JSON.stringify(round)}`);
      assert.ok(round.title, `Missing title: ${round.id}`);
      assert.ok(round.time, `Missing time: ${round.id}`);
      assert.ok(round.venueName, `Missing venueName: ${round.id}`);
      assert.ok(round.format, `Missing format: ${round.id}`);
      assert.ok(round.qualifiers, `Missing qualifiers: ${round.id}`);
    }

    const activeRound = getRoundById('round-2');
    assert.equal(activeRound.status, 'active', 'Round 2 must be active');
    assert.ok(activeRound.activeProgressPercent > 0, 'Progress percent must be > 0');
  });

  test('exports structured campus venues with interactive zones', () => {
    assert.ok(CAMPUS_VENUES.length >= 3, 'Must have at least 3 campus venues');

    const wozniak = getVenueById('wozniak');
    assert.ok(wozniak, 'Wozniak Auditorium must exist');
    assert.ok(wozniak.zones.length >= 4, 'Wozniak must have at least 4 designated zones');
    assert.ok(wozniak.amenities.length > 0, 'Wozniak amenities required');

    const green = getVenueById('green-4');
    assert.ok(green, 'Green Building 4th floor must exist');
    assert.ok(green.zones.length >= 4, 'Green Building 4th floor must have at least 4 labs/zones');
  });

  test('computes filtered standings correctly for finalists', () => {
    const all = getFilteredStandings('all');
    assert.equal(all.length, 10, 'All standings should return 10 teams');

    const finalists = getFilteredStandings('finalists');
    assert.equal(finalists.length, 8, 'Top 8 finalists only');
    assert.ok(finalists.every((t) => t.status === 'finalist'), 'All items must be finalists');

    // Rank 1 verification
    assert.equal(all[0].rank, 1);
    assert.equal(all[0].team, 'Team Riemann');
    assert.ok(all[0].score >= all[1].score, 'Scores must be descending');
  });

  test('Command Palette indexes and finds Live Symposium Hub', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);
    const liveResults = searchIndex('live', index);
    assert.ok(liveResults.length > 0, 'Searching "live" must find Live Hub');
    assert.ok(liveResults.some((r) => r.id === 'nav-live'), 'nav-live must match');

    const wozniakResults = searchIndex('wozniak', index);
    assert.ok(wozniakResults.length > 0, 'Searching "wozniak" must match');
  });
});
