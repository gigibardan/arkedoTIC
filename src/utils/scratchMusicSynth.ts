// Web Audio API note synthesizer for Scratch Music Extension
// MIDI note mapping: 60 = C4 (Do), 62 = D4 (Re), 64 = E4 (Mi), 65 = F4 (Fa), 67 = G4 (Sol), 69 = A4 (La), 71 = B4 (Si), 72 = C5 (Do)

class ScratchMusicSynth {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Convert MIDI note number to frequency in Hertz
  public midiToFreq(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // Play a musical note with envelope (attack, decay, sustain, release)
  public playNote(midiNote: number, durationSeconds: number = 0.5, instrumentType: 'piano' | 'synth' | 'flute' = 'piano') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      const freq = this.midiToFreq(midiNote);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      if (instrumentType === 'piano') {
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      } else if (instrumentType === 'flute') {
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      } else {
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      }

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSeconds);
    } catch {
      // Audio context might be blocked prior to user interaction
    }
  }
}

export const scratchSynth = new ScratchMusicSynth();
