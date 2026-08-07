'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CozyRetroDesk, { RetroTarget } from './components/CozyRetroDesk';
import TerminalModal from './components/TerminalModal';
import { sfx } from './utils/retroSFX';

const PROJECTS = [
  {
    id: 'DemoApp', label: 'Web Showcase Platform', sub: 'Full-Stack Showcase',
    href: 'https://github.com/nurgissa-dev', demo: 'https://your-demo.vercel.app/',
    desc: 'Interactive full-stack web application featuring real-time state management, polished UI components, and API integration.',
    tech: 'TypeScript · React · Next.js · TailwindCSS',
    color: '#68c078',
  },
  {
    id: 'AI', label: 'Gentry Guide', sub: 'AI Fashion Platform',
    href: 'https://github.com/nurgissa-dev', demo: 'https://genrty-guide-noi9.vercel.app/',
    desc: 'Intelligent style recommendations via computer vision & RAG. Multimodal outfit analysis powered by GPT-4o.',
    tech: 'Python · FastAPI · React · OpenAI · PostgreSQL',
    color: '#ffd166',
  },
  {
    id: 'ML', label: 'Machine Learning Collection', sub: 'ML / Data Science',
    href: 'https://github.com/nurgissa-dev/ML',
    desc: 'Collection of machine learning experiments, notebooks, and models covering classification, regression, and data analysis using scikit-learn, pandas, and neural networks.',
    tech: 'Python · scikit-learn · pandas · NumPy · Jupyter · matplotlib',
    color: '#00f5d4',
  },
  {
    id: 'CheatChecker', label: 'Cheat Checker Pro', sub: 'Windows Desktop App',
    href: 'https://github.com/nurgissa-dev/CheatChecker',
    desc: 'Modern Windows desktop app for scanning the system for cheats and suspicious files. Features file search, activity history, hardware info, and Steam account detection. Requires admin rights.',
    tech: 'C# · WPF · .NET 8.0 · Windows API',
    color: '#a8dadc',
  },
  {
    id: 'RecipeFinder', label: 'Recipe Finder App', sub: 'Android Clean Architecture',
    href: 'https://github.com/nurgissa-dev/Recipe-Finder',
    desc: 'Modern Android app built with Clean Architecture (MVVM, UseCases, Repository). Features Room FTS4 full-text search, DataStore, Kotlin Flows & Coroutines, Hilt DI, and Firebase FCM.',
    tech: 'Kotlin · Android Jetpack · MVVM · Room FTS4 · Hilt DI · Coroutines/Flows · Firebase',
    color: '#f4a2af',
  },
  {
    id: 'Web', label: 'Interactive Web App', sub: 'Vanilla JS Platform',
    href: 'https://github.com/nurgissa-dev/Front-End',
    desc: 'Feature-rich web application with authentication, theme switching, REST API pagination, and local caching.',
    tech: 'JavaScript ES6+ · HTML5 · CSS3 · REST API',
    color: '#b4a3e8',
  },
];

