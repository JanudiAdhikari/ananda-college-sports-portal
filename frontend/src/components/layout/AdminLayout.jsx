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
    isActive
      ? "block rounded-xl bg-ananda-maroon px-4 py-3 font-semibold text-white"
      : "block rounded-xl px-4 py-3 font-semibold text-ananda-dark-maroon hover:bg-ananda-cream";

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-md">
        <p className="text-sm font-semibold uppercase text-ananda-gold">
          Admin Area
        </p>

        <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ananda-dark-maroon">
              Management Panel
            </h1>
            <p className="text-sm text-gray-600">
              {user?.fullName} | {user?.role}
            </p>
          </div>

          <p className="rounded-full bg-ananda-cream px-4 py-2 text-sm font-semibold text-ananda-maroon">
            Authorized Access
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-white p-4 shadow-md">
            <p className="mb-3 px-4 text-sm font-semibold uppercase text-gray-500">
              Admin Menu
            </p>

            <nav className="space-y-2">
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

        <div className="lg:col-span-3">{children}</div>
      </div>
    </section>
  );
}

export default AdminLayout;