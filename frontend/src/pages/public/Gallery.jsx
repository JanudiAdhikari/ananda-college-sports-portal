import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../../services/sportService";
import { getGalleryAlbums } from "../../services/galleryService";

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
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Gallery
      </h1>

      <p className="mb-8 text-gray-700">
        View albums and photos from Ananda College sports events.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search albums..."
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        />

        <select
          value={filterSport}
          onChange={handleFilterSportChange}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        >
          <option value="ALL">All Sports</option>
          {sports.map((sport) => (
            <option key={sport._id} value={sport._id}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading gallery albums...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {!loading && !error && albums.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No gallery albums found.
        </div>
      )}

      {!loading && !error && albums.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {albums.map((album) => (
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

                <h2 className="text-xl font-bold text-ananda-maroon">
                  {album.title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {album.images?.length || 0} images
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Gallery;