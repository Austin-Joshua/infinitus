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
  triggerHaptic,
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

  test('triggerHaptic invokes navigator.vibrate with appropriate vibration patterns when available', () => {
    let vibrateCalls = [];
    const originalVibrate = globalThis.navigator?.vibrate;

    Object.defineProperty(globalThis.navigator, 'vibrate', {
      value: (pattern) => {
        vibrateCalls.push(pattern);
        return true;
      },
      configurable: true,
      writable: true,
    });

    triggerHaptic('light');
    triggerHaptic('medium');
    triggerHaptic('success');
    triggerHaptic('warning');

    assert.deepEqual(vibrateCalls, [10, 20, [12, 35, 18], [24, 40, 24]]);

    // Gracefully handles missing vibrate method (e.g. iOS Safari)
    delete globalThis.navigator.vibrate;
    assert.doesNotThrow(() => triggerHaptic('light'));

    if (originalVibrate) {
      Object.defineProperty(globalThis.navigator, 'vibrate', {
        value: originalVibrate,
        configurable: true,
        writable: true,
      });
    }
  });
});
