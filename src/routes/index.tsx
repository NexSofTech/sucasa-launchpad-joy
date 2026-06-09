import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sucasa — Event Management in Lucknow" },
      {
        name: "description",
        content:
          "Sucasa is Lucknow's premier event management company, crafting unforgettable weddings, corporate events, and celebrations.",
      },
      { property: "og:title", content: "Sucasa — Event Management in Lucknow" },
      {
        property: "og:description",
        content:
          "Sucasa is Lucknow's premier event management company, crafting unforgettable weddings, corporate events, and celebrations.",
      },
    ],
  }),
  component: Index,
});

const scriptFont = { fontFamily: "'Great Vibes', cursive" };

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 sm:px-10">
        <nav className="flex items-center justify-between">
          <a href="#home" className="text-3xl leading-none sm:text-4xl" style={scriptFont}>
            Sucasa
          </a>
          <ul className="hidden gap-8 text-sm uppercase tracking-[0.2em] text-muted-foreground md:flex">
            <li><a href="#services" className="hover:text-foreground transition-colors">Services</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <main
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      >
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
            Coming back
            <br />
            to the scene
          </h1>

          <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            <span className="h-px w-10 bg-foreground/20" />
            <span>Lucknow</span>
            <span className="h-px w-10 bg-foreground/20" />
          </div>
        </div>
      </main>

      {/* Services */}
      <section id="services" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">What we do</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Services</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Weddings", desc: "Bespoke wedding design, planning, and flawless execution." },
              { title: "Corporate Events", desc: "Conferences, launches, and brand activations with impact." },
              { title: "Private Celebrations", desc: "Birthdays, anniversaries, and intimate gatherings to remember." },
            ].map((s) => (
              <div key={s.title} className="border border-foreground/10 p-8 transition-colors hover:border-foreground/40">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">About</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Crafting moments in the heart of Lucknow.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Sucasa is an event management studio rooted in Lucknow, dedicated to
            transforming visions into living, breathing experiences. With an eye
            for detail and a passion for storytelling, we design events that
            linger long after the lights go down.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Get in touch</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Let's create something unforgettable.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Reach out to plan your next event with Sucasa.
          </p>
          <a
            href="mailto:hello@sucasa.in"
            className="mt-8 inline-block border border-foreground px-8 py-3 text-sm uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
          >
            hello@sucasa.in
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-2xl" style={scriptFont}>Sucasa</span>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} Sucasa · Lucknow
          </p>
        </div>
      </footer>
    </div>
  );
}
