import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-ananda-gold font-semibold"
      : "text-white hover:text-ananda-gold";

  return (
    <header className="bg-ananda-maroon text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-bold">
            Ananda College Sports Portal
          </span>
          <span className="text-xs text-ananda-light-gold">
            Colombo 10, Sri Lanka
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/sports" className={navLinkClass}>
            Sports
          </NavLink>

          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>

          <NavLink to="/live-matches" className={navLinkClass}>
            Live Matches
          </NavLink>

          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;