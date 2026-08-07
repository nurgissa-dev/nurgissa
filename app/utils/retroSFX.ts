// Pure Web Audio API Synthesizer for 8-Bit Retro Sound Effects (Zero External Files)

class RetroSFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Mouse / UI Click Sound (original 8-bit pop — used for buttons, mouse clicks, etc.)
  playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700 + Math.random() * 250, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch { /* suppressed */ }
  }

  // 2. Mechanical Keyboard Switch Sound — Box Navy / Clicky style
  //    Three-layer synthesis: click transient + bottom-out thud + spring ping
  playKeySwitchClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this.ctx.destination;

      // ── Layer A: Click transient (the "click" actuating moment) ──
      // Short, sharp burst ~1800Hz square → drops fast
      const oscA = this.ctx.createOscillator();
      const gainA = this.ctx.createGain();
      oscA.type = 'square';
      oscA.frequency.setValueAtTime(1800 + Math.random() * 200, now);
      oscA.frequency.exponentialRampToValueAtTime(400, now + 0.008);
      gainA.gain.setValueAtTime(0.055, now);
      gainA.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      oscA.connect(gainA); gainA.connect(dest);
      oscA.start(now); oscA.stop(now + 0.015);

      // ── Layer B: Bottom-out thud (key hitting the PCB/plate) ──
      // Low sine 120Hz with quick decay — the satisfying "thud"
      const oscB = this.ctx.createOscillator();
      const gainB = this.ctx.createGain();
      oscB.type = 'sine';
      oscB.frequency.setValueAtTime(130 + Math.random() * 30, now + 0.006);
      oscB.frequency.exponentialRampToValueAtTime(55, now + 0.07);
      gainB.gain.setValueAtTime(0.0, now);
      gainB.gain.setValueAtTime(0.22, now + 0.006);
      gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      oscB.connect(gainB); gainB.connect(dest);
      oscB.start(now); oscB.stop(now + 0.1);

      // ── Layer C: Spring ping (metallic resonance of the spring) ──
      // Very quiet sine ~700Hz, slightly randomised, fades slowly
      const oscC = this.ctx.createOscillator();
      const gainC = this.ctx.createGain();
      oscC.type = 'sine';
      oscC.frequency.setValueAtTime(680 + Math.random() * 80, now + 0.008);
      gainC.gain.setValueAtTime(0.0, now);
      gainC.gain.setValueAtTime(0.018, now + 0.008);
      gainC.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      oscC.connect(gainC); gainC.connect(dest);
      oscC.start(now); oscC.stop(now + 0.14);

    } catch { /* suppressed */ }
  }


  // 3. Typewriter Typing Sound — tuned for terminal animation (light, fast, varied)
  //    Simulates a real membrane/tactile keyboard being typed at speed
  playTypingClick(char?: string) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this.ctx.destination;

      // Space bar and Enter get a slightly deeper thud
      const isHeavy = char === ' ' || char === '\n';
      // Punctuation gets a softer shorter tap
      const isSoft = char ? /[.,;:\-\'"!?@#]/.test(char) : false;

      // ── Main tone: quick sine blip with pitch randomisation ──
      // Real keys vary ~±15% in pitch due to finger angle/force
      const basePitch = isHeavy ? 95 : isSoft ? 160 : 130;
      const pitchVar = (Math.random() - 0.5) * basePitch * 0.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch + pitchVar, now);
      osc.frequency.exponentialRampToValueAtTime((basePitch + pitchVar) * 0.45, now + 0.04);
      gain.gain.setValueAtTime(isHeavy ? 0.16 : isSoft ? 0.07 : 0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.07 : 0.045));
      osc.connect(gain); gain.connect(dest);
      osc.start(now); osc.stop(now + 0.08);

      // ── Transient click layer (only on regular keys, not space) ──
      if (!isHeavy) {
        const oscT = this.ctx.createOscillator();
        const gainT = this.ctx.createGain();
        oscT.type = 'square';
        oscT.frequency.setValueAtTime(1200 + Math.random() * 400, now);
        oscT.frequency.exponentialRampToValueAtTime(300, now + 0.007);
        gainT.gain.setValueAtTime(isSoft ? 0.018 : 0.032, now);
        gainT.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        oscT.connect(gainT); gainT.connect(dest);
        oscT.start(now); oscT.stop(now + 0.012);
      }

    } catch { /* suppressed */ }
  }

  // 4. Modal Open 8-Bit Arpeggio Chirp
  playModalOpen() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.035); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.07); // G5

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio context suppressed
    }
  }

  // 3. Modal Close 8-Bit Downward Chirp
  playModalClose() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.setValueAtTime(523.25, now + 0.04); // C5

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio context suppressed
    }
  }
}

export const sfx = new RetroSFX();
