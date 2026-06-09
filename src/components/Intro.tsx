import { useEffect, useRef, useState } from "react";

const logoFont = {
  fontFamily: "'Jura', sans-serif",
  fontWeight: 700,
  letterSpacing: "0.08em",
};

/**
 * Door-opening splash intro:
 * 1. Solid white screen
 * 2. SUCASA logo fades in
 * 3. A katana "slice" sound triggers as two white "doors" split apart
 * 4. onDone fires once the doors are fully out of frame
 */
export function Intro({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<"logo" | "open" | "gone">("logo");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let ctx: AudioContext | null = null;
    const AC =
      (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      try {
        ctx = new AC();
      } catch {
        ctx = null;
      }
    }

    const playKatanaSlice = (when: number) => {
      if (!ctx) return;
      const dur = 0.55;

      // White noise buffer
      const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass swept from high to low → metallic "shing"
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 8;
      bp.frequency.setValueAtTime(6000, when);
      bp.frequency.exponentialRampToValueAtTime(900, when + dur);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, when);
      noiseGain.gain.exponentialRampToValueAtTime(0.6, when + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

      noise.connect(bp).connect(noiseGain).connect(ctx.destination);
      noise.start(when);
      noise.stop(when + dur);

      // Pitched "ring" sweep for the blade tone
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(2400, when);
      osc.frequency.exponentialRampToValueAtTime(380, when + dur * 0.9);
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.0001, when);
      oscGain.gain.exponentialRampToValueAtTime(0.25, when + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(oscGain).connect(ctx.destination);
      osc.start(when);
      osc.stop(when + dur);
    };

    const t1 = setTimeout(() => {
      setPhase("open");
      if (ctx) playKatanaSlice(ctx.currentTime + 0.0);
    }, 1500);
    const t2 = setTimeout(() => {
      setPhase("gone");
      onDone?.();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      try {
        ctx?.close();
      } catch {
        // noop
      }
    };
  }, [onDone]);

  if (phase === "gone") return null;

  const open = phase === "open";

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    >
      {/* Left door */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-white overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: open ? "translateX(-100%)" : "translateX(0)" }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 whitespace-nowrap text-black"
          style={{ ...logoFont, fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          <span
            className="inline-block transition-opacity duration-700"
            style={{ opacity: phase === "logo" || open ? 1 : 0 }}
          >
            SUCASA
          </span>
        </div>
        <div
          className="absolute top-0 right-0 h-full w-8 transition-opacity duration-500"
          style={{
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(to left, rgba(0,0,0,0.15), rgba(0,0,0,0))",
          }}
        />
      </div>

      {/* Right door */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-white overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: open ? "translateX(100%)" : "translateX(0)" }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 whitespace-nowrap text-black"
          style={{ ...logoFont, fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          <span
            className="inline-block transition-opacity duration-700"
            style={{ opacity: phase === "logo" || open ? 1 : 0 }}
          >
            SUCASA
          </span>
        </div>
        <div
          className="absolute top-0 left-0 h-full w-8 transition-opacity duration-500"
          style={{
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0))",
          }}
        />
      </div>
    </div>
  );
}
