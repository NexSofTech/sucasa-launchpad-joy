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
 * 3. Two white "doors" split apart revealing the page
 * 4. A soft cinematic chord swells via WebAudio
 */
export function Intro({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<"logo" | "open" | "gone">("logo");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Soft cinematic chord (best effort — browsers may block until gesture)
    let ctx: AudioContext | null = null;
    try {
      const AC =
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        ctx = new AC();
        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.18, now + 1.2);
        master.gain.linearRampToValueAtTime(0.22, now + 2.8);
        master.gain.linearRampToValueAtTime(0, now + 4.2);
        master.connect(ctx.destination);

        // C major-ish chord with a low pad
        [130.81, 196.0, 261.63, 392.0].forEach((freq, i) => {
          const o = ctx!.createOscillator();
          o.type = i === 0 ? "sine" : "triangle";
          o.frequency.value = freq;
          const g = ctx!.createGain();
          g.gain.value = i === 0 ? 0.5 : 0.25;
          o.connect(g).connect(master);
          o.start(now);
          o.stop(now + 4.3);
        });
      }
    } catch {
      // ignore audio errors
    }

    const t1 = setTimeout(() => setPhase("open"), 1500);
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
        {/* subtle inner edge shadow when opening */}
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
