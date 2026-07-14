import { useEffect, useRef, useState } from"react";
import { Link } from"react-router-dom";

import { getSports } from"../../services/sportService";
import { getPlayers } from"../../services/playerService";
import { getFixtures } from"../../services/fixtureService";
import { getGalleryAlbums } from"../../services/galleryService";
import { getLiveMatches } from"../../services/liveMatchService";
import { getOptimizedCloudinaryUrl } from"../../utils/cloudinaryUrl";

import img1 from"../../assets/img1.jpg";
import img2 from"../../assets/img2.jpg";
import img3 from"../../assets/img3.jpg";
import img4 from"../../assets/img4.jpg";
import img5 from"../../assets/img5.jpg";
import img6 from"../../assets/img6.jpg";

const SLIDESHOW_IMAGES = [img1, img2, img3, img4, img5, img6];

// // Image Slideshow Component
// function ImageSlideshow() {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
// 
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
//     }, 4000); // Change image every 4 seconds
// 
//     return () => clearInterval(interval);
//   }, []);
// 
//   return (
//     <div className="relative overflow-hidden rounded-3xl h-96 md:h-[500px] shadow-2xl">
//       {SLIDESHOW_IMAGES.map((image, index) => (
//         <img
//           key={index}
//           src={image}
//           alt={`Slideshow ${index + 1}`}
//           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
//             index === currentImageIndex ?"opacity-100" :"opacity-0"
//           }`}
//         />
//       ))}
// 
//       {/* Indicators */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//         {SLIDESHOW_IMAGES.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentImageIndex(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               index === currentImageIndex
//                 ?"bg-ananda-gold w-8"
//                 :"bg-white/50 hover:bg-white/80 w-2"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

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

