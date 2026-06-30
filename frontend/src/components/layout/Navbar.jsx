import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 pb-1 border-b-2 ${
      isActive
        ? "text-ananda-gold border-ananda-gold"
        : "text-white/90 border-transparent hover:text-ananda-gold hover:border-ananda-gold/40"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `font-display block text-sm font-bold uppercase tracking-wide px-4 py-3 rounded-xl transition duration-200 ${
      isActive
        ? "bg-ananda-dark-maroon text-ananda-gold shadow-inner"
        : "text-white/90 hover:bg-ananda-dark-maroon hover:text-ananda-gold"
    }`;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ananda-maroon/95 text-white border-b border-ananda-gold/15 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
          <div className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-ananda-gold text-ananda-dark-maroon font-extrabold shadow-md transition duration-300 group-hover:scale-[1.05]">
            AC
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold uppercase tracking-[0.15em] leading-tight md:text-base text-white group-hover:text-ananda-gold transition duration-300">
              Ananda College
            </span>
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-ananda-light-gold">
              Sports Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/sports" className={navLinkClass}>
            Sports
          </NavLink>

          <NavLink to="/fixtures-results" className={navLinkClass}>
            Fixtures
          </NavLink>

          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>

          <NavLink to="/live-matches" className={navLinkClass}>
            Live Matches
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-5 border-l border-white/10 pl-6">
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>

              <div className="flex items-center gap-3">
                {/* Initial Avatar for User */}
                <div className="font-display flex h-7 w-7 items-center justify-center rounded-full bg-ananda-light-gold text-xs font-bold text-ananda-maroon">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <span className="max-w-28 truncate text-xs font-semibold text-ananda-light-gold">
                  {user?.fullName}
                </span>

                <button
                  onClick={handleLogout}
                  className="font-display text-[10px] font-bold uppercase tracking-wider border border-ananda-gold/40 hover:bg-ananda-gold hover:text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-300 text-ananda-gold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center border-l border-white/10 pl-6">
              <NavLink 
                to="/login" 
                className="font-display text-xs font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-4 py-2 rounded-xl transition duration-300"
              >
                Login
              </NavLink>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-ananda-gold/30 text-ananda-gold lg:hidden hover:bg-white/5 transition focus:outline-none cursor-pointer"
        >
          {isMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <nav className="border-t border-ananda-dark-maroon/50 bg-ananda-maroon/95 backdrop-blur-md px-6 pb-6 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1.5 pt-4">
            <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClass}>
              Home
            </NavLink>

            <NavLink
              to="/sports"
              onClick={closeMenu}
              className={mobileNavLinkClass}
            >
              Sports
            </NavLink>

            <NavLink
              to="/fixtures-results"
              onClick={closeMenu}
              className={mobileNavLinkClass}
            >
              Fixtures
            </NavLink>

            <NavLink
              to="/gallery"
              onClick={closeMenu}
              className={mobileNavLinkClass}
            >
              Gallery
            </NavLink>

            <NavLink
              to="/live-matches"
              onClick={closeMenu}
              className={mobileNavLinkClass}
            >
              Live Matches
            </NavLink>

            {isAuthenticated ? (
              <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  Dashboard
                </NavLink>

                <div className="flex items-center gap-3 rounded-xl bg-ananda-dark-maroon/60 px-4 py-3 border border-ananda-gold/10">
                  <div className="font-display flex h-8 w-8 items-center justify-center rounded-full bg-ananda-light-gold text-sm font-bold text-ananda-maroon">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Logged In As</p>
                    <p className="font-semibold text-white text-sm truncate max-w-48">{user?.fullName}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="font-display text-xs font-bold uppercase tracking-wider border border-ananda-gold/40 text-ananda-gold hover:bg-ananda-gold hover:text-ananda-dark-maroon px-4 py-3 rounded-xl transition duration-300 text-center cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-white/10">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="font-display block text-center text-sm font-bold uppercase tracking-wide bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-4 py-3 rounded-xl transition duration-300"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;