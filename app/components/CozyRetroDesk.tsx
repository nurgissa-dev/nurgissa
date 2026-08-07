'use client';

import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/retroSFX';

export type RetroTarget = 'sticker' | 'monitor' | 'books' | 'phone' | 'university' | null;

interface CozyRetroDeskProps {
  onSelectObject: (target: RetroTarget) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// 1-to-1 Physical Keyboard Code Mapping
const EXACT_CODE_MAP: Record<string, { row: number; col: number }> = {
  'backquote': { row: 0, col: 0 },
  'digit1': { row: 0, col: 1 }, 'digit2': { row: 0, col: 2 }, 'digit3': { row: 0, col: 3 },
  'digit4': { row: 0, col: 4 }, 'digit5': { row: 0, col: 5 }, 'digit6': { row: 0, col: 6 },
  'digit7': { row: 0, col: 7 }, 'digit8': { row: 0, col: 8 }, 'digit9': { row: 0, col: 9 },
  'digit0': { row: 0, col: 10 }, 'minus': { row: 0, col: 11 }, 'equal': { row: 0, col: 12 },
  'backspace': { row: 0, col: 13 },
  'tab': { row: 1, col: 0 },
  'keyq': { row: 1, col: 1 }, 'keyw': { row: 1, col: 2 }, 'keye': { row: 1, col: 3 },
  'keyr': { row: 1, col: 4 }, 'keyt': { row: 1, col: 5 }, 'keyy': { row: 1, col: 6 },
  'keyu': { row: 1, col: 7 }, 'keyi': { row: 1, col: 8 }, 'keyo': { row: 1, col: 9 },
  'keyp': { row: 1, col: 10 }, 'bracketleft': { row: 1, col: 11 }, 'bracketright': { row: 1, col: 12 },
  'backslash': { row: 1, col: 13 },
  'capslock': { row: 2, col: 0 },
  'keya': { row: 2, col: 1 }, 'keys': { row: 2, col: 2 }, 'keyd': { row: 2, col: 3 },
  'keyf': { row: 2, col: 4 }, 'keyg': { row: 2, col: 5 }, 'keyh': { row: 2, col: 6 },
  'keyj': { row: 2, col: 7 }, 'keyk': { row: 2, col: 8 }, 'keyl': { row: 2, col: 9 },
  'semicolon': { row: 2, col: 10 }, 'quote': { row: 2, col: 11 }, 'enter': { row: 2, col: 12 },
  'shiftleft': { row: 3, col: 0 },
  'keyz': { row: 3, col: 1 }, 'keyx': { row: 3, col: 2 }, 'keyc': { row: 3, col: 3 },
  'keyv': { row: 3, col: 4 }, 'keyb': { row: 3, col: 5 }, 'keyn': { row: 3, col: 6 },
  'keym': { row: 3, col: 7 }, 'comma': { row: 3, col: 8 }, 'period': { row: 3, col: 9 },
  'slash': { row: 3, col: 10 }, 'shiftright': { row: 3, col: 11 }, 'arrowup': { row: 3, col: 12 },
  'controlleft': { row: 4, col: 0 }, 'metaleft': { row: 4, col: 1 }, 'altleft': { row: 4, col: 2 },
  'altright': { row: 4, col: 9 }, 'controlright': { row: 4, col: 10 },
  'arrowleft': { row: 4, col: 11 }, 'arrowdown': { row: 4, col: 12 }, 'arrowright': { row: 4, col: 13 },
};

const KEY_LEGENDS = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'RET'],
  ['SHF', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHF', '▲'],
  ['CTL', 'WIN', 'ALT', '', '', '', '', '', '', 'ALT', 'FN', '◄', '▼', '►']
];

const PX = "'Press Start 2P', monospace";

