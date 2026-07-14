import { useEffect, useRef, useState } from"react";
import { Link } from"react-router-dom";
import { getSports } from"../../services/sportService";
import { getFixtures } from"../../services/fixtureService";

const statusOptions = [
  { value:"ALL", label:"All Statuses" },
  { value:"UPCOMING", label:"Upcoming" },
  { value:"LIVE", label:"Live" },
  { value:"COMPLETED", label:"Completed" },
  { value:"POSTPONED", label:"Postponed" },
];

const statusStyles = {
  LIVE:"bg-red-50 text-red-700 border-red-255",
  UPCOMING:"bg-ananda-cream text-ananda-maroon border-ananda-gold/20",
  COMPLETED:"bg-green-50 text-green-700 border-green-100",
  POSTPONED:"bg-gray-100 text-gray-600 border-gray-200",
};

const getStatusLabel = (value) => {
  return statusOptions.find((item) => item.value === value)?.label || value;
};

// Scroll-triggered reveal wrapper — fades sections in once
function Reveal({ children, className ="" }) {
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
      { threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ?"reveal" :"opacity-0"} ${className}`}>
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

    if (filterSport !=="ALL") {
      params.sport = filterSport;
    }

    if (filterStatus !=="ALL") {
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

        setError(error.response?.data?.message ||"Failed to load fixtures.");
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
      <section className="relative overflow-hidden bg-gradient-to-r from-ananda-dark-maroon via-ananda-maroon to-[#2d000a] text-white border-b border-ananda-gold/15 py-16">
        {/* Glowing visual accent spotlights */}
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-gradient-to-br from-ananda-gold/15 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-40 -mb-40 h-80 w-80 rounded-full bg-gradient-to-tr from-ananda-maroon/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 z-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ananda-light-gold transition duration-200 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <p className="font-display mb-2 text-xs font-semibold tracking-[0.25em] text-ananda-gold">
            Ananda College
          </p>
          
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Match Day
          </h1>
          
          <p className="mt-4 max-w-3xl text-xs font-semibold tracking-wider text-ananda-light-gold/80 leading-relaxed">
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
            <p className="font-display tracking-wide text-ananda-maroon animate-pulse">
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
        )}        {!loading && !error && fixtures.length > 0 && (
          <Reveal className="grid gap-8 md:grid-cols-2 pb-4">
            {fixtures.map((fixture) => {
              const isLive = fixture.status === "LIVE";
              const isCompleted = fixture.status === "COMPLETED";

              // Solid 3D offset shadow that shifts on hover
              const shadowClass = isLive
                ? "shadow-[5px_5px_0px_0px_#ef4444] hover:shadow-[7px_7px_0px_0px_#dc2626] border-red-500"
                : "shadow-[5px_5px_0px_0px_#e5a93b] hover:shadow-[7px_7px_0px_0px_#8b0000] border-ananda-gold/25 hover:border-ananda-maroon/30";

              // Score calculation
              const anandaScoreNum = Number(fixture.result?.anandaScore);
              const opponentScoreNum = Number(fixture.result?.opponentScore);
              const hasScores =
                fixture.result?.anandaScore !== undefined &&
                fixture.result?.anandaScore !== null;

              const anandaWon =
                isCompleted && hasScores && anandaScoreNum > opponentScoreNum;
              const opponentWon =
                isCompleted && hasScores && opponentScoreNum > anandaScoreNum;

              return (
                <div
                  key={fixture._id}
                  className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer ${shadowClass}`}
                >
                  <div>
                    {/* Top line with sport name & status badge */}
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <p className="font-display text-[10px] font-bold tracking-wider text-ananda-gold uppercase">
                        {fixture.sport?.name}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${
                          statusStyles[fixture.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isLive && (
                          <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
                        )}
                        {getStatusLabel(fixture.status)}
                      </span>
                    </div>

                    {/* Title & Match details */}
                    <h3 className="font-display text-lg font-bold tracking-tight text-ananda-dark-maroon mb-3">
                      {fixture.title}
                    </h3>

                    {/* Head-to-Head Visual Matchup */}
                    <div className="my-5 rounded-xl bg-ananda-cream/35 border border-ananda-gold/10 p-4 space-y-3">
                      {/* Ananda Team */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ananda-maroon text-[10px] font-bold text-white shadow-inner select-none">
                            AC
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              anandaWon ? "text-ananda-dark-maroon" : "text-gray-700"
                            }`}
                          >
                            Ananda College {anandaWon && "🏆"}
                          </span>
                        </div>
                        {hasScores && (
                          <span
                            className={`font-display text-lg font-extrabold ${
                              anandaWon ? "text-ananda-maroon" : "text-gray-500"
                            }`}
                          >
                            {fixture.result.anandaScore}
                          </span>
                        )}
                      </div>

                      {/* Divider line */}
                      <div className="border-t border-ananda-gold/10" />

                      {/* Opponent Team */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600 shadow-inner select-none">
                            {fixture.opponent.slice(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              opponentWon ? "text-ananda-dark-maroon" : "text-gray-700"
                            }`}
                          >
                            {fixture.opponent} {opponentWon && "🏆"}
                          </span>
                        </div>
                        {hasScores && (
                          <span
                            className={`font-display text-lg font-extrabold ${
                              opponentWon ? "text-ananda-maroon" : "text-gray-500"
                            }`}
                          >
                            {fixture.result.opponentScore}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Result Announcement banner */}
                    {fixture.result?.resultText && (
                      <div className="font-display mb-4 rounded-xl bg-ananda-light-gold/65 border border-ananda-gold/20 px-4 py-2.5 text-xs font-bold tracking-wider text-ananda-dark-maroon text-center shadow-xs">
                        {fixture.result.resultText}
                      </div>
                    )}

                    {/* Match Summary */}
                    {fixture.result?.summary && (
                      <p className="mb-4 text-xs font-semibold text-gray-550 leading-relaxed italic border-l-2 border-ananda-gold/30 pl-3">
                        "{fixture.result.summary}"
                      </p>
                    )}
                  </div>

                  {/* Date and Venue */}
                  <div className="mt-4 pt-4 border-t border-ananda-gold/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-[11px] text-gray-400 font-semibold tracking-wider">
                    <p className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-ananda-gold/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(fixture.matchDate).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <svg
                        className="h-4 w-4 text-ananda-gold/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {fixture.venue || "Venue not added"}
                    </p>
                  </div>
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