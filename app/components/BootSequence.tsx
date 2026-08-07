'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: '> booting workspace...', delay: 300 },
  { text: '> checking environment... [OK]', delay: 550 },
  { text: '> loading projects & modules... [OK]', delay: 850 },
  { text: '> mounting workspace... [OK]', delay: 1100 },
  { text: '> initializing personality... [OK]', delay: 1350 },
  { text: '> starting portfolio...', delay: 1600 },
];

const TOTAL_DURATION = 2500; // ms — total boot sequence
const FADE_START = 2000; // ms — when fade-out begins
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

    // Show "workspace ready" at 1800ms
    const readyTimer = setTimeout(() => setShowReady(true), 1800);

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

  if (!shouldRender) return null;

  // Build the ASCII progress bar
  const filled = Math.round((progress / 100) * 20);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#0a0c14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        overflow: 'hidden',
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? 'scale(1.05)' : 'scale(1)',
        transition: `opacity ${FADE_DURATION}ms ease-out, transform ${FADE_DURATION}ms ease-out`,
        pointerEvents: fadingOut ? 'none' : 'auto',
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
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Subtle CRT vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Terminal content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 520,
          width: '90%',
          padding: '0 20px',
        }}
      >
        {/* Prompt header */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ color: '#F2C14E', fontWeight: 'bold', fontSize: '0.95rem' }}>
            nurgissa@workshop
          </span>
          <span style={{ color: '#666' }}>:</span>
          <span style={{ color: '#62C9D9' }}>~</span>
          <span style={{ color: '#E8E3ED' }}>$ </span>
          <span style={{ color: '#E8E3ED' }}>boot</span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: '1em',
              background: visibleLines === 0 ? '#F2C14E' : 'transparent',
              verticalAlign: 'text-bottom',
              marginLeft: 3,
              animation: visibleLines === 0 ? 'bootCursorBlink 0.8s step-end infinite' : 'none',
            }}
          />
        </div>

        {/* Boot lines */}
        <div style={{ fontSize: '0.82rem', lineHeight: 1.8 }}>
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

        {/* Progress bar — shows after first line */}
        {visibleLines > 0 && (
          <div
            style={{
              marginTop: 16,
              fontSize: '0.8rem',
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

        {/* "workspace ready." — final green message */}
        {showReady && (
          <div
            style={{
              marginTop: 14,
              fontSize: '0.88rem',
              fontWeight: 'bold',
              color: '#63C174',
              opacity: 0,
              animation: 'bootLineIn 0.3s ease-out forwards',
            }}
          >
            {'> '}workspace ready.
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
