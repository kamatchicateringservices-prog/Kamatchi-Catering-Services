import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-deep text-primary-foreground">
      <div className="leaf-divider" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold font-display text-xl font-bold text-deep">
              க
            </span>
            <div>
              <p className="font-display text-lg font-bold">Kamatchi Catering</p>
              <p className="text-xs tracking-[0.25em] text-gold-soft uppercase">
                காமாட்சி கேட்டரிங்
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Traditional Tamil Nadu catering for weddings, temple festivals and family functions —
            served hot on the banana leaf.
          </p>
        </div>

        <div>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-gold">
                Full Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-gold">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact & Booking
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">
            We Cater
          </p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>Kalyana Virundhu (Weddings)</li>
            <li>Housewarming & Grehapravesam</li>
            <li>Temple Festivals & Utsavams</li>
            <li>Corporate & Birthday Events</li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold uppercase">
            Reach Us
          </p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a href="tel:+917824889665" className="hover:text-gold transition-colors">
                📞 +91 78248 89665
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/917824889665?text=Vanakkam%20Kamatchi%20Catering"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                💬 WhatsApp: +91 78248 89665
              </a>
            </li>
            <li>📍 Solaitheavenpatti, Varusanadu, Theni - 625579</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 pb-20 md:pb-5 text-center text-xs text-primary-foreground/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span>
          © {new Date().getFullYear()} Kamatchi Catering · Proprietor{" "}
          <span className="text-gold-soft">Pream Kumar M</span> · Made with tradition in Tamil Nadu
        </span>
        <span className="text-white/20">|</span>
        <Link to="/admin" className="text-primary-foreground/40 hover:text-gold transition-colors">
          Admin Portal · நிர்வாகம்
        </Link>
      </div>
    </footer>
  );
}
