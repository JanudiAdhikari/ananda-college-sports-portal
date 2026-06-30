import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getSports } from "../../services/sportService";
import { getPlayers } from "../../services/playerService";
import { getFixtures } from "../../services/fixtureService";
import { getGalleryAlbums } from "../../services/galleryService";
import { getLiveMatches } from "../../services/liveMatchService";

// Scroll-triggered reveal wrapper — fades sections in once, respects user's intent to not animate
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

const StatCard = ({ label, value, link }) => (
  <Link
    to={link}
    className="group rounded-2xl border border-ananda-gold/20 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-ananda-gold/50 hover:shadow-lg"
  >
    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
      {label}
    </p>
    <p className="font-display mt-2 text-5xl font-bold text-ananda-maroon transition group-hover:text-ananda-dark-maroon">
      {value}
    </p>
  </Link>
);

const SectionHeader = ({ eyebrow, title, description, link, linkText }) => (
  <div className="mb-8 flex flex-col gap-3 border-b border-ananda-gold/20 pb-6 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && (
        <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        {title}
      </h2>
      <p className="mt-1 text-gray-600">{description}</p>
    </div>

    {link && (
      <Link
        to={link}
        className="font-display whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-ananda-maroon transition hover:text-ananda-dark-maroon"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

function Home() {
  const [sports, setSports] = useState([]);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getSports(),
      getPlayers(),
      getFixtures(),
      getGalleryAlbums(),
      getLiveMatches({ visibleOnly: "true" }),
    ])
      .then(
        ([sportsData, playersData, fixturesData, galleryData, liveMatchesData]) => {
          if (!isMounted) return;

          setSports(sportsData.sports || []);
          setPlayers(playersData.players || []);
          setFixtures(fixturesData.fixtures || []);
          setGalleryAlbums(galleryData.albums || []);
          setLiveMatches(liveMatchesData.liveMatches || []);
          setError("");
        }
      )
      .catch((error) => {
        if (!isMounted) return;
        setError(error.response?.data?.message || "Failed to load dashboard data.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingFixtures = fixtures.filter((f) => f.status === "UPCOMING");
  const featuredFixtures = fixtures.filter((f) => f.isFeatured).slice(0, 3);
  const liveMatch = liveMatches.find((m) => m.status === "LIVE") || liveMatches[0];
  const latestGalleryAlbums = galleryAlbums.slice(0, 3);
  const featuredPlayers = players.slice(0, 4);
  const featuredSports = sports.slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display uppercase tracking-wide text-ananda-maroon">
            Loading the scoreboard...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ananda-dark-maroon">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-ananda-gold">
              Ananda College &middot; Colombo 10
            </p>

            <h1 className="font-display mb-5 text-5xl font-bold uppercase leading-[1.05] text-white md:text-6xl">
              Where every <span className="text-ananda-gold">match</span> tells the story
            </h1>

            <p className="max-w-xl text-lg text-ananda-light-gold/90">
              Teams, players, fixtures, results, and live coverage from across
              the school &mdash; all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/sports"
                className="font-display rounded-xl bg-ananda-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-ananda-dark-maroon transition hover:scale-[1.03] hover:shadow-lg"
              >
                Explore Sports
              </Link>

              <Link
                to="/live-matches"
                className="font-display rounded-xl border border-ananda-gold/60 px-7 py-3 text-sm font-bold uppercase tracking-wide text-ananda-gold transition hover:bg-ananda-gold hover:text-ananda-dark-maroon"
              >
                Live Matches
              </Link>
            </div>
          </div>

          {/* SIGNATURE: scoreboard panel */}
          <div className="overflow-hidden rounded-3xl border border-ananda-gold/30 bg-ananda-maroon shadow-2xl">
            {liveMatch ? (
              <>
                <div className="flex items-center justify-between border-b border-ananda-gold/25 px-6 py-4">
                  <div className="flex items-center gap-2">
                    {liveMatch.status === "LIVE" && (
                      <span className="live-dot h-2.5 w-2.5 rounded-full bg-red-400" />
                    )}
                    <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-ananda-gold">
                      {liveMatch.status === "LIVE" ? "Live Now" : "Latest Match"}
                    </span>
                  </div>
                  <span className="font-display text-xs uppercase tracking-wide text-ananda-light-gold/70">
                    {liveMatch.sport?.name}
                  </span>
                </div>

                <div className="px-6 py-6">
                  <h2 className="font-display mb-5 text-xl font-bold uppercase tracking-tight text-white">
                    {liveMatch.title}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-black/20 p-4 text-center">
                      <p className="mb-1 truncate text-xs font-medium uppercase tracking-wide text-ananda-light-gold/70">
                        {liveMatch.anandaTeamName}
                      </p>
                      <p className="font-display text-4xl font-bold text-white">
                        {liveMatch.score?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/20 p-4 text-center">
                      <p className="mb-1 truncate text-xs font-medium uppercase tracking-wide text-ananda-light-gold/70">
                        {liveMatch.opponentTeamName}
                      </p>
                      <p className="font-display text-4xl font-bold text-white">
                        {liveMatch.score?.opponentScore || "-"}
                      </p>
                    </div>
                  </div>

                  <p className="font-display mt-5 rounded-lg bg-ananda-gold/15 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-ananda-gold">
                    {liveMatch.score?.currentStatus || liveMatch.status}
                  </p>

                  <Link
                    to="/live-matches"
                    className="font-display mt-5 block rounded-xl bg-ananda-gold py-3 text-center text-sm font-bold uppercase tracking-wide text-ananda-dark-maroon transition hover:opacity-90"
                  >
                    Open Live Center
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="font-display mb-2 text-xs font-bold uppercase tracking-[0.25em] text-ananda-gold">
                  Live Center
                </p>
                <h2 className="font-display mb-3 text-2xl font-bold uppercase text-white">
                  No live matches right now
                </h2>
                <p className="text-sm text-ananda-light-gold/80">
                  Scores will appear here the moment a match goes live.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <Reveal className="grid gap-6 md:grid-cols-4">
          <StatCard label="Sports" value={sports.length} link="/sports" />
          <StatCard label="Players" value={players.length} link="/sports" />
          <StatCard label="Upcoming" value={upcomingFixtures.length} link="/fixtures-results" />
          <StatCard label="Albums" value={galleryAlbums.length} link="/gallery" />
        </Reveal>
      </section>

      {/* SPORTS */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <Reveal>
          <SectionHeader
            eyebrow="School Sports"
            title="Sports"
            description="Browse the main sports available at Ananda College."
            link="/sports"
            linkText="View all"
          />
        </Reveal>

        {featuredSports.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-sm">
            No sports added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {featuredSports.map((sport) => (
              <Link
                key={sport._id}
                to={`/sports/${sport.slug}`}
                className="group rounded-2xl border border-transparent bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg"
              >
                <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                  {sport.category}
                </p>
                <h3 className="font-display mb-3 text-xl font-bold uppercase text-ananda-maroon transition group-hover:text-ananda-dark-maroon">
                  {sport.name}
                </h3>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {sport.description || "Sport details will be added soon."}
                </p>
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      {/* FIXTURES */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <Reveal>
          <SectionHeader
            eyebrow="Match Day"
            title="Featured Fixtures"
            description="Important upcoming matches and completed results."
            link="/fixtures-results"
            linkText="View all"
          />
        </Reveal>

        {featuredFixtures.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-sm">
            No featured fixtures added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {featuredFixtures.map((fixture) => (
              <div
                key={fixture._id}
                className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                  {fixture.sport?.name} &middot; {fixture.status}
                </p>
                <h3 className="font-display mb-2 text-lg font-bold uppercase text-ananda-maroon">
                  {fixture.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Ananda College vs {fixture.opponent}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">
                  {new Date(fixture.matchDate).toLocaleString()}
                </p>

                {fixture.result?.resultText && (
                  <p className="font-display mt-4 rounded-lg bg-ananda-light-gold px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-ananda-dark-maroon">
                    {fixture.result.resultText}
                  </p>
                )}
              </div>
            ))}
          </Reveal>
        )}
      </section>

      {/* PLAYERS */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <Reveal>
          <SectionHeader
            eyebrow="Player Profiles"
            title="Featured Players"
            description="Performance summaries and skill ratings."
            link="/sports"
            linkText="Browse teams"
          />
        </Reveal>

        {featuredPlayers.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-sm">
            No players added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-4">
            {featuredPlayers.map((player) => (
              <Link
                key={player._id}
                to={`/players/${player._id}`}
                className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="font-display mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ananda-light-gold text-2xl font-bold text-ananda-maroon transition group-hover:bg-ananda-gold">
                  {player.fullName.charAt(0)}
                </div>
                <h3 className="font-display text-base font-bold uppercase text-ananda-maroon">
                  {player.fullName}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {player.sport?.name || "Sport"} &middot;{" "}
                  {player.role || player.position || "Player"}
                </p>
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <Reveal>
          <SectionHeader
            eyebrow="In Pictures"
            title="Latest Gallery Albums"
            description="Photos from school sports events and special encounters."
            link="/gallery"
            linkText="View gallery"
          />
        </Reveal>

        {latestGalleryAlbums.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-sm">
            No gallery albums added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {latestGalleryAlbums.map((album) => (
              <Link
                key={album._id}
                to={`/gallery/${album.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {album.coverImage?.url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={album.coverImage.url}
                      alt={album.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-ananda-light-gold text-ananda-maroon">
                    No cover image
                  </div>
                )}

                <div className="p-5">
                  <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                    {album.sport?.name || "General Event"}
                  </p>
                  <h3 className="font-display text-lg font-bold uppercase text-ananda-maroon">
                    {album.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {album.images?.length || 0} images
                  </p>
                </div>
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ananda-dark-maroon">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
            Follow Ananda College Sports
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ananda-light-gold/90">
            Stay updated with teams, player profiles, fixtures, results,
            event photos, and live coverage.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/fixtures-results"
              className="font-display rounded-xl bg-ananda-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-ananda-dark-maroon transition hover:scale-[1.03]"
            >
              View Fixtures
            </Link>
            <Link
              to="/gallery"
              className="font-display rounded-xl border border-ananda-gold/60 px-7 py-3 text-sm font-bold uppercase tracking-wide text-ananda-gold transition hover:bg-ananda-gold hover:text-ananda-dark-maroon"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;