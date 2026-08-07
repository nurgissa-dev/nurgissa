'use client';

import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/retroSFX';

export type RetroTarget = 'sticker' | 'monitor' | 'books' | 'phone' | 'university' | null;

interface CozyRetroDeskProps {
  onSelectObject: (target: RetroTarget) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// 1-to-1 Exact Physical Keyboard e.code Mapping
const EXACT_CODE_MAP: Record<string, { row: number; col: number }> = {
  // Row 0: Number Row
  'backquote': { row: 0, col: 0 },
  'digit1': { row: 0, col: 1 }, 'digit2': { row: 0, col: 2 }, 'digit3': { row: 0, col: 3 },
  'digit4': { row: 0, col: 4 }, 'digit5': { row: 0, col: 5 }, 'digit6': { row: 0, col: 6 },
  'digit7': { row: 0, col: 7 }, 'digit8': { row: 0, col: 8 }, 'digit9': { row: 0, col: 9 },
  'digit0': { row: 0, col: 10 }, 'minus': { row: 0, col: 11 }, 'equal': { row: 0, col: 12 },
  'backspace': { row: 0, col: 13 },

  // Row 1: Top Alpha Row
  'tab': { row: 1, col: 0 },
  'keyq': { row: 1, col: 1 }, 'keyw': { row: 1, col: 2 }, 'keye': { row: 1, col: 3 },
  'keyr': { row: 1, col: 4 }, 'keyt': { row: 1, col: 5 }, 'keyy': { row: 1, col: 6 },
  'keyu': { row: 1, col: 7 }, 'keyi': { row: 1, col: 8 }, 'keyo': { row: 1, col: 9 },
  'keyp': { row: 1, col: 10 }, 'bracketleft': { row: 1, col: 11 }, 'bracketright': { row: 1, col: 12 },
  'backslash': { row: 1, col: 13 },

  // Row 2: Home Alpha Row
  'capslock': { row: 2, col: 0 },
  'keya': { row: 2, col: 1 }, 'keys': { row: 2, col: 2 }, 'keyd': { row: 2, col: 3 },
  'keyf': { row: 2, col: 4 }, 'keyg': { row: 2, col: 5 }, 'keyh': { row: 2, col: 6 },
  'keyj': { row: 2, col: 7 }, 'keyk': { row: 2, col: 8 }, 'keyl': { row: 2, col: 9 },
  'semicolon': { row: 2, col: 10 }, 'quote': { row: 2, col: 11 }, 'enter': { row: 2, col: 12 },

  // Row 3: Bottom Alpha Row
  'shiftleft': { row: 3, col: 0 },
  'keyz': { row: 3, col: 1 }, 'keyx': { row: 3, col: 2 }, 'keyc': { row: 3, col: 3 },
  'keyv': { row: 3, col: 4 }, 'keyb': { row: 3, col: 5 }, 'keyn': { row: 3, col: 6 },
  'keym': { row: 3, col: 7 }, 'comma': { row: 3, col: 8 }, 'period': { row: 3, col: 9 },
  'slash': { row: 3, col: 10 }, 'shiftright': { row: 3, col: 11 }, 'arrowup': { row: 3, col: 12 },

  // Row 4: Modifiers & Spacebar Row
  'controlleft': { row: 4, col: 0 }, 'metaleft': { row: 4, col: 1 }, 'altleft': { row: 4, col: 2 },
  'altright': { row: 4, col: 9 }, 'controlright': { row: 4, col: 10 },
  'arrowleft': { row: 4, col: 11 }, 'arrowdown': { row: 4, col: 12 }, 'arrowright': { row: 4, col: 13 },
};

// Keyboard Key Legends Grid
const KEY_LEGENDS = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
  ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT', '▲'],
  ['CTRL', 'WIN', 'ALT', '', '', '', '', '', '', 'ALT', 'FN', '◄', '▼', '►']
];

