'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CozyRetroDesk, { RetroTarget } from './components/CozyRetroDesk';
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

const getContactItems = (isDarkMode: boolean) => [
  {
    id: 'telegram',
    label: 'Telegram',
    value: '@trulondoner',
    href: 'https://t.me/trulondoner',
    bg: isDarkMode ? 'linear-gradient(135deg, #112638, #193852)' : 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    borderColor: isDarkMode ? '#00f5d4' : '#0284c7',
    labelColor: isDarkMode ? '#00f5d4' : '#0369a1',
    valueColor: isDarkMode ? '#ffffff' : '#0c4a6e',
    badge: '✈️ TELEGRAM',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'nurgissa-dev',
    href: 'https://github.com/nurgissa-dev',
    bg: isDarkMode ? 'linear-gradient(135deg, #1f1b2e, #2c2545)' : 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
    borderColor: isDarkMode ? '#b4a3e8' : '#7e22ce',
    labelColor: isDarkMode ? '#b4a3e8' : '#6b21a8',
    valueColor: isDarkMode ? '#ffffff' : '#4c1d95',
    badge: '🐙 GITHUB',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Nurgissa Zhetkizgen',
    href: 'https://www.linkedin.com/in/nurgissa-zhetkizgen-818966424/',
    bg: isDarkMode ? 'linear-gradient(135deg, #0f2b3c, #19435e)' : 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
    borderColor: isDarkMode ? '#38bdf8' : '#1d4ed8',
    labelColor: isDarkMode ? '#38bdf8' : '#1e40af',
    valueColor: isDarkMode ? '#ffffff' : '#1e3a8a',
    badge: '💼 LINKEDIN',
  },
  {
    id: 'email',
    label: 'Email',
    value: 'sholak0@mail.ru',
    href: 'mailto:sholak0@mail.ru',
    bg: isDarkMode ? 'linear-gradient(135deg, #331c26, #4d2337)' : 'linear-gradient(135deg, #ffe4e6, #fecdd3)',
    borderColor: isDarkMode ? '#f4a2af' : '#e11d48',
    labelColor: isDarkMode ? '#f4a2af' : '#9f1239',
    valueColor: isDarkMode ? '#ffffff' : '#881337',
    badge: '✉️ EMAIL',
  },
];

