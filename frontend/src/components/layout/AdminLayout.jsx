import { NavLink } from"react-router-dom";
import { useAuth } from"../../hooks/useAuth";

const adminLinks = [
  {
    label:"Dashboard",
    path:"/admin",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER","PHOTO_CLUB","VIDEO_CLUB"],
  },
  {
    label:"Sports",
    path:"/admin/sports",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER"],
  },
  {
    label:"Teams",
    path:"/admin/teams",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER"],
  },
  {
    label:"Players",
    path:"/admin/players",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER"],
  },
  {
    label:"Fixtures",
    path:"/admin/fixtures",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER"],
  },
  {
    label:"Gallery",
    path:"/admin/gallery",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER","PHOTO_CLUB"],
  },
  {
    label:"Live Matches",
    path:"/admin/live-matches",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER","VIDEO_CLUB"],
  },
  {
    label:"Users",
    path:"/admin/users",
    roles: ["SUPER_ADMIN","SPORTS_TEACHER"],
  },
];

function AdminLayout({ children }) {
  const { user } = useAuth();

  const visibleLinks = adminLinks.filter((link) =>
    link.roles.includes(user?.role)
  );

  const linkClass = ({ isActive }) =>`font-display text-sm font-semibold tracking-wider block rounded-xl px-4 py-2 lg:py-3 transition duration-200 lg:hover:translate-x-0.5 ${
      isActive
        ?"bg-gradient-to-r from-ananda-maroon to-ananda-dark-maroon text-white shadow-md"
        :"text-ananda-dark-maroon hover:bg-ananda-cream/60 hover:text-ananda-maroon"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
      {/* Admin Header */}
      <div className="relative overflow-hidden mb-6 rounded-2xl border border-ananda-gold/15 bg-gradient-to-r from-ananda-dark-maroon via-ananda-maroon to-[#2d000a] p-6 shadow-sm text-white">
        {/* Glowing spotlights */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-48 w-48 rounded-full bg-gradient-to-br from-ananda-gold/15 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -ml-20 -mb-20 h-40 w-40 rounded-full bg-gradient-to-tr from-ananda-maroon/20 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <p className="font-display text-[10px] font-bold tracking-wider text-ananda-gold">
            Admin Area
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Management Panel
              </h1>
              <p className="mt-1 text-[10px] text-ananda-light-gold/80 font-bold tracking-wider">
                {user?.fullName} <span className="text-ananda-gold/40 font-normal mx-1">|</span> {user?.role?.replace("_","")}
              </p>
            </div>

            <span className="font-display self-start md:self-auto rounded-full bg-ananda-gold/10 border border-ananda-gold/30 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-ananda-gold">
              Authorized Access
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 rounded-2xl border border-ananda-gold/15 bg-white p-4 shadow-sm">
            <p className="font-display mb-3 px-4 text-xs font-bold tracking-wider text-gray-400">
              Admin Menu
            </p>

            <nav className="flex flex-wrap gap-2 lg:flex-col lg:space-y-1.5 lg:gap-0">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path ==="/admin"}
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