import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/sucasa-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sucasa — Coming Back to the Scene" },
      {
        name: "description",
        content:
          "Sucasa, Lucknow's event management company, is coming back to the scene.",
      },
      { property: "og:title", content: "Sucasa — Coming Back to the Scene" },
      {
        property: "og:description",
        content:
          "Sucasa, Lucknow's event management company, is coming back to the scene.",
      },
      { property: "og:image", content: logoAsset.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, oklch(0.35 0.05 265) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img
          src={logoAsset.url}
          alt="Sucasa"
          className="w-[min(80vw,520px)] select-none drop-shadow-[0_0_40px_oklch(1_0_0_/_0.15)]"
          draggable={false}
        />

        <h1 className="mt-12 text-2xl font-light tracking-[0.25em] uppercase text-foreground/90 sm:text-3xl md:text-4xl">
          Coming back to the scene
        </h1>

        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <span className="h-px w-10 bg-foreground/30" />
          <span>Lucknow</span>
          <span className="h-px w-10 bg-foreground/30" />
        </div>
      </div>
    </main>
  );
}
