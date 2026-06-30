import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../../services/sportService";
import { getFixtures } from "../../services/fixtureService";

const statusOptions = [
  { value: "ALL", label: "All Statuses" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live" },
  { value: "COMPLETED", label: "Completed" },
  { value: "POSTPONED", label: "Postponed" },
];

const statusStyles = {
  LIVE: "bg-red-50 text-red-700 border-red-255",
  UPCOMING: "bg-ananda-cream text-ananda-maroon border-ananda-gold/20",
  COMPLETED: "bg-green-50 text-green-700 border-green-100",
  POSTPONED: "bg-gray-100 text-gray-600 border-gray-200",
};

const getStatusLabel = (value) => {
  return statusOptions.find((item) => item.value === value)?.label || value;
};

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

function FixturesResults() {
  const [sports, setSports] = useState([]);
  const [fixtures, setFixtures] = useState([]);

  const [filterSport, setFilterSport] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getSports()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setSports(data.sports);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const params = {};

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    getFixtures(params)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setFixtures(data.fixtures);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load fixtures.");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filterSport, filterStatus]);

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setLoading(true);
    setFilterStatus(event.target.value);
  };

  return (
    <div>
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-ananda-dark-maroon py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            to="/"
            className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
          >
            &larr; Back to Home
          </Link>
          
          <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
            Ananda College
          </p>
          
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            Match Day
          </h1>
          
          <p className="mt-4 max-w-3xl text-base text-ananda-light-gold/90 leading-relaxed">
            Track upcoming fixtures, live scores, and completed match results across all sports.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Filters */}
        <Reveal className="mb-10 grid gap-4 md:grid-cols-2">
          {/* Sport Filter */}
          <div className="relative">
            <select
              value={filterSport}
              onChange={handleFilterSportChange}
              className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
            >
              <option value="ALL">All Sports</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </Reveal>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
            <p className="font-display uppercase tracking-wide text-ananda-maroon animate-pulse">
              Loading fixtures and results...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && fixtures.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 shadow-sm">
            No fixtures or results found matching the filters.
          </div>
        )}

        {!loading && !error && fixtures.length > 0 && (
          <Reveal className="grid gap-6 md:grid-cols-2">
            {fixtures.map((fixture) => {
              const isLive = fixture.status === "LIVE";
              const cardBorderClass = isLive ? "border-red-400 shadow-md animate-pulse" : "border-ananda-gold/15";
              
              return (
                <div
                  key={fixture._id}
                  className={`relative rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition duration-300 ${cardBorderClass}`}
                >
                  {/* Top line with sport name & status badge */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                      {fixture.sport?.name}
                    </p>

                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyles[fixture.status] || "bg-gray-100 text-gray-600"}`}>
                      {isLive && <span className="live-dot h-2 w-2 rounded-full bg-red-500" />}
                      {getStatusLabel(fixture.status)}
                    </span>
                  </div>

                  {/* Title & Match details */}
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ananda-dark-maroon mb-2">
                    {fixture.title}
                  </h2>

                  <p className="text-sm font-semibold text-gray-800">
                    Ananda College <span className="text-gray-400 font-normal">vs</span> {fixture.opponent}
                  </p>

                  {/* Date and Venue */}
                  <div className="mt-3 space-y-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-ananda-gold/10 pb-4">
                    <p className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-ananda-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(fixture.matchDate).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-ananda-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {fixture.venue || "Venue not added"}
                    </p>
                  </div>

                  {/* Scoreboard display */}
                  {(fixture.status === "COMPLETED" || fixture.status === "LIVE" || fixture.result?.anandaScore !== undefined || fixture.result?.opponentScore !== undefined) && (
                    <div className="mt-4 grid gap-4 grid-cols-2">
                      <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/35 p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ananda College</p>
                        <p className="font-display mt-1 text-2xl font-bold text-ananda-maroon">
                          {fixture.result?.anandaScore !== undefined && fixture.result?.anandaScore !== null ? fixture.result.anandaScore : "-"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/35 p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">{fixture.opponent}</p>
                        <p className="font-display mt-1 text-2xl font-bold text-ananda-maroon">
                          {fixture.result?.opponentScore !== undefined && fixture.result?.opponentScore !== null ? fixture.result.opponentScore : "-"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Result Announcement banner */}
                  {fixture.result?.resultText && (
                    <div className="font-display mt-4 rounded-xl bg-ananda-light-gold/65 border border-ananda-gold/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon text-center">
                      {fixture.result.resultText}
                    </div>
                  )}

                  {/* Match Summary */}
                  {fixture.result?.summary && (
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                      {fixture.result.summary}
                    </p>
                  )}
                </div>
              );
            })}
          </Reveal>
        )}
      </section>
    </div>
  );
}

export default FixturesResults;