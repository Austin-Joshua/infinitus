/**
 * Web Audio Harmonic Micro-Sounds (Feature 4A)
 *
 * Procedural mathematical sound synthesis engine built with the native browser Web Audio API.
 * - Zero external .mp3/.wav audio files (0 KB network overhead, zero latency).
 * - Micro-sounds based on Pythagorean tuning, harmonic series and golden ratio intervals.
 * - Master gain clamped for ultra-subtle, non-intrusive micro-feedback.
 * - Respects prefers-reduced-motion, browser autoplay policies, and persistent localStorage preference.
 */

const STORAGE_KEY = 'infinitus_sound_enabled';

// Listeners for reactive UI state synchronization
const listeners = new Set();

let audioCtx = null;
let masterGain = null;

/**
 * Checks if sound effects are enabled in localStorage.
 * Defaults to true unless explicitly disabled or prefers-reduced-motion is active.
 */
export function isSoundEnabled() {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }

  // Check if system prefers reduced motion/sensory input
  try {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return false;
  } catch {}

  // Default to enabled with subtle master volume
  return true;
}

/**
 * Sets the sound enabled preference and notifies all registered subscribers.
 */
export function setSoundEnabled(enabled) {
  if (typeof window === 'undefined') return;
  const value = Boolean(enabled);
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {}
  notifyListeners(value);

  // If enabled, play a subtle confirmation blip
  if (value) {
    playClick();
  }
}

/**
 * Toggles current sound setting between enabled and muted.
 */
export function toggleSound() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

/**
 * Subscribe to sound enabled state changes.
 * Returns an unsubscribe callback function.
 */
export function subscribeSound(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners(enabled) {
  listeners.forEach((fn) => {
    try {
      fn(enabled);
    } catch {}
  });
}

/**
 * Lazily initializes and caches the browser AudioContext and Master Gain.
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtx) {
      audioCtx = new AudioCtx();
      masterGain = audioCtx.createGain();
      // Master volume tuned for clear, audible harmonic feedback across laptop and mobile speakers
      masterGain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return { ctx: audioCtx, master: masterGain };
  } catch {
    return null;
  }
}

/**
 * Helper to play an envelope on an oscillator.
 */
function playTone({ freq = 440, type = 'sine', duration = 0.08, gainPeak = 0.6, startDelay = 0 }) {
  if (!isSoundEnabled()) return;

  const env = getAudioContext();
  if (!env) return;
  const { ctx, master } = env;

  const startTime = ctx.currentTime + startDelay;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // Exponential decay envelope
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(gainPeak, startTime + 0.006);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(master);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/**
 * 1. Crisp, tactile button micro-click (A5 / 880Hz, 35ms)
 */
export function playClick() {
  playTone({ freq: 880, type: 'sine', duration: 0.035, gainPeak: 0.75 });
}

/**
 * 2. Ascending harmonic chime for modal / command palette open
 * Pythagorean fifth interval: 528Hz -> 792Hz
 */
export function playOpenModal() {
  playTone({ freq: 528, type: 'sine', duration: 0.12, gainPeak: 0.8, startDelay: 0 });
  playTone({ freq: 792, type: 'sine', duration: 0.16, gainPeak: 0.75, startDelay: 0.045 });
}

/**
 * 3. Descending gentle resolution for modal close: 792Hz -> 528Hz
 */
export function playCloseModal() {
  playTone({ freq: 792, type: 'sine', duration: 0.09, gainPeak: 0.7, startDelay: 0 });
  playTone({ freq: 528, type: 'sine', duration: 0.11, gainPeak: 0.65, startDelay: 0.035 });
}

/**
 * 4. Harmonic bell chime for Dark/Light theme toggle
 * Fundamental 660Hz with octave harmonic 1320Hz
 */
export function playThemeToggle() {
  playTone({ freq: 660, type: 'sine', duration: 0.22, gainPeak: 0.85, startDelay: 0 });
  playTone({ freq: 1320, type: 'sine', duration: 0.28, gainPeak: 0.6, startDelay: 0.02 });
}

/**
 * 5. Attractor / Fourier Epicycles mode switch chord sweep
 * Mathematical golden ratio interval φ = 1.618
 */
export function playAttractorSwitch() {
  if (!isSoundEnabled()) return;
  const env = getAudioContext();
  if (!env) return;
  const { ctx, master } = env;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  // Sweep frequency from 432Hz up through harmonic golden ratio interval 700Hz
  osc.frequency.setValueAtTime(432, now);
  osc.frequency.exponentialRampToValueAtTime(699, now + 0.14);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.8, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(master);

  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * 6. Triumphant soft major triad for success/sync (C5-E5-G5: 523Hz, 659Hz, 784Hz)
 */
export function playSuccess() {
  playTone({ freq: 523.25, type: 'sine', duration: 0.14, gainPeak: 0.75, startDelay: 0 });
  playTone({ freq: 659.25, type: 'sine', duration: 0.16, gainPeak: 0.75, startDelay: 0.045 });
  playTone({ freq: 783.99, type: 'sine', duration: 0.24, gainPeak: 0.85, startDelay: 0.09 });
}
