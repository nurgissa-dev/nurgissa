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


  // 2. Modal Open 8-Bit Arpeggio Chirp
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
