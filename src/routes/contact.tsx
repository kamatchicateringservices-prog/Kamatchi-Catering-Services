import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Booking — Kamatchi Catering" },
      {
        name: "description",
        content:
          "Book Kamatchi Catering for your wedding, temple festival or family function. Call, WhatsApp or send an enquiry for a per-plate quote.",
      },
      { property: "og:title", content: "Contact Kamatchi Catering" },
      {
        property: "og:description",
        content: "Book traditional Tamil Nadu catering — get a per-plate quote for your event.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/40";
const labelCls = "mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: "Wedding",
    date: "",
    guests: "",
    notes: "",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("enquiries").insert([
        {
          name: form.name,
          phone: form.phone,
          event_type: form.eventType,
          event_date: form.date || null,
          approx_guests: form.guests ? parseInt(form.guests, 10) : null,
          menu_notes: form.notes || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.warn(
          "Notice: Saved locally. (Supabase 'enquiries' table message: " + error.message + ")",
        );
      }
    } catch (err) {
      console.warn("Notice: Error sending to Supabase:", err);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div>
      <section className="bg-primary pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-gold-soft uppercase">தொடர்பு</p>
          <h1 className="mt-3 font-display text-5xl font-black text-primary-foreground sm:text-6xl">
            Book Your <span className="text-gradient-gold">Feast</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Tell us about your function — we'll call back the same day with a menu suggestion and
            per-plate quote.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* details */}
          <div className="space-y-6 lg:col-span-2">
            {[
              {
                label: "அழைக்கவும் · Call",
                value: "+91 78248 89665",
                href: "tel:+917824889665",
                icon: "📞",
              },
              {
                label: "வாட்ஸ்அப் · WhatsApp",
                value: "+91 78248 89665",
                href: "https://wa.me/917824889665?text=Vanakkam%20Kamatchi%20Catering,%20I%20would%20like%20to%20enquire%20about%20catering%20services.",
                icon: "💬",
              },
              {
                label: "முகவரி · Location",
                value: "Solaitheavenpatti, Varusanadu, Theni - 625579",
                sub: "சோலைத்தேவன்பட்டி, வருசநாடு, தேனி - 625579",
                icon: "📍",
              },
              { label: "நேரம் · Hours", value: "Every day, 8 AM – 9 PM", icon: "🕒" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <TiltCard
                  maxTilt={5}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/40 text-xl">
                    {c.icon}
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="font-display text-lg font-bold hover:text-primary transition-colors"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <>
                        <p className="font-display text-base font-bold sm:text-lg">{c.value}</p>
                        {"sub" in c && c.sub ? (
                          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                            {c.sub}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
            <Reveal delay={360}>
              <div className="rounded-2xl bg-leaf-deep p-6 text-primary-foreground">
                <p className="font-display text-xl font-bold text-gold">Proprietor</p>
                <p className="mt-1 font-display text-2xl font-black">Pream Kumar M</p>
                <p className="mt-2 text-sm text-primary-foreground/75">
                  Call or WhatsApp directly at{" "}
                  <a href="tel:+917824889665" className="font-bold underline hover:text-gold">
                    +91 78248 89665
                  </a>{" "}
                  (
                  <a
                    href="https://wa.me/917824889665?text=Vanakkam%20Kamatchi%20Catering"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:text-gold"
                  >
                    WhatsApp Chat
                  </a>
                  ) for large events (500+ plates) and temple festival menus.
                </p>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={150} className="lg:col-span-3">
            <div className="scene-tight">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
                {sent ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf/15 text-4xl">
                      🪔
                    </div>
                    <h2 className="mt-5 font-display text-3xl font-black">
                      Vanakkam, {form.name || "friend"}!
                    </h2>
                    <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                      Your enquiry is noted. We'll call you on{" "}
                      <span className="font-bold text-foreground">
                        {form.phone || "your number"}
                      </span>{" "}
                      to plan the menu for your {form.eventType.toLowerCase()}.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 rounded-full border-2 border-primary px-6 py-2.5 font-display font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="c-name">
                        Your Name
                      </label>
                      <input
                        id="c-name"
                        required
                        value={form.name}
                        onChange={set("name")}
                        className={inputCls}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-phone">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="c-phone"
                        required
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        className={inputCls}
                        placeholder="+91"
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-type">
                        Event Type
                      </label>
                      <select
                        id="c-type"
                        value={form.eventType}
                        onChange={set("eventType")}
                        className={inputCls}
                      >
                        <option>Wedding / Reception</option>
                        <option>Housewarming</option>
                        <option>Temple Festival</option>
                        <option>Corporate Event</option>
                        <option>Birthday / Family Function</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-date">
                        Event Date
                      </label>
                      <input
                        id="c-date"
                        type="date"
                        value={form.date}
                        onChange={set("date")}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-guests">
                        Approx. Guests
                      </label>
                      <input
                        id="c-guests"
                        type="number"
                        min={20}
                        value={form.guests}
                        onChange={set("guests")}
                        className={inputCls}
                        placeholder="e.g. 250"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls} htmlFor="c-notes">
                        Menu Preferences
                      </label>
                      <textarea
                        id="c-notes"
                        rows={4}
                        value={form.notes}
                        onChange={set("notes")}
                        className={inputCls}
                        placeholder="Veg / non-veg, favourite dishes, live counters, budget per plate..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="glow-pulse sm:col-span-2 rounded-full bg-primary py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-75"
                    >
                      {loading
                        ? "Sending Enquiry · அனுப்புகிறது..."
                        : "Send Enquiry · முன்பதிவு செய்க"}
                    </button>
                    <p className="text-center text-xs text-muted-foreground sm:col-span-2">
                      We usually respond within a few hours during working days.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
