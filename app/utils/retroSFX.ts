// Pure Web Audio API Synthesizer + Real Audio File Playback

class RetroSFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  // Auto-detected base path for GitHub Pages (/nurgissa) vs local dev ('')
  private basePath: string = '';

  private getBasePath(): string {
    if (this.basePath) return this.basePath;
    if (typeof document !== 'undefined') {
      // Extract basePath from <base> tag or document.baseURI
      // e.g. "https://nurgissa-dev.github.io/nurgissa/" → "/nurgissa"
      try {
        const base = new URL(document.baseURI);
        const path = base.pathname.replace(/\/+$/, ''); // trim trailing slashes
        this.basePath = path || '';
      } catch {
        this.basePath = '';
      }
    }
    return this.basePath;
  }

  // Helper to build correct audio URL with basePath
  private audioUrl(filename: string): string {
    return `${this.getBasePath()}/${filename}`;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Immediately start preloading real audio buffers so first click uses real sounds
        this.preload();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Preload all real audio files into memory
  public preload() {
    this.initCtx();
    if (this.ctx) {
      this.loadMouseBuffer();
      this.loadKeyswitchBuffer();
      this.loadKeyboardBuffer();
    }
  }

  // Real mouse click audio buffer
  private mouseBuffer: AudioBuffer | null = null;
  private mouseLoading: boolean = false;

  private async loadMouseBuffer() {
    if (this.mouseBuffer || this.mouseLoading || !this.ctx) return;
    this.mouseLoading = true;
    try {
      const res = await fetch(this.audioUrl('klik-myshki-9.mp3'));
      const arrayBuf = await res.arrayBuffer();
      this.mouseBuffer = await this.ctx.decodeAudioData(arrayBuf);
    } catch {
      /* unavailable */
    }
    this.mouseLoading = false;
  }

  // Real keyswitch audio buffer
  private keyswitchBuffer: AudioBuffer | null = null;
  private keyswitchLoading: boolean = false;

  private async loadKeyswitchBuffer() {
    if (this.keyswitchBuffer || this.keyswitchLoading || !this.ctx) return;
    this.keyswitchLoading = true;
    try {
      const res = await fetch(this.audioUrl('keyswitch.mp3'));
      const arrayBuf = await res.arrayBuffer();
      this.keyswitchBuffer = await this.ctx.decodeAudioData(arrayBuf);
    } catch {
      /* unavailable */
    }
    this.keyswitchLoading = false;
  }

  // Real typing keyboard audio buffer
  private keyboardBuffer: AudioBuffer | null = null;
  private keyboardBufferLoading: boolean = false;

  private async loadKeyboardBuffer() {
    if (this.keyboardBuffer || this.keyboardBufferLoading || !this.ctx) return;
    this.keyboardBufferLoading = true;
    try {
      const res = await fetch(this.audioUrl('keyboard.mp3'));
      const arrayBuf = await res.arrayBuffer();
      this.keyboardBuffer = await this.ctx.decodeAudioData(arrayBuf);
    } catch {
      /* unavailable */
    }
    this.keyboardBufferLoading = false;
  }

  // Real Mouse Click Sound (LMB & RMB distinct tactile pitch)
  playMouseClick(isRightClick: boolean = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!this.mouseBuffer && !this.mouseLoading) {
        this.loadMouseBuffer();
      }

      // Play real mouseclick.mp3 audio if buffer is ready
      if (this.mouseBuffer) {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();

        source.buffer = this.mouseBuffer;

        // Distinct subtle pitch difference: Left click = slightly higher snappy tick, Right click = slightly deeper click
        const basePitch = isRightClick ? 0.90 : 1.05;
        source.playbackRate.value = basePitch + (Math.random() - 0.5) * 0.08;
        gainNode.gain.value = isRightClick ? 0.65 : 0.55;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      }

      // Fallback synthesis if buffer loading
      this.playKeyClick();
    } catch { /* suppressed */ }
  }

  // 1. UI Button Click Sound
  playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.mouseBuffer) {
        this.playMouseClick(false);
        return;
      }

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

  // 2. Mechanical Keyboard Switch Sound — real keyswitch.mp3 audio
  //    Loaded into AudioBuffer for polyphonic low-latency playback with pitch variation
  playKeySwitchClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Lazy-load the audio buffer on first call
      if (!this.keyswitchBuffer && !this.keyswitchLoading) {
        this.loadKeyswitchBuffer();
      }

      // Play real audio if buffer is ready
      if (this.keyswitchBuffer) {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();

        source.buffer = this.keyswitchBuffer;
        // Slight pitch variation (0.85–1.15x) so each keypress sounds unique
        source.playbackRate.value = 0.85 + Math.random() * 0.30;
        gainNode.gain.value = 0.5 + Math.random() * 0.3;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      }

      // ── Fallback synthesis if buffer not loaded yet ──
      const now = this.ctx.currentTime;
      const dest = this.ctx.destination;
      const oscA = this.ctx.createOscillator();
      const gainA = this.ctx.createGain();
      oscA.type = 'square';
      oscA.frequency.setValueAtTime(1800 + Math.random() * 200, now);
      oscA.frequency.exponentialRampToValueAtTime(400, now + 0.008);
      gainA.gain.setValueAtTime(0.055, now);
      gainA.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      oscA.connect(gainA); gainA.connect(dest);
      oscA.start(now); oscA.stop(now + 0.015);

    } catch { /* suppressed */ }
  }


  // 3. Typewriter Typing Sound — plays real keyboard.mp3 audio file
  //    Loads the buffer once, then plays a random slice with pitch/volume variation
  playTypingClick(char?: string) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Trigger buffer load on first call (async, non-blocking)
      if (!this.keyboardBuffer && !this.keyboardBufferLoading) {
        this.loadKeyboardBuffer();
        return; // skip first sound, buffer not ready yet
      }

      // If buffer loaded — play a random slice of the real recording
      if (this.keyboardBuffer) {
        const buf = this.keyboardBuffer;
        const duration = buf.duration;

        // Space/Enter = slightly slower playback (deeper pitch feel)
        const isHeavy = char === ' ' || char === '\n';

        // Random start point in the recording (avoid last 0.15s)
        const maxStart = Math.max(0, duration - 0.15);
        const offset = Math.random() * maxStart;

        // Each keystroke plays a 65–110ms slice — short enough to not overlap
        const sliceDuration = isHeavy ? 0.11 : 0.065 + Math.random() * 0.04;

        // Slight pitch variation: 0.90–1.12x (mimics different keys)
        const playbackRate = isHeavy
          ? 0.88 + Math.random() * 0.08
          : 0.92 + Math.random() * 0.20;

        // Volume: light touch, slightly random
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(isHeavy ? 0.55 : 0.45 + Math.random() * 0.15, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + sliceDuration);
        gainNode.connect(this.ctx.destination);

        const source = this.ctx.createBufferSource();
        source.buffer = buf;
        source.playbackRate.value = playbackRate;
        source.connect(gainNode);
        source.start(this.ctx.currentTime, offset, sliceDuration / playbackRate);
        return;
      }

      // ── Fallback synthesis (if file not available) ──
      const now = this.ctx.currentTime;
      const dest = this.ctx.destination;
      const isHeavy = char === ' ' || char === '\n';
      const isSoft = char ? /[.,;:\-\'"!?@#]/.test(char) : false;
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
