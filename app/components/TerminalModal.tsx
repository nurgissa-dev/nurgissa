'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../utils/retroSFX';

interface TerminalModalProps {
  onClose: () => void;
}

const TERMINAL_SCRIPT = [
  {
    command: 'whoami',
    type: 'whoami',
  },
  {
    command: 'cat skills.txt',
    type: 'skills',
  },
  {
    command: 'cat education.txt',
    type: 'edu',
  },
  {
    command: 'cat contact.txt',
    type: 'contact',
  },
  {
    command: 'echo "Available for hire 🚀"',
    type: 'hire',
  },
];

export default function TerminalModal({ onClose }: TerminalModalProps) {
  const [completedLines, setCompletedLines] = useState<{ cmd: string; type: string }[]>([]);
  const [currentTyped, setCurrentTyped] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'responding' | 'pausing' | 'done'>('typing');
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);

  const TYPING_SOUND_DURATION = 1800; // ms
  const RESPONSE_DELAY = 250; // ms
  const NEXT_CMD_DELAY = 700; // ms

  // Preload typing audio element once on mount
  useEffect(() => {
    let url = '/typing.mp3';
    if (typeof document !== 'undefined') {
      try {
        const base = new URL(document.baseURI);
        const path = base.pathname.replace(/\/+$/, '');
        if (path) url = `${path}/typing.mp3`;
      } catch { /* fallback */ }
    }
    const audio = new Audio(url);
    audio.volume = 0.325;
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
        setPhase('responding');
      }
    }

    if (phase === 'responding') {
      const timer = setTimeout(() => {
        setCompletedLines(prev => [
          ...prev,
          { cmd: item.command, type: item.type },
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

  const renderResponseContent = (type: string) => {
    switch (type) {
      case 'whoami':
        return (
          <div style={{ paddingLeft: 14, marginBottom: 8, lineHeight: 1.6 }}>
            <span style={{ color: '#E8E3ED', fontWeight: 'bold' }}>Nurgissa Zhetkizgen </span>
            <span style={{ color: '#62C9D9', fontWeight: 'bold' }}>— Full-Stack Developer</span>
          </div>
        );
      case 'skills':
        return (
          <div style={{ color: '#E8E3ED', paddingLeft: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Python · FastAPI · React · Next.js · TypeScript · PostgreSQL · Docker · Git
          </div>
        );
      case 'edu':
        return (
          <div style={{ color: '#E8E3ED', paddingLeft: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Astana IT University — B.S. Software Engineering (2023–2026)
          </div>
        );
      case 'contact':
        return (
          <div style={{ color: '#E8E3ED', paddingLeft: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Telegram: <span style={{ color: '#62C9D9' }}>@trulondoner</span> | GitHub: <span style={{ color: '#62C9D9' }}>nurgissa-dev</span> | Email: <span style={{ color: '#62C9D9' }}>sholak0@mail.ru</span>
          </div>
        );
      case 'hire':
        return (
          <div style={{ color: '#63C174', fontWeight: 'bold', paddingLeft: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Available for hire 🚀
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="retro-modal-overlay" onClick={onClose}>
      <div
        className="retro-card"
        style={{
          background: '#2A2138',
          color: '#E8E3ED',
          border: '3.5px solid #F2C14E',
          boxShadow: '6px 8px 0px #191424',
          maxWidth: 640,
          width: '100%',
          padding: 0,
          borderRadius: 14,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#2A2138',
          borderBottom: '2px solid rgba(242, 193, 78, 0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#f4a2af' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#F2C14E' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#63C174' }} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#F2C14E', letterSpacing: 1.2 }}>
              nurgissa@workshop: ~
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f4a2af',
              border: '2px solid #362840',
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

        {/* Terminal Body */}
        <div
          ref={scrollRef}
          style={{
            padding: '18px 20px',
            fontFamily: 'monospace',
            fontSize: '0.88rem',
            lineHeight: 1.85,
            minHeight: 270,
            maxHeight: 350,
            overflowY: 'auto',
            background: '#191424',
          }}
        >
          {/* Completed Lines */}
          {completedLines.map((line, i) => (
            <div key={i}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: '#F2C14E', fontWeight: 'bold' }}>nurgissa@workshop:~$ </span>
                <span style={{ color: '#F2C14E' }}>{line.cmd}</span>
              </div>
              {renderResponseContent(line.type)}
            </div>
          ))}

          {/* Currently Typing Line */}
          {phase !== 'done' && currentIdx < TERMINAL_SCRIPT.length && (
            <div>
              <span style={{ color: '#F2C14E', fontWeight: 'bold' }}>nurgissa@workshop:~$ </span>
              <span style={{ color: '#F2C14E' }}>{currentTyped}</span>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: '1em',
                background: cursorVisible ? '#F2C14E' : 'transparent',
                verticalAlign: 'text-bottom',
                marginLeft: 2,
                transition: 'background 0.1s',
              }} />
            </div>
          )}

          {/* Idle Cursor After All Done */}
          {phase === 'done' && (
            <div>
              <span style={{ color: '#F2C14E', fontWeight: 'bold' }}>nurgissa@workshop:~$ </span>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: '1em',
                background: cursorVisible ? '#F2C14E' : 'transparent',
                verticalAlign: 'text-bottom',
                marginLeft: 2,
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
          background: '#2A2138',
          borderTop: '2px solid rgba(242, 193, 78, 0.25)',
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#9d8189' }}>
            🖥 CRT TERMINAL v1.0 — READ ONLY MODE
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: '#F2C14E',
              border: '2.5px solid #362840',
              borderRadius: 6,
              fontWeight: 'bold',
              color: '#2A2138',
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
