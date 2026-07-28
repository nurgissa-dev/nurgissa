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

export default function Portfolio() {
  const [activeModal, setActiveModal] = useState<RetroTarget>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [forceDesktopView, setForceDesktopView] = useState(false);

  // Detect mobile viewport (< 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  // Keyboard Physical Hotkey Listener
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

  // Style tokens based on mode
  const cardBg = isDarkMode ? '#131720' : '#fefae0';
  const cardBorder = isDarkMode ? '#3b4252' : '#362840';
  const textColor = isDarkMode ? '#ececec' : '#362840';
  const subTextColor = isDarkMode ? '#8d9198' : '#9d8189';
  const innerBoxBg = isDarkMode ? '#1a202c' : '#ffffff';

  // 📱 MOBILE OPTIMIZED PORTFOLIO DASHBOARD VIEW (< 768px unless forced desktop)
  if (isMobile && !forceDesktopView) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: isDarkMode ? '#0B0E13' : '#f5ebe0', color: textColor, padding: '16px 16px 40px 16px', overflowY: 'auto', fontFamily: 'sans-serif', transition: 'background 0.4s ease' }}>

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
              style={{ padding: '6px 10px', background: soundEnabled ? (isDarkMode ? '#222834' : '#ffffff') : '#f4a2af', border: '2px solid #362840', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={toggleTheme}
              style={{ padding: '6px 10px', background: isDarkMode ? '#222834' : '#ffffff', border: '2px solid #362840', borderRadius: 20, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: isDarkMode ? '#ffd166' : '#362840' }}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div style={{ background: cardBg, border: '3px solid #362840', borderRadius: 12, padding: 18, marginBottom: 16, boxShadow: '4px 4px 0px #362840' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: textColor, marginBottom: 4 }}>
            Nurgissa Zhetkizgen
          </h1>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: subTextColor, fontFamily: 'monospace', marginBottom: 12 }}>
            Software Engineer · Astana, Kazakhstan
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: textColor, marginBottom: 14 }}>
            Software Engineering student at Astana IT University. Passionate about building clean Python backends (FastAPI), modern Next.js UIs, and AI platforms.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a
              href="/Nurgissa_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={() => sfx.playKeyClick()}
              style={{ flex: 1, minWidth: 140, textDecoration: 'none', padding: '10px 14px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', boxShadow: '2px 2px 0px #362840' }}
            >
              📄 OPEN RESUME (PDF) ↗
            </a>
            <a
              href="/Nurgissa_Resume.pdf"
              download="Nurgissa_Resume.pdf"
              onClick={() => sfx.playKeyClick()}
              style={{ flex: 1, minWidth: 140, textDecoration: 'none', padding: '10px 14px', background: '#ffd166', border: '2px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', boxShadow: '2px 2px 0px #362840' }}
            >
              📥 DOWNLOAD CV ↗
            </a>
          </div>
        </div>

        {/* Option to Switch to 2D Desk View */}
        <button
          onClick={() => {
            setForceDesktopView(true);
            sfx.playKeyClick();
          }}
          style={{ width: '100%', padding: '10px', background: isDarkMode ? '#1e2432' : '#b4a3e8', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: isDarkMode ? '#ececec' : '#362840', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: 16, cursor: 'pointer', boxShadow: '3px 3px 0px #362840' }}
        >
          💻 TRY 2D INTERACTIVE DESK VIEW ↗
        </button>

        {/* 🎓 Astana IT University Section */}
        <div style={{ background: isDarkMode ? '#1e2432' : 'linear-gradient(135deg, #f0ebff, #e2d5ff)', border: '3px solid #362840', borderRadius: 10, padding: 16, marginBottom: 16, boxShadow: '3px 3px 0px #362840' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor }}>🎓 Astana IT University</span>
            <span style={{ padding: '2px 8px', background: '#ffd166', border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
              2022 — 2026
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isDarkMode ? '#00f5d4' : '#6c5ce7', marginBottom: 6, fontFamily: 'monospace' }}>
            B.S. Software Engineering
          </div>
          <a
            href="https://astanait.edu.kz/en"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-block', padding: '6px 12px', background: '#362840', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}
          >
            Visit University Website (astanait.edu.kz) ↗
          </a>
        </div>

        {/* 📚 Projects Section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'inline-block', padding: '4px 10px', background: '#b4a3e8', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 10 }}>
            📚 FEATURED PROJECTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROJECTS.map(p => (
              <div key={p.id} style={{ background: innerBoxBg, border: '2.5px solid #362840', borderRadius: 8, padding: 14, boxShadow: '3px 3px 0px #362840' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: textColor }}>{p.label}</h3>
                  <span style={{ padding: '2px 6px', background: p.color, border: '1.5px solid #362840', borderRadius: 4, fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#362840' }}>
                    {p.sub}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: textColor, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace', marginBottom: 10 }}>{p.tech}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={p.href} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ textDecoration: 'none', padding: '6px 12px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                    GitHub ↗
                  </a>
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" onClick={() => sfx.playKeyClick()} style={{ textDecoration: 'none', padding: '6px 12px', background: '#ffd166', border: '2px solid #362840', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold', color: '#362840', fontFamily: 'monospace' }}>
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📞 Contacts & Socials Section */}
        <div style={{ background: cardBg, border: '3px solid #362840', borderRadius: 10, padding: 16, boxShadow: '3px 3px 0px #362840' }}>
          <div style={{ display: 'inline-block', padding: '4px 10px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 12 }}>
            📞 CONTACTS & SOCIALS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Telegram', value: '@trulondoner', href: 'https://t.me/trulondoner', bg: isDarkMode ? '#1e2826' : '#e2ece9' },
              { label: 'GitHub', value: 'nurgissa-dev', href: 'https://github.com/nurgissa-dev', bg: isDarkMode ? '#282029' : '#f0e6ef' },
              { label: 'LinkedIn', value: 'Nurgissa Zhetkizgen', href: 'https://www.linkedin.com/in/nurgissa-zhetkizgen-818966424/', bg: isDarkMode ? '#1f2924' : '#d8e2dc' },
              { label: 'Email', value: 'sholak0@mail.ru', href: 'mailto:sholak0@mail.ru', bg: isDarkMode ? '#2c2025' : '#ffe5ec' },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => sfx.playKeyClick()}
                style={{ textDecoration: 'none', background: c.bg, border: '2px solid #362840', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace' }}>{c.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: textColor }}>{c.value}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // 💻 DESKTOP 2D INTERACTIVE DESK VIEW (>= 768px or forced desktop view)
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: isDarkMode ? '#0B0E13' : '#f5ebe0', position: 'relative', transition: 'background 0.4s ease' }}>

      {/* If mobile user forced desktop view, offer back to mobile view button */}
      {isMobile && forceDesktopView && (
        <button
          onClick={() => setForceDesktopView(false)}
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
                href="/Nurgissa_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => sfx.playKeyClick()}
                style={{ flex: 1, textDecoration: 'none', padding: '9px 12px', background: '#f4a2af', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', boxShadow: '2px 3px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                📄 OPEN RESUME (PDF) ↗
              </a>
              <a
                href="/Nurgissa_Resume.pdf"
                download="Nurgissa_Resume.pdf"
                onClick={() => sfx.playKeyClick()}
                style={{ flex: 1, textDecoration: 'none', padding: '9px 12px', background: '#ffd166', border: '2.5px solid #362840', borderRadius: 8, fontWeight: 800, color: '#362840', fontFamily: 'monospace', fontSize: '0.8rem', boxShadow: '2px 3px 0px #362840', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                📥 DOWNLOAD RESUME ↗
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
              <div style={{ color: '#f4a2af', paddingLeft: 12, marginBottom: 8 }}>Resume File: /Nurgissa_Resume.pdf</div>

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
          <div className="retro-card" style={{ background: cardBg, borderColor: cardBorder, color: textColor }} onClick={e => e.stopPropagation()}>
            <button
              onClick={closeModal}
              style={{ position: 'absolute', top: 14, right: 18, background: '#f4a2af', border: '2.5px solid #362840', borderRadius: '50%', width: 28, height: 28, fontSize: 16, fontWeight: 'bold', color: '#362840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
            <div style={{ display: 'inline-block', padding: '4px 10px', background: '#ffd166', border: '2px solid #362840', borderRadius: 6, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', color: '#362840', marginBottom: 14 }}>
              📞 CONTACTS & SOCIALS
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: textColor, marginBottom: 14 }}>
              Let&apos;s Connect & Build Together
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Telegram', value: '@trulondoner', href: 'https://t.me/trulondoner', bg: isDarkMode ? '#1e2826' : '#e2ece9' },
                { label: 'GitHub', value: 'nurgissa-dev', href: 'https://github.com/nurgissa-dev', bg: isDarkMode ? '#282029' : '#f0e6ef' },
                { label: 'LinkedIn', value: 'Nurgissa Zhetkizgen', href: 'https://www.linkedin.com/in/nurgissa-zhetkizgen-818966424/', bg: isDarkMode ? '#1f2924' : '#d8e2dc' },
                { label: 'Email', value: 'sholak0@mail.ru', href: 'mailto:sholak0@mail.ru', bg: isDarkMode ? '#2c2025' : '#ffe5ec' },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sfx.playKeyClick()}
                  style={{ textDecoration: 'none', background: c.bg, border: '2.5px solid #362840', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 4, transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: subTextColor, fontFamily: 'monospace' }}>{c.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: textColor }}>{c.value}</span>
                </a>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={closeModal} style={{ padding: '8px 18px', background: '#f4a2af', border: '2px solid #362840', borderRadius: 6, fontWeight: 'bold', color: '#362840', cursor: 'pointer', fontFamily: 'monospace' }}>
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

    </main>
  );
}