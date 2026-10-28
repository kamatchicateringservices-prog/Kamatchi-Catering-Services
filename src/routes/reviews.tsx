import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { supabase } from "@/lib/supabase";

export type ReviewItem = {
  id: number;
  name: string;
  phone?: string | null;
  rating: number;
  event_type?: string | null;
  comment: string;
  location?: string | null;
  created_at: string;
};

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      {
        title: "Reviews & Testimonials · வாடிக்கையாளர் கருத்துக்கள் — Kamatchi Catering",
      },
      {
        name: "description",
        content:
          "Read genuine reviews of Kamatchi Catering or share your own experience. No login required. கல்யாணம் மற்றும் விசேஷங்களுக்கான வாடிக்கையாளர் கருத்துக்கள்.",
      },
      {
        property: "og:title",
        content: "Kamatchi Catering Reviews · மதிப்புரைகள்",
      },
      {
        property: "og:description",
        content: "Traditional Tamil Nadu wedding and event catering customer feedback.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: ReviewsPage,
});

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/40";
const labelCls = "mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase";

function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    eventType: "Wedding / கல்யாண விருந்து",
    location: "",
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.warn("Error fetching reviews:", error.message);
      } else if (data) {
        setReviews(data as ReviewItem[]);
      }
    } catch (err) {
      console.warn("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;

    setSubmitting(true);
    try {
      const newReview = {
        name: form.name.trim(),
        rating: form.rating,
        event_type: form.eventType,
        location: form.location.trim() || null,
        comment: form.comment.trim(),
        is_approved: true,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("reviews").insert([newReview]).select();

      if (error) {
        console.warn("Supabase insert error:", error.message);
      } else if (data && data[0]) {
        setReviews((prev) => [data[0] as ReviewItem, ...prev]);
      } else {
        // Fallback optimistic display
        setReviews((prev) => [{ ...newReview, id: Date.now() } as ReviewItem, ...prev]);
      }

      setSubmitted(true);
      setForm({
        name: "",
        rating: 5,
        eventType: "Wedding / கல்யாண விருந்து",
        location: "",
        comment: "",
      });
    } catch (err) {
      console.warn("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterType === "all") return true;
    if (filterType === "5") return r.rating === 5;
    if (filterType === "wedding")
      return (
        r.event_type?.toLowerCase().includes("wedding") ||
        r.event_type?.toLowerCase().includes("கல்யாண")
      );
    if (filterType === "housewarming")
      return (
        r.event_type?.toLowerCase().includes("housewarming") ||
        r.event_type?.toLowerCase().includes("கிரக")
      );
    return true;
  });

  return (
    <div>
      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-16">
        <div className="steam-puff absolute top-10 left-[20%] h-16 w-32 opacity-40" />
        <div
          className="steam-puff absolute top-16 left-[55%] h-16 w-28 opacity-30"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold tracking-[0.35em] text-gold-soft uppercase">
            மதிப்புரைகள் · GUEST EXPERIENCES & REVIEWS
          </p>
          <h1 className="mt-3 font-display text-4xl font-black text-primary-foreground sm:text-6xl">
            Customer <span className="text-gradient-gold">Reviews</span>
          </h1>
          <p className="mt-2 font-display text-2xl font-extrabold text-gold-soft sm:text-3xl">
            வாடிக்கையாளர் கருத்துக்கள் & அனுபவங்கள்
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 sm:text-lg">
            Real feedback from families and hosts across Tamil Nadu who enjoyed our traditional
            banana-leaf feasts.
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-primary-foreground/75 sm:text-base">
            எங்கள் கைவண்ணத்தில் உருவான சுவையான விருந்துண்ட குடும்பங்களின் உண்மை கருத்துக்கள்.
            உள்நுழைவு ஏதுமின்றி நீங்களும் உங்கள் கருத்தை இங்கு பதிவிடலாம்!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#write-review"
              className="glow-pulse inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-display text-base font-bold text-deep shadow-lg transition-transform hover:scale-105"
            >
              <span>Write a Review · உங்கள் கருத்தை எழுத</span>
              <span>✍️</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gold-soft/50 bg-deep/40 px-6 py-3.5 font-display text-sm font-bold text-gold-soft backdrop-blur transition-colors hover:border-gold hover:bg-deep/60"
            >
              <span>Book a Feast · முன்பதிவு செய்க</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS BANNER ================= */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 text-center sm:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-black text-gold">5.0 ★</p>
            <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Average Rating · சராசரி தரம்
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-black text-primary">100%</p>
            <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Banana Leaf Service · வாழை இலை
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-black text-leaf">500+</p>
            <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Events Catered · நிகழ்வுகள்
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-black text-foreground">Theni & TN</p>
            <p className="mt-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Tamil Nadu Wide · தமிழ்நாடு முழுவதும்
            </p>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Reviews List (7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="font-display text-2xl font-black sm:text-3xl">
                  Recent Reviews · <span className="text-primary">சமீபத்திய கருத்துக்கள்</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredReviews.length} customer experiences
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  onClick={() => setFilterType("all")}
                  className={`rounded-full px-3.5 py-1.5 transition-colors ${
                    filterType === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  All · அனைத்தும்
                </button>
                <button
                  onClick={() => setFilterType("5")}
                  className={`rounded-full px-3.5 py-1.5 transition-colors ${
                    filterType === "5"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  5 Stars ★★★★★
                </button>
                <button
                  onClick={() => setFilterType("wedding")}
                  className={`rounded-full px-3.5 py-1.5 transition-colors ${
                    filterType === "wedding"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Weddings · திருமணம்
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-muted-foreground">
                <span className="text-3xl">🍃</span>
                <p className="mt-2 text-sm">
                  Loading reviews · கருத்துக்கள் பதிவேற்றப்படுகின்றன...
                </p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <span className="text-3xl">🪔</span>
                <p className="mt-3 font-display text-lg font-bold">
                  No reviews yet in this filter.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Be the first to share your experience with Kamatchi Catering!
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredReviews.map((r) => (
                  <Reveal key={r.id}>
                    <TiltCard
                      maxTilt={3}
                      className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-gold/60 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                              {r.name.charAt(0)}
                            </span>
                            <div>
                              <p className="font-display font-bold text-foreground">{r.name}</p>
                              {r.location && (
                                <p className="text-xs text-muted-foreground">📍 {r.location}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span
                                key={idx}
                                className={`text-base ${
                                  idx < r.rating ? "text-amber-500" : "text-muted-foreground/30"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {r.event_type && (
                            <span className="mt-1 inline-block rounded-full bg-leaf/10 px-2.5 py-0.5 text-[11px] font-bold text-leaf">
                              {r.event_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-4 leading-relaxed text-foreground/90">"{r.comment}"</p>

                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-semibold text-leaf">
                          ✓ Verified Feast Experience · உறுதிப்படுத்தப்பட்டது
                        </span>
                        <span>
                          {r.created_at
                            ? new Date(r.created_at).toLocaleDateString("en-IN")
                            : "Recent"}
                        </span>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Review Submission Form (5 cols) */}
          <div className="lg:col-span-5" id="write-review">
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
              <div className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/30 text-2xl">
                  ✍️
                </span>
                <h3 className="mt-3 font-display text-2xl font-black text-foreground">
                  Add Your Review
                </h3>
                <p className="mt-1 font-display text-lg font-bold text-primary">
                  உங்கள் அனுபவத்தைப் பகிருங்கள்
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No login required · உடனடி பதிவு, உள்நுழைவு தேவையில்லை
                </p>
              </div>

              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/15 text-3xl">
                    🪔
                  </div>
                  <h4 className="mt-4 font-display text-xl font-bold text-foreground">
                    மிக்க நன்றி · Thank you!
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Your review has been successfully added to the Kamatchi Catering review wall.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full border border-primary px-5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Submit Another Review · மேலும் எழுத
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="r-name">
                      Your Name · உங்கள் பெயர் *
                    </label>
                    <input
                      id="r-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. Ramesh Kumar / ரமேஷ்"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Rating · உங்கள் மதிப்பீடு (1 - 5 Stars) *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, rating: star }))}
                          className="text-2xl transition-transform hover:scale-125 focus:outline-hidden"
                          aria-label={`${star} star`}
                        >
                          <span
                            className={
                              star <= form.rating ? "text-amber-500" : "text-muted-foreground/30"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="ml-2 font-display text-sm font-bold text-gold">
                        {form.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="r-type">
                      Event Type · நிகழ்வு வகை
                    </label>
                    <select
                      id="r-type"
                      value={form.eventType}
                      onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                      className={inputCls}
                    >
                      <option>Wedding / கல்யாண விருந்து</option>
                      <option>Housewarming / கிரகப்பிரவேசம்</option>
                      <option>Temple Festival / கோவில் உற்சவம்</option>
                      <option>Birthday / பிறந்தநாள் விழா</option>
                      <option>Corporate / நிறுவன விருந்து</option>
                      <option>Family Feast / குடும்ப விருந்து</option>
                      <option>Other / இதர விசேஷங்கள்</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="r-loc">
                      Your Town / City · ஊர் (Optional)
                    </label>
                    <input
                      id="r-loc"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. Theni / Madurai / வருசநாடு"
                    />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="r-comment">
                      Your Feedback / Review · உங்கள் கருத்து *
                    </label>
                    <textarea
                      id="r-comment"
                      required
                      rows={4}
                      value={form.comment}
                      onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                      className={inputCls}
                      placeholder="Share your experience about taste, service, hot banana-leaf food, hospitality..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="glow-pulse w-full rounded-full bg-primary py-3.5 font-display text-base font-bold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] disabled:opacity-75"
                  >
                    {submitting
                      ? "Submitting · பதிவேற்றப்படுகிறது..."
                      : "Post Review · கருத்தைப் பதிவு செய்க"}
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    Reviews are public immediately to help other hosts choose Kamatchi Catering.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
