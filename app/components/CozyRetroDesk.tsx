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

        {/* ── 3. MODERN LOFT PANORAMIC TRANSOM WINDOW (Top Wall Skylight Window) ── */}
        {/* Soft Ambient Light Beam Cast Downward onto Wall */}
        <polygon
          points="110,86 1090,86 1170,300 30,300"
          fill={isDarkMode ? '#00f5d4' : '#ffd166'}
          opacity={isDarkMode ? 0.035 : 0.07}
          pointerEvents="none"
        />

        <g
          id="loft-transom-window"
          className="retro-interactive-group"
          onClick={onToggleTheme}
          transform="translate(100, 16)"
          style={{ cursor: 'pointer' }}
        >
          <g className="retro-hover-lift">
            {/* Window Recess / Wall Cutout Shadow */}
            <rect x="-4" y="-4" width="1008" height="78" fill="#000000" opacity="0.3" rx="8" />

            {/* Loft Steel Outer Frame */}
            <rect
              x="0"
              y="0"
              width="1000"
              height="70"
              fill={isDarkMode ? '#1a1f2c' : '#362840'}
              stroke="#362840"
              strokeWidth="4"
              rx="6"
            />

            {/* Inner Glass Opening Area */}
            <g transform="translate(8, 8)">
              {/* Sky Background inside Window Panes */}
              <rect
                x="0"
                y="0"
                width="984"
                height="54"
                fill={isDarkMode ? '#0b1120' : '#fde6d2'}
                rx="3"
              />

              {/* Sky & Horizon Gradient / Elements */}
              {isDarkMode ? (
                /* Dark Mode Sky (Midnight Starry Sky & Distant City Skyline) */
                <g>
                  {/* Glowing Moon */}
                  <circle cx="860" cy="20" r="12" fill="#fff3b0" opacity="0.9" />
                  <circle cx="860" cy="20" r="18" fill="#ffd166" opacity="0.2" />

                  {/* Stars */}
                  {[[40, 12], [120, 28], [210, 14], [310, 32], [420, 10], [530, 25], [640, 15], [740, 30], [920, 12]].map(([sx, sy], idx) => (
                    <circle key={idx} cx={sx} cy={sy} r={idx % 2 === 0 ? 1.5 : 1} fill="#ffffff" opacity={0.8} />
                  ))}

                  {/* Distant City Skyline Silhouettes */}
                  <path d="M 0 54 L 30 38 L 55 38 L 70 54 L 110 32 L 140 32 L 160 54 L 210 24 L 235 24 L 250 54 L 320 36 L 360 36 L 380 54 L 450 28 L 480 28 L 510 54 L 600 34 L 630 34 L 660 54 L 730 22 L 760 22 L 790 54 L 880 30 L 910 30 L 940 54 L 984 54 Z" fill="#060913" />

                  {/* Tiny Glowing City Window Dots */}
                  {[[40, 42], [122, 38], [220, 30], [335, 42], [462, 34], [612, 40], [742, 28], [892, 36]].map(([wx, wy], idx) => (
                    <rect key={idx} x={wx} y={wy} width="3" height="4" fill={idx % 2 === 0 ? '#00f5d4' : '#ffd166'} opacity="0.85" />
                  ))}
                </g>
              ) : (
                /* Light Mode Sky (Warm Sunset Horizon & Clouds) */
                <g>
                  {/* Warm Sun */}
                  <circle cx="200" cy="28" r="16" fill="#f4a2af" opacity="0.95" />
                  <circle cx="200" cy="28" r="24" fill="#ffd166" opacity="0.35" />

                  {/* Soft Lo-Fi Clouds */}
                  <path d="M 80 20 Q 95 12 115 20 Q 130 15 145 22 L 75 22 Z" fill="#ffffff" opacity="0.6" />
                  <path d="M 450 18 Q 470 10 495 18 Q 515 12 535 22 L 440 22 Z" fill="#ffffff" opacity="0.65" />
                  <path d="M 780 22 Q 800 14 825 22 Q 845 16 865 26 L 770 26 Z" fill="#ffffff" opacity="0.55" />

                  {/* Tree Canopy Silhouettes at Bottom */}
                  <path d="M 0 54 Q 40 36 90 54 Q 160 38 230 54 Q 340 32 440 54 Q 540 35 640 54 Q 750 36 850 54 Q 920 40 984 54 Z" fill="#7a6252" opacity="0.7" />
                </g>
              )}

              {/* Vertical Metal Window Dividers (Loft Mullions) */}
              {[164, 328, 492, 656, 820].map((mx, idx) => (
                <rect key={idx} x={mx - 3} y="0" width="6" height="54" fill={isDarkMode ? '#1a1f2c' : '#362840'} />
              ))}

              {/* Diagonal Glass Highlight / Reflection Streaks */}
              <polygon points="40,0 80,0 20,54 -20,54" fill="#ffffff" opacity="0.1" />
              <polygon points="360,0 400,0 340,54 300,54" fill="#ffffff" opacity="0.08" />
              <polygon points="680,0 720,0 660,54 620,54" fill="#ffffff" opacity="0.08" />
            </g>

            {/* Metallic Bolts / Rivets on Frame Corners */}
            {[[12, 10], [988, 10], [12, 60], [988, 60], [336, 10], [664, 10]].map(([bx, by], idx) => (
              <circle key={idx} cx={bx} cy={by} r="2.5" fill="#4a5568" stroke="#1a1f2c" strokeWidth="1" />
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
