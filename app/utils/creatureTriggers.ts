/**
 * DesktopCreature — Spam Trigger Detector
 *
 * Detects keyboard and mouse spam via sliding-window counters.
 * Completely separate from WorkshopAI — listens to raw browser events.
 *
 * Rules:
 * - mousedown only counts clicks OUTSIDE modals, draggable windows, and the
 *   creature itself. Normal UI interaction never triggers the creature.
 * - All spam counters are fully reset after the creature appears (not just
 *   cooldown), so spamming during cooldown won't cause immediate re-trigger.
 * - Only one trigger can be active at a time (detector freezes while active).
 */

import { CREATURE_CONFIG, type TriggerType } from '../components/DesktopCreature/creatureConfig';

type TriggerCallback = (type: TriggerType) => void;

// CSS selectors that should NOT count as spam clicks
const EXCLUDED_SELECTORS = [
  '.retro-modal-overlay',
  '[class*="modal"]',
  '[class*="draggable"]',
  '[class*="creature"]',
  'button',
  'a',
  'input',
  'textarea',
];

function isExcludedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return EXCLUDED_SELECTORS.some(sel => target.closest(sel) !== null);
}

export function setupCreatureTriggers(onTrigger: TriggerCallback): () => void {
  const cfg = CREATURE_CONFIG;

  let frozen = false; // while creature is visible, detector is frozen

  // Sliding window timestamp arrays
  let keyTimestamps: number[] = [];
  let leftClickTimestamps: number[] = [];
  let rightClickTimestamps: number[] = [];

  function reset() {
    keyTimestamps = [];
    leftClickTimestamps = [];
    rightClickTimestamps = [];
  }

  function prune(arr: number[], windowMs: number): number[] {
    const cutoff = Date.now() - windowMs;
    return arr.filter(t => t > cutoff);
  }

  function fire(type: TriggerType) {
    if (frozen) return;
    frozen = true;
    reset(); // clear all counters on trigger
    onTrigger(type);
  }

  // ── Keyboard ──
  const handleKeyDown = (e: KeyboardEvent) => {
    if (frozen) return;
    if (e.repeat) return;
    // Ignore modifier-only keys
    if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) return;

    keyTimestamps = prune(keyTimestamps, cfg.KEYBOARD_WINDOW);
    keyTimestamps.push(Date.now());

    if (keyTimestamps.length >= cfg.KEYBOARD_EXTREME_THRESHOLD) {
      fire('keyboard_extreme');
    } else if (keyTimestamps.length >= cfg.KEYBOARD_THRESHOLD) {
      fire('keyboard');
    }
  };

  // ── Mouse ──
  const handleMouseDown = (e: MouseEvent) => {
    if (frozen) return;
    if (isExcludedTarget(e.target)) return;

    if (e.button === 0) {
      // Left click
      leftClickTimestamps = prune(leftClickTimestamps, cfg.LEFT_CLICK_WINDOW);
      leftClickTimestamps.push(Date.now());
      if (leftClickTimestamps.length >= cfg.LEFT_CLICK_THRESHOLD) {
        fire('leftClick');
      }
    } else if (e.button === 2) {
      // Right click
      rightClickTimestamps = prune(rightClickTimestamps, cfg.RIGHT_CLICK_WINDOW);
      rightClickTimestamps.push(Date.now());
      if (rightClickTimestamps.length >= cfg.RIGHT_CLICK_THRESHOLD) {
        fire('rightClick');
      }
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    if (frozen) return;
    if (isExcludedTarget(e.target)) return;
    // contextmenu = additional RMB signal (same counter)
    rightClickTimestamps = prune(rightClickTimestamps, cfg.RIGHT_CLICK_WINDOW);
    rightClickTimestamps.push(Date.now());
    if (rightClickTimestamps.length >= cfg.RIGHT_CLICK_THRESHOLD) {
      fire('rightClick');
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('contextmenu', handleContextMenu);

  // Returns: unfreeze function (called when creature finishes its animation)
  // and full cleanup
  const unfreeze = () => {
    frozen = false;
    reset();
  };

  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('contextmenu', handleContextMenu);
  };

  // Attach unfreeze to the returned cleanup so caller can invoke it separately
  (cleanup as { unfreeze?: () => void }).unfreeze = unfreeze;

  return cleanup;
}
