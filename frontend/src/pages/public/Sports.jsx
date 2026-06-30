import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../../services/sportService";

function Sports() {
  const [sports, setSports] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSports({
          search,
          category,
        });

        setSports(data.sports);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load sports."
        );
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSports, 300);

    return () => clearTimeout(timeoutId);
  }, [search, category]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Sports
      </h1>

      <p className="mb-8 text-gray-700">
        Browse all sports available at Ananda College.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search sports..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        >
          <option value="ALL">All Categories</option>
          <option value="TEAM">Team Sports</option>
          <option value="INDIVIDUAL">Individual Sports</option>
          <option value="AQUATIC">Aquatic Sports</option>
          <option value="ATHLETICS">Athletics</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          Loading sports...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {!loading && !error && sports.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No sports found.
        </div>
      )}

      {!loading && !error && sports.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sports.map((sport) => (
            <Link
              key={sport._id}
              to={`/sports/${sport.slug}`}
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                {sport.category}
              </p>

              <h2 className="mb-3 text-2xl font-bold text-ananda-maroon">
                {sport.name}
              </h2>

              <p className="line-clamp-3 text-gray-600">
                {sport.description || "Sport details will be added soon."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Sports;