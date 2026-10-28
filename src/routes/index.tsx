import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroFeast from "@/assets/hero-feast.jpg";
import biryani from "@/assets/biryani.jpg";
import tiffin from "@/assets/tiffin.jpg";
import sweets from "@/assets/sweets.jpg";
import { menuCategories } from "@/data/menu";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kamatchi Catering — Tamil Nadu Wedding & Event Catering" },
      {
        name: "description",
        content:
          "Traditional Tamil Nadu banana-leaf catering for weddings, temple festivals and family functions. 200+ dishes — tiffin, kuzhambu, biryani, payasam and more.",
      },
      { property: "og:title", content: "Kamatchi Catering" },
      {
        property: "og:description",
        content:
          "Traditional Tamil Nadu banana-leaf catering for weddings, temple festivals and family functions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: Home,
});

const marqueeDishes = [
  "Idli",
  "Sambar",
  "Mutton Biryani",
  "Ven Pongal",
  "Kesari",
  "Puliyodharai",
  "Mor Kuzhambu",
  "Chicken 65",
  "Mysore Pak",
  "Aviyal",
  "Rasam",
  "Semiya Payasam",
  "Medu Vadai",
  "Fish Varuval",
  "Thengai Saadham",
  "Gulab Jamun",
];

const occasions = [
  {
    tamil: "கல்யாண விருந்து",
    title: "Weddings & Receptions",
    desc: "The full kalyana virundhu — breakfast to grand lunch with live counters.",
    icon: "🌸",
  },
  {
    tamil: "கிரகப்பிரவேசம்",
    title: "Housewarming",
    desc: "Auspicious menus with payasam, puliyodharai and vadai done right.",
    icon: "🏠",
  },
  {
    tamil: "கோவில் உற்சவம்",
    title: "Temple Festivals",
    desc: "Large-scale annadhanam and utsavam catering, pure vegetarian.",
    icon: "🪔",
  },
  {
    tamil: "நிறுவன & பிறந்தநாள்",
    title: "Corporate & Birthdays",
    desc: "Biryani parties, tiffin counters and dessert tables for any size.",
    icon: "🎉",
  },
];

const whys = [
  {
    tamil: "வாசனை",
    title: "Stone-ground masalas",
    desc: "Fresh-ground sambar podi and rasam podi, never packet mixes.",
  },
  {
    tamil: "இலை",
    title: "Banana leaf service",
    desc: "Traditional virundhu served on the leaf, by uniformed servers.",
  },
  {
    tamil: "சுத்தம்",
    title: "Hygiene first",
    desc: "FSSAI-compliant kitchen practices and sealed water service.",
  },
  {
    tamil: "தரம்",
    title: "Live counters",
    desc: "Hot dosa, bajji and payasam counters at your venue.",
  },
];

