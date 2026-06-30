import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../../services/sportService";

const CATEGORIES = [
  { value: "ALL", label: "All" },
  { value: "TEAM", label: "Team" },
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "AQUATIC", label: "Aquatic" },
  { value: "ATHLETICS", label: "Athletics" },
  { value: "OTHER", label: "Other" },
];

function SportCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ananda-gold/10 bg-white p-6 shadow-sm">
      <div className="mb-3 h-3 w-20 rounded bg-ananda-light-gold" />
      <div className="mb-4 h-6 w-2/3 rounded bg-gray-200" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-3/4 rounded bg-gray-100" />
      </div>
    </div>
  );
}

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
        const data = await getSports({ search, category });
        setSports(data.sports);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load sports.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSports, 300);
    return () => clearTimeout(timeoutId);
  }, [search, category]);

  return (
    <div>
      {/* PAGE HEADER */}
      <section className="relative overflow-hidden bg-ananda-dark-maroon">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <p className="font-display mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-ananda-gold">
            Ananda College Athletics
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            All Sports
          </h1>
          <p className="mt-3 max-w-xl text-ananda-light-gold/90">
            Browse every sport played at Ananda College and explore the
            teams competing under each one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* FILTER BAR */}
        <div className="mb-10 flex flex-col gap-5 rounded-2xl border border-ananda-gold/15 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-80">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search sports..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-ananda-cream/40 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-ananda-maroon focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`font-display rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    active
                      ? "bg-ananda-maroon text-white shadow-sm"
                      : "bg-ananda-cream text-ananda-dark-maroon hover:bg-ananda-light-gold"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SportCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && sports.length === 0 && (
          <div className="rounded-2xl border border-ananda-gold/15 bg-white p-12 text-center shadow-sm">
            <p className="font-display text-lg font-semibold uppercase text-ananda-maroon">
              No sports found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or category.
            </p>
          </div>
        )}

        {!loading && !error && sports.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sports.map((sport, index) => (
              <Link
                key={sport._id}
                to={`/sports/${sport.slug}`}
                style={{ animationDelay: `${index * 40}ms` }}
                className="reveal group rounded-2xl border border-transparent bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg"
              >
                <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                  {sport.category}
                </p>
                <h2 className="font-display mb-3 text-xl font-bold uppercase text-ananda-maroon transition group-hover:text-ananda-dark-maroon">
                  {sport.name}
                </h2>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {sport.description || "Sport details will be added soon."}
                </p>
                <span className="font-display mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ananda-maroon opacity-0 transition group-hover:opacity-100">
                  View teams &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Sports;