import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getRoleDetails, ROLE_RESPONSIBILITIES_BY_ID } from '../lib/roleResponsibilities.js';
import { getMembers } from '../lib/members.js';
import { MEMBERS } from '../lib/data.js';

describe('roleResponsibilities', () => {
  it('resolves role details by stable member ID', () => {
    const m1 = getRoleDetails('m1');
    assert.ok(m1);
    assert.equal(m1.team, 'Leadership');
    assert.match(m1.summary, /leadership/i);

    const m11 = getRoleDetails('m11');
    assert.ok(m11);
    assert.equal(m11.team, 'Technical Team');
    assert.match(m11.summary, /technical/i);
  });

  it('resolves role details by member name fallback', () => {
    const byName = getRoleDetails('Austin Joshua M');
    assert.ok(byName);
    assert.equal(byName.team, 'Leadership');
  });

  it('returns null for unknown IDs', () => {
    assert.equal(getRoleDetails('unknown-id-xyz'), null);
  });

  it('every bundled static member has valid role responsibilities', () => {
    for (const member of MEMBERS) {
      const details = getRoleDetails(member.id) || getRoleDetails(member.name);
      assert.ok(details, `Member ${member.id} (${member.name}) must have role responsibilities`);
      assert.ok(details.team, `Member ${member.id} must belong to a team`);
      assert.ok(details.summary, `Member ${member.id} must have a summary`);
    }
  });
});

describe('getMembers', () => {
  it('returns non-empty array of hydrated members', async () => {
    const members = await getMembers();
    assert.ok(Array.isArray(members));
    assert.ok(members.length > 0);

    const first = members[0];
    assert.ok(first.name);
    assert.ok(first.role);
    assert.ok(first.team);
    assert.ok(first.responsibilities);
  });

  it('hydrates official core member posters and ensures assets exist', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const members = await getMembers();

    const withPosters = members.filter((m) => m.posterUrl);
    assert.equal(withPosters.length, 23, 'Exactly 23 core members must have official posters');

    for (const m of withPosters) {
      assert.match(m.posterUrl, /^\/team\/posters\/[a-z0-9-]+\.webp$/);
      const filePath = path.resolve('public', m.posterUrl.slice(1));
      assert.ok(fs.existsSync(filePath), `Poster file missing for ${m.name}: ${filePath}`);
    }
  });
});
