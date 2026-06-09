import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Party-themed background music synthesized via WebAudio.
 * Four-on-the-floor kick + offbeat hat + bass + chord stabs at ~118 BPM.
 * Starts when `enabled` is true. Tries autoplay; resumes on first gesture
 * if the browser blocks it.
 */
export function BackgroundMusic({ enabled = true }: { enabled?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  const start = useCallback(async () => {
    if (ctxRef.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterRef.current = master;

      // Subtle bus compression via lowpass to soften highs
      const bus = ctx.createBiquadFilter();
      bus.type = "lowpass";
      bus.frequency.value = 9000;
      bus.connect(master);

      const bpm = 118;
      const beat = 60 / bpm; // seconds per beat
      const bar = beat * 4;

      // ---------- Voices ----------
      const kick = (t: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.setValueAtTime(140, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(bus);
        o.start(t);
        o.stop(t + 0.28);
      };

      // Pre-build a noise buffer for hats
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

      const hat = (t: number, open = false) => {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 7000;
        const g = ctx.createGain();
        const dur = open ? 0.18 : 0.05;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(open ? 0.22 : 0.3, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(hp).connect(g).connect(bus);
        src.start(t);
        src.stop(t + dur + 0.02);
      };

      const bass = (t: number, freq: number, dur: number) => {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = freq;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(900, t);
        lp.frequency.exponentialRampToValueAtTime(220, t + dur);
        lp.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(lp).connect(g).connect(bus);
        o.start(t);
        o.stop(t + dur + 0.02);
      };

      const stab = (t: number, freqs: number[], dur: number) => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 3200;
        g.connect(lp).connect(bus);
        freqs.forEach((f) => {
          [-7, 0, 7].forEach((det) => {
            const o = ctx.createOscillator();
            o.type = "sawtooth";
            o.frequency.value = f;
            o.detune.value = det;
            o.connect(g);
            o.start(t);
            o.stop(t + dur + 0.02);
          });
        });
      };

      // ---------- Sequencer ----------
      // Chord progression: Am, F, C, G (party-friendly)
      // Bass roots and stab voicings
      const chords: Array<{ root: number; voicing: number[] }> = [
        { root: 110.0, voicing: [261.63, 329.63, 440.0] },     // Am: A C E
        { root: 87.31, voicing: [261.63, 349.23, 440.0] },     // F:  C F A
        { root: 130.81, voicing: [261.63, 329.63, 392.0] },    // C:  C E G
        { root: 98.0, voicing: [293.66, 392.0, 493.88] },      // G:  D G B
      ];

      let stopped = false;
      let nextTime = ctx.currentTime + 0.1;
      let bar_i = 0;

      const scheduleBar = (t0: number) => {
        const chord = chords[bar_i % chords.length];
        // Kick on every beat (four-on-the-floor)
        for (let b = 0; b < 4; b++) kick(t0 + b * beat);
        // Hats on offbeats
        for (let b = 0; b < 4; b++) hat(t0 + b * beat + beat / 2, b === 3);
        // Bass: root on 1 & 3, octave bounce on 2.5 & 4
        bass(t0, chord.root, beat * 0.9);
        bass(t0 + beat * 1.5, chord.root * 2, beat * 0.4);
        bass(t0 + beat * 2, chord.root, beat * 0.9);
        bass(t0 + beat * 3.5, chord.root * 2, beat * 0.4);
        // Chord stabs on the "and" of 2 and the "and" of 4
        stab(t0 + beat * 1 + beat / 2, chord.voicing, beat * 0.45);
        stab(t0 + beat * 3 + beat / 2, chord.voicing, beat * 0.45);
        bar_i++;
      };

      const tick = () => {
        if (stopped) return;
        const lookahead = ctx.currentTime + 0.6;
        while (nextTime < lookahead) {
          scheduleBar(nextTime);
          nextTime += bar;
        }
        setTimeout(tick, 150);
      };
      tick();

      // Fade in
      const now = ctx.currentTime;
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.28, now + 1.5);

      stopFnRef.current = () => {
        stopped = true;
      };

      setPlaying(true);
    } catch {
      // ignore
    }
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    stopFnRef.current?.();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        /* noop */
      }
      ctxRef.current = null;
      masterRef.current = null;
      stopFnRef.current = null;
      setPlaying(false);
    }, 900);
  }, []);

  // Auto-start when enabled. Try immediately, fall back to first gesture.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      await start();
      if (cancelled) return;
      const ctx = ctxRef.current;
      if (ctx && ctx.state === "suspended") {
        const resume = () => {
          ctx.resume().catch(() => {});
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, start]);

  useEffect(() => {
    return () => {
      stopFnRef.current?.();
      try {
        ctxRef.current?.close();
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : start())}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-background/80 backdrop-blur transition-colors hover:bg-foreground hover:text-background"
    >
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      )}
    </button>
  );
}
