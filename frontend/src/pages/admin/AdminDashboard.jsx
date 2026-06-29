function AdminDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Admin Dashboard
      </h1>

      <p className="mb-8 text-gray-700">
        Manage sports, teams, players, gallery, live matches, users, fixtures,
        and results.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          "Sports",
          "Teams",
          "Players",
          "Gallery",
          "Live Matches",
          "Users",
        ].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-ananda-maroon">{item}</h2>
            <p className="mt-2 text-gray-600">
              Add, edit, delete and manage {item.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;