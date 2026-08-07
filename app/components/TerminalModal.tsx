'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../utils/retroSFX';

interface TerminalModalProps {
  onClose: () => void;
}

// Each "scene" = prompt types the command, then the response appears
const TERMINAL_SCRIPT = [
  {
    command: 'whoami',
    response: 'Nurgissa Zhetkizgen — Full-Stack Developer',
    responseColor: '#00f5d4',
  },
  {
    command: 'cat skills.txt',
    response: 'Python · FastAPI · React · Next.js · TypeScript · PostgreSQL · Docker · Git',
    responseColor: '#ffd166',
  },
  {
    command: 'cat education.txt',
    response: 'Astana IT University — B.S. Software Engineering (2023–2026)',
    responseColor: '#b4a3e8',
  },
  {
    command: 'cat contact.txt',
    response: 'Telegram: @trulondoner  |  GitHub: nurgissa-dev  |  Email: sholak0@mail.ru',
    responseColor: '#f4a2af',
  },
  {
    command: 'echo "Available for hire 🚀"',
    response: 'Available for hire 🚀',
    responseColor: '#68c078',
  },
];

type LineType =
  | { kind: 'typing'; partial: string; cmdIdx: number }
  | { kind: 'done'; cmd: string; response: string; responseColor: string }
  | { kind: 'idle' };

export default function TerminalModal({ onClose }: TerminalModalProps) {
  // completedLines = fully typed commands+responses shown above current
  const [completedLines, setCompletedLines] = useState<{ cmd: string; response: string; responseColor: string }[]>([]);
  // current typing state
  const [currentTyped, setCurrentTyped] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'responding' | 'pausing' | 'done'>('typing');
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sound duration ~2s → typing should finish slightly before it ends
  const TYPING_SOUND_DURATION = 1800; // ms — effective typing window from the 2s sound
  const RESPONSE_DELAY = 250; // ms pause before response appears
  const NEXT_CMD_DELAY = 700; // ms pause before next command starts

  // Preload typing audio element once on mount
  useEffect(() => {
    // Detect audioUrl basePath
    let url = '/typing.mp3';
    if (typeof document !== 'undefined') {
      try {
        const base = new URL(document.baseURI);
        const path = base.pathname.replace(/\/+$/, '');
        if (path) url = `${path}/typing.mp3`;
      } catch { /* fallback */ }
    }
    const audio = new Audio(url);
    audio.volume = 0.5;
    typingAudioRef.current = audio;
  }, []);

  // Cursor blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Main typing state machine
  useEffect(() => {
    if (currentIdx >= TERMINAL_SCRIPT.length) {
      setPhase('done');
      return;
    }

    const item = TERMINAL_SCRIPT[currentIdx];
    const fullText = item.command;
    const charDelay = TYPING_SOUND_DURATION / Math.max(fullText.length, 1);

    if (phase === 'typing') {
      // Play real typing audio loop when starting typing
      if (currentTyped.length === 0 && typingAudioRef.current && sfx.enabled) {
        typingAudioRef.current.currentTime = 0;
        typingAudioRef.current.play().catch(() => {});
      }

      if (currentTyped.length < fullText.length) {
        const timer = setTimeout(() => {
          setCurrentTyped(fullText.slice(0, currentTyped.length + 1));
        }, charDelay);
        return () => clearTimeout(timer);
      } else {
        // Finished typing this command → pause briefly then show response
        setPhase('responding');
      }
    }

    if (phase === 'responding') {
      const timer = setTimeout(() => {
        setCompletedLines(prev => [
          ...prev,
          { cmd: item.command, response: item.response, responseColor: item.responseColor },
        ]);
        setCurrentTyped('');
        setPhase('pausing');
      }, RESPONSE_DELAY);
      return () => clearTimeout(timer);
    }

    if (phase === 'pausing') {
      const timer = setTimeout(() => {
        setCurrentIdx(i => i + 1);
        setPhase('typing');
      }, NEXT_CMD_DELAY);
      return () => clearTimeout(timer);
    }
  }, [phase, currentTyped, currentIdx]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [completedLines, currentTyped, phase]);

  const promptColor = '#a493e6';
  const accentColor = '#a493e6';

  return (
    <div className="retro-modal-overlay" onClick={onClose}>
      <div
        className="retro-card"
        style={{
          background: '#1c1426',
          color: '#ffffff',
          border: `3.5px solid ${accentColor}`,
          boxShadow: '6px 8px 0px #1a1028',
          maxWidth: 640,
          width: '100%',
          padding: 0,
          borderRadius: 14,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Terminal title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#2a2038',
          borderBottom: `2px solid ${accentColor}22`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f4a2af' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffd166' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#68c078' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 'bold', fontFamily: 'monospace', color: accentColor, letterSpacing: 1.5 }}>
              nurgissa@workshop: ~
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f4a2af',
              border: '2px solid #ffffff',
              borderRadius: '50%',
              width: 26,
              height: 26,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#362840',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          style={{
            padding: '16px 18px',
            fontFamily: 'monospace',
            fontSize: '0.88rem',
            lineHeight: 1.85,
            minHeight: 260,
            maxHeight: 340,
            overflowY: 'auto',
            background: '#1c1426',
          }}
        >
          {/* Completed lines */}
          {completedLines.map((line, i) => (
            <div key={i}>
              <div>
                <span style={{ color: '#ffd166' }}>nurgissa@workshop</span>
                <span style={{ color: '#aaaaaa' }}>:</span>
                <span style={{ color: '#58A6FF' }}>~</span>
                <span style={{ color: '#ffffff' }}>$ </span>
                <span style={{ color: '#ffffff' }}>{line.cmd}</span>
              </div>
              <div style={{ color: line.responseColor, paddingLeft: 14, marginBottom: 6, opacity: 0.95 }}>
                {line.response}
              </div>
            </div>
          ))}

          {/* Currently typing line */}
          {phase !== 'done' && currentIdx < TERMINAL_SCRIPT.length && (
            <div>
              <span style={{ color: '#ffd166' }}>nurgissa@workshop</span>
              <span style={{ color: '#aaaaaa' }}>:</span>
              <span style={{ color: '#58A6FF' }}>~</span>
              <span style={{ color: '#ffffff' }}>$ </span>
              <span style={{ color: '#ffffff' }}>{currentTyped}</span>
              <span style={{
                display: 'inline-block',
                width: 9,
                height: '1em',
                background: cursorVisible ? promptColor : 'transparent',
                verticalAlign: 'text-bottom',
                marginLeft: 1,
                transition: 'background 0.1s',
              }} />
            </div>
          )}

          {/* Idle cursor after all done */}
          {phase === 'done' && (
            <div>
              <span style={{ color: '#ffd166' }}>nurgissa@workshop</span>
              <span style={{ color: '#aaaaaa' }}>:</span>
              <span style={{ color: '#58A6FF' }}>~</span>
              <span style={{ color: '#ffffff' }}>$ </span>
              <span style={{
                display: 'inline-block',
                width: 9,
                height: '1em',
                background: cursorVisible ? promptColor : 'transparent',
                verticalAlign: 'text-bottom',
                marginLeft: 1,
              }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          background: '#2a2038',
          borderTop: `2px solid ${accentColor}22`,
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#555e6e' }}>
            🖥 CRT TERMINAL v1.0 — READ ONLY MODE
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: accentColor,
              border: '2.5px solid #ffffff',
              borderRadius: 6,
              fontWeight: 'bold',
              color: '#1c1426',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
