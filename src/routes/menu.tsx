import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { menuCategories } from "@/data/menu";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Full Menu · முழு மெனு — Kamatchi Catering · காமாட்சி கேட்டரிங்" },
      {
        name: "description",
        content:
          "200+ traditional Tamil Nadu dishes in both Tamil and English — tiffin, chutneys, kuzhambu, sambar, rasam, kootu, poriyal, variety rice, biryani, non-veg specials, sweets and payasam. காமாட்சி கேட்டரிங் வழங்கும் 200+ பாரம்பரிய உணவு வகைகள்.",
      },
      { property: "og:title", content: "Kamatchi Catering — Full Menu · முழு மெனு" },
      {
        property: "og:description",
        content:
          "200+ traditional Tamil Nadu dishes for weddings, temple festivals and family functions. தமிழ் மற்றும் ஆங்கிலத்தில் உணவு பட்டியல்.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const total = menuCategories.reduce((n, c) => n + c.dishes.length, 0);

  const filteredCategories = menuCategories
    .map((cat) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return cat;
      const matchedDishes = cat.dishes.filter(
        (d) => d.name.toLowerCase().includes(q) || d.tamil.toLowerCase().includes(q),
      );
      return { ...cat, dishes: matchedDishes };
    })
    .filter((cat) => cat.dishes.length > 0);

  return (
    <div>
      {/* ================= HEADER BAND ================= */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-16">
        <div className="steam-puff absolute top-10 left-[20%] h-16 w-32 opacity-40" />
        <div
          className="steam-puff absolute top-16 left-[55%] h-16 w-28 opacity-30"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-gold-soft uppercase">
            முழு மெனு பட்டியல் · COMPLETE FEAST DIRECTORY
          </p>
          <h1 className="mt-3 font-display text-4xl font-black text-primary-foreground sm:text-6xl">
            The Full <span className="text-gradient-gold">Kamatchi Menu</span>
          </h1>
          <p className="mt-2 font-display text-2xl font-extrabold text-gold-soft sm:text-3xl">
            முழு காமாட்சி கேட்டரிங் மெனு
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 sm:text-lg">
            {total}+ dishes across {menuCategories.length} authentic categories — mix and match for
            your wedding, temple festival, or family feast.
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-primary-foreground/75 sm:text-base">
            {menuCategories.length} பிரிவுகளில் {total}+ பாரம்பரிய உணவுகள் — உங்கள் இல்லத்
            திருமணங்கள் மற்றும் விசேஷங்களுக்கு சுடச்சுட சமைத்து வாழை இலையில் பரிமாறப்படும்.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="glow-pulse inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-display text-base font-bold text-deep shadow-lg transition-transform hover:scale-105"
            >
              <span>Plan Your Menu · மெனு திட்டமிடுங்கள்</span>
              <span>→</span>
            </Link>
            <a
              href="tel:+917824889665"
              className="inline-flex items-center gap-2 rounded-full border border-gold-soft/50 bg-deep/40 px-6 py-3.5 font-display text-sm font-bold text-gold-soft backdrop-blur transition-colors hover:border-gold hover:bg-deep/60"
            >
              <span>📞 +91 78248 89665</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= STICKY SEARCH & CATEGORY NAV ================= */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 py-3 shadow-xs backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                🔍
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="தேடுங்கள் / Search dishes (e.g. Biryani, சாம்பார்)..."
                className="w-full rounded-full border border-border bg-card py-2 pr-4 pl-9 text-xs font-medium outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            <p className="text-right text-xs font-semibold text-muted-foreground">
              {searchTerm
                ? `தேடல் முடிவுகள் · Results: ${filteredCategories.reduce((s, c) => s + c.dishes.length, 0)} உணவுகள்`
                : `${menuCategories.length} பிரிவுகள் · Categories`}
            </p>
          </div>

          {/* Quick-jump category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {menuCategories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold whitespace-nowrap text-foreground transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground"
              >
                <span>{c.tamil}</span> <span className="text-muted-foreground">· {c.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES & DISHES ================= */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        {filteredCategories.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🍃</span>
            <p className="mt-3 font-display text-xl font-bold">
              உணவு காணப்படவில்லை · No Dishes Found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching with another keyword or clear the search.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
            >
              Show All Dishes · அனைத்து உணவுகளையும் காட்டு
            </button>
          </div>
        ) : (
          filteredCategories.map((cat, idx) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-40 py-10">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-accent/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-leaf/15 px-3 py-0.5 text-xs font-bold text-leaf">
                        பிரிவு · {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-deep dark:text-gold-soft">
                        {cat.dishes.length} உணவுகள் · Items
                      </span>
                    </div>

                    <h2 className="mt-2 font-display text-3xl font-black text-foreground sm:text-4xl">
                      {cat.tamil}
                      <span className="ml-2 font-display text-2xl font-bold text-muted-foreground sm:text-3xl">
                        · {cat.title}
                      </span>
                    </h2>

                    <div className="mt-2 space-y-0.5">
                      <p className="text-sm font-semibold text-leaf">{cat.blurbTamil}</p>
                      <p className="text-xs text-muted-foreground">{cat.blurb}</p>
                    </div>
                  </div>

                  <a
                    href="#top"
                    className="text-xs font-bold text-muted-foreground hover:text-primary"
                  >
                    ↑ மேலே செல்க · Back to top
                  </a>
                </div>
              </Reveal>

              {/* Dish Cards in 2 languages */}
              <div className="scene mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.dishes.map((dish) => (
                  <TiltCard
                    key={dish.name}
                    maxTilt={5}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4.5 shadow-xs transition-all hover:border-gold/60 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-xs text-leaf transition-transform duration-300 group-hover:scale-125">
                        🍃
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                          {dish.tamil}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold tracking-wide text-muted-foreground">
                          {dish.name}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.35em] text-leaf uppercase">
              தனிப்பயன் விருந்து · CUSTOM FEAST COMPOSITION
            </p>
            <h2 className="mt-3 font-display text-3xl font-black text-foreground sm:text-5xl">
              Can't Decide? <span className="text-gradient-gold">We'll Compose Your Feast</span>
            </h2>
            <p className="mt-2 font-display text-xl font-bold text-primary sm:text-2xl">
              முடிவு செய்ய சிரமமா? உங்கள் விருந்தை நாங்கள் திட்டமிடுகிறோம்!
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Share your event date, expected guest count, and dietary preferences. Proprietor Pream
              Kumar M will custom-design the ideal banana-leaf virundhu menu in traditional Tamil
              sequence.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground/80">
              உங்கள் விசேஷத்தின் தேதி, விருந்தினர் எண்ணிக்கை மற்றும் விருப்பங்களை தெரிவித்தால்,
              பாரம்பரிய முறைப்படி மிகச்சிறந்த வாழை இலை மெனுவை நாங்கள் வடிவமைத்து தருகிறோம்.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="glow-pulse rounded-full bg-primary px-8 py-4 font-display text-base font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                Plan a Feast · மெனு முன்பதிவு 🪔
              </Link>
              <a
                href="https://wa.me/917824889665?text=Vanakkam%20Kamatchi%20Catering,%20I%20would%20like%20to%20plan%20a%20menu."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-primary bg-card px-8 py-4 font-display text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                WhatsApp: +91 78248 89665 💬
              </a>
              <a
                href="tel:+917824889665"
                className="rounded-full border-2 border-primary bg-card px-8 py-4 font-display text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Call Directly · அழைக்க: +91 78248 89665 📞
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