const StatCard = ({ label, value, link }) => (
  <Link
    to={link}
    className="group rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-md flex items-center justify-between"
  >
    <div>
      <p className="font-display text-[10px] font-bold tracking-wider text-gray-400">
        {label}
      </p>
      <p className="font-display mt-1 text-4xl font-extrabold text-ananda-maroon transition duration-300 group-hover:text-ananda-dark-maroon">
        {value}
      </p>
    </div>
    <div className="h-10 w-10 rounded-xl bg-ananda-cream/40 flex items-center justify-center text-ananda-maroon group-hover:bg-ananda-gold/20 group-hover:text-ananda-dark-maroon transition duration-300">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

const SectionHeader = ({ eyebrow, title, description, link, linkText }) => (
  <div className="mb-8 flex flex-col gap-4 border-b border-ananda-gold/15 pb-6 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && (
        <p className="font-display mb-1.5 text-xs font-bold tracking-wider text-ananda-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl font-bold tracking-tight text-ananda-dark-maroon">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>

    {link && (
      <Link
        to={link}
        className="font-display inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-ananda-maroon hover:text-ananda-dark-maroon transition duration-200"
      >
        {linkText}
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getSports(),
      getPlayers(),
      getFixtures(),
      getGalleryAlbums(),
      getLiveMatches({ visibleOnly:"true" }),
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
        setError(error.response?.data?.message ||"Failed to load dashboard data.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingFixtures = fixtures.filter((f) => f.status ==="UPCOMING");
  const featuredFixtures = fixtures.filter((f) => f.isFeatured).slice(0, 3);
  const liveMatch = liveMatches.find((m) => m.status ==="LIVE") || liveMatches[0];
  const latestGalleryAlbums = galleryAlbums.slice(0, 3);
  const featuredPlayers = players.slice(0, 4);
  const featuredSports = sports.slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display text-xs font-bold tracking-wider text-ananda-maroon animate-pulse">
            Loading...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* HERO with SLIDESHOW */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-ananda-dark-maroon">
        {/* Slideshow Background */}
        <div className="absolute inset-0">
          {SLIDESHOW_IMAGES.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hero ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ?"opacity-35" :"opacity-0"
              }`}
            />
          ))}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-ananda-dark-maroon/90 via-ananda-dark-maroon/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 w-full lg:grid-cols-2 lg:items-center z-10">
          <div className="max-w-2xl">
            <p className="font-display mb-4 text-xs font-semibold tracking-[0.25em] text-ananda-gold">
              Ananda College &middot; Colombo 10
            </p>

            <h1 className="font-display mb-6 text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl uppercase">
              Where every <span className="text-ananda-gold">match</span> tells the <span className="text-ananda-gold">story</span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-white/80 leading-relaxed font-medium">
              Discover comprehensive sports profiles, tournament schedules, live updates, and official match results in one central hub. Experience the rich legacy, passion, and competitive spirit of Ananda College athletics.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/sports"
                className="font-display rounded-xl bg-ananda-gold px-8 py-3.5 text-xs font-bold tracking-wider text-ananda-dark-maroon transition hover:scale-[1.03] hover:shadow-xl shadow-lg cursor-pointer hover:bg-ananda-light-gold"
              >
                Explore Sports
              </Link>

              <Link
                to="/live-matches"
                className="font-display rounded-xl border border-ananda-gold px-8 py-3.5 text-xs font-bold tracking-wider text-ananda-gold transition hover:bg-ananda-gold hover:text-ananda-dark-maroon hover:shadow-xl cursor-pointer"
              >
                Live Matches
              </Link>
            </div>
          </div>

          {/* Live Match Panel - Right Side */}
          {liveMatch && (
            <div className="overflow-hidden rounded-3xl border border-ananda-gold/30 bg-ananda-maroon/90 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-ananda-gold/15 px-6 py-4">
                <div className="flex items-center gap-2">
                  {liveMatch.status ==="LIVE" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-400 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Live Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-ananda-gold/20 border border-ananda-gold/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-ananda-gold">
                      Latest Match
                    </span>
                  )}
                </div>
                <span className="font-display text-[10px] font-bold tracking-wider text-ananda-light-gold/70">
                  {liveMatch.sport?.name}
                </span>
              </div>

              <div className="px-6 py-8">
                <h2 className="font-display mb-6 text-base font-bold tracking-tight text-white line-clamp-2">
                  {liveMatch.title}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl bg-black/20 p-5 text-center border border-ananda-gold/10">
                    <p className="mb-2 truncate text-[10px] font-bold tracking-wider text-ananda-light-gold/60">
                      {liveMatch.anandaTeamName}
                    </p>
                    <p className="font-display text-4xl font-extrabold text-white">
                      {liveMatch.score?.anandaScore ||"-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/20 p-5 text-center border border-ananda-gold/10">
                    <p className="mb-2 truncate text-[10px] font-bold tracking-wider text-ananda-light-gold/60">
                      {liveMatch.opponentTeamName}
                    </p>
                    <p className="font-display text-4xl font-extrabold text-white">
                      {liveMatch.score?.opponentScore ||"-"}
                    </p>
                  </div>
                </div>

                <div className="font-display mb-6 rounded-xl bg-ananda-gold/10 border border-ananda-gold/25 px-4 py-3 text-center text-xs font-semibold tracking-wider text-ananda-gold">
                  {liveMatch.score?.currentStatus || liveMatch.status}
                </div>

                <Link
                  to="/live-matches"
                  className="font-display block rounded-xl bg-ananda-gold py-3.5 text-center text-xs font-bold tracking-wider text-ananda-dark-maroon transition hover:bg-ananda-light-gold hover:shadow-lg cursor-pointer"
                >
                  View Live Center
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Slideshow Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDESHOW_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ?"bg-ananda-gold w-8"
                  :"bg-white/30 hover:bg-white/60 w-1.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <Reveal className="grid gap-6 grid-cols-2 md:grid-cols-4">
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
            title="Sports Categories"
            description="Browse the main sports available at Ananda College."
            link="/sports"
            linkText="View all"
          />
        </Reveal>

        {featuredSports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No sports added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {featuredSports.map((sport) => (
              <Link
                key={sport._id}
                to={`/sports/${sport.slug}`}
                className="group rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/35 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <p className="font-display mb-1.5 text-[10px] font-bold tracking-wider text-ananda-gold">
                    {sport.category}
                  </p>
                  <h3 className="font-display mb-3 text-lg font-bold text-ananda-maroon transition duration-300 group-hover:text-ananda-dark-maroon">
                    {sport.name}
                  </h3>
                  <p className="line-clamp-3 text-xs text-gray-500 leading-relaxed">
                    {sport.description ||"Sport details will be added soon."}
                  </p>
                </div>
                <span className="font-display mt-4 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-ananda-maroon opacity-0 transition group-hover:opacity-100 duration-300">
                  View teams &rarr;
                </span>
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
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No featured fixtures added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {featuredFixtures.map((fixture) => (
              <div
                key={fixture._id}
                className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm hover:border-ananda-gold/35 transition duration-300"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-[10px] font-bold tracking-wider text-ananda-gold">
                    {fixture.sport?.name}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold tracking-wider text-blue-600">
                    {fixture.status}
                  </span>
                </div>
                <h3 className="font-display mb-1 text-base font-bold text-ananda-maroon">
                  {fixture.title}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mb-2">
                  Ananda College vs {fixture.opponent}
                </p>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(fixture.matchDate).toLocaleString()}
                </p>

                {fixture.result?.resultText && (
                  <div className="font-display mt-4 rounded-xl bg-ananda-gold/15 border border-ananda-gold/25 px-4 py-3 text-xs font-semibold text-ananda-dark-maroon leading-relaxed">
                    <span className="font-display text-[9px] font-bold tracking-wider text-ananda-maroon block mb-0.5">Result</span>
                    {fixture.result.resultText}
                  </div>
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
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No players added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {featuredPlayers.map((player) => (
              <Link
                key={player._id}
                to={`/players/${player._id}`}
                className="group rounded-2xl border border-ananda-gold/15 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/35 hover:shadow-md flex flex-col items-center text-center"
              >
                <div className="font-display mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ananda-cream/40 border border-ananda-gold/20 text-lg font-bold text-ananda-maroon transition duration-300 group-hover:bg-ananda-gold/20 group-hover:text-ananda-dark-maroon">
                  {player.fullName.charAt(0)}
                </div>
                <h3 className="font-display text-sm font-bold text-ananda-maroon truncate w-full">
                  {player.fullName}
                </h3>
                <p className="mt-1 text-[10px] font-semibold tracking-wider text-gray-400">
                  {player.sport?.name ||"Sport"}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-gray-500 line-clamp-1">
                  {player.role || player.position ||"Player"}
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
            description="Photos from school sports events and encounters."
            link="/gallery"
            linkText="View gallery"
          />
        </Reveal>

        {latestGalleryAlbums.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No gallery albums added yet.
          </div>
        ) : (
          <Reveal className="grid gap-6 md:grid-cols-3">
            {latestGalleryAlbums.map((album) => (
              <Link
                key={album._id}
                to={`/gallery/${album.slug}`}
                className="group overflow-hidden rounded-2xl border border-ananda-gold/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/35 hover:shadow-md"
              >
                {album.images?.[0]?.url || album.coverImage?.url ? (
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={getOptimizedCloudinaryUrl(album.images?.[0]?.url || album.coverImage.url, 600)}
                      alt={album.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-[9px] font-bold tracking-wider text-white">
                      {album.images?.length || 0} Photos
                    </span>
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-ananda-cream/40 border-b border-ananda-gold/15 text-ananda-maroon font-semibold text-xs">
                    No cover image
                  </div>
                )}

                <div className="p-5">
                  <p className="font-display mb-1 text-[10px] font-bold tracking-wider text-ananda-gold">
                    {album.sport?.name ||"General Event"}
                  </p>
                  <h3 className="font-display text-base font-bold text-ananda-maroon line-clamp-1">
                    {album.title}
                  </h3>
                </div>
              </Link>
            ))}
          </Reveal>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-ananda-cream/35 border-t border-ananda-gold/15">
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center z-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ananda-dark-maroon">
            Follow Ananda College Sports
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs font-semibold tracking-wider text-gray-500 leading-relaxed">
            Stay updated with teams, player profiles, fixtures, results,
            event photos, and live coverage.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/fixtures-results"
              className="font-display rounded-xl bg-ananda-maroon px-7 py-3 text-xs font-bold tracking-wider text-white transition hover:scale-[1.03] cursor-pointer hover:bg-ananda-dark-maroon shadow-sm hover:shadow-md"
            >
              View Fixtures
            </Link>
            <Link
              to="/gallery"
              className="font-display rounded-xl border border-ananda-maroon/30 px-7 py-3 text-xs font-bold tracking-wider text-ananda-maroon transition hover:bg-ananda-cream/45 cursor-pointer"
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