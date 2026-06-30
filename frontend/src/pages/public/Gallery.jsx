import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../../services/sportService";
import { getGalleryAlbums } from "../../services/galleryService";

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

function Gallery() {
  const [sports, setSports] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [search, setSearch] = useState("");
  const [filterSport, setFilterSport] = useState("ALL");

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

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    const timeoutId = setTimeout(() => {
      getGalleryAlbums(params)
        .then((data) => {
          if (!isMounted) {
            return;
          }

          setAlbums(data.albums);
          setError("");
        })
        .catch((error) => {
          if (!isMounted) {
            return;
          }

          setError(error.response?.data?.message || "Failed to load albums.");
        })
        .finally(() => {
          if (!isMounted) {
            return;
          }

          setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [search, filterSport]);

  const handleSearchChange = (event) => {
    setLoading(true);
    setSearch(event.target.value);
  };

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
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
            In Pictures
          </h1>
          
          <p className="mt-4 max-w-3xl text-base text-ananda-light-gold/90 leading-relaxed">
            View albums and photos from school sports events, championships, and encounters.
          </p>
        </div>
      </section>

      {/* GALLERY CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Search & Filter Bar */}
        <Reveal className="mb-10 grid gap-4 md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search albums..."
              className="w-full rounded-xl border border-ananda-gold/25 bg-white py-3 pl-11 pr-4 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
            />
          </div>

          {/* Sport Select */}
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
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-505">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </Reveal>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
            <p className="font-display uppercase tracking-wide text-ananda-maroon animate-pulse">
              Loading gallery albums...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && albums.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 shadow-sm">
            No gallery albums found matching your search.
          </div>
        )}

        {!loading && !error && albums.length > 0 && (
          <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album._id}
                to={`/gallery/${album.slug}`}
                className="group overflow-hidden rounded-2xl border border-ananda-gold/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg flex flex-col"
              >
                <div className="h-52 overflow-hidden relative bg-ananda-cream/35">
                  {album.coverImage?.url ? (
                    <img
                      src={album.coverImage.url}
                      alt={album.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-ananda-light-gold/30 text-ananda-maroon font-display uppercase tracking-wider text-xs">
                      No cover image
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {album.images?.length || 0} Photos
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                      {album.sport?.name || "General Event"}
                    </p>

                    <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon group-hover:text-ananda-dark-maroon transition duration-300 line-clamp-2">
                      {album.title}
                    </h2>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ananda-gold opacity-0 transition duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                    View Album &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
        )}
      </section>
    </div>
  );
}

export default Gallery;