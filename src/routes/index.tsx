import { createFileRoute } from "@tanstack/react-router";

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
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1
          className="text-[clamp(4rem,15vw,10rem)] leading-none text-foreground"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Sucasa
        </h1>

        <h2 className="mt-10 text-2xl font-light tracking-[0.25em] uppercase text-foreground/80 sm:text-3xl md:text-4xl">
          Coming back to the scene
        </h2>

        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <span className="h-px w-10 bg-foreground/20" />
          <span>Lucknow</span>
          <span className="h-px w-10 bg-foreground/20" />
        </div>
      </div>
    </main>
  );
}
