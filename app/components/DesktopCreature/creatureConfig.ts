/**
 * DesktopCreature — Config
 *
 * All thresholds and timings in one place.
 * Tweak here without touching any component logic.
 */

export const CREATURE_CONFIG = {
  // ── Keyboard spam detection ──
  KEYBOARD_THRESHOLD: 12,         // keys in window → annoyed reaction
  KEYBOARD_EXTREME_THRESHOLD: 20, // keys in window → hammer reaction
  KEYBOARD_WINDOW: 3000,          // ms sliding window

  // ── Left-click spam detection ──
  LEFT_CLICK_THRESHOLD: 15,
  LEFT_CLICK_WINDOW: 3000,

  // ── Right-click spam detection ──
  RIGHT_CLICK_THRESHOLD: 8,
  RIGHT_CLICK_WINDOW: 3000,

  // ── Timing (ms) ──
  CREATURE_COOLDOWN: 1_000,  // after appearing, won't trigger again for 45s

  // Animation phase durations
  FLICKER_DURATION: 400,   // CRT pre-flicker before creature wakes
  PEEK_DURATION: 900,      // eyes only visible
  EMERGE_DURATION: 800,    // walk cycle out from behind monitor to gap
  REACT_DURATION: 2800,    // reaction hold
  HAMMER_DURATION: 2200,   // hammer swing animation hold
  LEAVE_DURATION: 750,     // walk cycle back behind monitor
  GLITCH_DURATION: 600,    // CRT glitch flash

  // ── Hammer reaction probability for keyboard spam (non-extreme) ──
  // 0.0 = never, 1.0 = always
  HAMMER_CHANCE_ON_KEYBOARD: 0.0, // Only hammer on EXTREME (handled separately)
} as const;

export type TriggerType = 'keyboard' | 'keyboard_extreme' | 'leftClick' | 'rightClick';

export type CreatureState =
  | 'hidden'
  | 'flicker'
  | 'peeking'
  | 'emerging'
  | 'reacting'
  | 'hammering'
  | 'leaving';
