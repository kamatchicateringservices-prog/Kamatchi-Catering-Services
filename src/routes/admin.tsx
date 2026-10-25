import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { adminLoginServerFn } from "@/lib/admin-auth";
import type { ReviewItem } from "./reviews";

export type EventPhotoItem = {
  id: number;
  title: string;
  title_tamil?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  image_url: string;
  description?: string | null;
  created_at: string;
};

export type EnquiryItem = {
  id: number;
  name: string;
  phone: string;
  event_type?: string | null;
  event_date?: string | null;
  approx_guests?: number | null;
  menu_notes?: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal · நிர்வாக குழு — Kamatchi Catering" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/40";
const labelCls = "mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form state
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab: 'photos' | 'reviews' | 'enquiries'
  const [activeTab, setActiveTab] = useState<"photos" | "reviews" | "enquiries">("photos");

  // Data states
  const [photos, setPhotos] = useState<EventPhotoItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // New photo form state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: "",
    titleTamil: "",
    eventType: "Wedding",
    eventDate: "",
    imageUrl: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check existing session
  useEffect(() => {
    const sessionToken = localStorage.getItem("kamatchi_admin_session");
    if (sessionToken && sessionToken.startsWith("admin_session_")) {
      setIsAuthenticated(true);
    }
    setAuthChecking(false);
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [photosRes, reviewsRes, enquiriesRes] = await Promise.all([
        supabase.from("event_photos").select("*").order("id", { ascending: false }),
        supabase.from("reviews").select("*").order("id", { ascending: false }),
        supabase.from("enquiries").select("*").order("id", { ascending: false }),
      ]);

      if (photosRes.data) setPhotos(photosRes.data as EventPhotoItem[]);
      if (reviewsRes.data) setReviews(reviewsRes.data as ReviewItem[]);
      if (enquiriesRes.data) setEnquiries(enquiriesRes.data as EnquiryItem[]);
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const result = await adminLoginServerFn({
        data: {
          userId: loginId,
          password: loginPassword,
        },
      });

      if (result.success && result.token) {
        localStorage.setItem("kamatchi_admin_session", result.token);
        setIsAuthenticated(true);
        setLoginId("");
        setLoginPassword("");
      } else {
        setLoginError(result.error || "Login failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error logging in";
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kamatchi_admin_session");
    setIsAuthenticated(false);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingPhoto(true);

    try {
      let finalImageUrl = photoForm.imageUrl.trim();

      // If a file was selected, upload to Supabase storage bucket
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("event-photos")
          .upload(filePath, selectedFile, { cacheControl: "3600", upsert: true });

        if (uploadError) {
          console.warn("Storage upload failed, using fallback URL:", uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("event-photos")
            .getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            finalImageUrl = publicUrlData.publicUrl;
          }
        }
      }

      if (!finalImageUrl) {
        alert("Please provide an image URL or choose a photo file to upload.");
        setUploadingPhoto(false);
        return;
      }

      const newRecord = {
        title: photoForm.title.trim(),
        title_tamil: photoForm.titleTamil.trim() || null,
        event_type: photoForm.eventType,
        event_date: photoForm.eventDate || null,
        image_url: finalImageUrl,
        description: photoForm.description.trim() || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("event_photos").insert([newRecord]).select();

      if (error) {
        alert("Error saving photo: " + error.message);
      } else if (data && data[0]) {
        setPhotos((prev) => [data[0] as EventPhotoItem, ...prev]);
        setPhotoForm({
          title: "",
          titleTamil: "",
          eventType: "Wedding",
          eventDate: "",
          imageUrl: "",
          description: "",
        });
        setSelectedFile(null);
      }
    } catch (err) {
      console.warn("Add photo error:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event photo?")) return;
    try {
      const { error } = await supabase.from("event_photos").delete().eq("id", id);
      if (!error) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.warn("Delete photo error:", err);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (!error) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.warn("Delete review error:", err);
    }
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-3xl">🍃</span>
      </div>
    );
  }

  // ================= 1. LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold font-display text-2xl font-bold text-deep shadow-md">
              க
            </span>
            <h1 className="mt-4 font-display text-2xl font-black text-foreground">Admin Portal</h1>
            <p className="font-display text-lg font-bold text-primary">நிர்வாகிகள் உள்நுழைவு</p>
            <p className="mt-1 text-xs text-muted-foreground">Kamatchi Catering · Secure Access</p>
          </div>

          {loginError && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-xs font-semibold text-destructive">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className={labelCls} htmlFor="admin-id">
                Admin User ID · பயனர் எண்
              </label>
              <input
                id="admin-id"
                type="text"
                required
                autoComplete="username"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className={inputCls}
                placeholder="Enter User ID"
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="admin-password">
                Password · கடவுச்சொல்
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={inputCls}
                placeholder="Enter Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="glow-pulse mt-2 w-full rounded-full bg-primary py-3.5 font-display text-base font-bold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] disabled:opacity-75"
            >
              {isLoggingIn ? "Verifying · சரிபார்க்கிறது..." : "Log In · உள்நுழைக"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= 2. DASHBOARD SCREEN =================
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Top Banner */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold font-display text-base font-bold text-deep">
                க
              </span>
              <h1 className="font-display text-2xl font-black text-foreground">
                Kamatchi Admin Dashboard
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              நிர்வாகக் குழு மேலாண்மை · Manage Event Photos, Reviews & Bookings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="rounded-full border border-border bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-accent"
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-destructive/10 px-5 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Logout · வெளியேறு
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab("photos")}
            className={`rounded-full px-5 py-2.5 transition-colors ${
              activeTab === "photos"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📸 Event Photos · புகைப்படங்கள் ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`rounded-full px-5 py-2.5 transition-colors ${
              activeTab === "reviews"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ⭐ Customer Reviews · மதிப்புரைகள் ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`rounded-full px-5 py-2.5 transition-colors ${
              activeTab === "enquiries"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📋 Booking Enquiries · முன்பதிவுகள் ({enquiries.length})
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {loadingData ? (
          <div className="py-20 text-center text-muted-foreground">
            <span className="text-3xl">🍃</span>
            <p className="mt-2 text-sm">Loading data · தகவல்கள் எடுக்கப்படுகின்றன...</p>
          </div>
        ) : (
          <>
            {/* ================= TAB 1: EVENT PHOTOS ================= */}
            {activeTab === "photos" && (
              <div className="space-y-12">
                {/* Upload / Add Form */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-md sm:p-8">
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    Add Photos of Completed Events · நிகழ்வு புகைப்படம் சேர்க்க
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload photos of recent weddings, housewarmings, and temple feasts.
                  </p>

                  <form onSubmit={handleAddPhoto} className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="p-title">
                        Event Title (English) *
                      </label>
                      <input
                        id="p-title"
                        required
                        value={photoForm.title}
                        onChange={(e) => setPhotoForm((f) => ({ ...f, title: e.target.value }))}
                        className={inputCls}
                        placeholder="e.g. Madurai Grand Wedding Feast"
                      />
                    </div>

                    <div>
                      <label className={labelCls} htmlFor="p-title-tamil">
                        Event Title (Tamil) · தமிழ் தலைப்பு
                      </label>
                      <input
                        id="p-title-tamil"
                        value={photoForm.titleTamil}
                        onChange={(e) =>
                          setPhotoForm((f) => ({ ...f, titleTamil: e.target.value }))
                        }
                        className={inputCls}
                        placeholder="எ.கா. மதுரை பிரமாண்ட கல்யாண விருந்து"
                      />
                    </div>

                    <div>
                      <label className={labelCls} htmlFor="p-type">
                        Event Type · நிகழ்வு வகை
                      </label>
                      <select
                        id="p-type"
                        value={photoForm.eventType}
                        onChange={(e) => setPhotoForm((f) => ({ ...f, eventType: e.target.value }))}
                        className={inputCls}
                      >
                        <option>Wedding</option>
                        <option>Housewarming</option>
                        <option>Temple Festival</option>
                        <option>Birthday / Family Feast</option>
                        <option>Corporate Event</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls} htmlFor="p-date">
                        Event Date · நிகழ்வு தேதி
                      </label>
                      <input
                        id="p-date"
                        type="date"
                        value={photoForm.eventDate}
                        onChange={(e) => setPhotoForm((f) => ({ ...f, eventDate: e.target.value }))}
                        className={inputCls}
                      />
                    </div>

                    {/* Image File Upload or URL */}
                    <div>
                      <label className={labelCls} htmlFor="p-file">
                        Upload Image File (Device / Phone)
                      </label>
                      <input
                        id="p-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedFile(file);
                        }}
                        className="w-full text-xs text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>

                    <div>
                      <label className={labelCls} htmlFor="p-url">
                        Or Image URL (Web link)
                      </label>
                      <input
                        id="p-url"
                        value={photoForm.imageUrl}
                        onChange={(e) => setPhotoForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        className={inputCls}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelCls} htmlFor="p-desc">
                        Description / Menu highlights (Optional)
                      </label>
                      <input
                        id="p-desc"
                        value={photoForm.description}
                        onChange={(e) =>
                          setPhotoForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className={inputCls}
                        placeholder="e.g. 500 guests served on banana leaf with live vadai and payasam counters"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingPhoto}
                      className="glow-pulse sm:col-span-2 rounded-full bg-primary py-3.5 font-display text-base font-bold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] disabled:opacity-75"
                    >
                      {uploadingPhoto
                        ? "Saving Photo · பதிவேற்றப்படுகிறது..."
                        : "Upload & Save Event Photo · புகைப்படம் சேர்க்க 📸"}
                    </button>
                  </form>
                </div>

                {/* Photos Grid */}
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    Completed Event Photos ({photos.length})
                  </h3>

                  {photos.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No event photos uploaded yet. Use the form above to add your first photo!
                    </p>
                  ) : (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {photos.map((p) => (
                        <div
                          key={p.id}
                          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                        >
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="h-56 w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="p-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-full bg-leaf/15 px-2.5 py-0.5 text-[11px] font-bold text-leaf">
                                {p.event_type || "Event"}
                              </span>
                              {p.event_date && (
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(p.event_date).toLocaleDateString("en-IN")}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-2 font-display text-lg font-bold text-foreground">
                              {p.title}
                            </h4>
                            {p.title_tamil && (
                              <p className="text-xs font-semibold text-gold-soft">
                                {p.title_tamil}
                              </p>
                            )}
                            {p.description && (
                              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                                {p.description}
                              </p>
                            )}

                            <button
                              onClick={() => handleDeletePhoto(p.id)}
                              className="mt-4 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              Delete Photo · நீக்கு
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: REVIEWS ================= */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-black">
                      Customer Reviews ({reviews.length})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Reviews submitted by customers without login.
                    </p>
                  </div>
                  <a
                    href="/reviews"
                    target="_blank"
                    className="text-xs font-bold text-primary underline hover:text-gold"
                  >
                    View Public Reviews Page →
                  </a>
                </div>

                {reviews.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No reviews received yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-border bg-card p-5 shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-display font-bold text-foreground">
                              {r.name}{" "}
                              {r.location && (
                                <span className="text-xs font-normal text-muted-foreground">
                                  · 📍 {r.location}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-amber-500 text-sm">{"★".repeat(r.rating)}</span>
                              <span className="text-xs font-bold text-leaf bg-leaf/10 px-2 py-0.5 rounded-full">
                                {r.event_type}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.created_at).toLocaleDateString("en-IN")}
                            </span>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                          "{r.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: BOOKING ENQUIRIES ================= */}
            {activeTab === "enquiries" && (
              <div>
                <div className="border-b border-border pb-4">
                  <h2 className="font-display text-2xl font-black">
                    Customer Enquiries ({enquiries.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Inquiries submitted from the Contact & Booking form.
                  </p>
                </div>

                {enquiries.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No enquiries submitted yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="rounded-2xl border border-border bg-card p-6 shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-display text-lg font-bold text-foreground">
                                {enq.name}
                              </p>
                              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                                {enq.event_type || "Event"}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                              <p>
                                📅 Event Date:{" "}
                                <span className="font-semibold text-foreground">
                                  {enq.event_date || "Not specified"}
                                </span>
                              </p>
                              <p>
                                👥 Guests:{" "}
                                <span className="font-semibold text-foreground">
                                  {enq.approx_guests || "Not specified"}
                                </span>
                              </p>
                              <p>
                                🕒 Submitted:{" "}
                                <span className="font-semibold text-foreground">
                                  {new Date(enq.created_at).toLocaleDateString("en-IN")}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`tel:${enq.phone.replace(/\s+/g, "")}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                            >
                              📞 Call {enq.phone}
                            </a>
                            <a
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=Vanakkam%20${encodeURIComponent(enq.name)},%20this%20is%20Kamatchi%20Catering%20regarding%20your%20booking%20enquiry.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              💬 WhatsApp
                            </a>
                          </div>
                        </div>

                        {enq.menu_notes && (
                          <div className="mt-4 rounded-xl bg-muted/60 p-3.5 text-xs text-foreground/90">
                            <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                              Menu Preferences & Notes:
                            </p>
                            {enq.menu_notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
