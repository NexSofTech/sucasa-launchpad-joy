import { createFileRoute } from "@tanstack/react-router";
import { Intro } from "@/components/Intro";
import { BackgroundMusic } from "@/components/BackgroundMusic";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sucasa — Event Management" },
      {
        name: "description",
        content:
          "Sucasa is a premier event management company, crafting unforgettable weddings, corporate events, and celebrations.",
      },
      { property: "og:title", content: "Sucasa — Event Management" },
      {
        property: "og:description",
        content:
          "Sucasa is a premier event management company, crafting unforgettable weddings, corporate events, and celebrations.",
      },
    ],
  }),
  component: Index,
});

const logoFont = {
  fontFamily: "'Jura', sans-serif",
  fontWeight: 700,
  letterSpacing: "0.08em",
};

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={className} style={logoFont}>
      SUCASA
    </span>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Intro />
      <BackgroundMusic />


      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 sm:px-10">
        <nav className="flex items-center justify-between">
          <a href="#home" className="leading-none">
            <Logo className="text-2xl sm:text-3xl" />
          </a>
          <ul className="hidden gap-8 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex">
            <li><a href="#upcoming" className="hover:text-foreground transition-colors">Upcoming Events</a></li>
            <li><a href="#why" className="hover:text-foreground transition-colors">Why Sucasa</a></li>
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
            <span>Event Management</span>
            <span className="h-px w-10 bg-foreground/20" />
          </div>

          <a
            href="#contact"
            className="mt-12 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
          >
            Plan your event
          </a>
        </div>
      </main>

      {/* Upcoming Events */}
      <section id="upcoming" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">On the horizon</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Upcoming Events</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Summer Gala 2026", date: "June 2026", desc: "An evening of elegance, live music, and curated experiences under the stars." },
              { title: "Corporate Summit", date: "August 2026", desc: "A flagship gathering for industry leaders, innovators, and visionaries." },
              { title: "Wedding Showcase", date: "October 2026", desc: "A preview of breathtaking setups, floral artistry, and bespoke celebrations." },
            ].map((e) => (
              <div key={e.title} className="border border-foreground/10 p-8 transition-colors hover:border-foreground/40">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{e.date}</p>
                <h3 className="mt-3 text-xl font-semibold">{e.title}</h3>
                <p className="mt-3 text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sucasa */}
      <section id="why" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Why us</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Why Sucasa</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {[
              { n: "10+", label: "Years of experience" },
              { n: "250+", label: "Events delivered" },
              { n: "100%", label: "In-house execution" },
              { n: "24/7", label: "Client support" },
            ].map((i) => (
              <div key={i.label}>
                <p className="text-5xl font-bold tracking-tight">{i.n}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">{i.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { title: "Detail-obsessed", desc: "Every napkin fold, every light cue, every cue card — accounted for." },
              { title: "Local roots", desc: "Deeply networked across premium venues, artists, and craftsmen." },
              { title: "End-to-end", desc: "Concept, design, production, and on-ground delivery under one roof." },
            ].map((b) => (
              <div key={b.title}>
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-muted-foreground">{b.desc}</p>
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
              Crafting moments that last a lifetime.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Sucasa is an event management studio dedicated to
            transforming visions into living, breathing experiences. With an eye
            for detail and a passion for storytelling, we design events that
            linger long after the lights go down.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-foreground/10 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Contact us</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Let's create something unforgettable.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Tell us about your event and we'll be in touch within 24 hours.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</p>
              <a href="mailto:hello@sucasa.in" className="mt-2 block hover:underline">hello@sucasa.in</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Phone</p>
              <a href="tel:+910000000000" className="mt-2 block hover:underline">+91 00000 00000</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio</p>
              <p className="mt-2">India</p>
            </div>
          </div>
          <a
            href="mailto:hello@sucasa.in"
            className="mt-10 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background"
          >
            Start a conversation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo className="text-xl" />
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} Sucasa
          </p>
        </div>
      </footer>
    </div>
  );
}
