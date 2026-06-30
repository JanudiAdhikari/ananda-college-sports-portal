import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Scroll-triggered reveal wrapper — fades sections in once
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ? "reveal" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: "Sports",
      description: "Add, edit, delete and manage school sports.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
      path: "/admin/sports",
    },
    {
      title: "Teams",
      description: "Manage teams, age groups, coaches, captains and years.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
      path: "/admin/teams",
    },
    {
      title: "Players",
      description: "Manage player profiles, statistics and achievements.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
      path: "/admin/players",
    },
    {
      title: "Fixtures & Results",
      description:
        "Manage upcoming fixtures, completed results and match summaries.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
      path: "/admin/fixtures",
    },
    {
      title: "Gallery",
      description: "Create albums and manage event images.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER", "PHOTO_CLUB"],
      path: "/admin/gallery",
    },
    {
      title: "Live Matches",
      description: "Update live match links, scores and match status.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER", "VIDEO_CLUB"],
      path: "/admin/live-matches",
    },
    {
      title: "Users",
      description: "Create and manage system users and roles.",
      roles: ["SUPER_ADMIN", "SPORTS_TEACHER"],
      path: "/admin/users",
    },
  ];

  const allowedItems = dashboardItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Welcome Back
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Admin Dashboard
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Hello, {user?.fullName}. Select a section below to manage portal content and configurations.
      </p>

      <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allowedItems.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm transition duration-350 hover:-translate-y-1 hover:border-ananda-gold/30 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon group-hover:text-ananda-dark-maroon transition duration-300">
                {item.title}
              </h2>

              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <Link
              to={item.path}
              className="mt-6 inline-block text-center font-display text-[11px] font-bold uppercase tracking-wider bg-ananda-maroon text-white hover:bg-ananda-dark-maroon px-4 py-2.5 rounded-xl transition duration-300 shadow-sm hover:scale-[1.02]"
            >
              Manage {item.title}
            </Link>
          </div>
        ))}
      </Reveal>
    </div>
  );
}

export default AdminDashboard;
