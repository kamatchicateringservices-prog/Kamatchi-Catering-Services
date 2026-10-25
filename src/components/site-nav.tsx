import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home", tamil: "முகப்பு" },
  { to: "/menu", label: "Menu", tamil: "மெனு" },
  { to: "/reviews", label: "Reviews", tamil: "மதிப்புரைகள்" },
  { to: "/about", label: "About", tamil: "எங்களைப் பற்றி" },
  { to: "/contact", label: "Contact", tamil: "தொடர்பு" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-card/95 shadow-lg shadow-black/5 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="scene-tight">
            <span
              className={`preserve-3d flex h-11 w-11 items-center justify-center rounded-full font-display text-xl font-bold transition-transform duration-500 group-hover:rotate-[360deg] ${
                scrolled ? "bg-primary text-primary-foreground" : "bg-gold text-deep"
              }`}
            >
              க
            </span>
          </span>
          <span className="leading-tight">
            <span
              className={`block font-display text-lg font-bold tracking-wide sm:text-xl ${
                scrolled ? "text-foreground" : "text-primary-foreground drop-shadow"
              }`}
            >
              Kamatchi Catering
            </span>
            <span
              className={`block text-[11px] tracking-[0.25em] uppercase ${
                scrolled ? "text-muted-foreground" : "text-gold-soft"
              }`}
            >
              காமாட்சி கேட்டரிங்
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  scrolled
                    ? active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                    : active
                      ? "bg-gold text-deep"
                      : "text-primary-foreground hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className={`ml-3 rounded-full px-5 py-2.5 text-sm font-bold shadow-md transition-transform hover:scale-105 ${
              scrolled ? "bg-accent text-accent-foreground" : "bg-gold text-deep"
            }`}
          >
            Book a Feast
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`rounded-lg p-2 md:hidden ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-border bg-card/98 px-4 pb-4 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-base font-semibold text-foreground last:border-0"
            >
              {l.label} <span className="text-sm text-muted-foreground">· {l.tamil}</span>
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-primary px-5 py-3 text-center font-bold text-primary-foreground"
          >
            Book a Feast
          </Link>
        </div>
      )}
    </header>
  );
}
