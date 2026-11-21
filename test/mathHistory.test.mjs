import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MATH_ERAS, MATH_MILESTONES } from '../lib/mathHistory.js';
import { buildSearchIndex, searchIndex } from '../lib/commandIndex.js';
import { EVENTS, MEMBERS } from '../lib/data.js';

describe('Mathematical History & Heritage Timeline (Feature 3B)', () => {
  test('exports valid eras and comprehensive milestones', () => {
    assert.ok(Array.isArray(MATH_ERAS), 'Eras must be an array');
    assert.ok(MATH_ERAS.length >= 5, 'Should have at least 5 era categories');
    assert.ok(Array.isArray(MATH_MILESTONES), 'Milestones must be an array');
    assert.ok(MATH_MILESTONES.length >= 7, 'Should cover all 7 key historical milestones');

    for (const item of MATH_MILESTONES) {
      assert.ok(item.id, `Missing id: ${JSON.stringify(item)}`);
      assert.ok(item.era, `Missing era: ${item.id}`);
      assert.ok(item.year, `Missing year: ${item.id}`);
      assert.ok(item.title, `Missing title: ${item.id}`);
      assert.ok(item.formula, `Missing formula: ${item.id}`);
      assert.ok(item.description, `Missing description: ${item.id}`);
      assert.ok(item.keyContribution, `Missing key contribution: ${item.id}`);
    }
  });

  test('filters milestones accurately by era', () => {
    const classical = MATH_MILESTONES.filter((m) => m.era === 'classical');
    assert.ok(classical.length >= 2, 'Classical era should include Aryabhata and Brahmagupta');
    assert.ok(classical.some((m) => m.id === 'aryabhata'));
    assert.ok(classical.some((m) => m.id === 'brahmagupta'));

    const calculus = MATH_MILESTONES.filter((m) => m.era === 'calculus');
    assert.ok(calculus.some((m) => m.id === 'madhava'), 'Calculus should feature Madhava');

    const modern = MATH_MILESTONES.filter((m) => m.era === 'modern');
    assert.ok(modern.some((m) => m.id === 'lorenz'), 'Modern should feature Lorenz chaos');
    assert.ok(modern.some((m) => m.id === 'modern-ai'), 'Modern should feature neural geometry');
  });

  test('Command Palette indexes and finds Mathematical History', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);
    const historyResults = searchIndex('history', index);
    assert.ok(historyResults.length > 0, 'Searching "history" must find Math History Timeline');
    assert.ok(historyResults.some((r) => r.id === 'nav-math-history'));

    const ramanujanResults = searchIndex('ramanujan', index);
    assert.ok(ramanujanResults.length > 0, 'Searching "ramanujan" must match');
  });
});
