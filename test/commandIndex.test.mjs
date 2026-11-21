import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchIndex, searchIndex, groupResults } from '../lib/commandIndex.js';
import { EVENTS, MEMBERS } from '../lib/data.js';

describe('Command Palette Search Index & Algorithm (Feature 3A)', () => {
  test('builds comprehensive search index aggregating routes, actions, events, and members', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);

    assert.ok(Array.isArray(index), 'Index must be an array');
    assert.ok(index.length >= 65, `Expected at least 65 indexed items, got ${index.length}`);

    // Verify all 44 events are indexed
    const eventItems = index.filter((item) => item.group === 'Events');
    assert.equal(eventItems.length, 44, 'All 44 events must be indexed');

    // Verify all members are indexed
    const memberItems = index.filter((item) => item.group === 'Team Members');
    assert.equal(memberItems.length, MEMBERS.length, `All ${MEMBERS.length} members must be indexed`);

    // Verify actions and navigation
    const actionItems = index.filter((item) => item.group === 'Actions');
    assert.ok(actionItems.length >= 7, 'Must have at least 7 instant action items');

    const navItems = index.filter((item) => item.group === 'Navigation');
    assert.ok(navItems.length >= 5, 'Must have primary navigation routes');

    // Verify every item has required fields
    for (const item of index) {
      assert.ok(item.id, `Item missing id: ${JSON.stringify(item)}`);
      assert.ok(item.title, `Item missing title: ${item.id}`);
      assert.ok(item.group, `Item missing group: ${item.id}`);
      assert.ok(item.href || item.action, `Item missing href or action: ${item.id}`);
    }
  });

  test('returns curated suggestions when search query is empty', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);
    const results = searchIndex('', index);

    assert.ok(results.length > 0, 'Empty query should return default suggested items');
    assert.ok(
      results.some((r) => r.id === 'nav-events'),
      'Suggested items should include events directory'
    );
    assert.ok(
      results.some((r) => r.id === 'act-theme'),
      'Suggested items should include theme toggle action'
    );
  });

  test('searches and ranks events by title and keywords', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);

    // Search for "Ramanujan"
    const ramanujanResults = searchIndex('Ramanujan', index);
    assert.ok(ramanujanResults.length > 0, 'Should find Ramanujan Reimagined');
    assert.equal(ramanujanResults[0].id, 'event-ramanujan-reimagined');

    // Search for "Number Hunt"
    const numberHuntResults = searchIndex('number hunt', index);
    assert.ok(numberHuntResults.length > 0, 'Should find Number Hunt');
    assert.equal(numberHuntResults[0].id, 'event-number-hunt');

    // Search for "Matrix"
    const matrixResults = searchIndex('matrix', index);
    assert.ok(matrixResults.length > 0, 'Should find Matrix Reloaded workshop');
  });

  test('searches and finds team members by name and role', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);

    // Search by President name
    const austinResults = searchIndex('Austin Joshua', index);
    assert.ok(austinResults.length > 0, 'Should find Austin Joshua M');
    assert.equal(austinResults[0].title, 'Austin Joshua M');

    // Search by role
    const presidentResults = searchIndex('President', index);
    assert.ok(presidentResults.length > 0, 'Should find President');
    assert.ok(
      presidentResults.some((r) => r.title === 'Austin Joshua M' || r.title === 'Sanjay Yuvaraj'),
      'Role query should find presidency members'
    );

    // Search for technical coordinator
    const chrisResults = searchIndex('Chris Alan', index);
    assert.ok(chrisResults.length > 0, 'Should find Chris Alan');
  });

  test('searches simulation actions and theme actions', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);

    const lorenzResults = searchIndex('lorenz', index);
    assert.ok(lorenzResults.length > 0, 'Should find Lorenz attractor action');
    assert.equal(lorenzResults[0].action, 'set-math-lorenz');

    const fourierResults = searchIndex('fourier', index);
    assert.ok(fourierResults.length > 0, 'Should find Fourier action');
    assert.equal(fourierResults[0].action, 'set-math-fourier');

    const themeResults = searchIndex('theme', index);
    assert.ok(themeResults.length > 0, 'Should find Theme toggle action');
    assert.equal(themeResults[0].action, 'toggle-theme');

    const soundResults = searchIndex('sound', index);
    assert.ok(soundResults.length > 0, 'Should find Sound toggle action');
    assert.equal(soundResults[0].action, 'toggle-sound');
  });

  test('groups results into structured category containers', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);
    const results = searchIndex('math', index);
    const groups = groupResults(results);

    assert.ok(Array.isArray(groups), 'Groups must be an array');
    for (const g of groups) {
      assert.ok(g.key, 'Group must have a key');
      assert.ok(g.title, 'Group must have a title');
      assert.ok(g.items.length > 0, 'Group must not be empty');
    }
  });

  test('returns empty array when query has zero matches', () => {
    const index = buildSearchIndex(EVENTS, MEMBERS);
    const results = searchIndex('xyzzynonexistent99999', index);
    assert.deepEqual(results, []);
  });
});
