import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        {user?.role}
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Admin Dashboard
      </h1>

      <p className="mb-8 text-gray-700">
        Welcome, {user?.fullName}. Manage the sections you have permission to
        access.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {allowedItems.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-ananda-maroon">
              {item.title}
            </h2>

            <p className="mt-2 text-gray-600">{item.description}</p>

            <Link
              to={item.path}
              className="mt-5 inline-block rounded-xl bg-ananda-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-ananda-dark-maroon"
            >
              Manage
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;