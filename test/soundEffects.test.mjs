import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSoundEnabled,
  setSoundEnabled,
  toggleSound,
  subscribeSound,
  playClick,
  playOpenModal,
  playCloseModal,
  playThemeToggle,
  playAttractorSwitch,
  playSuccess,
} from '../lib/soundEffects.js';

describe('Web Audio Harmonic Micro-Sounds (Feature 4A)', () => {
  beforeEach(() => {
    // Reset global window and localStorage mocks
    global.window = {
      matchMedia: () => ({ matches: false }),
    };
    const storage = new Map();
    global.localStorage = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, val) => storage.set(key, String(val)),
      removeItem: (key) => storage.delete(key),
    };
  });

  test('defaults to sound enabled when no localStorage preference is set', () => {
    assert.equal(isSoundEnabled(), true);
  });

  test('persists enabled preference and toggles state correctly', () => {
    setSoundEnabled(false);
    assert.equal(isSoundEnabled(), false);
    assert.equal(global.localStorage.getItem('infinitus_sound_enabled'), 'false');

    const nextState = toggleSound();
    assert.equal(nextState, true);
    assert.equal(isSoundEnabled(), true);
  });

  test('notifies subscribers when sound enabled state transitions', () => {
    const events = [];
    const unsubscribe = subscribeSound((enabled) => {
      events.push(enabled);
    });

    setSoundEnabled(false);
    setSoundEnabled(true);
    unsubscribe();
    setSoundEnabled(false);

    assert.deepEqual(events, [false, true]);
  });

  test('respects prefers-reduced-motion media query by defaulting to false when active', () => {
    global.localStorage.removeItem('infinitus_sound_enabled');
    global.window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
    });

    assert.equal(isSoundEnabled(), false);
  });

  test('sound trigger functions run safely without throwing in headless/SSR environments', () => {
    assert.doesNotThrow(() => playClick());
    assert.doesNotThrow(() => playOpenModal());
    assert.doesNotThrow(() => playCloseModal());
    assert.doesNotThrow(() => playThemeToggle());
    assert.doesNotThrow(() => playAttractorSwitch());
    assert.doesNotThrow(() => playSuccess());
  });
});