export default function Portfolio() {
  const [activeModal, setActiveModal] = useState<RetroTarget>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    sfx.playKeyClick();
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
      else if (k === 't') toggleTheme();
      else if (k === 'm') toggleSound();
      else if (k === 'escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, selectObject, toggleSound, toggleTheme]);

  // Dark Mode Style Tokens
  const cardBg = isDarkMode ? '#131720' : '#fefae0';
  const cardBorder = isDarkMode ? '#3b4252' : '#362840';
  const textColor = isDarkMode ? '#ececec' : '#362840';
  const subTextColor = isDarkMode ? '#8d9198' : '#9d8189';
  const innerBoxBg = isDarkMode ? '#1a202c' : '#ffffff';

  return (
    <main style={{ minHeight: '100vh', width: '100%', background: isDarkMode ? '#0B0E13' : '#f5ebe0', position: 'relative', transition: 'background 0.4s ease' }}>
      
      {/* 📱 MOBILE DASHBOARD VIEW (Visible when screen < 768px and isMobileView is true) */}
      {isMobileView ? (
        <div style={{ width: '100%', minHeight: '100vh', background: isDarkMode ? '#0B0E13' : '#f5ebe0', color: textColor, padding: '16px 16px 60px 16px', overflowY: 'visible', fontFamily: 'sans-serif' }}>
          
          {/* Mobile Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.4rem' }}>🎓</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace', color: isDarkMode ? '#00f5d4' : '#6c5ce7' }}>
                ASTANA IT UNIVERSITY
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={toggleSound}
                style={{ padding: '6px 12px', background: soundEnabled ? (isDarkMode ? '#222834' : '#ffffff') : '#f4a2af', border: '2.5px solid #362840', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', boxShadow: '2px 2px 0px #362840' }}
              >
                {soundEnabled ? '🔊 SFX' : '🔇 MUTED'}
              </button>
              <button
                onClick={toggleTheme}
                style={{ padding: '6px 12px', background: isDarkMode ? '#222834' : '#ffffff', border: '2.5px solid #362840', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: isDarkMode ? '#ffd166' : '#362840', boxShadow: '2px 2px 0px #362840' }}
              >
                {isDarkMode ? '🌙 DARK' : '☀️ DAY'}
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ background: cardBg, border: '3.5px solid #362840', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '5px 5px 0px #362840' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ padding: '3px 8px', background: '#68c078', border: '1.5px solid #362840', borderRadius: 12, fontSize: '0.7rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                🟢 AVAILABLE FOR HIRE
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: subTextColor }}>ASTANA, KZ</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: textColor, marginBottom: 4 }}>
              Nurgissa Zhetkizgen
            </h1>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isDarkMode ? '#00f5d4' : '#6c5ce7', fontFamily: 'monospace', marginBottom: 12 }}>
              Software Engineer & Full-Stack Developer
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: textColor, marginBottom: 16 }}>
              Software Engineering student at Astana IT University. Specialized in Python backend engineering (FastAPI), modern frontend platforms (React/Next.js), and AI integration.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="Nurgissa_Resume.pdf?v=2"
                target="_blank"
                rel="noreferrer"
                onClick={() => sfx.playKeyClick()}
                style={{ flex: 1, minWidth: 135, textDecoration: 'none', padding: '11px 14px', background: '#f4a2af', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.82rem', textAlign: 'center', boxShadow: '3px 3px 0px #362840' }}
              >
                📄 OPEN RESUME (PDF) ↗
              </a>
              <a
                href="Nurgissa_Resume.pdf?v=2"
                download="Nurgissa_Resume.pdf"
                onClick={() => sfx.playKeyClick()}
                style={{ flex: 1, minWidth: 135, textDecoration: 'none', padding: '11px 14px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.82rem', textAlign: 'center', boxShadow: '3px 3px 0px #362840' }}
              >
                📥 DOWNLOAD CV ↗
              </a>
            </div>
          </div>

          {/* Option to Switch to 2D Desk View */}
          <button
            onClick={() => {
              setIsMobileView(false);
              sfx.playKeyClick();
            }}
            style={{ width: '100%', padding: '12px', background: isDarkMode ? '#1e2432' : '#b4a3e8', border: '3px solid #362840', borderRadius: 10, fontWeight: 800, color: isDarkMode ? '#ececec' : '#362840', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 16, cursor: 'pointer', boxShadow: '4px 4px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>💻 SWITCH TO 2D DESK SCENE</span>
            <span style={{ padding: '2px 6px', background: '#ffd166', color: '#362840', borderRadius: 4, fontSize: '0.7rem' }}>INTERACTIVE</span>
          </button>

          {/* 🎓 Astana IT University Section */}
          <div style={{ background: isDarkMode ? '#1e2432' : 'linear-gradient(135deg, #f0ebff, #e2d5ff)', border: '3.5px solid #362840', borderRadius: 12, padding: 18, marginBottom: 16, boxShadow: '4px 4px 0px #362840' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem' }}>🎓</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: textColor }}>Astana IT University</span>
              </div>
              <span style={{ padding: '3px 8px', background: '#ffd166', border: '1.5px solid #362840', borderRadius: 6, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                2023 — 2026
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isDarkMode ? '#00f5d4' : '#6c5ce7', marginBottom: 8, fontFamily: 'monospace' }}>
              B.S. Software Engineering Degree Student
            </div>
            <p style={{ fontSize: '0.82rem', color: textColor, lineHeight: 1.5, marginBottom: 10 }}>
              Specialization in Software Architecture, Data Structures, FastAPI Backend Systems, React Frontend, and Cloud Infrastructure.
            </p>
            <a
              href="https://astanait.edu.kz/en"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#362840', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: '0.78rem', fontWeight: 'bold', fontFamily: 'monospace' }}
            >
              Visit University Website (astanait.edu.kz) ↗
            </a>
          </div>

          {/* 🖥️ Interactive Mobile CRT Terminal */}
          <div style={{ background: isDarkMode ? '#0d1117' : '#1c1426', border: '3.5px solid #362840', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '4px 4px 0px #362840', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1.5px solid #3c2f4d', paddingBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isDarkMode ? '#00f5d4' : '#ffd166' }}>🖥 MOBILE CRT TERMINAL v1.0</span>
              <span style={{ fontSize: '0.68rem', color: '#8d9198' }}>INTERACTIVE</span>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {[
                { id: 'whoami', label: '$ whoami' },
                { id: 'skills', label: '$ skills' },
                { id: 'edu', label: '$ education' },
                { id: 'contact', label: '$ contact' },
              ].map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    setMobileTerminalCmd(cmd.id as any);
                    sfx.playKeyClick();
                  }}
                  style={{
                    padding: '4px 8px',
                    background: mobileTerminalCmd === cmd.id ? (isDarkMode ? '#00f5d4' : '#ffd166') : '#2a2038',
                    color: mobileTerminalCmd === cmd.id ? '#1c1426' : '#ffffff',
                    border: '1.5px solid #3c2f4d',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {cmd.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', lineHeight: 1.7, color: '#ececec', background: '#0a0d14', padding: 12, borderRadius: 6, border: '1px solid #2a3240' }}>
              {mobileTerminalCmd === 'whoami' && (
                <div>
                  <span style={{ color: '#ffd166' }}>&gt; whoami</span><br />
                  <span style={{ color: '#00f5d4' }}>Nurgissa Zhetkizgen</span> — Software Engineer & Full-Stack Developer.<br />
                  Passionate about building scalable backends & clean interactive web products.
                </div>
              )}
              {mobileTerminalCmd === 'skills' && (
                <div>
                  <span style={{ color: '#ffd166' }}>&gt; skills</span><br />
                  Python · FastAPI · React · Next.js · TypeScript · PostgreSQL · Docker · Hilt · Room FTS4 · Git
                </div>
              )}
              {mobileTerminalCmd === 'edu' && (
                <div>
                  <span style={{ color: '#ffd166' }}>&gt; education</span><br />
                  Astana IT University (2023–2026)<br />
                  Degree: B.S. Software Engineering
                </div>
              )}
              {mobileTerminalCmd === 'contact' && (
                <div>
                  <span style={{ color: '#ffd166' }}>&gt; contact</span><br />
                  Telegram: @trulondoner | Email: sholak0@mail.ru | GitHub: nurgissa-dev
                </div>
              )}
            </div>
          </div>

          {/* 📚 Projects Section */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'inline-block', padding: '5px 12px', background: '#b4a3e8', border: '2.5px solid #362840', borderRadius: 8, fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 12 }}>
              📚 FEATURED PROJECTS & CODE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PROJECTS.map(p => (
                <div key={p.id} style={{ background: innerBoxBg, border: '3px solid #362840', borderRadius: 10, padding: 16, boxShadow: '4px 4px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: textColor }}>{p.label}</h3>
                    <span style={{ padding: '3px 8px', background: p.color, border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.68rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                      {p.sub}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: textColor, lineHeight: 1.55, marginBottom: 10 }}>{p.desc}</p>
                  <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace', marginBottom: 12 }}>{p.tech}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a href={p.href} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ flex: 1, textDecoration: 'none', padding: '8px 12px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 6, fontSize: '0.78rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace', textAlign: 'center' }}>
                      GitHub Repo ↗
                    </a>
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ flex: 1, textDecoration: 'none', padding: '8px 12px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: '0.78rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace', textAlign: 'center' }}>
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📞 Contacts & Socials Section */}
          <div style={{ background: cardBg, border: '3.5px solid #362840', borderRadius: 12, padding: 18, boxShadow: '4px 4px 0px #362840' }}>
            <div style={{ display: 'inline-block', padding: '5px 12px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 8, fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 14 }}>
              📞 CONTACTS & SOCIALS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {getContactItems(isDarkMode).map(c => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sfx.playKeyClick()}
                  style={{
                    textDecoration: 'none',
                    background: c.bg,
                    border: `2px solid ${c.borderColor}`,
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    boxShadow: isDarkMode ? `0 3px 10px ${c.borderColor}22` : '2px 2px 0px #362840'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: c.labelColor, fontFamily: 'monospace' }}>{c.badge}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: c.valueColor, wordBreak: 'break-all' }}>{c.value}</span>
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
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
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
                <div style={{ background: isDarkMode ? '#1c2230' : 'linear-gradient(135deg, #f0ebff, #e8deff)', border: '2.5px solid #362840', borderRadius: 8, padding: 12, marginBottom: 14, boxShadow: '3px 3px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.2rem' }}>🎓</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isDarkMode ? '#ececec' : '#362840' }}>Astana IT University</span>
                    </div>
                    <span style={{ padding: '2px 8px', background: '#ffd166', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                      2023 — 2026
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isDarkMode ? '#00f5d4' : '#6c5ce7', marginBottom: 6, fontFamily: 'monospace' }}>
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isDarkMode ? '#a493e6' : '#362840', marginBottom: 6, fontFamily: 'monospace' }}>TECH TOOLKIT</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {['Python', 'FastAPI', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'OpenAI', 'Git'].map(t => (
                      <span key={t} style={{ padding: '3px 8px', background: isDarkMode ? '#222834' : '#e0a09822', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, color: isDarkMode ? '#ececec' : '#362840', fontFamily: 'monospace' }}>
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

          {/* 🖥️ 2. TERMINAL (CRT Monitor Screen) */}
          {activeModal === 'monitor' && (
            <div className="retro-modal-overlay" onClick={closeModal}>
              <div className="retro-card" style={{ background: isDarkMode ? '#0d1117' : '#2a2038', color: '#ffffff', border: `3.5px solid ${isDarkMode ? '#00f5d4' : '#a493e6'}`, boxShadow: '6px 8px 0px #1a1028', maxWidth: 580 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2px solid #ffffff', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isDarkMode ? '#00f5d4' : '#a493e6', fontFamily: 'monospace', marginBottom: 14, letterSpacing: 2 }}>
                  🖥 CRT MONITOR TERMINAL v1.0 {isDarkMode ? '[ MIDNIGHT EXEC ]' : ''}
                </div>
                <div style={{ background: isDarkMode ? '#161b22' : '#1c1426', border: '2px solid #3c2f4d', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8 }}>
                  <div><span style={{ color: '#ffd166' }}>nurgissa@workshop</span>:<span style={{ color: '#58A6FF' }}>~</span>$ whoami</div>
                  <div style={{ color: isDarkMode ? '#00f5d4' : '#e0a098', paddingLeft: 12, marginBottom: 8 }}>Nurgissa Zhetkizgen — Full-Stack Developer</div>

                  <div><span style={{ color: '#ffd166' }}>nurgissa@workshop</span>:<span style={{ color: '#58A6FF' }}>~</span>$ cat education.txt</div>
                  <div style={{ color: '#b4a3e8', paddingLeft: 12, marginBottom: 8 }}>Astana IT University (https://astanait.edu.kz/en)</div>

                  <div><span style={{ color: '#ffd166' }}>nurgissa@workshop</span>:<span style={{ color: '#58A6FF' }}>~</span>$ cat resume.txt</div>
                  <div style={{ color: '#f4a2af', paddingLeft: 12, marginBottom: 8 }}>Resume File: Nurgissa_Resume.pdf</div>

                  <div><span style={{ color: '#ffd166' }}>nurgissa@workshop</span>:<span style={{ color: '#58A6FF' }}>~</span>$ <span className="floating-zzz" style={{ color: '#ffd166', display: 'inline-block' }}>█</span></div>
                </div>
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <button onClick={closeModal} style={{ padding: '8px 18px', background: isDarkMode ? '#00f5d4' : '#a493e6', border: '2px solid #ffffff', borderRadius: 6, fontWeight: 'bold', color: '#2a2038', cursor: 'pointer', fontFamily: 'monospace' }}>
                    CLOSE TERMINAL
                  </button>
                </div>
              </div>
            </div>
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
                  {getContactItems(isDarkMode).map(c => (
                    <a
                      key={c.id}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.playKeyClick()}
                      style={{
                        textDecoration: 'none',
                        background: c.bg,
                        border: `2.5px solid ${c.borderColor}`,
                        borderRadius: 10,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        boxShadow: isDarkMode ? `0 4px 14px ${c.borderColor}22` : '3px 3px 0px #362840',
                        transition: 'transform 0.2s ease, filter 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.filter = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: c.labelColor, fontFamily: 'monospace', letterSpacing: 0.5 }}>
                          {c.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: c.labelColor, opacity: 0.8 }}>↗</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: c.valueColor, wordBreak: 'break-all', fontFamily: 'sans-serif' }}>
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

                <div style={{ background: isDarkMode ? '#1e2432' : 'linear-gradient(135deg, #f0ebff, #e2d5ff)', border: '3px solid #362840', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '4px 4px 0px #362840' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.8rem' }}>🎓</span>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: textColor }}>Astana IT University</h3>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDarkMode ? '#00f5d4' : '#6c5ce7', fontFamily: 'monospace' }}>Astana, Kazakhstan</div>
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