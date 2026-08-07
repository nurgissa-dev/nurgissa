# 📁 Project Structure — Nurgissa Portfolio

High-resolution 16-bit pixel art interactive developer workstation portfolio.

```text
my-portfolio/
├── app/
│   ├── components/
│   │   ├── BootSequence.tsx     # BIOS & CRT terminal startup sequence overlay
│   │   ├── CozyRetroDesk.tsx    # Interactive 16-bit pixel art workstation SVG scene
│   │   ├── TerminalModal.tsx    # Interactive CRT monitor terminal with typewriter effect
│   │   └── ThreeRoom.tsx        # 3D canvas scene fallback / alternative view
│   ├── utils/
│   │   └── retroSFX.ts          # Web Audio API polyphonic sound engine (clicks, keys, modals)
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global styles, pixel art tokens, scanlines,Press Start 2P font
│   ├── layout.tsx               # Next.js root layout, SEO metadata, OpenGraph, font loader
│   └── page.tsx                 # Main orchestrator page (Desktop interactive canvas & Mobile UI)
│
├── public/                      # Static assets & media files
│   ├── Nurgissa_Resume.pdf      # Direct PDF resume for view/download
│   ├── keyboard.mp3             # Mechanical typing sound effect
│   ├── keyswitch.mp3            # Single key switch click audio
│   ├── mouseclick.mp3           # Mouse button click audio
│   ├── typing.mp3               # Terminal typewriter typing sound
│   ├── og-image.png             # OpenGraph social banner image
│   ├── snorlax.gif              # Animated pixel art Snorlax easter egg
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
- **Keyboard Hotkeys**: Listens for hotkeys (`1`-`5`, `m`, `Escape`) to trigger modals or toggle SFX.
- **Mobile Responsive View**: Renders a dedicated retro card dashboard when screen width `< 768px`.
- **Modal Windows**: Rendered as retro OS desktop windows with double borders, 3D bevel buttons, and hard pixel shadows.

### 2. `app/components/CozyRetroDesk.tsx`
- **16-Bit Pixel Art Workstation**: Fully interactive SVG scene drawn with 16-bit pixel art aesthetics (`shapeRendering="crispEdges"`).
- **Interactive Objects**:
  - **CRT Monitor**: Displays blinking face, scanlines filter, opens `TerminalModal`.
  - **3D Mechanical Keyboard**: 5-row layout with physical key depression (`translateY(2px)`) on keypress + audio feedback.
  - **Mouse**: Smooth cursor-tracking 2D mouse with active click state animation.
  - **Stack of Books**: Projects launcher with mini pixel cactus sitting on top.
  - **Potted Plant**: About Me launcher with multi-shaded leaves and sway animation.
  - **Retro Phone**: Contacts modal launcher with 3x2 keypad grid.
  - **Diploma Frame**: Education modal launcher showing Astana IT University degree.
  - **Interactive Desk Lamp**: Toggles `lampOn` state, casting a warm dithered light cone (`#ffd166`) across the desk or darkening the ambient room.
  - **Wall Items**: Retro dev poster, wall panel dither, cable management.
  - **Snorlax**: Animated pixel easter egg sitting on desk.

### 3. `app/components/BootSequence.tsx`
- **BIOS & Boot Loader**: Simulates a 16-bit workstation boot (`NURGISSA WORKSHOP BIOS v1.0`).
- **Progress Bar**: Animates ASCII progress `[████████████████████] 100%`.
- **Session Persistence**: Stores `nurgissa_boot_seen` in `sessionStorage` so repeat visits skip directly to the interactive desk.

### 4. `app/components/TerminalModal.tsx`
- **CRT Terminal UI**: Simulates a Linux shell (`nurgissa@workshop:~$`).
- **Interactive Script**: Auto-types `whoami`, `cat skills.txt`, `cat education.txt`, `cat contact.txt`, and `echo "Available for hire 🚀"`.
- **Typing Audio**: Synchronized polyphonic typing sounds during output generation.

### 5. `app/utils/retroSFX.ts`
- **Web Audio API Engine**: Synthesizes low-latency audio for key clicks, mouse presses, and modal open/close transitions.
- **Fallbacks**: Uses AudioContext synthesis if MP3 audio buffers are loading.
