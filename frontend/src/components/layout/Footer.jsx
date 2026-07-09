import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-ananda-dark-maroon to-[#1c0006] text-white border-t border-ananda-gold/15">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-5">
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
            <p className="text-xs text-white/60 leading-relaxed font-semibold max-w-sm">
              The official sports portal of Ananda College, Colombo 10. Dedicated to fostering athletic excellence, school pride, and updates on matches and achievements.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ananda-gold">
              Quick Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-xs font-semibold uppercase tracking-wider text-white/70">
              <li>
                <Link to="/" className="hover:text-ananda-gold transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group">
                  <span className="h-1 w-1 rounded-full bg-ananda-gold/40 group-hover:bg-ananda-gold" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sports" className="hover:text-ananda-gold transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group">
                  <span className="h-1 w-1 rounded-full bg-ananda-gold/40 group-hover:bg-ananda-gold" />
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/fixtures-results" className="hover:text-ananda-gold transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group">
                  <span className="h-1 w-1 rounded-full bg-ananda-gold/40 group-hover:bg-ananda-gold" />
                  Fixtures
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-ananda-gold transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group">
                  <span className="h-1 w-1 rounded-full bg-ananda-gold/40 group-hover:bg-ananda-gold" />
                  Gallery
                </Link>
              </li>
              <li className="col-span-2">
                <Link to="/live-matches" className="hover:text-ananda-gold transition-all duration-200 flex items-center gap-2 hover:translate-x-1 group">
                  <span className="h-1 w-1 rounded-full bg-ananda-gold/40 group-hover:bg-ananda-gold" />
                  Live Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ananda-gold">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs text-white/70 font-semibold">
              <li className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ananda-gold/10 text-ananda-gold border border-ananda-gold/20 shrink-0">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="leading-relaxed">Ananda College, Maradana, Colombo 10, Sri Lanka.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ananda-gold/10 text-ananda-gold border border-ananda-gold/20 shrink-0">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>info@anandacollege.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
          <p>
            © {new Date().getFullYear()} Ananda College. All rights reserved.
          </p>
          <p>
            Developed by Ananda College
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;