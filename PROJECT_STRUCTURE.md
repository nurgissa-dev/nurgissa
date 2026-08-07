# 📁 Project Structure — Nurgissa Portfolio

Interactive 2D Retro Developer Workstation & Portfolio of Nurgissa Zhetkizgen.

```text
my-portfolio/
├── app/
│   ├── components/
│   │   ├── BootSequence.tsx     # CRT terminal boot sequence loading screen (sessionStorage flag)
│   │   ├── CozyRetroDesk.tsx    # Interactive 2D vector cozy retro desk workstation scene
│   │   ├── TerminalModal.tsx    # Interactive CRT terminal modal with typewriter effect & sound cleanup
│   │   └── ThreeRoom.tsx        # 3D canvas scene fallback / alternative view
│   ├── utils/
│   │   └── retroSFX.ts          # Web Audio API polyphonic sound engine (-35% volume reduction)
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global styling, retro card styles, keyframe animations
│   ├── layout.tsx               # Next.js root layout, SEO metadata, OpenGraph tags
│   └── page.tsx                 # Main orchestrator page (Desktop 2D canvas & Mobile dashboard UI)
│
├── public/                      # Static assets & media files
│   ├── Nurgissa_Resume.pdf      # Direct PDF resume for view/download
│   ├── keyboard.mp3             # Mechanical typing sound effect
│   ├── keyswitch.mp3            # Single key switch click audio
│   ├── mouseclick.mp3           # Mouse button click audio
│   ├── typing.mp3               # Terminal typewriter typing sound
│   ├── og-image.png             # OpenGraph social banner image
│   ├── snorlax.gif              # Animated Snorlax easter egg
│   └── *.svg                    # UI Icons (file, globe, next, vercel, window)
│
├── .github/                     # GitHub Actions CI/CD workflows for GitHub Pages deployment
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration (static export settings)
├── package.json                 # Project dependencies & scripts
├── postcss.config.mjs           # PostCSS configuration for TailwindCSS
├── README.md                    # Project overview & documentation
└── tsconfig.json                # TypeScript compiler options
```

---

## 🧩 Core Architecture Overview

### 1. `app/page.tsx`
- **Main Orchestrator**: Manages state for `activeModal` ('sticker' | 'monitor' | 'books' | 'phone' | 'university'), `soundEnabled`, `isMobileView`, and `booting`.
- **Keyboard Hotkeys**: Listens for hotkeys (`1`-`5`, `m`, `Escape`) to trigger modals or toggle SFX (with `e.repeat` guard).
- **Mobile Responsive View**: Renders a dedicated retro card dashboard when screen width `< 768px`.

### 2. `app/components/CozyRetroDesk.tsx`
- **Cozy Retro 2D Desk**: Interactive vector SVG scene.
- **Interactive Objects**:
  - **CRT Monitor**: Displays face animation and opens `TerminalModal`.
  - **Custom 65% Mechanical Keyboard**: 5-row layout with physical key depression (`isKeyActive`) and audio feedback.
  - **Mouse**: Smooth cursor-tracking 2D mouse with click animations.
  - **Stack of Books**: Projects modal launcher.
  - **Yellow Post-It Sticker**: About Me modal launcher.
  - **Vintage Phone**: Contacts modal launcher.
  - **Potted Houseplant**: Desk greenery decoration.
  - **Retro Desk Lamp**: Cozy lamp lighting.
  - **Snorlax**: Animated GIF easter egg.

### 3. `app/components/BootSequence.tsx`
- **CRT Boot Sequence**: Displays terminal boot lines (`booting workspace...`, `checking environment...`, `loading projects...`) with ASCII progress bar `[████████████████████] 100%` and smooth fade-out transition.
- **Session Persistence**: Saved in `sessionStorage` (`nurgissa_boot_seen`) to skip on repeat visits.

### 4. `app/components/TerminalModal.tsx`
- **CRT Terminal UI**: Simulates terminal output (`whoami`, `cat skills.txt`, `cat education.txt`, `cat contact.txt`).
- **Color Palette**: Base `#2A2138`, prompt `#F2C14E`, text `#E8E3ED`, cyan accents `#62C9D9`, green success `#63C174`.
- **Audio Cleanup**: Automatically pauses typing audio when modal unmounts.

### 5. `app/utils/retroSFX.ts`
- **Sound Engine**: Polyphonic Web Audio API synthesis with 35% gain reduction for quiet, pleasant audio.
