'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: '> INITIALIZING WORKSPACE ENVIRONMENT...', delay: 250 },
  { text: '> CHECKING FASTAPI & NEXT.JS SYSTEM MODULES... [OK]', delay: 500 },
  { text: '> LOADING PROJECTS & SKILLS DATABASE... [OK]', delay: 750 },
  { text: '> MOUNTING 16-BIT RETRO WORKSTATION... [OK]', delay: 1000 },
  { text: '> INITIALIZING PERSONALITY ENGINE... [OK]', delay: 1250 },
  { text: '> STARTING CRT MONITOR & AUDIO SFX...', delay: 1500 },
];

const TOTAL_DURATION = 2600; // ms — total boot sequence
const FADE_START = 2100; // ms — when fade-out begins
const FADE_DURATION = 500; // ms — fade-out transition length

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Check sessionStorage — skip boot if already seen this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('nurgissa_boot_seen');
      if (seen === 'true') {
        setShouldRender(false);
        onComplete();
        return;
      }
    }
  }, [onComplete]);

  // Progress bar animation loop
  const animateProgress = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const pct = Math.min(100, (elapsed / FADE_START) * 100);
    setProgress(Math.round(pct));

    if (elapsed < TOTAL_DURATION) {
      rafRef.current = requestAnimationFrame(animateProgress);
    }
  }, []);

  // Main boot sequence orchestration
  useEffect(() => {
    if (!shouldRender) return;

    // Start progress animation
    rafRef.current = requestAnimationFrame(animateProgress);

    // Schedule each boot line appearance
    const lineTimers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );

    // Show "workspace ready" at 1750ms
    const readyTimer = setTimeout(() => setShowReady(true), 1750);

    // Start fade-out at FADE_START
    const fadeTimer = setTimeout(() => setFadingOut(true), FADE_START);

    // Complete — mark as seen, call onComplete
    const completeTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nurgissa_boot_seen', 'true');
      }
      setShouldRender(false);
      onComplete();
    }, TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lineTimers.forEach(clearTimeout);
      clearTimeout(readyTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [shouldRender, animateProgress, onComplete]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nurgissa_boot_seen', 'true');
    }
    setFadingOut(true);
    setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 200);
  };

  if (!shouldRender) return null;

  // Build the ASCII progress bar
  const filled = Math.round((progress / 100) * 20);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#140e1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Press Start 2P', monospace",
        overflow: 'hidden',
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? 'scale(1.04)' : 'scale(1)',
        transition: `opacity ${FADE_DURATION}ms ease-out, transform ${FADE_DURATION}ms ease-out`,
        pointerEvents: fadingOut ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* CRT Scanlines overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* CRT Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Terminal Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 580,
          width: '92%',
          padding: '0 20px',
        }}
      >
        {/* BIOS Header */}
        <div style={{ marginBottom: 20, color: '#9d8189', fontSize: '0.45rem', lineHeight: 1.8 }}>
          NURGISSA WORKSHOP BIOS v1.0 (C) 2026<br />
          SOFTWARE ENGINEERING WORKSTATION · ASTANA IT<br />
          MEMORY TEST: 640KB OK
        </div>

        {/* Prompt Header */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#F2C14E', fontSize: '0.55rem' }}>
            nurgissa@workshop
          </span>
          <span style={{ color: '#666', fontSize: '0.55rem' }}>:</span>
          <span style={{ color: '#62C9D9', fontSize: '0.55rem' }}>~</span>
          <span style={{ color: '#E8E3ED', fontSize: '0.55rem' }}>$ </span>
          <span style={{ color: '#E8E3ED', fontSize: '0.55rem' }}>boot --system</span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: '1em',
              background: visibleLines === 0 ? '#F2C14E' : 'transparent',
              verticalAlign: 'text-bottom',
              marginLeft: 4,
              animation: visibleLines === 0 ? 'bootCursorBlink 0.8s step-end infinite' : 'none',
            }}
          />
        </div>

        {/* Boot Lines */}
        <div style={{ fontSize: '0.42rem', lineHeight: 2.3 }}>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
            const isOK = line.text.includes('[OK]');
            const parts = isOK ? line.text.split('[OK]') : [line.text];
            return (
              <div
                key={i}
                style={{
                  color: '#E8E3ED',
                  opacity: 0,
                  animation: 'bootLineIn 0.2s ease-out forwards',
                }}
              >
                {parts[0]}
                {isOK && <span style={{ color: '#63C174', fontWeight: 'bold' }}>[OK]</span>}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {visibleLines > 0 && (
          <div
            style={{
              marginTop: 16,
              fontSize: '0.45rem',
              color: '#F2C14E',
              opacity: 0,
              animation: 'bootLineIn 0.3s ease-out 0.1s forwards',
            }}
          >
            <span style={{ color: '#666' }}>[</span>
            <span style={{ color: '#F2C14E', letterSpacing: '0.5px' }}>{bar}</span>
            <span style={{ color: '#666' }}>]</span>
            <span style={{ color: '#E8E3ED', marginLeft: 10 }}>{progress}%</span>
          </div>
        )}

        {/* WORKSPACE READY */}
        {showReady && (
          <div
            style={{
              marginTop: 16,
              fontSize: '0.5rem',
              fontWeight: 'bold',
              color: '#63C174',
              opacity: 0,
              animation: 'bootLineIn 0.3s ease-out forwards',
            }}
          >
            {'> '}WORKSPACE READY. CLICK TO ENTER.
          </div>
        )}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes bootCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes bootLineIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
