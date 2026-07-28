'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../utils/retroSFX';

interface TerminalModalProps {
  isDarkMode: boolean;
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

export default function TerminalModal({ isDarkMode, onClose }: TerminalModalProps) {
  // completedLines = fully typed commands+responses shown above current
  const [completedLines, setCompletedLines] = useState<{ cmd: string; response: string; responseColor: string }[]>([]);
  // current typing state
  const [currentTyped, setCurrentTyped] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'responding' | 'pausing' | 'done'>('typing');
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const CHAR_DELAY = 60;   // ms per character when typing command
  const RESPONSE_DELAY = 250; // ms pause before response appears
  const NEXT_CMD_DELAY = 700; // ms pause before next command starts

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Typewriter engine
  useEffect(() => {
    if (currentIdx >= TERMINAL_SCRIPT.length) {
      setPhase('done');
      return;
    }

    const script = TERMINAL_SCRIPT[currentIdx];

    if (phase === 'typing') {
      if (currentTyped.length < script.command.length) {
        const id = setTimeout(() => {
          setCurrentTyped(prev => script.command.slice(0, prev.length + 1));
          sfx.playKeyClick(); // 🔊 clack on each typed character
        }, CHAR_DELAY);
        return () => clearTimeout(id);
      } else {
        // Full command typed — pause then show response
        const id = setTimeout(() => setPhase('responding'), RESPONSE_DELAY);
        return () => clearTimeout(id);
      }
    }

    if (phase === 'responding') {
      // Move to completed, start pause before next
      setCompletedLines(prev => [
        ...prev,
        { cmd: script.command, response: script.response, responseColor: script.responseColor },
      ]);
      setCurrentTyped('');
      setPhase('pausing');
    }

    if (phase === 'pausing') {
      const id = setTimeout(() => {
        setCurrentIdx(i => i + 1);
        setPhase('typing');
      }, NEXT_CMD_DELAY);
      return () => clearTimeout(id);
    }
  }, [phase, currentTyped, currentIdx]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [completedLines, currentTyped, phase]);

  const promptColor = isDarkMode ? '#00f5d4' : '#a493e6';
  const accentColor = isDarkMode ? '#00f5d4' : '#a493e6';

  return (
    <div className="retro-modal-overlay" onClick={onClose}>
      <div
        className="retro-card"
        style={{
          background: isDarkMode ? '#0d1117' : '#1c1426',
          color: '#ffffff',
          border: `3.5px solid ${accentColor}`,
          boxShadow: `6px 8px 0px ${isDarkMode ? '#001a14' : '#1a1028'}`,
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
          background: isDarkMode ? '#161b22' : '#2a2038',
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
            background: isDarkMode ? '#0d1117' : '#1c1426',
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
          background: isDarkMode ? '#161b22' : '#2a2038',
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
              border: '2px solid #ffffff',
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
