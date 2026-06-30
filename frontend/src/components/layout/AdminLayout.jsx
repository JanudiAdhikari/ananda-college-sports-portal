import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const adminLinks = [
  {
    label: "Dashboard",
    path: "/admin",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER", "PHOTO_CLUB", "VIDEO_CLUB"],
  },
  {
    label: "Sports",
    path: "/admin/sports",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
  },
  {
    label: "Teams",
    path: "/admin/teams",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
  },
  {
    label: "Players",
    path: "/admin/players",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
  },
  {
    label: "Fixtures",
    path: "/admin/fixtures",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER", "PHOTO_CLUB"],
  },
  {
    label: "Live Matches",
    path: "/admin/live-matches",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER", "VIDEO_CLUB"],
  },
  {
    label: "Users",
    path: "/admin/users",
    roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
  },
];

function AdminLayout({ children }) {
  const { user } = useAuth();

  const visibleLinks = adminLinks.filter((link) =>
    link.roles.includes(user?.role)
  );

  const linkClass = ({ isActive }) =>
    `font-display text-xs font-bold uppercase tracking-wider block rounded-xl px-4 py-3 transition duration-200 ${
      isActive
        ? "bg-ananda-maroon text-white shadow-md"
        : "text-ananda-dark-maroon hover:bg-ananda-cream/50 hover:text-ananda-maroon"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      {/* Admin Header */}
      <div className="mb-6 rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
        <p className="font-display text-xs font-semibold uppercase tracking-wider text-ananda-gold">
          Admin Area
        </p>

        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
              Management Panel
            </h1>
            <p className="mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {user?.fullName} <span className="text-ananda-gold/60 font-normal">|</span> {user?.role?.replace("_", " ")}
            </p>
          </div>

          <span className="font-display self-start md:self-auto rounded-full bg-ananda-cream/70 border border-ananda-gold/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ananda-maroon">
            Authorized Access
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-ananda-gold/15 bg-white p-4 shadow-sm">
            <p className="font-display mb-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Admin Menu
            </p>

            <nav className="space-y-1.5">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/admin"}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </section>
  );
}

export default AdminLayout;