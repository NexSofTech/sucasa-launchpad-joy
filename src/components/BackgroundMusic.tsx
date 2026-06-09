import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ambient background music synthesized via WebAudio.
 * No external audio file — generates a slow evolving pad chord
 * suitable for an event/landing experience.
 *
 * Browsers block autoplay, so playback starts on first user gesture
 * (we also expose a toggle button).
 */
export function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const lfoRef = useRef<OscillatorNode[]>([]);

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

      // Soft lowpass for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.6;
      filter.connect(master);

      // Lush chord: Cmaj9 voicing (C, E, G, B, D)
      const chord = [130.81, 164.81, 196.0, 246.94, 293.66];
      chord.forEach((freq, i) => {
        // Two detuned oscillators per note for chorus
        [-6, 6].forEach((detune) => {
          const o = ctx.createOscillator();
          o.type = i === 0 ? "sine" : "triangle";
          o.frequency.value = freq;
          o.detune.value = detune;
          const g = ctx.createGain();
          g.gain.value = i === 0 ? 0.16 : 0.09;

          // Slow amplitude LFO for breathing motion
          const lfo = ctx.createOscillator();
          lfo.frequency.value = 0.05 + i * 0.03;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 0.04;
          lfo.connect(lfoGain).connect(g.gain);
          lfo.start();
          lfoRef.current.push(lfo);

          o.connect(g).connect(filter);
          o.start();
          nodesRef.current.push(o);
        });
      });

      // Fade in
      const now = ctx.currentTime;
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.22, now + 3);

      setPlaying(true);
    } catch {
      // ignore
    }
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.2);
    setTimeout(() => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* noop */
        }
      });
      lfoRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* noop */
        }
      });
      nodesRef.current = [];
      lfoRef.current = [];
      try {
        ctx.close();
      } catch {
        /* noop */
      }
      ctxRef.current = null;
      masterRef.current = null;
      setPlaying(false);
    }, 1300);
  }, []);

  // Try autoplay on first user interaction anywhere on the page
  useEffect(() => {
    const onFirstGesture = () => {
      start();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [start]);

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* noop */
        }
      });
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
