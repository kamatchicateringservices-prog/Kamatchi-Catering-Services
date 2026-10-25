import { createFileRoute, Link } from "@tanstack/react-router";
import tiffin from "@/assets/tiffin.jpg";
import sweets from "@/assets/sweets.jpg";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Kamatchi Catering" },
      {
        name: "description",
        content:
          "Kamatchi Catering, led by proprietor Pream Kumar M, serves traditional Tamil Nadu banana-leaf feasts for weddings, temple festivals and family functions.",
      },
      { property: "og:title", content: "About Kamatchi Catering" },
      {
        property: "og:description",
        content: "Traditional Tamil Nadu catering led by proprietor Pream Kumar M.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    tamil: "பாரம்பரியம்",
    title: "Tradition",
    desc: "Menus follow the classic Tamil order of service — from tiffin to thirukannamadhu.",
  },
  {
    tamil: "தூய்மை",
    title: "Purity",
    desc: "Pure veg cooked in one kitchen, non-veg in another, never the same vessels.",
  },
  {
    tamil: "விருந்தோம்பல்",
    title: "Hospitality",
    desc: "Servers trained to treat every guest like family — second helpings before you ask.",
  },
  {
    tamil: "நியாயம்",
    title: "Fair Pricing",
    desc: "Clear per-plate quotes with no hidden charges, for 50 guests or 5,000.",
  },
];

const steps = [
  {
    n: "01",
    title: "Share the occasion",
    desc: "Date, venue, guest count and preferences — veg, non-veg or both.",
  },
  {
    n: "02",
    title: "Menu tasting",
    desc: "We shortlist dishes and arrange a tasting at our kitchen.",
  },
  {
    n: "03",
    title: "Venue setup",
    desc: "Cooking stations, live counters and serving teams at your venue.",
  },
  {
    n: "04",
    title: "The virundhu",
    desc: "Hot food on the leaf, second helpings served till the last guest.",
  },
];

function AboutPage() {
  return (
    <div>
      {/* header */}
      <section className="bg-primary pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-gold-soft uppercase">
            எங்களைப் பற்றி
          </p>
          <h1 className="mt-3 font-display text-5xl font-black text-primary-foreground sm:text-6xl">
            The Kamatchi <span className="text-gradient-gold">Story</span>
          </h1>
        </div>
      </section>

      {/* story + owner */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-black sm:text-4xl">
              Named after the Goddess, <span className="text-gradient-gold">run like a family</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Kamatchi Catering was born from a simple belief — that a wedding feast is the memory
              guests carry home. Proprietor{" "}
              <span className="font-bold text-foreground">Pream Kumar M</span> built the kitchen
              around that idea: masalas ground fresh on stone, vegetables bought at the morning
              market, and rice cooked in brass pots the old way.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From a hundred-plate family function to a five-thousand-plate temple festival, the
              same cooks, the same recipes and the same promise — nobody leaves with an empty leaf.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <TiltCard className="rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary font-display text-4xl font-black text-primary-foreground shadow-lg">
                PM
              </div>
              <p className="mt-4 text-xs font-bold tracking-[0.3em] text-leaf uppercase">
                உரிமையாளர் · Proprietor
              </p>
              <h3 className="mt-1 font-display text-3xl font-black">Pream Kumar M</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                "A feast isn't just food on a leaf. It's how you tell your guests you're glad they
                came."
              </p>
              <div className="mt-5 flex justify-center gap-3 text-xs font-bold">
                <span className="rounded-full bg-muted px-4 py-1.5">Weddings</span>
                <span className="rounded-full bg-muted px-4 py-1.5">Temple Utsavams</span>
                <span className="rounded-full bg-muted px-4 py-1.5">Corporate</span>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* images band */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="scene-tight">
              <img
                src={tiffin}
                alt="Tiffin counter"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-72 w-full rounded-3xl border-4 border-leaf/60 object-cover shadow-lg"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="scene-tight">
              <img
                src={sweets}
                alt="Sweets and payasam"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-72 w-full rounded-3xl border-4 border-gold/60 object-cover shadow-lg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* values */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-black">
              What We <span className="text-gradient-gold">Stand By</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <TiltCard className="h-full rounded-2xl border border-border bg-card p-6 text-center shadow-md">
                  <p className="font-display text-2xl font-black text-gold">{v.tamil}</p>
                  <h3 className="mt-1 font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black">
            How a Feast <span className="text-gradient-gold">Comes Together</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-md">
                <p className="font-display text-5xl font-black text-accent">{s.n}</p>
                <h3 className="mt-2 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="inline-block rounded-full bg-primary px-9 py-3.5 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Start With Step One
          </Link>
        </div>
      </section>
    </div>
  );
}
