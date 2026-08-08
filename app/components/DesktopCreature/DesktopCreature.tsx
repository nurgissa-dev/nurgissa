'use client';

/**
 * DesktopCreature — Keyboard Gremlin (Native SVG Layer)
 *
 * Rendered inside CozyRetroDesk SVG before <g id="computer-group">.
 * This guarantees the CRT monitor physically hides the gremlin when it is at
 * x <= 580.
 *
 * Sequence:
 *   1. hidden: translate(510px, 410px) — 100% hidden behind CRT monitor box.
 *   2. peek:   translate(565px, 410px) — right ear & eye peek past right CRT edge.
 *   3. emerge: translate(565px) -> translate(625px) with WALK CYCLE (emotion-walk).
 *      Legs step, arms swing, head/body bob up & down. ZERO SLIDING!
 *   4. emerged:translate(625px, 410px). Walk stops, stands on desk surface y=490.
 *      Executes emotion reaction & speech bubble.
 *   5. leave:  translate(625px) -> translate(510px) with WALK CYCLE.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { setupCreatureTriggers } from '../../utils/creatureTriggers';
import { CREATURE_CONFIG, type TriggerType, type CreatureState } from './creatureConfig';
import './DesktopCreature.css';

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  body:      '#b4a3e8',
  bodyLight: '#c8baee',
  eyes:      '#ffd166',
  accent:    '#f4a2af',
  outline:   '#362840',
  shadow:    '#66557f',
  highlight: '#fefae0',
};

const CR = 'crispEdges' as const;

// ─── Reaction types ───────────────────────────────────────────────────────────

type EmotionClass =
  | 'emotion-idle'
  | 'emotion-walk'
  | 'emotion-annoyed'
  | 'emotion-angry'
  | 'emotion-shocked'
  | 'emotion-facepalm'
  | 'emotion-hammer';

type MouthShape = 'neutral' | 'flat' | 'frown' | 'grimace' | 'o';

interface Reaction {
  emotion: EmotionClass;
  mouth: MouthShape;
  bubbleText: string | null;
  isHammer?: boolean;
}

const KEYBOARD_REACTIONS: Reaction[] = [
  { emotion: 'emotion-annoyed', mouth: 'frown',   bubbleText: 'STOP 😐' },
  { emotion: 'emotion-angry',   mouth: 'grimace', bubbleText: null },
  { emotion: 'emotion-annoyed', mouth: 'flat',    bubbleText: 'ugh...' },
  { emotion: 'emotion-angry',   mouth: 'frown',   bubbleText: '🫠' },
];

const KEYBOARD_EXTREME_REACTION: Reaction = {
  emotion: 'emotion-hammer', mouth: 'flat', bubbleText: null, isHammer: true,
};

const LEFT_CLICK_REACTIONS: Reaction[] = [
  { emotion: 'emotion-annoyed', mouth: 'flat',  bubbleText: 'Seriously?' },
  { emotion: 'emotion-shocked', mouth: 'o',     bubbleText: '...why' },
  { emotion: 'emotion-annoyed', mouth: 'frown', bubbleText: '😑' },
];

const RIGHT_CLICK_REACTIONS: Reaction[] = [
  { emotion: 'emotion-facepalm', mouth: 'frown', bubbleText: 'Why.' },
  { emotion: 'emotion-facepalm', mouth: 'flat',  bubbleText: null },
  { emotion: 'emotion-facepalm', mouth: 'frown', bubbleText: '🤦' },
];

function pickReaction(type: TriggerType): Reaction {
  if (type === 'keyboard_extreme') return KEYBOARD_EXTREME_REACTION;
  const pool =
    type === 'keyboard' ? KEYBOARD_REACTIONS :
    type === 'leftClick' ? LEFT_CLICK_REACTIONS :
    RIGHT_CLICK_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SVG BODY PARTS
// ═══════════════════════════════════════════════════════════════════════════════

function Ears() {
  return (
    <g>
      <polygon points="11,18 17,4 24,18"
        fill={P.body} stroke={P.outline} strokeWidth="2.5" strokeLinejoin="round" shapeRendering={CR} />
      <polygon points="14,17 17,9 22,17" fill={P.accent} opacity="0.48" shapeRendering={CR} />
      <polygon points="61,18 55,4 48,18"
        fill={P.body} stroke={P.outline} strokeWidth="2.5" strokeLinejoin="round" shapeRendering={CR} />
      <polygon points="58,17 55,9 50,17" fill={P.accent} opacity="0.48" shapeRendering={CR} />
    </g>
  );
}

function Head() {
  return (
    <g className="creature-part-head">
      <Ears />
      <rect x="10" y="14" width="52" height="40" rx="8"
        fill={P.body} stroke={P.outline} strokeWidth="2.5" shapeRendering={CR} />
      <rect x="14" y="18" width="44" height="32" rx="5"
        fill={P.bodyLight} opacity="0.26" shapeRendering={CR} />
    </g>
  );
}

function Eyes() {
  return (
    <g className="creature-part-eyes">
      <rect x="15" y="22" width="14" height="14" rx="2"
        fill={P.eyes} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="19" y="26" width="6" height="6" rx="1" fill={P.outline} shapeRendering={CR} />
      <rect x="19" y="25" width="3" height="3" fill="white" shapeRendering={CR} />
      <rect x="43" y="22" width="14" height="14" rx="2"
        fill={P.eyes} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="47" y="26" width="6" height="6" rx="1" fill={P.outline} shapeRendering={CR} />
      <rect x="47" y="25" width="3" height="3" fill="white" shapeRendering={CR} />
    </g>
  );
}

function Brows() {
  return (
    <>
      <rect className="creature-brow-left"
        x="14" y="18" width="14" height="3.5" rx="1.5"
        fill={P.outline} shapeRendering={CR} />
      <rect className="creature-brow-right"
        x="44" y="18" width="14" height="3.5" rx="1.5"
        fill={P.outline} shapeRendering={CR} />
    </>
  );
}

function Nose() {
  return (
    <g>
      <rect x="29" y="36" width="3" height="3" rx="1" fill={P.shadow} shapeRendering={CR} />
      <rect x="40" y="36" width="3" height="3" rx="1" fill={P.shadow} shapeRendering={CR} />
    </g>
  );
}

function Mouth({ shape }: { shape: MouthShape }) {
  const cls = 'creature-part-mouth';
  switch (shape) {
    case 'neutral':
      return <rect className={cls} x="25" y="45" width="22" height="4" rx="2"
               fill={P.outline} shapeRendering={CR} />;
    case 'flat':
      return <rect className={cls} x="24" y="46" width="24" height="3" rx="1.5"
               fill={P.outline} shapeRendering={CR} />;
    case 'frown':
      return (
        <g className={cls}>
          <rect x="25" y="46" width="22" height="3" rx="1.5" fill={P.outline} shapeRendering={CR} />
          <rect x="25" y="44" width="4" height="5" rx="1.5" fill={P.outline} shapeRendering={CR} />
          <rect x="43" y="44" width="4" height="5" rx="1.5" fill={P.outline} shapeRendering={CR} />
        </g>
      );
    case 'grimace':
      return (
        <g className={cls}>
          <rect x="22" y="44" width="28" height="8" rx="2" fill={P.outline} shapeRendering={CR} />
          <rect x="24" y="45" width="4" height="5" fill={P.highlight} shapeRendering={CR} />
          <rect x="30" y="45" width="4" height="5" fill={P.highlight} shapeRendering={CR} />
          <rect x="36" y="45" width="4" height="5" fill={P.highlight} shapeRendering={CR} />
          <rect x="42" y="45" width="4" height="5" fill={P.highlight} shapeRendering={CR} />
        </g>
      );
    case 'o':
      return (
        <g className={cls}>
          <rect x="29" y="43" width="14" height="10" rx="5" fill={P.outline} shapeRendering={CR} />
          <rect x="32" y="46" width="8" height="5" rx="3" fill={P.shadow} shapeRendering={CR} />
        </g>
      );
  }
}

function Steam() {
  return (
    <g opacity="0.75">
      <rect x="57" y="12" width="4" height="7" rx="2" fill={P.accent} shapeRendering={CR} />
      <rect x="62" y="9"  width="3" height="5" rx="1.5" fill={P.accent} opacity="0.5" shapeRendering={CR} />
    </g>
  );
}

function Body() {
  return (
    <g>
      <rect x="20" y="54" width="32" height="16" rx="5"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="24" y="57" width="24" height="10" rx="3"
        fill={P.bodyLight} opacity="0.22" shapeRendering={CR} />
    </g>
  );
}

function LeftArm() {
  return (
    <g className="creature-part-arm-left">
      <rect x="7" y="44" width="10" height="17" rx="5"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <ellipse cx="12" cy="61" rx="5" ry="4"
        fill={P.body} stroke={P.outline} strokeWidth="1.5" shapeRendering={CR} />
      <rect x="7"  y="59" width="3" height="5" rx="1.5"
        fill={P.body} stroke={P.outline} strokeWidth="1" shapeRendering={CR} />
      <rect x="14" y="59" width="3" height="5" rx="1.5"
        fill={P.body} stroke={P.outline} strokeWidth="1" shapeRendering={CR} />
    </g>
  );
}

function RightArm() {
  return (
    <g className="creature-part-arm-right">
      <rect x="55" y="44" width="10" height="17" rx="5"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <ellipse cx="60" cy="61" rx="5" ry="4"
        fill={P.body} stroke={P.outline} strokeWidth="1.5" shapeRendering={CR} />
      <rect x="55" y="59" width="3" height="5" rx="1.5"
        fill={P.body} stroke={P.outline} strokeWidth="1" shapeRendering={CR} />
      <rect x="62" y="59" width="3" height="5" rx="1.5"
        fill={P.body} stroke={P.outline} strokeWidth="1" shapeRendering={CR} />
    </g>
  );
}

function LeftLeg() {
  return (
    <g className="creature-part-leg-left">
      <rect x="21" y="66" width="10" height="11" rx="4"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="17" y="73" width="15" height="6" rx="3"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
    </g>
  );
}

function RightLeg() {
  return (
    <g className="creature-part-leg-right">
      <rect x="41" y="66" width="10" height="11" rx="4"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="40" y="73" width="15" height="6" rx="3"
        fill={P.body} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
    </g>
  );
}

function Hammer() {
  return (
    <g className="creature-part-hammer">
      <rect x="59" y="8" width="4" height="20" rx="2"
        fill={P.eyes} stroke={P.outline} strokeWidth="2" shapeRendering={CR} />
      <rect x="51" y="2" width="18" height="10" rx="2"
        fill={P.eyes} stroke={P.outline} strokeWidth="2.5" shapeRendering={CR} />
      <rect x="53" y="8" width="14" height="4" rx="1" fill="#e0a800" shapeRendering={CR} />
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NATIVE SVG CREATURE COMPONENT
// Renders inside CozyRetroDesk SVG before computer-group
// ═══════════════════════════════════════════════════════════════════════════════

interface CreatureSVGProps {
  emotion: EmotionClass;
  mouth: MouthShape;
  showSteam?: boolean;
}

function CreatureSVG({ emotion, mouth, showSteam }: CreatureSVGProps) {
  return (
    <g className={`creature-svg-group ${emotion}`}>
      <LeftLeg />
      <RightLeg />
      <Body />
      <LeftArm />
      <RightArm />
      <Head />
      <Eyes />
      <Brows />
      <Nose />
      <Mouth shape={mouth} />
      <Hammer />
      {showSteam && <Steam />}
    </g>
  );
}

export default function DesktopCreature() {
  const [state, setState] = useState<CreatureState>('hidden');
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showKbdOverlay, setShowKbdOverlay] = useState(false);
  const [kbdPhase, setKbdPhase] = useState<'disconnected' | 'kidding'>('disconnected');
  const [crtGlitch, setCrtGlitch] = useState(false);

  const unfreezeRef = useRef<(() => void) | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function later(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }
  function clearTimers() { timers.current.forEach(clearTimeout); timers.current = []; }

  const cfg = CREATURE_CONFIG;

  const runSequence = useCallback((triggerType: TriggerType) => {
    clearTimers();
    const r = pickReaction(triggerType);
    setReaction(r);

    // 1. Signal flicker (CRT screen pulse)
    setState('flicker');

    // 2. Peek — right side of head & eye peek out past CRT right edge (x=580)
    later(() => setState('peeking'), cfg.FLICKER_DURATION);

    // 3. Emerge — walks out with WALK CYCLE (emotion-walk) into gap (x=625)
    later(() => setState('emerging'), cfg.FLICKER_DURATION + cfg.PEEK_DURATION);

    const emergeEnd = cfg.FLICKER_DURATION + cfg.PEEK_DURATION + cfg.EMERGE_DURATION;

    if (r.isHammer) {
      later(() => setState('hammering'), emergeEnd);

      later(() => {
        setCrtGlitch(true);
        later(() => setCrtGlitch(false), cfg.GLITCH_DURATION);
        setKbdPhase('disconnected');
        setShowKbdOverlay(true);
      }, emergeEnd + cfg.HAMMER_DURATION);

      later(() => setKbdPhase('kidding'), emergeEnd + cfg.HAMMER_DURATION + 700);
      later(() => { setShowKbdOverlay(false); setState('leaving'); },
            emergeEnd + cfg.HAMMER_DURATION + 1500);
      later(() => {
        setState('hidden'); setReaction(null);
        later(() => unfreezeRef.current?.(), cfg.CREATURE_COOLDOWN);
      }, emergeEnd + cfg.HAMMER_DURATION + 1900);

    } else {
      later(() => {
        setState('reacting');
        if (r.bubbleText) later(() => setShowBubble(true), 200);
      }, emergeEnd);

      later(() => { setShowBubble(false); setState('leaving'); },
            emergeEnd + cfg.REACT_DURATION);

      later(() => {
        setState('hidden'); setReaction(null);
        later(() => unfreezeRef.current?.(), cfg.CREATURE_COOLDOWN);
      }, emergeEnd + cfg.REACT_DURATION + cfg.LEAVE_DURATION + 100);
    }
  }, [cfg]);

  useEffect(() => {
    const cleanup = setupCreatureTriggers((t: TriggerType) => runSequence(t));
    unfreezeRef.current = (cleanup as { unfreeze?: () => void }).unfreeze ?? null;
    return () => { cleanup(); clearTimers(); };
  }, [runSequence]);

  function getSliderClass(): string {
    switch (state) {
      case 'peeking':              return 'creature-slider--peek';
      case 'emerging':             return 'creature-slider--emerge';
      case 'reacting':
      case 'hammering':            return 'creature-slider--emerged';
      case 'leaving':              return 'creature-slider--leave';
      default:                     return '';
    }
  }

  function getEmotion(): EmotionClass {
    if (state === 'peeking') return 'emotion-idle';
    if (state === 'emerging' || state === 'leaving') return 'emotion-walk';
    if (state === 'hammering') return 'emotion-hammer';
    return reaction?.emotion ?? 'emotion-idle';
  }

  function getMouth(): MouthShape {
    if (state === 'peeking' || state === 'emerging') return 'neutral';
    return reaction?.mouth ?? 'neutral';
  }

  function hasSteam(): boolean {
    const e = getEmotion();
    return e === 'emotion-annoyed' || e === 'emotion-angry' || e === 'emotion-hammer';
  }

  if (state === 'hidden' && !crtGlitch && !showKbdOverlay) return null;

  return (
    <>
      {/* ── Native SVG Creature Layer ── */}
      {state !== 'hidden' && (
        <g className="creature-root-g">
          <g className={`creature-slider-g ${getSliderClass()}`}>
            <svg width="52" height="58" viewBox="0 0 72 80" style={{ overflow: 'visible', display: 'block' }}>
              <CreatureSVG emotion={getEmotion()} mouth={getMouth()} showSteam={hasSteam()} />
            </svg>

            {/* Speech bubble inside SVG */}
            {showBubble && reaction?.bubbleText && (
              <g className="creature-bubble-g" transform="translate(26, -18)">
                <rect x="-35" y="-22" width="70" height="22" rx="5"
                      fill="#fefae0" stroke="#362840" strokeWidth="2" />
                <polygon points="-4,0 4,0 0,5" fill="#362840" />
                <text x="0" y="-7" fill="#362840" fontSize="10" fontWeight="900"
                      fontFamily="monospace" textAnchor="middle">
                  {reaction.bubbleText}
                </text>
              </g>
            )}
          </g>
        </g>
      )}

      {/* CRT Glitch Overlay (if hammer active) */}
      {crtGlitch && <div className="creature-crt-glitch-overlay" aria-hidden="true" />}

      {/* Fullscreen KEYBOARD DISCONNECTED Overlay */}
      {showKbdOverlay && (
        <div className="creature-kbd-overlay" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {kbdPhase === 'disconnected' ? (
            <div className="creature-kbd-overlay-text">⌨ KEYBOARD DISCONNECTED</div>
          ) : (
            <>
              <div className="creature-kbd-overlay-text creature-kbd-overlay-text--ok">
                just kidding :)
              </div>
              <div className="creature-kbd-overlay-sub">(but seriously, stop that)</div>
            </>
          )}
        </div>
      )}
    </>
  );
}
