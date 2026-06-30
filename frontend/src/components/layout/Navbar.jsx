import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-ananda-gold font-semibold"
      : "text-white hover:text-ananda-gold";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-ananda-dark-maroon px-4 py-3 text-ananda-gold font-semibold"
      : "rounded-xl px-4 py-3 text-white hover:bg-ananda-dark-maroon hover:text-ananda-gold";

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ananda-maroon text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMenu} className="flex flex-col">
          <span className="text-lg font-bold md:text-xl">
            Ananda College Sports Portal
          </span>
          <span className="text-xs text-ananda-light-gold">
            Colombo 10, Sri Lanka
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
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
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>

              <div className="flex items-center gap-3">
                <span className="max-w-36 truncate text-sm text-ananda-light-gold">
                  {user?.fullName}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-ananda-gold px-3 py-1 text-sm text-ananda-gold hover:bg-ananda-gold hover:text-ananda-dark-maroon"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg border border-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-gold lg:hidden"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-ananda-dark-maroon px-6 pb-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
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
              <>
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  Dashboard
                </NavLink>

                <div className="rounded-xl bg-ananda-dark-maroon px-4 py-3">
                  <p className="text-sm text-ananda-light-gold">
                    Logged in as
                  </p>
                  <p className="font-semibold text-white">{user?.fullName}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-ananda-gold px-4 py-3 text-left font-semibold text-ananda-gold hover:bg-ananda-gold hover:text-ananda-dark-maroon"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                Login
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;