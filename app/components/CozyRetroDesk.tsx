'use client';

import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/retroSFX';

export type RetroTarget = 'sticker' | 'monitor' | 'books' | 'phone' | 'university' | null;

interface CozyRetroDeskProps {
  onSelectObject: (target: RetroTarget) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// 1-to-1 Exact Physical Keyboard e.code Mapping
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

  useEffect(() => { sfx.enabled = soundEnabled; }, [soundEnabled]);

  // Periodic eye blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 250);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Keypress listener
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
      const normX = (e.clientX / window.innerWidth - 0.5) * 70;
      const normY = (e.clientY / window.innerHeight - 0.5) * 30;
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

  // Pixel art color palette
  const wallBg = '#f8f1e5';
  const wallAccent = '#efe4d4';
  const deskBg = '#e2b991';
  const deskDark = '#c89460';
  const deskEdge = '#d4a375';
  const outline = '#362840';
  const monitorShell = '#a493e6';
  const monitorInner = '#c0b3f0';
  const screenBg = '#1c1426';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5ebe0', overflow: 'hidden' }}>

      {/* Top Controls Bar */}
      <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 100, display: 'flex', gap: 8 }}>
        <button
          onClick={onToggleSound}
          style={{
            background: soundEnabled ? '#fefae0' : '#f4a2af',
            border: '3px solid #362840',
            borderRadius: 0,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '4px 4px 0px #362840',
            fontFamily: PX,
            fontSize: '0.55rem',
            fontWeight: 400,
            color: '#362840',
          }}
        >
          <span>{soundEnabled ? '♪ SFX ON' : '♪ MUTED'}</span>
        </button>
      </div>

      {/* ── 16-BIT PIXEL ART SVG SCENE ── */}
      <svg
        viewBox="0 0 1200 675"
        style={{ width: '100%', height: '100%', maxHeight: '100vh', objectFit: 'contain', imageRendering: 'auto' }}
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Pixel dither pattern for wall */}
          <pattern id="wallDither" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={wallBg} />
            <rect x="0" y="0" width="4" height="4" fill={wallAccent} opacity="0.5" />
            <rect x="4" y="4" width="4" height="4" fill={wallAccent} opacity="0.5" />
          </pattern>
          {/* Wood grain dither for desk */}
          <pattern id="deskGrain" x="0" y="0" width="12" height="6" patternUnits="userSpaceOnUse">
            <rect width="12" height="6" fill={deskBg} />
            <rect x="0" y="0" width="6" height="2" fill={deskDark} opacity="0.2" />
            <rect x="6" y="3" width="6" height="2" fill={deskDark} opacity="0.15" />
          </pattern>
          {/* CRT scanlines */}
          <pattern id="scanlines" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <rect x="0" y="2" width="4" height="2" fill="#000000" opacity="0.08" />
          </pattern>
        </defs>

        {/* ── 1. BACKGROUND WALL (Pixel Dithered) ── */}
        <rect x="0" y="0" width="1200" height="490" fill="url(#wallDither)" />
        {/* Wall pixel border trim at bottom */}
        <rect x="0" y="484" width="1200" height="6" fill={outline} />

        {/* Wall decorative pixel stripe accents */}
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={i} x={i * 80 + 10} y="0" width="4" height="484" fill={wallAccent} opacity="0.4" />
        ))}

        {/* ── 2. DESK SURFACE (Pixel Wood) ── */}
        <rect x="0" y="490" width="1200" height="185" fill="url(#deskGrain)" />
        <rect x="0" y="490" width="1200" height="185" fill="none" stroke={outline} strokeWidth="4" />
        
        {/* Desk front lip */}
        <rect x="0" y="490" width="1200" height="14" fill={deskEdge} stroke={outline} strokeWidth="3" />

        {/* Pixel wood grain lines */}
        <rect x="40" y="530" width="280" height="2" fill={deskDark} opacity="0.3" />
        <rect x="450" y="558" width="430" height="2" fill={deskDark} opacity="0.25" />
        <rect x="150" y="618" width="530" height="2" fill={deskDark} opacity="0.2" />
        <rect x="780" y="598" width="360" height="2" fill={deskDark} opacity="0.25" />

        {/* ── 3. POTTED PLANT (Pixel Art) ── */}
        <g transform="translate(60, 240)">
          {/* Shadow */}
          <rect x="10" y="248" width="100" height="8" fill="#000" opacity="0.15" />
          
          {/* Pot body - pixel trapezoid via stacked rects */}
          <rect x="24" y="160" width="72" height="88" fill="#c88b83" stroke={outline} strokeWidth="3" />
          <rect x="20" y="160" width="80" height="4" fill="#c88b83" stroke={outline} strokeWidth="3" />
          <rect x="28" y="244" width="64" height="4" fill="#c88b83" stroke={outline} strokeWidth="3" />
          {/* Pot rim */}
          <rect x="16" y="150" width="88" height="14" fill="#e0a098" stroke={outline} strokeWidth="3" />
          
          {/* Pixel leaves - angular diamond shapes */}
          {/* Center tall leaf */}
          <polygon points="56,150 52,80 56,40 60,80" fill="#68c078" stroke={outline} strokeWidth="3" />
          {/* Left leaf */}
          <polygon points="56,150 40,110 20,60 45,100" fill="#52b788" stroke={outline} strokeWidth="3" />
          {/* Right leaf */}
          <polygon points="56,150 72,110 96,55 70,95" fill="#74c69d" stroke={outline} strokeWidth="3" />
          {/* Far left small leaf */}
          <polygon points="56,150 30,120 8,100 35,125" fill="#40916c" stroke={outline} strokeWidth="3" />
          {/* Far right small leaf */}
          <polygon points="56,150 80,125 108,110 78,130" fill="#95d5b2" stroke={outline} strokeWidth="3" />
        </g>

        {/* ── 4. SNORLAX GIF ── */}
        <image
          href="snorlax.gif"
          x="0"
          y="490"
          width="120"
          height="185"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* ── 5. CRT COMPUTER MONITOR (Pixel Art) ── */}
        <g id="computer-group" transform="translate(180, 170)">
          {/* Shadow */}
          <rect x="15" y="322" width="390" height="10" fill="#000" opacity="0.2" />

          {/* Floppy drive unit */}
          <rect x="25" y="240" width="370" height="80" fill="#eddcc8" stroke={outline} strokeWidth="4" />
          {/* Floppy slot */}
          <rect x="230" y="275" width="130" height="10" fill={outline} />
          <rect x="230" y="255" width="60" height="8" fill="#d8c5b0" stroke={outline} strokeWidth="2" />
          {/* Power LED */}
          <rect x="354" y="254" width="12" height="12" fill="#f4a2af" stroke={outline} strokeWidth="2" />
          {/* Vent slits */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={50 + i * 22} y="258" width="4" height="44" fill={outline} />
          ))}

          {/* CRT Monitor - CLICKABLE */}
          <g
            id="monitor-clickable"
            className="retro-interactive-group"
            onClick={() => onSelectObject('monitor')}
          >
            <rect x="10" y="0" width="400" height="240" fill="transparent" pointerEvents="all" />

            <g className="retro-hover-lift">
              {/* Monitor shell */}
              <rect x="10" y="0" width="400" height="240" fill={monitorShell} stroke={outline} strokeWidth="4" />
              {/* Inner bezel */}
              <rect x="30" y="18" width="360" height="204" fill={monitorInner} stroke={outline} strokeWidth="3" />
              {/* Screen */}
              <rect x="50" y="32" width="320" height="176" fill={screenBg} stroke={outline} strokeWidth="4" />
              {/* Scanlines overlay */}
              <rect x="50" y="32" width="320" height="176" fill="url(#scanlines)" />

              {/* Pixel face on screen */}
              {!blink ? (
                <g fill="#ffffff">
                  {/* Left eye */}
                  <rect x="130" y="80" width="8" height="8" />
                  <rect x="138" y="80" width="8" height="8" />
                  <rect x="134" y="72" width="8" height="8" />
                  {/* Right eye */}
                  <rect x="260" y="80" width="8" height="8" />
                  <rect x="268" y="80" width="8" height="8" />
                  <rect x="264" y="72" width="8" height="8" />
                </g>
              ) : (
                <g fill="#ffffff">
                  {/* Closed eyes - horizontal lines */}
                  <rect x="128" y="84" width="20" height="4" />
                  <rect x="258" y="84" width="20" height="4" />
                </g>
              )}

              {/* Pixel mouth */}
              <rect x="186" y="118" width="8" height="8" fill="#fff" />
              <rect x="194" y="126" width="24" height="8" fill="#fff" />
              <rect x="218" y="118" width="8" height="8" fill="#fff" />

              {/* "CLICK TO OPEN" label */}
              <text x="210" y="182" fill="#a493e6" fontSize="7" fontWeight="400" textAnchor="middle" fontFamily={PX}>
                [ CLICK TO OPEN ]
              </text>
            </g>
          </g>

          {/* Floating Zzz (pixel) */}
          <g className="floating-zzz" pointerEvents="none">
            <text x="360" y="35" fill="#fff" fontSize="18" fontWeight="400" fontFamily={PX} stroke={outline} strokeWidth="2">Z</text>
            <text x="380" y="18" fill="#fff" fontSize="14" fontWeight="400" fontFamily={PX} stroke={outline} strokeWidth="1.5">z</text>
            <text x="396" y="4" fill="#fff" fontSize="10" fontWeight="400" fontFamily={PX} stroke={outline} strokeWidth="1">z</text>
          </g>

          {/* 🟡 YELLOW POST-IT STICKER (About Me) */}
          <g
            id="sticker-group"
            className="retro-interactive-group"
            onClick={(e) => { e.stopPropagation(); onSelectObject('sticker'); }}
            transform="translate(20, -18) rotate(-6)"
          >
            <rect x="-10" y="-15" width="110" height="110" fill="transparent" pointerEvents="all" />
            <g className="retro-hover-lift">
              {/* Shadow */}
              <rect x="4" y="4" width="88" height="88" fill="#000" opacity="0.2" />
              {/* Sticker body */}
              <rect x="0" y="0" width="88" height="88" fill="#ffd166" stroke={outline} strokeWidth="3" />
              {/* Tape strip */}
              <rect x="24" y="-6" width="40" height="12" fill="#fefae0" stroke={outline} strokeWidth="2" opacity="0.9" />
              {/* Text */}
              <text x="44" y="24" fill={outline} fontSize="6" fontWeight="400" textAnchor="middle" fontFamily={PX}>
                ABOUT
              </text>
              <text x="44" y="36" fill={outline} fontSize="6" fontWeight="400" textAnchor="middle" fontFamily={PX}>
                ME
              </text>
              {/* Pixel dashed lines */}
              <rect x="14" y="46" width="60" height="2" fill={outline} />
              <rect x="14" y="54" width="60" height="2" fill={outline} />
              <rect x="14" y="62" width="44" height="2" fill={outline} />
              {/* Click badge */}
              <rect x="16" y="70" width="56" height="14" fill="#f4a2af" stroke={outline} strokeWidth="2" />
              <text x="44" y="80" fill={outline} fontSize="5" fontWeight="400" textAnchor="middle" fontFamily={PX}>
                CLICK
              </text>
            </g>
          </g>
        </g>

        {/* ── 6. STACK OF BOOKS (Projects) ── */}
        <g
          id="books-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('books')}
          transform="translate(680, 310)"
        >
          <rect x="-10" y="-20" width="240" height="210" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            {/* Shadow */}
            <rect x="8" y="176" width="215" height="8" fill="#000" opacity="0.15" />

            {/* Book 1 (bottom, widest) - Pink */}
            <g transform="translate(0, 120)">
              <rect x="0" y="0" width="220" height="42" fill="#f4a2af" stroke={outline} strokeWidth="4" />
              <rect x="210" y="4" width="10" height="34" fill="#fff" stroke={outline} strokeWidth="2" />
              <rect x="24" y="20" width="150" height="3" fill={outline} />
            </g>

            {/* Book 2 (middle) - Purple */}
            <g transform="translate(15, 75)">
              <rect x="0" y="0" width="195" height="38" fill="#b4a3e8" stroke={outline} strokeWidth="4" />
              <rect x="185" y="4" width="10" height="30" fill="#fff" stroke={outline} strokeWidth="2" />
              <rect x="20" y="18" width="130" height="3" fill={outline} />
            </g>

            {/* Book 3 (top, narrowest) - Yellow */}
            <g transform="translate(28, 35)">
              <rect x="0" y="0" width="170" height="34" fill="#ffd166" stroke={outline} strokeWidth="4" />
              <rect x="160" y="4" width="10" height="26" fill="#fff" stroke={outline} strokeWidth="2" />
              <text x="75" y="22" fill={outline} fontSize="7" fontWeight="400" textAnchor="middle" fontFamily={PX}>
                PROJECTS
              </text>
            </g>

            {/* Pixel cactus on top of books */}
            <g transform="translate(95, -10)">
              {/* Pot */}
              <rect x="10" y="30" width="28" height="16" fill="#9d8189" stroke={outline} strokeWidth="2" />
              {/* Cactus body */}
              <rect x="18" y="6" width="12" height="28" fill="#68c078" stroke={outline} strokeWidth="2" />
              {/* Left arm */}
              <rect x="10" y="14" width="8" height="4" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              <rect x="10" y="8" width="4" height="10" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              {/* Right arm */}
              <rect x="30" y="18" width="8" height="4" fill="#68c078" stroke={outline} strokeWidth="1.5" />
              <rect x="34" y="12" width="4" height="10" fill="#68c078" stroke={outline} strokeWidth="1.5" />
            </g>
          </g>
        </g>

        {/* ── 7. PIXEL PHONE (Contacts) ── */}
        <g
          id="phone-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('phone')}
          transform="translate(900, 390)"
        >
          <rect x="-20" y="-10" width="180" height="120" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            {/* Shadow */}
            <rect x="4" y="98" width="148" height="6" fill="#000" opacity="0.15" />

            {/* Phone body */}
            <rect x="0" y="0" width="150" height="95" fill="#ffd166" stroke={outline} strokeWidth="4" />
            
            {/* Screen */}
            <rect x="14" y="14" width="122" height="24" fill="#f4a2af" stroke={outline} strokeWidth="3" />
            <text x="75" y="30" fill={outline} fontSize="6" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              CONTACTS
            </text>

            {/* Pixel number pad (3x2 grid) */}
            {[
              [24, 48], [58, 48], [92, 48],
              [24, 68], [58, 68], [92, 68]
            ].map(([kx, ky], i) => (
              <rect key={i} x={kx} y={ky} width="24" height="14" fill="#fff" stroke={outline} strokeWidth="2" />
            ))}

            {/* Pixel phone cord */}
            <rect x="-8" y="20" width="4" height="8" fill={outline} />
            <rect x="-12" y="24" width="4" height="24" fill={outline} />
            <rect x="-8" y="44" width="4" height="8" fill={outline} />
            <rect x="-4" y="48" width="4" height="20" fill={outline} />
          </g>
        </g>

        {/* ── 8. PIXEL DESK LAMP ── */}
        <g id="desk-lamp-group" transform="translate(1075, 250)">
          {/* Shadow */}
          <rect x="4" y="236" width="52" height="6" fill="#000" opacity="0.2" />
          {/* Base */}
          <rect x="10" y="230" width="40" height="10" fill="#ffd166" stroke={outline} strokeWidth="3" />
          {/* Arm - pixel angular segments */}
          <rect x="28" y="140" width="4" height="92" fill={outline} />
          <rect x="24" y="136" width="12" height="4" fill="#b4a3e8" stroke={outline} strokeWidth="2" />
          {/* Diagonal arm */}
          <rect x="12" y="100" width="4" height="40" fill={outline} transform="rotate(-15, 14, 120)" />
          {/* Lamp shade */}
          <rect x="-8" y="86" width="40" height="20" fill="#f4a2af" stroke={outline} strokeWidth="3" />
          {/* Bulb */}
          <rect x="6" y="96" width="12" height="8" fill="#fefae0" stroke={outline} strokeWidth="2" />
        </g>

        {/* ── 9. WALL DIPLOMA FRAME (University) ── */}
        <g
          id="university-group"
          className="retro-interactive-group"
          onClick={() => onSelectObject('university')}
          transform="translate(830, 60)"
        >
          <rect x="-10" y="-10" width="200" height="160" fill="transparent" pointerEvents="all" />

          <g className="retro-hover-lift">
            {/* Frame shadow */}
            <rect x="6" y="6" width="170" height="130" fill="#000" opacity="0.15" />
            {/* Outer frame */}
            <rect x="0" y="0" width="170" height="130" fill="#d4a375" stroke={outline} strokeWidth="4" />
            {/* Inner mat */}
            <rect x="12" y="12" width="146" height="106" fill="#fefae0" stroke={outline} strokeWidth="2" />
            {/* Diploma content */}
            <text x="85" y="38" fill={outline} fontSize="5" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              ASTANA IT
            </text>
            <text x="85" y="52" fill={outline} fontSize="5" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              UNIVERSITY
            </text>
            <rect x="35" y="60" width="100" height="2" fill={outline} opacity="0.3" />
            <text x="85" y="76" fill="#6c5ce7" fontSize="4" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              B.S. SOFTWARE
            </text>
            <text x="85" y="88" fill="#6c5ce7" fontSize="4" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              ENGINEERING
            </text>
            {/* Gold seal */}
            <rect x="70" y="96" width="30" height="16" fill="#ffd166" stroke={outline} strokeWidth="2" />
            <text x="85" y="108" fill={outline} fontSize="4" fontWeight="400" textAnchor="middle" fontFamily={PX}>
              2026
            </text>
          </g>
        </g>

        {/* ── 10. PIXEL MECHANICAL KEYBOARD ── */}
        <g id="keyboard-group" transform="translate(340, 498)">
          {/* Pixel coiled cable */}
          <rect x="44" y="-30" width="4" height="14" fill={outline} />
          <rect x="36" y="-36" width="12" height="4" fill={outline} />
          <rect x="32" y="-44" width="4" height="12" fill={outline} />
          <rect x="36" y="-48" width="16" height="4" fill={outline} />
          {/* Aviator connector */}
          <rect x="44" y="-18" width="14" height="10" fill="#ffd166" stroke={outline} strokeWidth="2" />

          {/* Keyboard shadow */}
          <rect x="8" y="8" width="470" height="136" fill="#000" opacity="0.2" />

          {/* Keyboard case */}
          <rect x="0" y="0" width="470" height="136" fill="#eddcc8" stroke={outline} strokeWidth="4" />

          {/* Inner plate */}
          <rect x="10" y="8" width="450" height="120" fill="#d5c3b0" stroke={outline} strokeWidth="3" />

          {/* Brand badge */}
          <rect x="428" y="12" width="26" height="12" fill="#ffd166" stroke={outline} strokeWidth="2" />
          <text x="441" y="21" fill={outline} fontSize="5" fontWeight="400" textAnchor="middle" fontFamily={PX}>AITU</text>

          {/* Keycaps grid */}
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
                    {/* Key shadow */}
                    <rect x={kx} y={ky + 2} width="27" height="18" fill={outline} />
                    {/* Key top */}
                    <rect x={kx} y={ky} width="27" height="18" fill={keyFill} stroke={outline} strokeWidth="2" />
                    {/* Key highlight */}
                    <rect x={kx + 2} y={ky + 1} width="23" height="8" fill="rgba(255,255,255,0.3)" />
                    {/* Legend */}
                    {legendText && (
                      <text
                        x={kx + 13.5}
                        y={ky + 13}
                        fill={active ? '#fff' : outline}
                        fontSize={legendText.length > 3 ? '4.5' : (legendText.length > 1 ? '5' : '6.5')}
                        fontWeight="400"
                        textAnchor="middle"
                        fontFamily={PX}
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

          {/* Spacebar */}
          <g>
            <rect
              x="111"
              y={(isSpaceActive ? 103 : 101) + 2}
              width="182"
              height="18"
              fill={outline}
            />
            <rect
              x="111"
              y={isSpaceActive ? 103 : 101}
              width="182"
              height="18"
              fill={isSpaceActive ? '#ff4d6d' : '#a493e6'}
              stroke={outline}
              strokeWidth="3"
            />
            <rect
              x="115"
              y={(isSpaceActive ? 103 : 101) + 2}
              width="174"
              height="7"
              fill="rgba(255,255,255,0.3)"
            />
            <text
              x="202"
              y={(isSpaceActive ? 103 : 101) + 13}
              fill={isSpaceActive ? '#fff' : outline}
              fontSize="5"
              fontWeight="400"
              textAnchor="middle"
              fontFamily={PX}
              letterSpacing="2"
              pointerEvents="none"
            >
              SPACE
            </text>
          </g>
        </g>

        {/* ── 11. PIXEL MOUSE ── */}
        <g
          id="mouse-group"
          transform={`translate(${850 + mousePos.x}, ${530 + mousePos.y})`}
          style={{ transition: 'transform 0.05s ease-out' }}
        >
          {/* Shadow */}
          <rect x="4" y="52" width="56" height="6" fill="#000" opacity="0.15" />

          {/* Mouse body - pixel rounded shape via stacked rects */}
          <rect x="4" y="8" width="56" height="80" fill="#f4f1de" stroke={outline} strokeWidth="3" />
          <rect x="8" y="4" width="48" height="88" fill="#f4f1de" stroke={outline} strokeWidth="3" />
          
          {/* Clean up overlapping fills */}
          <rect x="8" y="8" width="48" height="80" fill="#f4f1de" />

          {/* Left button */}
          <rect
            x="8" y="8" width="24" height="30"
            fill={leftClick ? '#ff4d6d' : '#fff'}
            stroke={outline} strokeWidth="2"
            style={{ transition: 'fill 0.05s' }}
          />

          {/* Right button */}
          <rect
            x="32" y="8" width="24" height="30"
            fill={rightClick ? '#ffd166' : '#fff'}
            stroke={outline} strokeWidth="2"
            style={{ transition: 'fill 0.05s' }}
          />

          {/* Scroll wheel */}
          <rect x="28" y="14" width="8" height="16" fill="#b4a3e8" stroke={outline} strokeWidth="2" />

          {/* Divider line */}
          <rect x="30" y="8" width="4" height="30" fill={outline} />

          {/* Mouse cord (pixel) */}
          <rect x="30" y="0" width="4" height="8" fill={outline} />
          <rect x="26" y="-8" width="4" height="12" fill={outline} />
          <rect x="22" y="-16" width="4" height="12" fill={outline} />
          <rect x="26" y="-24" width="4" height="12" fill={outline} />
        </g>

      </svg>
    </div>
  );
}
