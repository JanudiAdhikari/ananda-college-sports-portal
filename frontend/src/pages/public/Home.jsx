import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSports } from "../../services/sportService";
import { getPlayers } from "../../services/playerService";
import { getFixtures } from "../../services/fixtureService";
import { getGalleryAlbums } from "../../services/galleryService";
import { getLiveMatches } from "../../services/liveMatchService";

const StatCard = ({ label, value, link }) => (
  <Link
    to={link}
    className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
  >
    <p className="text-sm font-semibold uppercase text-ananda-gold">
      {label}
    </p>
    <p className="mt-2 text-4xl font-bold text-ananda-maroon">
      {value}
    </p>
  </Link>
);

const SectionHeader = ({ title, description, link, linkText }) => (
  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <h2 className="text-2xl font-bold text-ananda-dark-maroon">
        {title}
      </h2>
      <p className="mt-1 text-gray-700">{description}</p>
    </div>

    {link && (
      <Link
        to={link}
        className="font-semibold text-ananda-maroon hover:text-ananda-dark-maroon"
      >
        {linkText}
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
        ([
          sportsData,
          playersData,
          fixturesData,
          galleryData,
          liveMatchesData,
        ]) => {
          if (!isMounted) {
            return;
          }

          setSports(sportsData.sports || []);
          setPlayers(playersData.players || []);
          setFixtures(fixturesData.fixtures || []);
          setGalleryAlbums(galleryData.albums || []);
          setLiveMatches(liveMatchesData.liveMatches || []);
          setError("");
        }
      )
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(
          error.response?.data?.message || "Failed to load dashboard data."
        );
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
  }, []);

  const upcomingFixtures = fixtures.filter(
    (fixture) => fixture.status === "UPCOMING"
  );

  // const completedFixtures = fixtures.filter(
  //   (fixture) => fixture.status === "COMPLETED"
  // );

  const featuredFixtures = fixtures
    .filter((fixture) => fixture.isFeatured)
    .slice(0, 3);

  const liveMatch =
    liveMatches.find((match) => match.status === "LIVE") || liveMatches[0];

  const latestGalleryAlbums = galleryAlbums.slice(0, 3);
  const featuredPlayers = players.slice(0, 4);
  const featuredSports = sports.slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-md">
          {error}
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="bg-ananda-maroon">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ananda-gold">
              Ananda College, Colombo 10
            </p>

            <h1 className="mb-5 text-4xl font-bold text-white md:text-5xl">
              Official Sports Information Portal
            </h1>

            <p className="max-w-2xl text-lg text-ananda-light-gold">
              View school sports, teams, player profiles, fixtures, results,
              galleries, live matches, and achievements in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/sports"
                className="rounded-xl bg-ananda-gold px-6 py-3 font-semibold text-ananda-dark-maroon hover:opacity-90"
              >
                Explore Sports
              </Link>

              <Link
                to="/live-matches"
                className="rounded-xl border border-ananda-gold px-6 py-3 font-semibold text-ananda-gold hover:bg-ananda-gold hover:text-ananda-dark-maroon"
              >
                View Live Matches
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            {liveMatch ? (
              <>
                <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                  {liveMatch.status === "LIVE"
                    ? "Live Now"
                    : "Latest Match"}
                </p>

                <h2 className="mb-3 text-2xl font-bold text-ananda-maroon">
                  {liveMatch.title}
                </h2>

                <p className="mb-5 text-gray-600">
                  {liveMatch.anandaTeamName} vs {liveMatch.opponentTeamName}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-ananda-cream p-4">
                    <p className="text-sm text-gray-500">
                      {liveMatch.anandaTeamName}
                    </p>
                    <p className="text-2xl font-bold text-ananda-maroon">
                      {liveMatch.score?.anandaScore || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-ananda-cream p-4">
                    <p className="text-sm text-gray-500">
                      {liveMatch.opponentTeamName}
                    </p>
                    <p className="text-2xl font-bold text-ananda-maroon">
                      {liveMatch.score?.opponentScore || "-"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-xl bg-ananda-light-gold p-4 text-sm font-semibold text-ananda-dark-maroon">
                  {liveMatch.score?.currentStatus || liveMatch.status}
                </p>

                <Link
                  to="/live-matches"
                  className="mt-5 inline-block rounded-xl bg-ananda-maroon px-5 py-3 font-semibold text-white hover:bg-ananda-dark-maroon"
                >
                  Open Live Center
                </Link>
              </>
            ) : (
              <>
                <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                  Live Center
                </p>

                <h2 className="mb-3 text-2xl font-bold text-ananda-maroon">
                  No live matches right now
                </h2>

                <p className="text-gray-600">
                  Live matches and scores will appear here when available.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          <StatCard label="Sports" value={sports.length} link="/sports" />
          <StatCard label="Players" value={players.length} link="/sports" />
          <StatCard
            label="Upcoming"
            value={upcomingFixtures.length}
            link="/fixtures-results"
          />
          <StatCard
            label="Albums"
            value={galleryAlbums.length}
            link="/gallery"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectionHeader
          title="Sports"
          description="Browse the main sports available at Ananda College."
          link="/sports"
          linkText="View all sports"
        />

        {featuredSports.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
            No sports added yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredSports.map((sport) => (
              <Link
                key={sport._id}
                to={`/sports/${sport.slug}`}
                className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                  {sport.category}
                </p>

                <h3 className="mb-3 text-xl font-bold text-ananda-maroon">
                  {sport.name}
                </h3>

                <p className="line-clamp-3 text-sm text-gray-600">
                  {sport.description || "Sport details will be added soon."}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectionHeader
          title="Featured Fixtures"
          description="Important upcoming matches and completed results."
          link="/fixtures-results"
          linkText="View fixtures"
        />

        {featuredFixtures.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
            No featured fixtures added yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredFixtures.map((fixture) => (
              <div
                key={fixture._id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                  {fixture.sport?.name} | {fixture.status}
                </p>

                <h3 className="mb-2 text-xl font-bold text-ananda-maroon">
                  {fixture.title}
                </h3>

                <p className="text-sm text-gray-600">
                  Ananda College vs {fixture.opponent}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {new Date(fixture.matchDate).toLocaleString()}
                </p>

                {fixture.result?.resultText && (
                  <p className="mt-4 rounded-xl bg-ananda-light-gold p-3 text-sm font-semibold text-ananda-dark-maroon">
                    {fixture.result.resultText}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <SectionHeader
          title="Featured Players"
          description="View player profiles, performance summaries, and skill ratings."
          link="/sports"
          linkText="Browse teams"
        />

        {featuredPlayers.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
            No players added yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
            {featuredPlayers.map((player) => (
              <Link
                key={player._id}
                to={`/players/${player._id}`}
                className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ananda-light-gold text-2xl font-bold text-ananda-maroon">
                  {player.fullName.charAt(0)}
                </div>

                <h3 className="text-lg font-bold text-ananda-maroon">
                  {player.fullName}
                </h3>

                <p className="text-sm text-gray-600">
                  {player.sport?.name || "Sport"} |{" "}
                  {player.role || player.position || "Player"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <SectionHeader
          title="Latest Gallery Albums"
          description="Photos from school sports events and special encounters."
          link="/gallery"
          linkText="View gallery"
        />

        {latestGalleryAlbums.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
            No gallery albums added yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {latestGalleryAlbums.map((album) => (
              <Link
                key={album._id}
                to={`/gallery/${album.slug}`}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                {album.coverImage?.url ? (
                  <img
                    src={album.coverImage.url}
                    alt={album.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-ananda-light-gold text-ananda-maroon">
                    No cover image
                  </div>
                )}

                <div className="p-5">
                  <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                    {album.sport?.name || "General Event"}
                  </p>

                  <h3 className="text-xl font-bold text-ananda-maroon">
                    {album.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {album.images?.length || 0} images
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-ananda-dark-maroon">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Follow Ananda College Sports
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-ananda-light-gold">
            Stay updated with school sports teams, player profiles, fixtures,
            results, event photos, and live match coverage.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/fixtures-results"
              className="rounded-xl bg-ananda-gold px-6 py-3 font-semibold text-ananda-dark-maroon hover:opacity-90"
            >
              View Fixtures
            </Link>

            <Link
              to="/gallery"
              className="rounded-xl border border-ananda-gold px-6 py-3 font-semibold text-ananda-gold hover:bg-ananda-gold hover:text-ananda-dark-maroon"
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