function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [eventPhotos, setEventPhotos] = useState<
    { id: number; title: string; title_tamil?: string; image_url: string; event_type?: string }[]
  >([]);
  const [homeReviews, setHomeReviews] = useState<
    {
      id: number;
      name: string;
      rating: number;
      comment: string;
      location?: string;
      event_type?: string;
    }[]
  >([]);

  useEffect(() => {
    supabase
      .from("event_photos")
      .select("id, title, title_tamil, image_url, event_type")
      .order("id", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setEventPhotos(data);
      });

    supabase
      .from("reviews")
      .select("id, name, rating, comment, location, event_type")
      .order("id", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setHomeReviews(data);
      });
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section
        className="scene relative flex min-h-screen items-center overflow-hidden"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({
            x: ((e.clientX - r.left) / r.width - 0.5) * 2,
            y: ((e.clientY - r.top) / r.height - 0.5) * 2,
          });
        }}
      >
        {/* backdrop */}
        <img
          src={heroFeast}
          alt="Traditional Tamil Nadu banana leaf feast"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-deep/90 via-deep/60 to-deep/20" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-deep/40" />

        {/* steam wisps */}
        <div className="steam-puff absolute top-[22%] left-[30%] h-16 w-32" />
        <div
          className="steam-puff absolute top-[30%] left-[34%] h-14 w-24"
          style={{ animationDelay: "1.4s" }}
        />
        <div
          className="steam-puff absolute top-[18%] left-[46%] h-16 w-28"
          style={{ animationDelay: "2.2s" }}
        />

        {/* floating dish cards (3D parallax) */}
        <div
          className="preserve-3d absolute inset-0 hidden lg:block"
          style={{ transform: `rotateY(${tilt.x * 4}deg) rotateX(${tilt.y * -4}deg)` }}
        >
          <div
            className="floaty absolute top-[16%] right-[16%] w-56 xl:w-64"
            style={{ transform: `translate3d(${tilt.x * 14}px, ${tilt.y * 10}px, 90px)` }}
          >
            <img
              src={biryani}
              alt="Dum biryani in brass handi"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full rounded-3xl border-4 border-gold/70 object-cover shadow-2xl shadow-black/50"
            />
            <p className="mt-2 rounded-full bg-deep/80 px-3 py-1 text-center text-xs font-bold text-gold-soft backdrop-blur">
              Mutton & Chicken Biryani
            </p>
          </div>
          <div
            className="floaty-slow absolute top-[52%] right-[30%] w-48 xl:w-56"
            style={{ transform: `translate3d(${tilt.x * -22}px, ${tilt.y * -14}px, 60px)` }}
          >
            <img
              src={tiffin}
              alt="Idli dosai tiffin spread"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full rounded-3xl border-4 border-leaf/80 object-cover shadow-2xl shadow-black/50"
            />
            <p className="mt-2 rounded-full bg-deep/80 px-3 py-1 text-center text-xs font-bold text-gold-soft backdrop-blur">
              Morning Tiffin Counter
            </p>
          </div>
          <div
            className="floaty absolute top-[70%] right-[8%] w-44 xl:w-52"
            style={{
              transform: `translate3d(${tilt.x * 30}px, ${tilt.y * 18}px, 120px)`,
              animationDelay: "1.8s",
            }}
          >
            <img
              src={sweets}
              alt="Mysore pak, laddu and payasam"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full rounded-3xl border-4 border-gold/70 object-cover shadow-2xl shadow-black/50"
            />
            <p className="mt-2 rounded-full bg-deep/80 px-3 py-1 text-center text-xs font-bold text-gold-soft backdrop-blur">
              Sweets & Payasam
            </p>
          </div>
        </div>

        {/* spinning seal */}
        <div className="absolute top-24 right-10 hidden h-28 w-28 xl:block">
          <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-gold/60" />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-deep/70 backdrop-blur">
            <span className="font-display text-3xl font-bold text-gold">க</span>
          </div>
        </div>

        {/* copy */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-deep/60 px-3.5 py-1 text-[11px] sm:text-xs font-bold tracking-[0.25em] text-gold-soft uppercase backdrop-blur">
              🪔 விருந்து சாப்பாடு · Since Tamil Nadu
            </p>
            <h1 className="mt-4 sm:mt-6 font-display text-4xl leading-[1.08] font-black text-primary-foreground drop-shadow-xl xs:text-5xl sm:text-6xl xl:text-7xl">
              Kamatchi
              <span className="text-gradient-gold block">Catering</span>
            </h1>
            <p className="mt-2 sm:mt-3 font-body text-lg sm:text-xl font-semibold text-gold-soft">
              காமாட்சி கேட்டரிங்
            </p>
            <p className="mt-3 sm:mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-primary-foreground/90">
              Weddings, temple festivals and family functions catered the traditional way —
              stone-ground masalas, dum-cooked biryani and a full{" "}
              <span className="font-bold text-gold-soft">banana leaf virundhu</span> served hot at
              your venue.
            </p>

            {/* Mobile 3D Animated Floating Dishes Strip */}
            <div className="mt-6 block lg:hidden">
              <p className="mb-2.5 text-[11px] font-bold tracking-widest text-gold-soft uppercase">
                ✨ மணக்கும் விருந்து சிறப்புகள் · Signature Feasts
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                <div className="floaty-mobile shrink-0 w-40 snap-start rounded-2xl border-2 border-gold/60 bg-deep/85 p-2 shadow-xl backdrop-blur-md">
                  <img
                    src={biryani}
                    alt="Dum biryani"
                    width={200}
                    height={200}
                    className="h-20 w-full rounded-xl object-cover"
                  />
                  <div className="p-1 text-center">
                    <p className="text-xs font-bold text-primary-foreground truncate">Dum Biryani</p>
                    <p className="text-[10px] font-medium text-gold-soft">தம் பிரியாணி</p>
                  </div>
                </div>
                <div
                  className="floaty-mobile shrink-0 w-40 snap-start rounded-2xl border-2 border-leaf/70 bg-deep/85 p-2 shadow-xl backdrop-blur-md"
                  style={{ animationDelay: "1.2s" }}
                >
                  <img
                    src={tiffin}
                    alt="Morning tiffin"
                    width={200}
                    height={200}
                    className="h-20 w-full rounded-xl object-cover"
                  />
                  <div className="p-1 text-center">
                    <p className="text-xs font-bold text-primary-foreground truncate">Morning Tiffin</p>
                    <p className="text-[10px] font-medium text-leaf-soft">காலை டிபன்</p>
                  </div>
                </div>
                <div
                  className="floaty-mobile shrink-0 w-40 snap-start rounded-2xl border-2 border-gold/60 bg-deep/85 p-2 shadow-xl backdrop-blur-md"
                  style={{ animationDelay: "2.4s" }}
                >
                  <img
                    src={sweets}
                    alt="Sweets and Payasam"
                    width={200}
                    height={200}
                    className="h-20 w-full rounded-xl object-cover"
                  />
                  <div className="p-1 text-center">
                    <p className="text-xs font-bold text-primary-foreground truncate">Sweets & Payasam</p>
                    <p className="text-[10px] font-medium text-gold-soft">இனிப்பு & பாயாசம்</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                to="/menu"
                className="w-full sm:w-auto text-center glow-pulse rounded-full bg-gold px-8 py-3.5 font-display text-base font-bold text-deep shadow-xl transition-transform active:scale-95 hover:scale-105"
              >
                Explore the Menu · மெனு
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center rounded-full border-2 border-primary-foreground/40 bg-primary-foreground/10 px-8 py-3.5 font-display text-base font-bold text-primary-foreground backdrop-blur transition-all active:scale-95 hover:border-gold hover:text-gold-soft"
              >
                Book Your Feast · முன்பதிவு
              </Link>
              <a
                href="https://wa.me/917824889665?text=Hello%20Kamatchi%20Catering,%20I%20would%20like%20to%20inquire%20about%20catering%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#20ba59]"
              >
                <span>💬 WhatsApp Quick Inquiry</span>
              </a>
            </div>

            {/* Mobile-optimized glassmorphic stats bar */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-gold/40 bg-deep/75 p-3 text-center backdrop-blur-md shadow-lg sm:mt-10 sm:p-4">
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-2xl sm:text-3xl font-black text-gold">200+</p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
                  Dishes · உணவுகள்
                </p>
              </div>
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-sm sm:text-xl font-black text-gold leading-tight">
                  Veg & Non-Veg
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
                  Separate Kitchens
                </p>
              </div>
              <div className="px-1.5 sm:px-2">
                <p className="font-display text-2xl sm:text-3xl font-black text-gold">Live</p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
                  Counters · அரங்குகள்
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="overflow-hidden bg-primary py-4">
        <div className="marquee-track flex w-max gap-10">
          {[...marqueeDishes, ...marqueeDishes].map((d, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-display text-lg font-semibold whitespace-nowrap text-gold-soft"
            >
              {d} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ================= FEATURED ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
        <Reveal>
          <p className="text-center text-xs font-bold tracking-[0.35em] text-leaf uppercase">
            சுவையான சிறப்புகள் · SIGNATURE FEASTS
          </p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl lg:text-5xl font-black">
            Our Signature <span className="text-gradient-gold">Feast Categories</span>
          </h2>
        </Reveal>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-8 md:grid-cols-3">
          {[
            { img: tiffin, cat: menuCategories[0]! },
            { img: biryani, cat: menuCategories.find((c) => c.id === "biryani")! },
            { img: sweets, cat: menuCategories.find((c) => c.id === "sweets")! },
          ].map(({ img, cat }, i) => (
            <Reveal key={cat.id} delay={i * 120}>
              <Link to="/menu" className="block active:scale-[0.98] transition-transform">
                <TiltCard className="group overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                  <div className="overflow-hidden">
                    <img
                      src={img}
                      alt={cat.title}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-48 sm:h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold tracking-[0.25em] text-leaf">{cat.tamil}</p>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold">{cat.title}</h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {cat.blurb}
                    </p>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-primary">
                      {cat.dishes.length}+ உணவுகள் · items →
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= OCCASIONS ================= */}
      <section className="bg-muted py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-center text-xs font-bold tracking-[0.35em] text-leaf uppercase">
              நாங்கள் சமைக்கும் நிகழ்வுகள் · OCCASIONS
            </p>
            <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl lg:text-5xl font-black">
              Every Occasion, <span className="text-gradient-gold">One Kitchen</span>
            </h2>
          </Reveal>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {occasions.map((o, i) => (
              <Reveal key={o.title} delay={i * 100}>
                <TiltCard className="h-full rounded-2xl border border-border bg-card p-5 sm:p-6 text-center shadow-md active:scale-[0.98] transition-transform">
                  <div className="sway mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent/40 text-2xl sm:text-3xl">
                    {o.icon}
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs font-bold tracking-[0.2em] text-primary">
                    {o.tamil}
                  </p>
                  <h3 className="mt-1 font-display text-lg sm:text-xl font-bold">{o.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">{o.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY KAMATCHI ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.35em] text-leaf uppercase">ஏன் காமாட்சி?</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-black">
              Cooked Like Home, <span className="text-gradient-gold">Served Like a Wedding</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kamatchi Catering is run by proprietor{" "}
              <span className="font-bold text-foreground">Pream Kumar M</span> — a kitchen that
              treats every function like a family wedding: fresh produce from the morning market,
              masalas ground on the stone, and servers who never let your leaf go empty.
            </p>
            <Link
              to="/about"
              className="mt-5 sm:mt-6 inline-block rounded-full border-2 border-primary px-6 sm:px-7 py-2.5 sm:py-3 font-display text-sm sm:text-base font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              Our Story · எங்கள் வரலாறு
            </Link>
          </Reveal>
          <div className="grid gap-3 sm:gap-5 grid-cols-2">
            {whys.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <TiltCard className="h-full rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md">
                  <p className="font-display text-xl sm:text-2xl font-black text-gold">{w.tamil}</p>
                  <h3 className="mt-1 font-display text-base sm:text-lg font-bold">{w.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{w.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMPLETED EVENTS GALLERY ================= */}
      {eventPhotos.length > 0 && (
        <section className="bg-muted py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="text-center text-xs font-bold tracking-[0.35em] text-leaf uppercase">
                நிறைவுற்ற நிகழ்வுகள் · COMPLETED EVENTS
              </p>
              <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl lg:text-5xl font-black">
                Moments from Our <span className="text-gradient-gold">Recent Feasts</span>
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-xs sm:text-base text-muted-foreground">
                நாங்கள் சமைத்து பரிமாறிய கல்யாண விருந்து மற்றும் விசேஷங்களின் புகைப்படங்கள்.
              </p>
            </Reveal>

            <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventPhotos.map((photo, i) => (
                <Reveal key={photo.id} delay={i * 100}>
                  <TiltCard className="group overflow-hidden rounded-3xl border border-border bg-card shadow-md active:scale-[0.98] transition-transform">
                    <div className="overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="h-52 sm:h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      {photo.event_type && (
                        <span className="rounded-full bg-leaf/15 px-3 py-0.5 text-xs font-bold text-leaf">
                          {photo.event_type}
                        </span>
                      )}
                      <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-foreground">
                        {photo.title}
                      </h3>
                      {photo.title_tamil && (
                        <p className="text-xs font-semibold text-gold-soft mt-0.5">
                          {photo.title_tamil}
                        </p>
                      )}
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CUSTOMER REVIEWS PREVIEW ================= */}
      {homeReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
          <Reveal>
            <p className="text-center text-xs font-bold tracking-[0.35em] text-leaf uppercase">
              விருந்தினர் மதிப்புரைகள் · GUEST REVIEWS
            </p>
            <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl lg:text-5xl font-black">
              Loved by <span className="text-gradient-gold">Families Across Tamil Nadu</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-xs sm:text-base text-muted-foreground">
              எங்கள் விருந்துண்ட மக்களின் உண்மையான கருத்துக்கள்.
            </p>
          </Reveal>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeReviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 120}>
                <TiltCard className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm active:scale-[0.98] transition-transform">
                  <div>
                    <div className="flex text-amber-500 text-sm sm:text-base">
                      {"★".repeat(r.rating)}
                    </div>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
                      "{r.comment}"
                    </p>
                  </div>
                  <div className="mt-5 border-t border-border/50 pt-3">
                    <p className="font-display text-sm sm:text-base font-bold text-foreground">
                      {r.name}
                    </p>
                    {r.location && <p className="text-xs text-muted-foreground">📍 {r.location}</p>}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link
              to="/reviews"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 sm:px-8 py-3 sm:py-3.5 font-display text-sm sm:text-base font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <span>Read All Reviews & Share Yours · கருத்துக்களைப் பார்க்க →</span>
            </Link>
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-leaf-deep py-14 sm:py-20">
        <div className="leaf-divider absolute top-0 inset-x-0" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.35em] text-gold-soft uppercase">
              உங்கள் விருந்து, நம் பொறுப்பு
            </p>
            <h2 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-black text-primary-foreground">
              Let's Plan Your Banana Leaf Feast
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-primary-foreground/80 leading-relaxed">
              Tell us the date and the guest count — we'll bring the menu, the cooks and the
              counters.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="glow-pulse rounded-full bg-gold px-8 py-3.5 font-display text-base sm:text-lg font-bold text-deep shadow-xl transition-transform active:scale-95 hover:scale-105"
              >
                Get a Quote · மதிப்பீடு பெற
              </Link>
              <a
                href="https://wa.me/917824889665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 font-display text-base sm:text-lg font-bold text-white shadow-xl transition-transform active:scale-95 hover:bg-[#20ba59]"
              >
                <span>💬 WhatsApp Quick Chat</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FLOATING STICKY ACTION BAR FOR PHONE SCREENS ================= */}
      <div className="fixed bottom-3 inset-x-3 z-40 block md:hidden pointer-events-auto">
        <div className="flex items-center justify-between gap-1.5 rounded-full border border-gold/40 bg-deep/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <a
            href="tel:+917824889665"
            className="flex-1 flex items-center justify-center gap-1 rounded-full bg-gold/15 py-2.5 text-xs font-bold text-gold active:bg-gold active:text-deep transition-all"
          >
            <span>📞 Call</span>
          </a>
          <a
            href="https://wa.me/917824889665?text=Hello%20Kamatchi%20Catering,%20I%20would%20like%20to%20inquire%20about%20catering%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 rounded-full bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
          >
            <span>💬 WhatsApp</span>
          </a>
          <Link
            to="/menu"
            className="flex-1 flex items-center justify-center gap-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground active:scale-95 transition-transform"
          >
            <span>📋 Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
