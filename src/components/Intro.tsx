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

    const playKatanaSlice = (start: number) => {
      if (!ctx) return;
      const master = ctx.createGain();
      master.gain.value = 1.0;
      master.connect(ctx.destination);

      // 1) Sharp "whoosh" — short white noise burst, fast bandpass sweep high→low
      const whooshDur = 0.22;
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * whooshDur, ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const nbp = ctx.createBiquadFilter();
      nbp.type = "bandpass";
      nbp.Q.value = 4;
      nbp.frequency.setValueAtTime(8000, start);
      nbp.frequency.exponentialRampToValueAtTime(600, start + whooshDur);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, start);
      ng.gain.exponentialRampToValueAtTime(0.9, start + 0.008);
      ng.gain.exponentialRampToValueAtTime(0.0001, start + whooshDur);
      noise.connect(nbp).connect(ng).connect(master);
      noise.start(start);
      noise.stop(start + whooshDur);

      // 2) Metallic "shing" — high resonant ring (two detuned partials)
      const shingStart = start + 0.05;
      const shingDur = 0.7;
      [3200, 4800].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(f, shingStart);
        o.frequency.exponentialRampToValueAtTime(f * 0.55, shingStart + shingDur);
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.Q.value = 22;
        bp.frequency.setValueAtTime(f, shingStart);
        bp.frequency.exponentialRampToValueAtTime(f * 0.55, shingStart + shingDur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, shingStart);
        g.gain.exponentialRampToValueAtTime(i === 0 ? 0.35 : 0.22, shingStart + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, shingStart + shingDur);
        o.connect(bp).connect(g).connect(master);
        o.start(shingStart);
        o.stop(shingStart + shingDur);
      });

      // 3) Low thunk — short body impact when the blade lands
      const thunkStart = start + 0.02;
      const thunk = ctx.createOscillator();
      thunk.type = "sine";
      thunk.frequency.setValueAtTime(160, thunkStart);
      thunk.frequency.exponentialRampToValueAtTime(45, thunkStart + 0.18);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.0001, thunkStart);
      tg.gain.exponentialRampToValueAtTime(0.5, thunkStart + 0.005);
      tg.gain.exponentialRampToValueAtTime(0.0001, thunkStart + 0.2);
      thunk.connect(tg).connect(master);
      thunk.start(thunkStart);
      thunk.stop(thunkStart + 0.22);
    };

    const t1 = setTimeout(() => {
      setPhase("open");
      if (ctx) {
        // Resume in case context started suspended
        ctx.resume?.().catch(() => {});
        playKatanaSlice(ctx.currentTime + 0.0);
      }
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
