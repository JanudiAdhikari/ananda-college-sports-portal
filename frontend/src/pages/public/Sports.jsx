import { useEffect, useRef, useState } from "react";
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

const sportImages = {
  cricket: "/sports/cricket.svg",
  rugby: "/sports/rugby.svg",
  athletics: "/sports/athletics.svg",
  badminton: "/sports/badminton.svg",
  basketball: "/sports/basketball.svg",
  "table-tennis": "/sports/table-tennis.svg",
  tennis: "/sports/tennis.svg",
  rowing: "/sports/rowing.svg",
  hockey: "/sports/hockey.svg",
  volleyball: "/sports/volleyball.svg",
  "beach-volleyball": "/sports/beach-volleyball.svg",
  football: "/sports/football.svg",
  swimming: "/sports/swimming.svg",
  gymnastics: "/sports/gymnastics.svg",
  lifesaving: "/sports/lifesaving.svg",
  scouting: "/sports/scouting.svg",
  archery: "/sports/archery.svg",
  golf: "/sports/golf.svg",
  chess: "/sports/chess.svg",
  "water-polo": "/sports/water-polo.svg",
  wushu: "/sports/wushu.svg",
  karate: "/sports/karate.svg",
  boxing: "/sports/boxing.svg",
  judo: "/sports/judo.svg",
  taekwondo: "/sports/taekwondo.svg",
  "roller-skating": "/sports/roller-skating.svg",
  weightlifting: "/sports/weightlifting.svg",
  powerlifting: "/sports/powerlifting.svg",
  carrom: "/sports/carrom.svg",
  handball: "/sports/handball.svg",
  baseball: "/sports/baseball.svg",
  mountaineering: "/sports/mountaineering.svg",
  "cadet-corps": "/sports/cadet-corps.svg",
  "police-cadet-corps": "/sports/police-cadet-corps.svg",
  "junior-cadet-corps": "/sports/junior-cadet-corps.svg",
  "cadet-band": "/sports/cadet-band.svg",
  squash: "/sports/squash.svg",
  shooting: "/sports/shooting.svg",
  kabaddi: "/sports/kabaddi.svg",
  "softball-cricket": "/sports/softball-cricket.svg",
  elle: "/sports/elle.svg",
};

const getSportPlaceholderImage = (slug) => {
  return sportImages[slug] || "/sports/default.svg";
};

function SportCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ananda-gold/10 bg-white p-6 shadow-sm">
      <div className="mb-3 h-3 w-20 rounded bg-ananda-light-gold/40" />
      <div className="mb-4 h-6 w-2/3 rounded bg-gray-250/20" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-150/15" />
        <div className="h-3 w-5/6 rounded bg-gray-150/15" />
        <div className="h-3 w-3/4 rounded bg-gray-150/15" />
      </div>
    </div>
  );
}

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
      { threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? "reveal" : "opacity-0"} ${className}`}
    >
      {children}
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
      <section className="relative overflow-hidden bg-gradient-to-r from-ananda-dark-maroon via-ananda-maroon to-[#2d000a] text-white border-b border-ananda-gold/15">
        {/* Glowing visual accent spotlights */}
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-gradient-to-br from-ananda-gold/15 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-40 -mb-40 h-80 w-80 rounded-full bg-gradient-to-tr from-ananda-maroon/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 z-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ananda-light-gold transition duration-200 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <p className="font-display mb-3 text-xs font-semibold tracking-[0.25em] text-ananda-gold">
            Ananda College Athletics
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            All Sports
          </h1>
          <p className="mt-3 max-w-xl text-xs font-semibold tracking-wider text-ananda-light-gold/80 leading-relaxed">
            Browse every sport played at Ananda College and explore the teams
            competing under each one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* FILTER BAR */}
        <Reveal className="mb-10 flex flex-col gap-5 rounded-2xl border border-ananda-gold/15 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
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
                strokeWidth={2.5}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search sports..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-ananda-gold/25 bg-white py-3.5 pl-10 pr-4 text-xs font-semibold tracking-wider outline-none transition focus:border-ananda-maroon"
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
                  className={`font-display rounded-xl px-4 py-2.5 text-[10px] font-bold  tracking-wider transition cursor-pointer ${
                    active
                      ? "bg-ananda-maroon text-white shadow-sm"
                      : "bg-ananda-cream/40 text-ananda-dark-maroon hover:bg-ananda-gold/20"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* RESULTS */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SportCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && sports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="font-display text-lg font-bold text-ananda-maroon">
              No sports found
            </p>
            <p className="mt-2 text-xs text-gray-500 font-medium">
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
                className="reveal group rounded-2xl border border-ananda-gold/15 bg-white overflow-hidden shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/35 hover:shadow-md flex flex-col justify-between cursor-pointer"
              >
                {/* Top Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-150/10 border-b border-ananda-gold/10">
                  <img
                    src={
                      sport.coverImage?.url ||
                      getSportPlaceholderImage(sport.slug)
                    }
                    alt={sport.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Floating Category Badge */}
                  <div className="absolute top-3 left-3 rounded-lg bg-ananda-maroon px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase shadow-sm border border-ananda-gold/20">
                    {sport.category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div className="mb-4">
                    <h2 className="font-display mb-2 text-lg font-bold text-ananda-maroon transition duration-300 group-hover:text-ananda-dark-maroon">
                      {sport.name}
                    </h2>
                    <p className="line-clamp-3 text-xs text-gray-550 leading-relaxed font-semibold">
                      {sport.description || "Sport details will be added soon."}
                    </p>
                  </div>
                  <span className="font-display inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-ananda-maroon group-hover:translate-x-1 transition duration-300">
                    View teams
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Sports;
