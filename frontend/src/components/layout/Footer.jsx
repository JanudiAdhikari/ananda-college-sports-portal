import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ananda-dark-maroon text-white border-t border-ananda-gold/15">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-ananda-gold text-ananda-dark-maroon font-extrabold shadow-md transition duration-300 group-hover:scale-[1.05]">
                AC
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold uppercase tracking-[0.15em] leading-tight text-white group-hover:text-ananda-gold transition duration-300">
                  Ananda College
                </span>
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-ananda-light-gold">
                  Sports Portal
                </span>
              </div>
            </Link>
            <p className="text-xs text-ananda-light-gold/80 leading-relaxed max-w-sm">
              The official sports portal of Ananda College, Colombo 10. Dedicated to fostering athletic excellence, school pride, and updates on matches and achievements.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ananda-gold">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wider">
              <li>
                <Link to="/" className="text-white/80 hover:text-ananda-gold transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sports" className="text-white/80 hover:text-ananda-gold transition duration-200">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/fixtures-results" className="text-white/80 hover:text-ananda-gold transition duration-200">
                  Fixtures
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/80 hover:text-ananda-gold transition duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/live-matches" className="text-white/80 hover:text-ananda-gold transition duration-200">
                  Live Matches
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ananda-gold">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <svg className="h-4 w-4 text-ananda-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ananda College, Maradana, Colombo 10, Sri Lanka.</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-ananda-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@anandacollege.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ananda-light-gold/60 font-medium">
          <p>
            © {new Date().getFullYear()} Ananda College Sports Portal. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-wider">
            Developed by Ananda College
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;