export default function CozyRetroDesk({
  onSelectObject,
  soundEnabled,
  onToggleSound
}: CozyRetroDeskProps) {
  const [blink, setBlink] = useState(false);
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [leftClick, setLeftClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lampOn, setLampOn] = useState(true);

  useEffect(() => { sfx.enabled = soundEnabled; }, [soundEnabled]);

  // Periodic eye blinking for CRT screen face
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 260);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Keyboard keypress listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const code = e.code.toLowerCase();
      setPressedCodes(prev => new Set(prev).add(code));
      sfx.playKeySwitchClick();
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

  // Mouse tracking & click listener
  useEffect(() => {
    sfx.preload();
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 60;
      const normY = (e.clientY / window.innerHeight - 0.5) * 25;
      setMousePos({ x: normX, y: normY });
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { setLeftClick(true); sfx.playMouseClick(false); }
      if (e.button === 2) { setRightClick(true); sfx.playMouseClick(true); }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) setLeftClick(false);
      if (e.button === 2) setRightClick(false);
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setTimeout(() => setRightClick(false), 150);
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

  const isKeyActive = (row: number, col: number) => {
    for (const code of Array.from(pressedCodes)) {
      const coord = EXACT_CODE_MAP[code];
      if (coord && coord.row === row && coord.col === col) return true;
    }
    return false;
  };

  const isSpaceActive = pressedCodes.has('space');

  // Rich 16-Bit Color Palette
  const wallBg = '#f5ebd9';
  const wallAccent = '#e8dcbe';
  const wallShadow = '#d4c5a3';
  const deskBase = '#d49b63';
  const deskHighlight = '#e6af78';
  const deskShadow = '#ac723d';
  const deskLip = '#c58a52';
  const outline = '#2a1d34'; // Soft dark purple outline instead of harsh black
  const monitorHighlight = '#c2b0ee';
  const monitorShell = '#a493e6';
  const monitorShadow = '#7f6dc3';
  const monitorDeepShadow = '#59499e';
  const monitorInner = '#d2c7f6';
  const screenBg = '#191224';

  const toggleLamp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLampOn(prev => !prev);
    sfx.playKeyClick();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eadecb', overflow: 'hidden' }}>

      {/* Top Controls Bar */}
      <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 100, display: 'flex', gap: 10 }}>
        <button
          onClick={toggleLamp}
          style={{
            background: lampOn ? '#ffd166' : '#9d8189',
            border: `3px solid ${outline}`,
            borderRadius: 0,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: `3px 3px 0px ${outline}`,
            fontFamily: PX,
            fontSize: '0.5rem',
            color: outline,
          }}
        >
          <span>{lampOn ? '💡 LAMP ON' : '🌑 LAMP OFF'}</span>
        </button>

        <button
          onClick={onToggleSound}
          style={{
            background: soundEnabled ? '#fefae0' : '#f4a2af',
            border: `3px solid ${outline}`,
            borderRadius: 0,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: `3px 3px 0px ${outline}`,
            fontFamily: PX,
            fontSize: '0.5rem',
            color: outline,
          }}
        >
          <span>{soundEnabled ? '♪ SFX ON' : '♪ MUTED'}</span>
        </button>
      </div>

      {/* ── 16-BIT HIGH-RES PIXEL ART CANVAS SCENE ── */}
      <svg
        viewBox="0 0 1200 675"
        style={{ width: '100%', height: '100%', maxHeight: '100vh', objectFit: 'contain' }}
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Wall Dither Pattern */}
          <pattern id="wallDither" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={wallBg} />
            <rect x="0" y="0" width="4" height="4" fill={wallAccent} opacity="0.6" />
            <rect x="4" y="4" width="4" height="4" fill={wallAccent} opacity="0.6" />
          </pattern>

          {/* Desk Wood Texture Dither */}
          <pattern id="deskWoodGrain" x="0" y="0" width="16" height="8" patternUnits="userSpaceOnUse">
            <rect width="16" height="8" fill={deskBase} />
            <rect x="0" y="0" width="8" height="2" fill={deskHighlight} opacity="0.4" />
            <rect x="8" y="4" width="8" height="2" fill={deskShadow} opacity="0.3" />
          </pattern>

          {/* CRT Scanlines Filter */}
          <pattern id="crtScanlines" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <rect x="0" y="2" width="4" height="2" fill="#000" opacity="0.12" />
          </pattern>

          {/* Pixel Dither Shadow for Lamp Cone */}
          <pattern id="lampLightDither" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <rect x="0" y="0" width="2" height="2" fill="#ffd166" opacity="0.25" />
            <rect x="2" y="2" width="2" height="2" fill="#ffd166" opacity="0.25" />
          </pattern>
        </defs>

        {/* ── 1. BACKGROUND WALL ── */}
        <rect x="0" y="0" width="1200" height="490" fill="url(#wallDither)" />
        <rect x="0" y="484" width="1200" height="6" fill={outline} />

        {/* Vertical Wall Wood/Wallpaper Panel Lines */}
        {Array.from({ length: 15 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 80 + 10} y="0" width="2" height="484" fill={wallShadow} opacity="0.4" />
            <rect x={i * 80 + 12} y="0" width="2" height="484" fill="#fff" opacity="0.2" />
          </g>
        ))}

        {/* ── 1b. WALL DECORATIONS ── */}
        {/* Pixel Art Game/Dev Poster (Left Wall) */}
        <g transform="translate(60, 40)">
          <rect x="4" y="4" width="92" height="122" fill={outline} opacity="0.3" />
          <rect x="0" y="0" width="92" height="122" fill="#fefae0" stroke={outline} strokeWidth="3" />
          <rect x="6" y="6" width="80" height="90" fill="#2a1d34" stroke={outline} strokeWidth="2" />
          {/* Pixel Mountain / Sun Graphic on Poster */}
          <rect x="36" y="20" width="20" height="20" fill="#f4a2af" />
          <polygon points="12,80 35,45 55,80" fill="#62c9d9" />
          <polygon points="40,80 62,52 80,80" fill="#68c078" />
          <text x="46" y="108" fill={outline} fontSize="4.5" fontFamily={PX} textAnchor="middle">RETRO DEV</text>
        </g>

        {/* Coiled Wall Cables (Behind Desk Center) */}
        <path
          d="M 230 484 Q 220 380 270 340 T 320 280"
          fill="none"
          stroke={outline}
          strokeWidth="3"
        />

        {/* ── 2. DESK SURFACE (16-Bit Layered Wood) ── */}
        <rect x="0" y="490" width="1200" height="185" fill="url(#deskWoodGrain)" />
        <rect x="0" y="490" width="1200" height="185" fill="none" stroke={outline} strokeWidth="4" />
        
        {/* Desk Lip & Highlights */}
        <rect x="0" y="490" width="1200" height="12" fill={deskLip} stroke={outline} strokeWidth="2" />
        <rect x="0" y="490" width="1200" height="3" fill={deskHighlight} opacity="0.6" />
        <rect x="0" y="500" width="1200" height="2" fill={deskShadow} opacity="0.5" />

        {/* Contact Shadows under items */}
        <rect x="40" y="484" width="140" height="10" fill={outline} opacity="0.25" />
        <rect x="190" y="484" width="370" height="12" fill={outline} opacity="0.3" />
        <rect x="680" y="484" width="220" height="10" fill={outline} opacity="0.25" />

        {/* ── 3. POTTED PLANT (About Me - Clickable) ── */}
        <g
          id="plant-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('sticker')}
          transform="translate(60, 235)"
        >
          <g className="retro-hover-lift">
            {/* Pot Contact Shadow */}
            <rect x="12" y="250" width="96" height="8" fill={outline} opacity="0.3" />

            {/* Clay Pot Base Shading */}
            <rect x="24" y="160" width="72" height="88" fill="#bc6c25" stroke={outline} strokeWidth="3" />
            <rect x="24" y="160" width="12" height="88" fill="#dda15e" />
            <rect x="80" y="160" width="16" height="88" fill="#884918" />
            <rect x="16" y="148" width="88" height="16" fill="#dda15e" stroke={outline} strokeWidth="3" />
            <rect x="16" y="148" width="88" height="3" fill="#fefae0" opacity="0.6" />

            {/* Detailed Pixel Leaves (Multi-shaded Green) */}
            {/* Left Leaf */}
            <polygon points="56,148 32,100 12,65 42,95" fill="#40916c" stroke={outline} strokeWidth="3" />
            <polygon points="56,148 35,102 18,72" fill="#52b788" />

            {/* Center Left Leaf */}
            <polygon points="56,148 48,70 42,30 54,65" fill="#52b788" stroke={outline} strokeWidth="3" />
            <polygon points="56,148 50,72 46,36" fill="#74c69d" />

            {/* Center Main Leaf */}
            <polygon points="56,148 60,60 56,15 64,60" fill="#68c078" stroke={outline} strokeWidth="3" />
            <polygon points="56,148 59,62 58,22" fill="#95d5b2" />

            {/* Right Leaf */}
            <polygon points="56,148 76,95 102,50 78,100" fill="#2d6a4f" stroke={outline} strokeWidth="3" />
            <polygon points="56,148 74,93 96,55" fill="#40916c" />

            {/* Far Right Leaf */}
            <polygon points="56,148 84,120 114,105 82,130" fill="#52b788" stroke={outline} strokeWidth="3" />

            {/* Floating Label */}
            <g transform="translate(6, 260)">
              <rect x="0" y="0" width="100" height="20" fill="#f4a2af" stroke={outline} strokeWidth="2.5" />
              <text x="50" y="13" fill={outline} fontSize="5" fontFamily={PX} textAnchor="middle">
                ABOUT ME 🌿
              </text>
            </g>
          </g>
        </g>

        {/* ── 4. SNORLAX ── */}
        <image
          href="snorlax.gif"
          x="0"
          y="480"
          width="130"
          height="195"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* ── 5. CRT MONITOR & SYSTEM UNIT (Terminal - Clickable) ── */}
        <g id="computer-group" transform="translate(180, 160)">
          {/* Base Shadow */}
          <rect x="15" y="325" width="390" height="12" fill={outline} opacity="0.35" />

          {/* Floppy Drive / System Unit Base */}
          <rect x="25" y="240" width="370" height="85" fill="#eddcc8" stroke={outline} strokeWidth="4" />
          <rect x="25" y="240" width="370" height="8" fill="#fefae0" opacity="0.7" />
          <rect x="25" y="317" width="370" height="8" fill="#cbb49c" />

          {/* Floppy Drive Slot 1 */}
          <rect x="230" y="260" width="135" height="10" fill={outline} />
          <rect x="230" y="274" width="60" height="8" fill="#d8c5b0" stroke={outline} strokeWidth="2" />
          <rect x="300" y="274" width="12" height="8" fill="#63c174" stroke={outline} strokeWidth="1.5" />

          {/* Floppy Drive Slot 2 */}
          <rect x="230" y="292" width="135" height="10" fill={outline} />

          {/* Power Switch & LED */}
          <rect x="375" y="260" width="12" height="12" fill="#f4a2af" stroke={outline} strokeWidth="2" />
          <rect x="375" y="280" width="12" height="16" fill="#ffd166" stroke={outline} strokeWidth="2" />

          {/* Front Air Vents */}
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={i} x={45 + i * 20} y="260" width="4" height="48" fill={outline} />
          ))}

          {/* CRT Monitor Main Frame (CLICKABLE -> Terminal) */}
          <g
            id="monitor-clickable"
            className="retro-interactive-group"
            onClick={() => onSelectObject('monitor')}
          >
            <rect x="10" y="0" width="400" height="240" fill="transparent" pointerEvents="all" />

            <g className="retro-hover-lift">
              {/* Monitor Shell (4-tone Shading) */}
              <rect x="10" y="0" width="400" height="240" fill={monitorShell} stroke={outline} strokeWidth="4" />
              <rect x="10" y="0" width="400" height="8" fill={monitorHighlight} />
              <rect x="398" y="0" width="12" height="240" fill={monitorShadow} />
              <rect x="10" y="232" width="400" height="8" fill={monitorDeepShadow} />

              {/* Inner Screen Bezel */}
              <rect x="30" y="16" width="360" height="208" fill={monitorInner} stroke={outline} strokeWidth="3" />
              <rect x="30" y="16" width="360" height="6" fill="#fff" opacity="0.4" />
              <rect x="30" y="218" width="360" height="6" fill="#9d8ec7" />

              {/* CRT Glass Screen */}
              <rect x="50" y="32" width="320" height="176" fill={screenBg} stroke={outline} strokeWidth="4" />

              {/* CRT Monitor Screen Glow Effect */}
              <rect x="52" y="34" width="316" height="172" fill="#62c9d9" opacity="0.06" />

              {/* Scanlines Filter */}
              <rect x="50" y="32" width="320" height="176" fill="url(#crtScanlines)" />

              {/* Pixel Face Graphic on Screen */}
              {!blink ? (
                <g fill="#fefae0">
                  {/* Left Eye */}
                  <rect x="126" y="76" width="20" height="16" />
                  <rect x="130" y="70" width="12" height="6" />
                  {/* Right Eye */}
                  <rect x="274" y="76" width="20" height="16" />
                  <rect x="278" y="70" width="12" height="6" />
                </g>
              ) : (
                <g fill="#fefae0">
                  {/* Closed Blinking Eyes */}
                  <rect x="122" y="82" width="28" height="6" />
                  <rect x="270" y="82" width="28" height="6" />
                </g>
              )}

              {/* Pixel Mouth */}
              <rect x="190" y="114" width="40" height="8" fill="#fefae0" />
              <rect x="198" y="122" width="24" height="8" fill="#fefae0" />

              {/* Glowing Terminal Click Hint */}
              <rect x="90" y="168" width="240" height="24" fill="#2a1d34" stroke="#ffd166" strokeWidth="2" />
              <text x="210" y="184" fill="#ffd166" fontSize="6.5" fontFamily={PX} textAnchor="middle">
                [ CLICK TO OPEN TERMINAL ]
              </text>
            </g>
          </g>

          {/* Floating Zzz */}
          <g className="floating-zzz" pointerEvents="none">
            <text x="365" y="30" fill="#fff" fontSize="16" fontFamily={PX} stroke={outline} strokeWidth="2">Z</text>
            <text x="385" y="14" fill="#fff" fontSize="12" fontFamily={PX} stroke={outline} strokeWidth="1.5">z</text>
            <text x="400" y="0" fill="#fff" fontSize="9" fontFamily={PX} stroke={outline} strokeWidth="1">z</text>
          </g>

          {/* Yellow Post-It Sticker (About Me - Clickable) */}
          <g
            id="sticker-group"
            className="retro-interactive-group"
            onClick={(e) => { e.stopPropagation(); onSelectObject('sticker'); }}
            transform="translate(18, -20) rotate(-5)"
          >
            <rect x="-10" y="-15" width="110" height="110" fill="transparent" pointerEvents="all" />
            <g className="retro-hover-lift">
              <rect x="4" y="4" width="88" height="88" fill={outline} opacity="0.3" />
              <rect x="0" y="0" width="88" height="88" fill="#ffd166" stroke={outline} strokeWidth="3" />
              <rect x="24" y="-6" width="40" height="12" fill="#fefae0" stroke={outline} strokeWidth="2" opacity="0.9" />
              <text x="44" y="24" fill={outline} fontSize="6" fontFamily={PX} textAnchor="middle">
                ABOUT
              </text>
              <text x="44" y="36" fill={outline} fontSize="6" fontFamily={PX} textAnchor="middle">
                ME 📌
              </text>
              <rect x="14" y="46" width="60" height="2" fill={outline} />
              <rect x="14" y="54" width="60" height="2" fill={outline} />
              <rect x="14" y="62" width="44" height="2" fill={outline} />
              <rect x="16" y="70" width="56" height="14" fill="#f4a2af" stroke={outline} strokeWidth="2" />
              <text x="44" y="80" fill={outline} fontSize="4.5" fontFamily={PX} textAnchor="middle">
                CLICK HERE
              </text>
            </g>
          </g>
        </g>

        {/* ── 6. STACK OF BOOKS (Projects - Clickable) ── */}
        <g
          id="books-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('books')}
          transform="translate(680, 300)"
        >
          <rect x="-10" y="-20" width="240" height="210" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            {/* Drop Shadow */}
            <rect x="8" y="186" width="215" height="10" fill={outline} opacity="0.3" />

            {/* Book 1 (Bottom, Pink) */}
            <g transform="translate(0, 130)">
              <rect x="0" y="0" width="220" height="44" fill="#f4a2af" stroke={outline} strokeWidth="4" />
              <rect x="0" y="0" width="220" height="4" fill="#fff" opacity="0.4" />
              <rect x="208" y="4" width="12" height="36" fill="#fefae0" stroke={outline} strokeWidth="2" />
              <text x="100" y="27" fill={outline} fontSize="6" fontFamily={PX} textAnchor="middle">
                FULL-STACK APPS
              </text>
            </g>

            {/* Book 2 (Middle, Purple) */}
            <g transform="translate(15, 82)">
              <rect x="0" y="0" width="195" height="40" fill="#b4a3e8" stroke={outline} strokeWidth="4" />
              <rect x="0" y="0" width="195" height="4" fill="#fff" opacity="0.4" />
              <rect x="183" y="4" width="12" height="32" fill="#fefae0" stroke={outline} strokeWidth="2" />
              <text x="90" y="25" fill={outline} fontSize="6" fontFamily={PX} textAnchor="middle">
                PYTHON & FASTAPI
              </text>
            </g>

            {/* Book 3 (Top, Yellow - Click Target Title) */}
            <g transform="translate(28, 40)">
              <rect x="0" y="0" width="170" height="36" fill="#ffd166" stroke={outline} strokeWidth="4" />
              <rect x="0" y="0" width="170" height="4" fill="#fff" opacity="0.5" />
              <rect x="158" y="4" width="12" height="28" fill="#fefae0" stroke={outline} strokeWidth="2" />
              <text x="75" y="23" fill={outline} fontSize="7" fontFamily={PX} textAnchor="middle">
                PROJECTS 📚
              </text>
            </g>

            {/* Mini Pixel Cactus on top of book */}
            <g transform="translate(95, -6)">
              <rect x="10" y="30" width="28" height="18" fill="#bc6c25" stroke={outline} strokeWidth="2" />
              <rect x="18" y="4" width="12" height="30" fill="#68c078" stroke={outline} strokeWidth="2" />
              <rect x="10" y="14" width="8" height="4" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              <rect x="10" y="8" width="4" height="10" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              <rect x="30" y="18" width="8" height="4" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              <rect x="34" y="12" width="4" height="10" fill="#68c078" stroke={outline} strokeWidth="1.5" />
            </g>
          </g>
        </g>

        {/* ── 7. RETRO PHONE (Contacts - Clickable) ── */}
        <g
          id="phone-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('phone')}
          transform="translate(905, 385)"
        >
          <rect x="-20" y="-10" width="180" height="120" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            <rect x="4" y="100" width="148" height="8" fill={outline} opacity="0.3" />

            {/* Base Phone Box */}
            <rect x="0" y="0" width="150" height="98" fill="#ffd166" stroke={outline} strokeWidth="4" />
            <rect x="0" y="0" width="150" height="6" fill="#fff" opacity="0.4" />

            {/* Screen Header */}
            <rect x="14" y="14" width="122" height="26" fill="#f4a2af" stroke={outline} strokeWidth="3" />
            <text x="75" y="31" fill={outline} fontSize="6" fontFamily={PX} textAnchor="middle">
              CONTACTS ☎
            </text>

            {/* Number Pad Buttons (3x2 Grid) */}
            {[
              [24, 48], [58, 48], [92, 48],
              [24, 68], [58, 68], [92, 68]
            ].map(([kx, ky], i) => (
              <g key={i}>
                <rect x={kx} y={ky} width="24" height="14" fill="#fff" stroke={outline} strokeWidth="2" />
                <rect x={kx + 2} y={ky + 2} width="20" height="4" fill="#eee" />
              </g>
            ))}

            {/* Coiled Cord */}
            <rect x="-8" y="20" width="4" height="8" fill={outline} />
            <rect x="-12" y="24" width="4" height="24" fill={outline} />
            <rect x="-8" y="44" width="4" height="8" fill={outline} />
            <rect x="-4" y="48" width="4" height="20" fill={outline} />
          </g>
        </g>

        {/* ── 8. DIPLOMA / CERTIFICATE FRAME (Education - Clickable) ── */}
        <g
          id="university-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('university')}
          transform="translate(830, 45)"
        >
          <rect x="-10" y="-10" width="200" height="160" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            <rect x="6" y="6" width="170" height="130" fill={outline} opacity="0.3" />
            <rect x="0" y="0" width="170" height="130" fill="#d49b63" stroke={outline} strokeWidth="4" />
            <rect x="10" y="10" width="150" height="110" fill="#fefae0" stroke={outline} strokeWidth="2" />

            <text x="85" y="34" fill={outline} fontSize="5" fontFamily={PX} textAnchor="middle">
              ASTANA IT UNIVERSITY
            </text>
            <rect x="35" y="42" width="100" height="2" fill={outline} opacity="0.4" />
            <text x="85" y="62" fill="#6c5ce7" fontSize="4.5" fontFamily={PX} textAnchor="middle">
              B.S. SOFTWARE
            </text>
            <text x="85" y="74" fill="#6c5ce7" fontSize="4.5" fontFamily={PX} textAnchor="middle">
              ENGINEERING
            </text>

            <rect x="70" y="86" width="30" height="18" fill="#ffd166" stroke={outline} strokeWidth="2" />
            <text x="85" y="98" fill={outline} fontSize="4" fontFamily={PX} textAnchor="middle">
              2026
            </text>
          </g>
        </g>

        {/* ── 9. INTERACTIVE DESK LAMP ── */}
        <g id="desk-lamp-group" transform="translate(1065, 230)">
          {/* Base Shadow */}
          <rect x="4" y="256" width="52" height="8" fill={outline} opacity="0.3" />

          {/* Lamp Stand Base */}
          <rect x="10" y="246" width="40" height="14" fill="#ffd166" stroke={outline} strokeWidth="3" />
          <rect x="10" y="246" width="40" height="3" fill="#fff" opacity="0.5" />

          {/* Lamp Vertical & Diagonal Stem */}
          <rect x="28" y="140" width="6" height="106" fill={outline} />
          <rect x="24" y="134" width="14" height="6" fill="#b4a3e8" stroke={outline} strokeWidth="2" />
          <rect x="12" y="95" width="6" height="42" fill={outline} transform="rotate(-18, 14, 115)" />

          {/* Lamp Shade (Clickable to Toggle Light) */}
          <g className="retro-interactive-group" onClick={toggleLamp}>
            <rect x="-14" y="80" width="48" height="24" fill="#f4a2af" stroke={outline} strokeWidth="3.5" />
            <rect x="-14" y="80" width="48" height="4" fill="#fff" opacity="0.5" />
            <rect x="2" y="92" width="16" height="10" fill={lampOn ? '#ffd166' : '#9d8189'} stroke={outline} strokeWidth="2" />
          </g>
        </g>

        {/* ── 9b. LAMP LIGHT CONE OVERLAY (Dynamic when lampOn) ── */}
        {lampOn && (
          <g pointerEvents="none">
            {/* Warm pixel light cone shining over right desk area */}
            <polygon points="1055,310 720,675 1200,675 1120,310" fill="url(#lampLightDither)" />
            <polygon points="1055,310 820,675 1200,675 1100,310" fill="#ffd166" opacity="0.08" />
          </g>
        )}

        {/* ── 9c. CRT MONITOR COLD GLOW OVERLAY (Enhanced when lampOn is OFF) ── */}
        <g pointerEvents="none">
          <circle cx="380" cy="280" r="180" fill="#62c9d9" opacity={lampOn ? '0.04' : '0.12'} />
        </g>

        {/* ── 9d. DARK AMBIENT OVERLAY (When lamp is OFF) ── */}
        {!lampOn && (
          <rect x="0" y="0" width="1200" height="675" fill="#191224" opacity="0.28" pointerEvents="none" />
        )}

        {/* ── 10. 3D ISOMETRIC MECHANICAL KEYBOARD ── */}
        <g id="keyboard-group" transform="translate(340, 495)">
          {/* Aviator Coiled Cable */}
          <rect x="44" y="-30" width="4" height="14" fill={outline} />
          <rect x="34" y="-36" width="14" height="4" fill={outline} />
          <rect x="30" y="-46" width="4" height="14" fill={outline} />
          <rect x="34" y="-50" width="18" height="4" fill={outline} />
          <rect x="44" y="-18" width="14" height="10" fill="#ffd166" stroke={outline} strokeWidth="2" />

          {/* Keyboard Outer Shadow */}
          <rect x="8" y="10" width="470" height="136" fill={outline} opacity="0.35" />

          {/* Custom Aluminum Case (3D Perspective Edges) */}
          <rect x="0" y="0" width="470" height="136" fill="#eddcc8" stroke={outline} strokeWidth="4" />
          <rect x="0" y="0" width="470" height="6" fill="#fff" opacity="0.5" />
          <rect x="0" y="128" width="470" height="8" fill="#cbb49c" />

          {/* Inner Brass Plate */}
          <rect x="10" y="8" width="450" height="120" fill="#d5c3b0" stroke={outline} strokeWidth="3" />

          {/* AITU Metallic Corner Badge */}
          <rect x="426" y="12" width="28" height="13" fill="#ffd166" stroke={outline} strokeWidth="2" />
          <text x="440" y="21" fill={outline} fontSize="5" fontFamily={PX} textAnchor="middle">AITU</text>

          {/* 5-Row Keycaps Grid */}
          {Array.from({ length: 5 }).map((_, row) => (
            <g key={row}>
              {Array.from({ length: 14 }).map((_, col) => {
                if (row === 4 && col >= 3 && col <= 8) return null;

                const active = isKeyActive(row, col);

                let baseFill = '#fefae0';
                if (row === 0 && col === 0) baseFill = '#f4a2af';
                else if (row === 2 && col === 12) baseFill = '#ffd166';
                else if (col === 0 || col === 13 || row === 4) baseFill = '#b4a3e8';

                const keyFill = active ? '#ff4d6d' : baseFill;
                const legendText = KEY_LEGENDS[row]?.[col] || '';

                const kx = 18 + col * 31;
                const ky = (active ? 15 : 13) + row * 22;

                return (
                  <g key={col}>
                    {/* Key Drop Shadow */}
                    <rect x={kx} y={ky + 3} width="27" height="17" fill={outline} />
                    {/* Keycap Body */}
                    <rect x={kx} y={ky} width="27" height="17" fill={keyFill} stroke={outline} strokeWidth="2" />
                    {/* Top Highlight Surface */}
                    <rect x={kx + 2} y={ky + 1} width="23" height="7" fill="#fff" opacity="0.35" />
                    {/* Key Legend Text */}
                    {legendText && (
                      <text
                        x={kx + 13.5}
                        y={ky + 12.5}
                        fill={active ? '#fff' : outline}
                        fontSize={legendText.length > 3 ? '4.5' : (legendText.length > 1 ? '5' : '6.5')}
                        fontFamily={PX}
                        textAnchor="middle"
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

          {/* Dedicated Spacebar */}
          <g>
            <rect
              x="111"
              y={(isSpaceActive ? 103 : 101) + 3}
              width="182"
              height="17"
              fill={outline}
            />
            <rect
              x="111"
              y={isSpaceActive ? 103 : 101}
              width="182"
              height="17"
              fill={isSpaceActive ? '#ff4d6d' : '#a493e6'}
              stroke={outline}
              strokeWidth="3"
            />
            <rect
              x="115"
              y={(isSpaceActive ? 103 : 101) + 2}
              width="174"
              height="6"
              fill="#fff"
              opacity="0.35"
            />
            <text
              x="202"
              y={(isSpaceActive ? 103 : 101) + 12.5}
              fill={isSpaceActive ? '#fff' : outline}
              fontSize="5"
              fontFamily={PX}
              textAnchor="middle"
              letterSpacing="2"
              pointerEvents="none"
            >
              SPACE
            </text>
          </g>
        </g>

        {/* ── 11. 2D CONTOURED MOUSE ── */}
        <g
          id="mouse-group"
          transform={`translate(${850 + mousePos.x}, ${525 + mousePos.y})`}
          style={{ transition: 'transform 0.05s ease-out' }}
        >
          {/* Shadow */}
          <rect x="4" y="54" width="56" height="8" fill={outline} opacity="0.3" />

          {/* Mouse Main Body */}
          <rect x="4" y="8" width="56" height="80" fill="#f4f1de" stroke={outline} strokeWidth="3.5" />
          <rect x="8" y="4" width="48" height="88" fill="#f4f1de" stroke={outline} strokeWidth="3.5" />
          <rect x="8" y="8" width="48" height="80" fill="#f4f1de" />
          <rect x="8" y="4" width="48" height="4" fill="#fff" opacity="0.6" />

          {/* Left Mouse Button */}
          <rect
            x="8" y="8" width="24" height="30"
            fill={leftClick ? '#ff4d6d' : '#fff'}
            stroke={outline} strokeWidth="2"
          />

          {/* Right Mouse Button */}
          <rect
            x="32" y="8" width="24" height="30"
            fill={rightClick ? '#ffd166' : '#fff'}
            stroke={outline} strokeWidth="2"
          />

          {/* Scroll Wheel */}
          <rect x="28" y="14" width="8" height="16" fill="#b4a3e8" stroke={outline} strokeWidth="2" />

          {/* Wire Cord */}
          <rect x="30" y="0" width="4" height="8" fill={outline} />
          <rect x="26" y="-8" width="4" height="12" fill={outline} />
          <rect x="22" y="-16" width="4" height="12" fill={outline} />
          <rect x="26" y="-24" width="4" height="12" fill={outline} />
        </g>
      </svg>
    </div>
  );
}