export default function CozyRetroDesk({
  onSelectObject,
  isDarkMode,
  onToggleTheme,
  soundEnabled,
  onToggleSound
}: CozyRetroDeskProps) {
  const [blink, setBlink] = useState(false);
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [leftClick, setLeftClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Update SFX enabled state
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Theme color tokens
  const wallBg = isDarkMode ? '#171B22' : '#f8f1e5';
  const wallStripe = isDarkMode ? '#222834' : '#f0e5d5';
  const deskBg = isDarkMode ? '#3A2A1F' : '#e2b991';
  const deskLip = isDarkMode ? '#2c1f17' : '#d4a375';
  const deskGrain = isDarkMode ? '#251a13' : '#cd9766';
  const computerBox = isDarkMode ? '#252033' : '#a493e6';
  const computerInner = isDarkMode ? '#352e47' : '#c0b3f0';
  const computerScreen = isDarkMode ? '#0B0E13' : '#2a2038';

  // 1. Periodic eye blinking for CRT screen
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 250);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // 2. Physical keypress listener mapping e.code strictly 1-to-1 + Trigger Key Click SFX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      setPressedCodes(prev => new Set(prev).add(code));
      sfx.playKeySwitchClick(); // 🎹 Box Navy clicky switch sound
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      setPressedCodes(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 3. Mouse cursor tracking & left/right click listener + Mouse Click SFX
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 70;
      const normY = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x: normX, y: normY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setLeftClick(true);
      if (e.button === 2 || e.button === 1) setRightClick(true);
      sfx.playKeyClick();
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) setLeftClick(false);
      if (e.button === 2 || e.button === 1) setRightClick(false);
    };

    const handleContextMenu = () => {
      setRightClick(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Check if a specific key (row, col) is currently active
  const isKeyActive = (row: number, col: number) => {
    for (const code of Array.from(pressedCodes)) {
      const coord = EXACT_CODE_MAP[code];
      if (coord && coord.row === row && coord.col === col) {
        return true;
      }
    }
    return false;
  };

  const isSpaceActive = pressedCodes.has('space');

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? '#0B0E13' : '#f5ebe0', overflow: 'hidden', transition: 'background 0.4s ease' }}>

      {/* Top Controls Bar: Sound Toggle & Theme Toggle */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 100, display: 'flex', gap: 10 }}>
        
        {/* Sound SFX Mute/Unmute Pill */}
        <button
          onClick={onToggleSound}
          style={{
            background: soundEnabled ? (isDarkMode ? '#222834' : '#ffffff') : '#f4a2af',
            border: '2.5px solid #362840',
            borderRadius: 24,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #362840',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#362840',
            transition: 'all 0.3s ease'
          }}
        >
          <span>{soundEnabled ? '🔊 SFX ON' : '🔇 SFX MUTED'}</span>
        </button>

        {/* Theme Pill */}
        <button
          onClick={onToggleTheme}
          style={{
            background: isDarkMode ? '#222834' : '#ffffff',
            border: '2.5px solid #362840',
            borderRadius: 24,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #362840',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: isDarkMode ? '#ffd166' : '#362840',
            transition: 'all 0.3s ease'
          }}
        >
          <span>{isDarkMode ? '🌙 MIDNIGHT' : '☀️ COZY DAY'}</span>
          <span style={{ padding: '2px 6px', background: isDarkMode ? '#ffd166' : '#b4a3e8', color: '#362840', borderRadius: 10, fontSize: '0.7rem' }}>
            TOGGLE
          </span>
        </button>

      </div>

      {/* 2D Vector Inline SVG Scene (16:9 viewBox) */}
      <svg
        viewBox="0 0 1200 675"
        style={{ width: '100%', height: '100%', maxHeight: '100vh', objectFit: 'contain', transition: 'all 0.4s ease' }}
      >
        <defs>
          {/* Filters for soft glow */}
          <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isDarkMode ? 8 : 4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. BACKGROUND WALL ── */}
        <rect x="0" y="0" width="1200" height="490" fill={wallBg} style={{ transition: 'fill 0.4s ease' }} />
        
        {/* Soft Wall Stripe Pattern */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="490"
            stroke={wallStripe}
            strokeWidth="1.5"
            style={{ transition: 'stroke 0.4s ease' }}
          />
        ))}

        {/* ── 2. DESK SURFACE ── */}
        <rect x="0" y="490" width="1200" height="185" fill={deskBg} stroke="#362840" strokeWidth="4" style={{ transition: 'fill 0.4s ease' }} />
        
        {/* Desk Front Edge Lip */}
        <rect x="0" y="490" width="1200" height="16" fill={deskLip} stroke="#362840" strokeWidth="3" style={{ transition: 'fill 0.4s ease' }} />
        
        {/* Wood Texture Grain Lines */}
        <line x1="40" y1="530" x2="320" y2="530" stroke={deskGrain} strokeWidth="2" strokeDasharray="60 15 40 20" />
        <line x1="450" y1="560" x2="880" y2="560" stroke={deskGrain} strokeWidth="2" strokeDasharray="80 25 50 15" />
        <line x1="150" y1="620" x2="680" y2="620" stroke={deskGrain} strokeWidth="2" strokeDasharray="100 30 70 20" />
        <line x1="780" y1="600" x2="1140" y2="600" stroke={deskGrain} strokeWidth="2" strokeDasharray="90 20 40 30" />

        {/* ── 3. TALL MODERN LOFT PANORAMIC WINDOW (30% Wall Height, Astana Skyline View) ── */}
        <g
          id="loft-transom-window"
          className="retro-interactive-group"
          onClick={onToggleTheme}
          transform="translate(80, 12)"
          style={{ cursor: 'pointer' }}
        >
          <g className="retro-hover-lift">
            {/* Soft Wall Recess Drop Shadow Behind Outer Frame */}
            <rect x="-4" y="-4" width="1048" height="153" fill="#000000" opacity="0.28" rx="10" />

            {/* Loft Steel Outer Frame */}
            <rect
              x="0"
              y="0"
              width="1040"
              height="145"
              fill={isDarkMode ? '#171c28' : '#362840'}
              stroke="#362840"
              strokeWidth="4"
              rx="8"
            />

            {/* Inner Glass Opening Area (1024 x 129) */}
            <g transform="translate(8, 8)">
              {/* Sky Background inside Window */}
              <rect
                x="0"
                y="0"
                width="1024"
                height="129"
                fill={isDarkMode ? '#0a0f1d' : '#fce4d6'}
                rx="4"
              />

              {/* DYNAMIC SKY & ASTANA SKYLINE PANORAMA */}
              {isDarkMode ? (
                /* MIDNIGHT MODE: Deep Indigo Sky, Large Glowing Moon, Stars & Glowing Astana Skyline */
                <g>
                  {/* Deep Night Sky Soft Gradient Bands */}
                  <rect x="0" y="0" width="1024" height="65" fill="#14112e" opacity="0.6" />
                  <rect x="0" y="65" width="1024" height="64" fill="#0c1938" opacity="0.5" />

                  {/* Large Rounded Moon & Glow */}
                  <circle cx="860" cy="38" r="22" fill="#fff5c0" opacity="0.95" />
                  <circle cx="860" cy="38" r="32" fill="#ffd166" opacity="0.22" />

                  {/* Twinkling Night Stars */}
                  {[
                    [50, 20], [140, 45], [230, 25], [340, 50], [440, 18],
                    [540, 40], [630, 22], [750, 48], [940, 26], [990, 52]
                  ].map(([sx, sy], idx) => (
                    <g key={idx}>
                      <circle cx={sx} cy={sy} r={idx % 2 === 0 ? 1.8 : 1.2} fill="#ffffff" opacity={0.85} />
                      {idx % 3 === 0 && <path d={`M ${sx-3} ${sy} L ${sx+3} ${sy} M ${sx} ${sy-3} L ${sx} ${sy+3}`} stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />}
                    </g>
                  ))}

                  {/* ASTANA SKYLINE SILHOUETTE (MIDNIGHT) */}
                  {/* Khan Shatyr Cone (Left Sector) */}
                  <polygon points="180,129 230,48 280,129" fill="#070a14" />
                  <line x1="230" y1="48" x2="230" y2="129" stroke="#00f5d4" strokeWidth="1" opacity="0.5" />

                  {/* Skyscrapers & City Towers */}
                  <path d="M 0 129 L 40 85 L 85 85 L 110 129 L 140 70 L 170 70 L 180 129 Z" fill="#080c19" />
                  <path d="M 280 129 L 310 75 L 340 75 L 355 129 L 380 60 L 420 60 L 435 129 L 470 80 L 510 80 L 530 129 Z" fill="#060913" />
                  <path d="M 530 129 L 560 65 L 595 65 L 610 129 L 770 129 Z" fill="#080c19" />
                  <path d="M 770 129 L 800 68 L 840 68 L 860 129 L 900 82 L 950 82 L 980 129 L 1024 129 Z" fill="#060913" />

                  {/* BAITEREK TOWER ASTANA (Center-Right Sector x=680..730) */}
                  <path d="M 695 129 L 702 70 L 710 129 M 715 129 L 708 70 L 700 129" stroke="#050710" strokeWidth="3" />
                  <path d="M 695 72 Q 705 60 715 72" fill="none" stroke="#00f5d4" strokeWidth="2" opacity="0.8" />
                  {/* Golden Glowing Sphere atop Baiterek */}
                  <circle cx="705" cy="54" r="13" fill="#ffc300" opacity="0.9" />
                  <circle cx="705" cy="54" r="19" fill="#00f5d4" opacity="0.3" />

                  {/* Glowing City Windows */}
                  {[
                    [50, 95], [65, 105], [150, 82], [158, 98], [320, 88], [395, 72], [405, 92],
                    [485, 95], [572, 78], [582, 98], [810, 82], [822, 100], [915, 96]
                  ].map(([wx, wy], idx) => (
                    <rect key={idx} x={wx} y={wy} width="4" height="6" fill={idx % 2 === 0 ? '#00f5d4' : '#ffd166'} opacity="0.85" rx="1" />
                  ))}
                </g>
              ) : (
                /* COZY DAY / DUSK MODE: Warm Peach Sky, Soft Clouds & Astana Horizon */
                <g>
                  {/* Soft Dusk Sky Horizon Gradient Bands */}
                  <rect x="0" y="0" width="1024" height="45" fill="#fbcfe8" opacity="0.4" />
                  <rect x="0" y="45" width="1024" height="45" fill="#fed7aa" opacity="0.5" />

                  {/* Soft Warm Sun */}
                  <circle cx="280" cy="48" r="28" fill="#f4a2af" opacity="0.9" />
                  <circle cx="280" cy="48" r="40" fill="#ffd166" opacity="0.3" />

                  {/* Floating Lo-Fi Clouds */}
                  <path d="M 80 32 Q 105 18 135 32 Q 160 22 185 35 L 70 35 Z" fill="#ffffff" opacity="0.75" />
                  <path d="M 480 25 Q 510 12 545 25 Q 575 16 605 30 L 465 30 Z" fill="#ffffff" opacity="0.8" />
                  <path d="M 820 38 Q 845 26 875 38 Q 898 28 925 42 L 805 42 Z" fill="#ffffff" opacity="0.7" />

                  {/* ASTANA SKYLINE SILHOUETTE (DAY / DUSK) */}
                  {/* Khan Shatyr Tent Silhouette */}
                  <polygon points="180,129 230,48 280,129" fill="#9b7364" />

                  {/* Skyline City Buildings */}
                  <path d="M 0 129 L 40 85 L 85 85 L 110 129 L 140 70 L 170 70 L 180 129 Z" fill="#8c6456" />
                  <path d="M 280 129 L 310 75 L 340 75 L 355 129 L 380 60 L 420 60 L 435 129 L 470 80 L 510 80 L 530 129 Z" fill="#80574a" />
                  <path d="M 530 129 L 560 65 L 595 65 L 610 129 L 770 129 Z" fill="#8c6456" />
                  <path d="M 770 129 L 800 68 L 840 68 L 860 129 L 900 82 L 950 82 L 980 129 L 1024 129 Z" fill="#80574a" />

                  {/* BAITEREK TOWER ASTANA (DAY / DUSK) */}
                  <path d="M 695 129 L 702 70 L 710 129 M 715 129 L 708 70 L 700 129" stroke="#684236" strokeWidth="3" />
                  <path d="M 695 72 Q 705 60 715 72" fill="none" stroke="#ffd166" strokeWidth="2.5" />
                  {/* Golden Sphere atop Baiterek */}
                  <circle cx="705" cy="54" r="13" fill="#ffd166" stroke="#362840" strokeWidth="2" />
                </g>
              )}

              {/* ONLY 3 LARGE PANES (2 Thin Vertical Mullion Dividers at x=340 & x=684) */}
              <rect x="337" y="0" width="7" height="129" fill={isDarkMode ? '#171c28' : '#362840'} />
              <rect x="681" y="0" width="7" height="129" fill={isDarkMode ? '#171c28' : '#362840'} />

              {/* Subtle Glass Glare / Reflection Streaks */}
              <polygon points="50,0 110,0 30,129 -30,129" fill="#ffffff" opacity="0.08" />
              <polygon points="450,0 510,0 420,129 360,129" fill="#ffffff" opacity="0.07" />
              <polygon points="800,0 860,0 770,129 710,129" fill="#ffffff" opacity="0.07" />
            </g>

            {/* Corner Bolts on Outer Metal Frame */}
            {[[14, 14], [1026, 14], [14, 131], [1026, 131], [345, 14], [689, 14]].map(([bx, by], idx) => (
              <circle key={idx} cx={bx} cy={by} r="3" fill="#4a5568" stroke="#171c28" strokeWidth="1" />
            ))}
          </g>
        </g>

        {/* ── 5. POTTED HOUSEPLANT (Desk Left) ── */}
        <g id="plant-group" transform="translate(60, 240)">
          <ellipse cx="60" cy="250" rx="55" ry="12" fill="#000000" opacity="0.25" />
          <path d="M 20 160 L 35 245 L 85 245 L 100 160 Z" fill={isDarkMode ? '#8d5b53' : '#c88b83'} stroke="#362840" strokeWidth="3.5" />
          <rect x="15" y="150" width="90" height="15" fill={isDarkMode ? '#9e6b63' : '#e0a098'} stroke="#362840" strokeWidth="3.5" rx="3" />
          
          <path d="M 55 150 Q 40 90 20 50 Q 55 80 55 150" fill={isDarkMode ? '#387044' : '#68c078'} stroke="#362840" strokeWidth="3" />
          <path d="M 55 150 Q 80 80 100 35 Q 75 75 55 150" fill={isDarkMode ? '#2d6a4f' : '#52b788'} stroke="#362840" strokeWidth="3" />
          <path d="M 55 150 Q 15 110 -10 90 Q 20 120 55 150" fill={isDarkMode ? '#40916c' : '#74c69d'} stroke="#362840" strokeWidth="3" />
          <path d="M 55 150 Q 95 120 125 100 Q 85 130 55 150" fill={isDarkMode ? '#1b4332' : '#40916c'} stroke="#362840" strokeWidth="3" />
          <path d="M 55 150 Q 55 60 55 10 Q 65 60 55 150" fill={isDarkMode ? '#52b788' : '#95d5b2'} stroke="#362840" strokeWidth="3" />
        </g>

        {/* ── 5b. SNORLAX GIF (Bottom-left corner, below plant on desk) ── */}
        <image
          href="snorlax.gif"
          x="0"
          y="490"
          width="120"
          height="185"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* ── 6. RETRO CRT COMPUTER (Central-Left) ── */}
        <g id="computer-group" transform="translate(180, 170)">
          <ellipse cx="220" cy="325" rx="210" ry="20" fill="#000000" opacity="0.3" />

          {/* Floppy Drive Unit */}
          <rect x="25" y="240" width="370" height="80" fill={isDarkMode ? '#2c2538' : '#eddcc8'} stroke="#362840" strokeWidth="4" rx="8" />
          <rect x="230" y="275" width="130" height="12" fill="#362840" rx="3" />
          <rect x="230" y="255" width="60" height="8" fill={isDarkMode ? '#1c1626' : '#d8c5b0'} stroke="#362840" strokeWidth="2" rx="2" />
          <circle cx="360" cy="260" r="7" fill={isDarkMode ? '#00f5d4' : '#f4a2af'} stroke="#362840" strokeWidth="2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={50 + i * 22} y1="260" x2={50 + i * 22} y2="300" stroke="#362840" strokeWidth="3.5" strokeLinecap="round" />
          ))}

          {/* CRT Monitor Main Box */}
          <g
            id="monitor-clickable"
            className="retro-interactive-group"
            onClick={() => onSelectObject('monitor')}
          >
            <rect x="10" y="0" width="400" height="240" fill="transparent" pointerEvents="all" />

            <g className="retro-hover-lift">
              <rect x="10" y="0" width="400" height="240" fill={computerBox} stroke="#362840" strokeWidth="4" rx="14" />
              <rect x="30" y="18" width="360" height="204" fill={computerInner} stroke="#362840" strokeWidth="3" rx="10" />

              <rect x="50" y="32" width="320" height="176" fill={computerScreen} stroke="#362840" strokeWidth="3.5" rx="18" />
              <path d="M 65 48 C 120 42, 280 42, 335 48 C 345 90, 345 150, 335 185" fill="none" stroke="#3c2f4d" strokeWidth="4" opacity="0.6" />

              {!blink ? (
                <g fill={isDarkMode ? '#00f5d4' : '#ffffff'}>
                  <rect x="120" y="88" width="30" height="8" rx="2" />
                  <rect x="130" y="78" width="10" height="10" rx="2" />
                  <rect x="250" y="88" width="30" height="8" rx="2" />
                  <rect x="260" y="78" width="10" height="10" rx="2" />
                </g>
              ) : (
                <g fill={isDarkMode ? '#00f5d4' : '#ffffff'}>
                  <rect x="120" y="88" width="30" height="6" rx="2" />
                  <rect x="250" y="88" width="30" height="6" rx="2" />
                </g>
              )}

              <rect x="185" y="118" width="50" height="24" fill={isDarkMode ? '#00f5d4' : '#ffffff'} rx="4" />
              <rect x="190" y="122" width="40" height="16" fill={computerScreen} rx="2" />

              <text x="210" y="185" fill={isDarkMode ? '#00f5d4' : '#a493e6'} fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                [ CLICK TO OPEN TERMINAL ]
              </text>
            </g>
          </g>

          {/* Floating Zzz */}
          <g className="floating-zzz" pointerEvents="none">
            <text x="360" y="35" fill={isDarkMode ? '#00f5d4' : '#ffffff'} fontSize="24" fontWeight="bold" fontFamily="sans-serif" stroke="#362840" strokeWidth="1.5">Z</text>
            <text x="382" y="15" fill={isDarkMode ? '#00f5d4' : '#ffffff'} fontSize="18" fontWeight="bold" fontFamily="sans-serif" stroke="#362840" strokeWidth="1.5">z</text>
            <text x="398" y="-2" fill={isDarkMode ? '#00f5d4' : '#ffffff'} fontSize="14" fontWeight="bold" fontFamily="sans-serif" stroke="#362840" strokeWidth="1.5">z</text>
          </g>

          {/* 🟡 YELLOW POST-IT STICKER (Clickable -> About Me) */}
          <g
            id="sticker-group"
            className="retro-interactive-group"
            onClick={(e) => {
              e.stopPropagation();
              onSelectObject('sticker');
            }}
            transform="translate(20, -18) rotate(-6)"
          >
            <rect x="-10" y="-15" width="110" height="110" fill="transparent" pointerEvents="all" />

            <g className="retro-hover-lift">
              <rect x="3" y="3" width="90" height="90" fill="#000000" opacity="0.25" rx="4" />
              <rect x="0" y="0" width="90" height="90" fill="#ffd166" stroke="#362840" strokeWidth="3" rx="4" />
              <rect x="25" y="-8" width="40" height="16" fill="#fefae0" stroke="#362840" strokeWidth="2" opacity="0.85" rx="2" />
              <text x="45" y="28" fill="#362840" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ABOUT ME
              </text>
              <line x1="15" y1="42" x2="75" y2="42" stroke="#362840" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="15" y1="54" x2="75" y2="54" stroke="#362840" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="15" y1="66" x2="60" y2="66" stroke="#362840" strokeWidth="2" strokeDasharray="4 3" />
              
              <rect x="18" y="72" width="54" height="14" fill="#f4a2af" stroke="#362840" strokeWidth="1.5" rx="3" />
              <text x="45" y="83" fill="#362840" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                CLICK HERE
              </text>
            </g>
          </g>
        </g>

        {/* ── 7. STACK OF BOOKS (Clickable -> Projects) ── */}
        <g
          id="books-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('books')}
          transform="translate(680, 310)"
        >
          <rect x="-10" y="-20" width="240" height="210" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            <ellipse cx="110" cy="180" rx="115" ry="12" fill="#000000" opacity="0.2" />

            <g transform="translate(0, 120)">
              <rect x="0" y="0" width="220" height="42" fill={isDarkMode ? '#a84e5b' : '#f4a2af'} stroke="#362840" strokeWidth="3.5" rx="5" />
              <rect x="210" y="5" width="10" height="32" fill="#ffffff" stroke="#362840" strokeWidth="2" />
              <line x1="25" y1="21" x2="170" y2="21" stroke="#362840" strokeWidth="3" />
            </g>

            <g transform="translate(15, 75)">
              <rect x="0" y="0" width="195" height="38" fill={isDarkMode ? '#6c5ce7' : '#b4a3e8'} stroke="#362840" strokeWidth="3.5" rx="5" />
              <rect x="185" y="5" width="10" height="28" fill="#ffffff" stroke="#362840" strokeWidth="2" />
              <line x1="20" y1="19" x2="150" y2="19" stroke="#362840" strokeWidth="3" />
            </g>

            <g transform="translate(28, 35)">
              <rect x="0" y="0" width="170" height="34" fill="#ffd166" stroke="#362840" strokeWidth="3.5" rx="5" />
              <rect x="160" y="4" width="10" height="26" fill="#ffffff" stroke="#362840" strokeWidth="2" />
              <text x="75" y="22" fill="#362840" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                PROJECTS
              </text>
            </g>

            <g transform="translate(90, -10)">
              <path d="M 10 30 L 15 45 L 35 45 L 40 30 Z" fill="#9d8189" stroke="#362840" strokeWidth="2" />
              <circle cx="25" cy="20" r="12" fill={isDarkMode ? '#00f5d4' : '#68c078'} stroke="#362840" strokeWidth="2" />
            </g>
          </g>
        </g>

        {/* ── 8. VINTAGE PHONE / CALCULATOR (Clickable -> Contacts) ── */}
        <g
          id="phone-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('phone')}
          transform="translate(940, 390)"
        >
          <rect x="-20" y="-10" width="190" height="120" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            <ellipse cx="80" cy="100" rx="85" ry="12" fill="#000000" opacity="0.2" />

            <rect x="0" y="0" width="160" height="95" fill="#ffd166" stroke="#362840" strokeWidth="3.5" rx="14" />
            
            <rect x="20" y="15" width="120" height="24" fill="#f4a2af" stroke="#362840" strokeWidth="2.5" rx="4" />
            <text x="80" y="32" fill="#362840" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CONTACTS ☎
            </text>

            {[
              [30, 48], [65, 48], [100, 48],
              [30, 68], [65, 68], [100, 68]
            ].map(([kx, ky], i) => (
              <rect key={i} x={kx} y={ky} width="24" height="14" fill="#ffffff" stroke="#362840" strokeWidth="2" rx="3" />
            ))}
            <path d="M -10 20 Q -30 10 -20 50 Q -10 80 0 70" fill="none" stroke="#362840" strokeWidth="3" />
          </g>
        </g>

        {/* ── 9. AESTHETIC COMPLETE 5-ROW CUSTOM 65% MECHANICAL KEYBOARD ── */}
        <g id="keyboard-group" transform="translate(340, 498)">
          {/* Coiled Aviator Cable (Top-Left) */}
          <path
            d="M 50 0 Q 30 -25 10 -15 Q -10 -5 5 -35 Q 20 -45 40 -35 L 70 -5"
            fill="none"
            stroke="#362840"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Aviator Metal Connector */}
          <rect x="42" y="-12" width="16" height="10" fill="#ffd166" stroke="#362840" strokeWidth="2" rx="2" />

          {/* Keyboard Outer Shadow */}
          <rect x="8" y="10" width="470" height="136" fill="#000000" opacity="0.3" rx="16" />

          {/* Custom Aluminum Case */}
          <rect
            x="0"
            y="0"
            width="470"
            height="136"
            fill={isDarkMode ? '#221b2b' : '#eddcc8'}
            stroke="#362840"
            strokeWidth="4"
            rx="16"
          />

          {/* Inner Brass Plate Inset */}
          <rect
            x="10"
            y="8"
            width="450"
            height="120"
            fill={isDarkMode ? '#16111c' : '#d5c3b0'}
            stroke="#362840"
            strokeWidth="2.5"
            rx="10"
          />

          {/* Brass Metallic Corner Badge */}
          <rect x="428" y="12" width="26" height="12" fill="#ffd166" stroke="#362840" strokeWidth="1.5" rx="3" />
          <text x="441" y="21" fill="#362840" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AITU</text>

          {/* 5-Row Keycaps Grid */}
          {Array.from({ length: 5 }).map((_, row) => (
            <g key={row}>
              {Array.from({ length: 14 }).map((_, col) => {
                if (row === 4 && col >= 3 && col <= 8) return null;

                const active = isKeyActive(row, col);

                let baseFill = isDarkMode ? '#2c2438' : '#fefae0';
                if (row === 0 && col === 0) baseFill = '#f4a2af';
                else if (row === 2 && col === 12) baseFill = '#ffd166';
                else if (col === 0 || col === 13 || row === 4) baseFill = isDarkMode ? '#4a3b60' : '#b4a3e8';

                const keyFill = active ? '#ff4d6d' : baseFill;
                const legendText = KEY_LEGENDS[row]?.[col] || '';

                const kx = 18 + col * 31;
                const ky = (active ? 15 : 13) + row * 22;

                return (
                  <g key={col}>
                    {/* Keycap Shadow/Base */}
                    <rect
                      x={kx}
                      y={ky + 2}
                      width="27"
                      height="18"
                      fill="#362840"
                      rx="4"
                    />
                    {/* Keycap Top Face */}
                    <rect
                      x={kx}
                      y={ky}
                      width="27"
                      height="18"
                      fill={keyFill}
                      stroke="#362840"
                      strokeWidth="2"
                      rx="4"
                      style={{ transition: 'all 0.04s ease-out' }}
                    />
                    {/* Keycap Bevel Surface Insert */}
                    <rect
                      x={kx + 2.5}
                      y={ky + 1.5}
                      width="22"
                      height="12"
                      fill="rgba(255, 255, 255, 0.25)"
                      rx="2"
                      pointerEvents="none"
                    />
                    {/* Key Legend Text */}
                    {legendText && (
                      <text
                        x={kx + 13.5}
                        y={ky + 12}
                        fill={active ? '#ffffff' : (isDarkMode ? '#ececec' : '#362840')}
                        fontSize={legendText.length > 3 ? '6' : (legendText.length > 1 ? '7' : '8.5')}
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {legendText}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Dedicated Row 4 Spacebar */}
          <g>
            <rect
              x="111"
              y={(isSpaceActive ? 103 : 101) + 2}
              width="182"
              height="18"
              fill="#362840"
              rx="5"
            />
            <rect
              x="111"
              y={isSpaceActive ? 103 : 101}
              width="182"
              height="18"
              fill={isSpaceActive ? '#ff4d6d' : (isDarkMode ? '#6c5ce7' : '#a493e6')}
              stroke="#362840"
              strokeWidth="2.5"
              rx="5"
              style={{ transition: 'all 0.04s ease-out' }}
            />
            <rect
              x="117"
              y={(isSpaceActive ? 103 : 101) + 2}
              width="170"
              height="11"
              fill="rgba(255, 255, 255, 0.3)"
              rx="3"
              pointerEvents="none"
            />
            <text
              x="202"
              y={(isSpaceActive ? 103 : 101) + 12}
              fill={isSpaceActive ? '#ffffff' : (isDarkMode ? '#ececec' : '#362840')}
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
              letterSpacing="3"
              pointerEvents="none"
            >
              SPACE
            </text>
          </g>
        </g>

        {/* ── 10. 2D COMPUTER MOUSE ── */}
        <g
          id="mouse-group"
          transform={`translate(${850 + mousePos.x}, ${530 + mousePos.y})`}
          style={{ transition: 'transform 0.05s ease-out' }}
        >
          {/* Mouse Drop Shadow */}
          <ellipse cx="32" cy="55" rx="34" ry="24" fill="#000000" opacity="0.25" />

          {/* Main Mouse Base Body */}
          <rect
            x="0"
            y="0"
            width="64"
            height="96"
            fill={isDarkMode ? '#252033' : '#f4f1de'}
            stroke="#362840"
            strokeWidth="3.5"
            rx="30"
          />

          {/* Left Mouse Button */}
          <path
            d="M 4 30 L 30 30 L 30 6 C 18 8, 8 16, 4 30 Z"
            fill={leftClick ? '#ff4d6d' : (isDarkMode ? '#3b324d' : '#ffffff')}
            stroke="#362840"
            strokeWidth="2"
            style={{ transition: 'fill 0.05s ease-out' }}
          />

          {/* Right Mouse Button */}
          <path
            d="M 34 30 L 60 30 C 56 16, 46 8, 34 6 L 34 30 Z"
            fill={rightClick ? '#ffd166' : (isDarkMode ? '#3b324d' : '#ffffff')}
            stroke="#362840"
            strokeWidth="2"
            style={{ transition: 'fill 0.05s ease-out' }}
          />

          {/* Scroll Wheel */}
          <rect
            x="29"
            y="16"
            width="6"
            height="14"
            fill={isDarkMode ? '#00f5d4' : '#b4a3e8'}
            stroke="#362840"
            strokeWidth="1.5"
            rx="3"
          />

          {/* Wire Cord */}
          <path
            d="M 32 0 Q 32 -15 20 -25 Q 10 -35 25 -45"
            fill="none"
            stroke="#362840"
            strokeWidth="2.5"
          />
        </g>

      </svg>
    </div>
  );
}