const CONTACT_ITEMS = [
  {
    id: 'telegram',
    label: 'Telegram',
    value: '@trulondoner',
    href: 'https://t.me/trulondoner',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#24A1DE" />
        <path d="M5.4 11.9L16.8 7.2C17.3 7 17.8 7.3 17.7 7.8L15.8 16.7C15.6 17.2 15.1 17.3 14.7 17L11.7 14.7L10.3 16.1C10.1 16.3 9.8 16.4 9.6 16.4L9.8 13.5L15.2 8.6C15.4 8.4 15.2 8.3 14.9 8.5L8.3 12.6L5.5 11.7C5 11.5 5 11 5.4 11.9Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'nurgissa-dev',
    href: 'https://github.com/nurgissa-dev',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#24292E">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Nurgissa Zhetkizgen',
    href: 'https://www.linkedin.com/in/nurgissa-zhetkizgen-818966424/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path d="M19 19H16V13.8C16 12.3 14.8 11.2 13.3 11.2C12.1 11.2 11.2 12.1 11.2 13.3V19H8.2V9H11.2V10.3C11.8 9.4 12.9 8.8 14.2 8.8C16.8 8.8 19 11 19 13.6V19ZM5.2 7.2C4.2 7.2 3.4 6.4 3.4 5.4C3.4 4.4 4.2 3.6 5.2 3.6C6.2 3.6 7 4.4 7 5.4C7 6.4 6.2 7.2 5.2 7.2ZM3.7 19H6.7V9H3.7V19Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    value: 'sholak0@mail.ru',
    href: 'mailto:sholak0@mail.ru',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#EA4335" />
        <path d="M5 7L12 12.5L19 7M5 7H19V17H5V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Portfolio() {
  const [activeModal, setActiveModal] = useState<RetroTarget>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mobileTerminalCmd, setMobileTerminalCmd] = useState<'whoami' | 'skills' | 'edu' | 'contact'>('whoami');

  // Detect mobile screen on mount & resize
  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 768;
      setIsMobileView(small);
      setIsSmallScreen(small);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectObject = useCallback((target: RetroTarget) => {
    setActiveModal(target);
    if (target) {
      sfx.playModalOpen();
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    sfx.playModalClose();
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Keyboard Hotkey Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const k = e.key.toLowerCase();
      if (k === '1') selectObject('sticker');
      else if (k === '2') selectObject('monitor');
      else if (k === '3') selectObject('books');
      else if (k === '4') selectObject('phone');
      else if (k === '5') selectObject('university');
      else if (k === 'm') toggleSound();
      else if (k === 'escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, selectObject, toggleSound]);

  // Clean Light Theme Style Tokens
  const cardBg = '#fefae0';
  const cardBorder = '#362840';
  const textColor = '#362840';
  const subTextColor = '#9d8189';
  const innerBoxBg = '#ffffff';
  const contactBorderColor = '#362840';

  return (
    <main style={{ minHeight: '100vh', width: '100%', background: '#f5ebe0', position: 'relative' }}>
      
      {/* 📱 MOBILE DASHBOARD VIEW (Visible when screen < 768px and isMobileView is true) */}
      {isMobileView ? (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f5ebe0', color: textColor, padding: '16px 16px 60px 16px', overflowY: 'visible', fontFamily: 'sans-serif' }}>
          
          {/* Mobile Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.4rem' }}>🎓</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace', color: '#6c5ce7' }}>
                ASTANA IT UNIVERSITY
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={toggleSound}
                style={{ padding: '6px 12px', background: soundEnabled ? '#ffffff' : '#f4a2af', border: '2.5px solid #362840', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', boxShadow: '2px 2px 0px #362840' }}
              >
                {soundEnabled ? '🔊 SFX' : '🔇 MUTED'}
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ background: cardBg, border: '3.5px solid #362840', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '4px 6px 0px #362840' }}>
            <div style={{ display: 'inline-block', padding: '4px 10px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 10 }}>
              👋 WELCOME TO MY WORKSPACE
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: textColor, marginBottom: 4, letterSpacing: '-0.5px' }}>
              Nurgissa Zhetkizgen
            </h1>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6c5ce7', fontFamily: 'monospace', marginBottom: 12 }}>
              Full-Stack Software Engineer
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: textColor, marginBottom: 14 }}>
              Software Engineering student at Astana IT University specializing in Python backend (FastAPI), Next.js frontend, AI integrations, and mobile development.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href="Nurgissa_Resume.pdf?v=2"
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, textDecoration: 'none', padding: '10px', background: '#f4a2af', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', boxShadow: '2px 3px 0px #362840' }}
              >
                📄 RESUME (PDF)
              </a>
              <a
                href="https://t.me/trulondoner"
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, textDecoration: 'none', padding: '10px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', boxShadow: '2px 3px 0px #362840' }}
              >
                💬 TELEGRAM
              </a>
            </div>
          </div>

          {/* Switch to Desktop 2D Canvas Button for Mobile users */}
          <button
            onClick={() => setIsMobileView(false)}
            style={{ width: '100%', padding: '12px', background: '#b4a3e8', border: '3px solid #362840', borderRadius: 10, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 16, cursor: 'pointer', boxShadow: '4px 4px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>🖥 EXPLORE INTERACTIVE 2D CANVAS SCENE</span>
          </button>

          {/* Mobile Education Card */}
          <div style={{ background: 'linear-gradient(135deg, #f0ebff, #e2d5ff)', border: '3.5px solid #362840', borderRadius: 12, padding: 18, marginBottom: 16, boxShadow: '4px 4px 0px #362840' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.4rem' }}>🎓</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: textColor }}>Astana IT University</span>
              </div>
              <span style={{ padding: '3px 8px', background: '#ffd166', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                2023–2026
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6c5ce7', marginBottom: 8, fontFamily: 'monospace' }}>
              B.S. Software Engineering
            </div>
            <p style={{ fontSize: '0.82rem', color: textColor, lineHeight: 1.5, marginBottom: 10 }}>
              Astana, Kazakhstan · Focused on Software Architecture, Backend Systems, Cloud Databases, and Data Structures.
            </p>
            <a
              href="https://astanait.edu.kz/en"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#362840', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}
            >
              Visit astanait.edu.kz ↗
            </a>
          </div>

          {/* Mobile Terminal Card */}
          <div style={{ background: '#1c1426', border: '3.5px solid #362840', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '4px 4px 0px #362840', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #362840', paddingBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ffd166' }}>🖥 MOBILE CRT TERMINAL v1.0</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f4a2af' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffd166' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#68c078' }} />
              </div>
            </div>

            {/* Quick Command Selector Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
              {[
                { id: 'whoami', label: '$ whoami' },
                { id: 'skills', label: '$ cat skills' },
                { id: 'edu', label: '$ cat edu' },
                { id: 'contact', label: '$ cat contact' }
              ].map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => setMobileTerminalCmd(cmd.id as typeof mobileTerminalCmd)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1.5px solid #362840',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: mobileTerminalCmd === cmd.id ? '#ffd166' : '#2a2038',
                    color: mobileTerminalCmd === cmd.id ? '#362840' : '#ffffff',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cmd.label}
                </button>
              ))}
            </div>

            {/* Command Output Window */}
            <div style={{ background: '#0d1117', borderRadius: 8, padding: 12, fontSize: '0.8rem', lineHeight: 1.6, color: '#ffffff' }}>
              {mobileTerminalCmd === 'whoami' && (
                <div>
                  <div style={{ color: '#888' }}>$ whoami</div>
                  <div style={{ color: '#00f5d4', fontWeight: 'bold', marginTop: 4 }}>
                    Nurgissa Zhetkizgen — Full-Stack Developer & Software Engineering Student
                  </div>
                </div>
              )}
              {mobileTerminalCmd === 'skills' && (
                <div>
                  <div style={{ color: '#888' }}>$ cat skills.txt</div>
                  <div style={{ color: '#ffd166', fontWeight: 'bold', marginTop: 4 }}>
                    Python · FastAPI · React · Next.js · TypeScript · PostgreSQL · Docker · Git
                  </div>
                </div>
              )}
              {mobileTerminalCmd === 'edu' && (
                <div>
                  <div style={{ color: '#888' }}>$ cat education.txt</div>
                  <div style={{ color: '#b4a3e8', fontWeight: 'bold', marginTop: 4 }}>
                    Astana IT University — B.S. Software Engineering (2023–2026)
                  </div>
                </div>
              )}
              {mobileTerminalCmd === 'contact' && (
                <div>
                  <div style={{ color: '#888' }}>$ cat contact.txt</div>
                  <div style={{ color: '#f4a2af', fontWeight: 'bold', marginTop: 4 }}>
                    Telegram: @trulondoner | Email: sholak0@mail.ru | GitHub: nurgissa-dev
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Projects List */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#362840', fontFamily: 'monospace', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📚 FEATURED PROJECTS ({PROJECTS.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PROJECTS.map(p => (
                <div key={p.id} style={{ background: cardBg, border: '3px solid #362840', borderRadius: 10, padding: 14, boxShadow: '3px 3px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: textColor }}>{p.label}</h3>
                    <span style={{ padding: '2px 6px', background: p.color, border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.68rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                      {p.sub}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: textColor, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
                  <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace', marginBottom: 10 }}>{p.tech}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={p.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '5px 12px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                      GitHub ↗
                    </a>
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '5px 12px', background: '#ffd166', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Contacts Grid */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#362840', fontFamily: 'monospace', marginBottom: 10 }}>
              📞 GET IN TOUCH
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CONTACT_ITEMS.map(c => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: innerBoxBg,
                    border: `2.5px solid ${contactBorderColor}`,
                    borderRadius: 10,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    boxShadow: '3px 3px 0px #362840'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {c.icon}
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4a5568', fontFamily: 'monospace' }}>
                        {c.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: subTextColor }}>↗</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: textColor, wordBreak: 'break-all', fontFamily: 'sans-serif' }}>
                    {c.value}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* 💻 DESKTOP 2D INTERACTIVE DESK VIEW (Default on PC screens >= 768px) */
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
          
          {/* If user manually switched to desktop mode on small screen, show back to mobile button */}
          {isSmallScreen && (
            <button
              onClick={() => setIsMobileView(true)}
              style={{ position: 'absolute', top: 20, left: 24, zIndex: 100, padding: '6px 12px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', cursor: 'pointer' }}
            >
              📱 SWITCH TO MOBILE VIEW
            </button>
          )}

          {/* ── COZY RETRO 2D DESK INTERACTIVE SCENE ── */}
          <CozyRetroDesk
            onSelectObject={selectObject}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />

          {/* ── RETRO MODAL OVERLAYS ── */}

          {/* 🟡 1. ABOUT ME (Sticker) */}
          {activeModal === 'sticker' && (
            <div className="retro-modal-overlay" onClick={closeModal}>
              <div className="retro-card" style={{ maxWidth: 580, background: cardBg, borderColor: cardBorder, color: textColor }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2.5px solid #362840', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
                <div style={{ display: 'inline-block', padding: '4px 10px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 12 }}>
                  🟡 ABOUT ME / BIO
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: textColor, marginBottom: 4, fontFamily: 'sans-serif' }}>
                  Nurgissa Zhetkizgen
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: subTextColor, marginBottom: 14, fontFamily: 'monospace' }}>
                  Software Engineer · Astana, Kazakhstan
                </div>

                {/* 🎓 ASTANA IT UNIVERSITY BADGE */}
                <div style={{ background: 'linear-gradient(135deg, #f0ebff, #e8deff)', border: '2.5px solid #362840', borderRadius: 8, padding: 12, marginBottom: 14, boxShadow: '3px 3px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.2rem' }}>🎓</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#362840' }}>Astana IT University</span>
                    </div>
                    <span style={{ padding: '2px 8px', background: '#ffd166', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                      2023 — 2026
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6c5ce7', marginBottom: 6, fontFamily: 'monospace' }}>
                    B.S. Software Engineering Student
                  </div>
                  <a
                    href="https://astanait.edu.kz/en"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#362840', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: '0.72rem', fontWeight: 'bold', fontFamily: 'monospace' }}
                  >
                    Visit Astana IT University Website ↗
                  </a>
                </div>

                <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: textColor, marginBottom: 14 }}>
                  Hi! I&apos;m a Software Engineering student at Astana IT University passionate about building clean, efficient, and thoughtful applications. I specialize in Python backend engineering (FastAPI), modern frontend development (React/Next.js), and AI-driven solutions.
                </p>

                {/* 📄 DIRECT RESUME (Nurgissa_Resume.pdf) DOWNLOAD / VIEW BUTTONS */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <a
                    href="Nurgissa_Resume.pdf?v=2"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sfx.playKeyClick()}
                    style={{ flex: 1, textDecoration: 'none', padding: '9px 12px', background: '#f4a2af', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', boxShadow: '2px 3px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    📄 OPEN RESUME (PDF) ↗
                  </a>
                  <a
                    href="Nurgissa_Resume.pdf?v=2"
                    download="Nurgissa_Resume.pdf"
                    onClick={() => sfx.playKeyClick()}
                    style={{ flex: 1, textDecoration: 'none', padding: '9px 12px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', boxShadow: '2px 3px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    📥 DOWNLOAD CV ↗
                  </a>
                </div>

                <div style={{ background: innerBoxBg, border: '2px stroke #362840', borderStyle: 'solid', borderRadius: 8, padding: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#362840', marginBottom: 6, fontFamily: 'monospace' }}>TECH TOOLKIT</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {['Python', 'FastAPI', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'OpenAI', 'Git'].map(t => (
                      <span key={t} style={{ padding: '3px 8px', background: '#e0a09822', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, color: '#362840', fontFamily: 'monospace' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={closeModal} style={{ padding: '8px 18px', background: '#b4a3e8', border: '2px solid #362840', borderRadius: 6, fontWeight: 'bold', color: '#362840', cursor: 'pointer', fontFamily: 'monospace' }}>
                    CLOSE ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🖥️ 2. TERMINAL (CRT Monitor Screen) — with typewriter animation */}
          {activeModal === 'monitor' && (
            <TerminalModal onClose={closeModal} />
          )}

          {/* 📚 3. PROJECTS (Stack of Books) */}
          {activeModal === 'books' && (
            <div className="retro-modal-overlay" onClick={closeModal}>
              <div className="retro-card" style={{ maxWidth: 640, background: cardBg, borderColor: cardBorder, color: textColor }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2.5px solid #362840', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
                <div style={{ display: 'inline-block', padding: '4px 10px', background: '#b4a3e8', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 14 }}>
                  📚 PROJECTS & CASE STUDIES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
                  {PROJECTS.map(p => (
                    <div key={p.id} style={{ background: innerBoxBg, border: '2.5px solid #362840', borderRadius: 8, padding: 14, boxShadow: '3px 4px 0px #362840' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textColor }}>{p.label}</h3>
                        <span style={{ padding: '2px 8px', background: p.color, border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                          {p.sub}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: textColor, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
                      <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace', marginBottom: 10 }}>{p.tech}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a href={p.href} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ textDecoration: 'none', padding: '5px 12px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                          GitHub ↗
                        </a>
                        {p.demo && (
                          <a href={p.demo} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ textDecoration: 'none', padding: '5px 12px', background: '#ffd166', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 📞 4. CONTACTS (Vintage Phone / Calculator) */}
          {activeModal === 'phone' && (
            <div className="retro-modal-overlay" onClick={closeModal}>
              <div className="retro-card" style={{ background: cardBg, borderColor: cardBorder, color: textColor, maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2.5px solid #362840', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
                <div style={{ display: 'inline-block', padding: '4px 10px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 14 }}>
                  📞 CONTACTS & SOCIALS
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: textColor, marginBottom: 16 }}>
                  Let&apos;s Connect & Build Together
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  {CONTACT_ITEMS.map(c => (
                    <a
                      key={c.id}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.playKeyClick()}
                      style={{
                        textDecoration: 'none',
                        background: innerBoxBg,
                        border: `2.5px solid ${contactBorderColor}`,
                        borderRadius: 10,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        boxShadow: '3px 3px 0px #362840',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#6c5ce7';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = contactBorderColor;
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {c.icon}
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4a5568', fontFamily: 'monospace' }}>
                            {c.label}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: subTextColor }}>↗</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor, wordBreak: 'break-all', fontFamily: 'sans-serif' }}>
                        {c.value}
                      </span>
                    </a>
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={closeModal} style={{ padding: '8px 18px', background: '#f4a2af', border: '2.5px solid #362840', borderRadius: 6, fontWeight: 'bold', color: '#362840', cursor: 'pointer', fontFamily: 'monospace' }}>
                    CLOSE ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🎓 5. ASTANA IT UNIVERSITY (Wall Diploma Board) */}
          {activeModal === 'university' && (
            <div className="retro-modal-overlay" onClick={closeModal}>
              <div className="retro-card" style={{ maxWidth: 620, background: cardBg, borderColor: cardBorder, color: textColor }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2.5px solid #362840', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
                <div style={{ display: 'inline-block', padding: '4px 10px', background: '#b4a3e8', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 14 }}>
                  🎓 ASTANA IT UNIVERSITY DIPLOMA
                </div>

                <div style={{ background: 'linear-gradient(135deg, #f0ebff, #e2d5ff)', border: '3px solid #362840', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '4px 4px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.8rem' }}>🎓</span>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: textColor }}>Astana IT University</h3>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6c5ce7', fontFamily: 'monospace' }}>Astana, Kazakhstan</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                      2023 — 2026
                    </span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: textColor, marginTop: 4, marginBottom: 8 }}>
                    B.S. Software Engineering Degree
                  </div>
                  <p style={{ fontSize: '0.88rem', color: textColor, lineHeight: 1.6, marginBottom: 12 }}>
                    Focused on Data Structures, Algorithms, Software Architecture, High-Performance Backend Engineering (Python/FastAPI), React Frontend Systems, and Cloud Databases.
                  </p>
                  <a
                    href="https://astanait.edu.kz/en"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sfx.playKeyClick()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: '#362840', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace', boxShadow: '2px 3px 0px #6c5ce7' }}
                  >
                    Visit Astana IT University Website (astanait.edu.kz) ↗
                  </a>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button onClick={closeModal} style={{ padding: '8px 18px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontWeight: 'bold', color: '#362840', cursor: 'pointer', fontFamily: 'monospace' }}>
                    CLOSE DIPLOMA ✕
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </main>
  );
}