/**
 * Web Audio API based Sports Car Engine Sound & Telemetry Synthesizer
 * Generates realistic procedural V8 / V10 / V12 roaring engine sounds and exhaust crackles
 * Completely lightweight and runs 100% locally in any modern browser!
 */

class EngineSoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNodes = [];
    this.filterNode = null;
    this.masterGain = null;
    this.analyser = null;
    this.currentRpm = 1000;
    this.targetRpm = 1000;
    this.animFrameId = null;
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.audioCtx = new AudioContextClass();

      // Master output
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);

      // Analyser for real-time visualizer soundwaves
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      // Lowpass filter for engine body resonance
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  startEngine(carType = 'v8') {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Base frequencies based on cylinder count
    let baseFreq = 45; // V8
    if (carType.includes('v10')) baseFreq = 52;
    if (carType.includes('v12')) baseFreq = 58;
    if (carType.includes('electric')) baseFreq = 75;

    // Harmonic oscillators for deep throaty roar
    const harmonics = [1, 2, 2.5, 3.75, 4.5];
    this.oscillators = [];
    this.gainNodes = [];

    harmonics.forEach((h, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = i === 0 ? 'sawtooth' : (i % 2 === 0 ? 'triangle' : 'sawtooth');
      osc.frequency.setValueAtTime(baseFreq * h, this.audioCtx.currentTime);

      const gainVal = i === 0 ? 0.45 : (0.35 / (i + 1));
      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });

    // Fade in master volume smoothly
    this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    this.masterGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.35, this.audioCtx.currentTime + 0.3);

    this.currentRpm = 1000;
    this.targetRpm = 1000;
    this.updateLoop();
  }

  setRpm(rpm) {
    this.targetRpm = Math.max(900, Math.min(rpm, 9500));
  }

  revThrottle(peakRpm = 8200) {
    if (!this.isPlaying) {
      this.startEngine();
    }
    this.setRpm(peakRpm);

    // Auto return to idle after burst
    setTimeout(() => {
      this.setRpm(1100);
    }, 1100);
  }

  updateLoop() {
    if (!this.isPlaying) return;

    // Smooth RPM interpolation
    const diff = this.targetRpm - this.currentRpm;
    this.currentRpm += diff * 0.12;

    if (this.audioCtx && this.oscillators.length > 0) {
      const baseFreq = 30 + (this.currentRpm / 9000) * 140;
      const harmonics = [1, 2, 2.5, 3.75, 4.5];

      this.oscillators.forEach((osc, i) => {
        try {
          osc.frequency.setValueAtTime(baseFreq * harmonics[i], this.audioCtx.currentTime);
        } catch (e) {}
      });

      if (this.filterNode) {
        const filterFreq = 350 + (this.currentRpm / 9000) * 2200;
        this.filterNode.frequency.setValueAtTime(filterFreq, this.audioCtx.currentTime);
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.updateLoop());
  }

  stopEngine() {
    if (!this.isPlaying || !this.audioCtx) return;

    this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 0.4);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
      }
    }, 450);
  }

  getByteFrequencyData() {
    if (!this.analyser) return new Uint8Array(16);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const engineSound = new EngineSoundSynthesizer();
