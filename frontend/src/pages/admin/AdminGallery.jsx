import { useEffect, useRef, useState } from "react";
import { getSports } from "../../services/sportService";
import {
  createGalleryAlbum,
  deleteAlbumImage,
  deleteGalleryAlbum,
  getGalleryAlbums,
  updateGalleryAlbum,
  uploadAlbumImages,
} from "../../services/galleryService";

const initialFormData = {
  title: "",
  sport: "",
  eventDate: "",
  description: "",
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

function AdminGallery() {
  const [sports, setSports] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingAlbumId, setEditingAlbumId] = useState(null);

  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [search, setSearch] = useState("");
  const [filterSport, setFilterSport] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildAlbumParams = () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    return params;
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGalleryAlbums(buildAlbumParams());
      setAlbums(data.albums);

      if (data.albums.length > 0 && !selectedAlbumId) {
        setSelectedAlbumId(data.albums[0]._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getSports()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setSports(data.sports);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load sports.");
      });

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

          if (data.albums.length > 0 && !selectedAlbumId) {
            setSelectedAlbumId(data.albums[0]._id);
          }

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
  }, [search, filterSport, selectedAlbumId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  const handleSearchChange = (event) => {
    setLoading(true);
    setSearch(event.target.value);
    setMessage("");
    setError("");
  };

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        title: formData.title,
        sport: formData.sport,
        eventDate: formData.eventDate,
        description: formData.description,
      };

      if (editingAlbumId) {
        await updateGalleryAlbum(editingAlbumId, payload);
        setMessage("Album updated successfully.");
      } else {
        await createGalleryAlbum(payload);
        setMessage("Album created successfully.");
      }

      setEditingAlbumId(null);
      setFormData(initialFormData);

      await loadAlbums();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save album.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbumId(album._id);

    setFormData({
      title: album.title || "",
      sport: album.sport?._id || "",
      eventDate: album.eventDate ? album.eventDate.slice(0, 10) : "",
      description: album.description || "",
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingAlbumId(null);
    setFormData(initialFormData);
    setMessage("");
    setError("");
  };

  const handleDeleteAlbum = async (albumId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteGalleryAlbum(albumId);
      setMessage("Album deleted successfully.");
      setSelectedAlbumId("");
      await loadAlbums();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete album.");
    }
  };

  const handleUploadImages = async (event) => {
    event.preventDefault();

    if (!selectedAlbumId) {
      setError("Please select an album.");
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      await uploadAlbumImages(selectedAlbumId, selectedFiles);

      setMessage("Images uploaded successfully.");
      setSelectedFiles(null);
      setFileInputKey((previousKey) => previousKey + 1);

      await loadAlbums();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (albumId, imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteAlbumImage(albumId, imageId);
      setMessage("Image deleted successfully.");
      await loadAlbums();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete image.");
    }
  };

  const selectedAlbum = albums.find((album) => album._id === selectedAlbumId);

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Gallery
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Create event albums and upload sports event images.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          {/* Create Album Form */}
          <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm h-fit">
            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              {editingAlbumId ? "Edit Album" : "Create Album"}
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Album Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Sports Meet 2026"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Related Sport
                </label>
                <div className="relative">
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  >
                    <option value="">General Event</option>
                    {sports.map((sport) => (
                      <option key={sport._id} value={sport._id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a short description..."
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
                >
                  {saving
                    ? "Saving..."
                    : editingAlbumId
                      ? "Update Album"
                      : "Create Album"}
                </button>

                {editingAlbumId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-xl border border-ananda-maroon/30 px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-cream/45 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </Reveal>

          {/* Upload Images Form */}
          <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm h-fit">
            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Upload Images
            </h2>

            <form className="space-y-5" onSubmit={handleUploadImages}>
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Select Album
                </label>
                <div className="relative">
                  <select
                    value={selectedAlbumId}
                    onChange={(event) => setSelectedAlbumId(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                    required
                  >
                    <option value="">Select album</option>
                    {albums.map((album) => (
                      <option key={album._id} value={album._id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Images
                </label>
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setSelectedFiles(event.target.files)}
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 text-xs text-gray-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-ananda-cream file:text-ananda-maroon hover:file:bg-ananda-gold/20 transition cursor-pointer"
                />
                <p className="mt-2 text-[10px] text-gray-400 font-medium leading-relaxed">
                  Maximum 20 images. Each image should be under 5MB.
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            </form>
          </Reveal>
        </div>

        {/* Albums List Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Gallery Albums
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search albums..."
                className="rounded-xl border border-ananda-gold/25 bg-white px-4 py-2 text-xs font-semibold outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
              />

              {/* Sport Filter */}
              <div className="relative">
                <select
                  value={filterSport}
                  onChange={handleFilterSportChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Sports</option>
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-555">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading albums...</p>
            </div>
          )}

          {!loading && albums.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No albums found.
            </div>
          )}

          {!loading && albums.length > 0 && (
            <div className="space-y-6">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm hover:border-ananda-gold/35 transition duration-250"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
                        {album.sport?.name || "General Event"}
                      </p>

                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
                        {album.title}
                      </h3>

                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        {album.images?.length || 0} images
                      </p>

                      {album.description && (
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedAlbumId(album._id);
                          setMessage("");
                          setError("");
                        }}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-maroon hover:bg-ananda-dark-maroon text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Select
                      </button>

                      <button
                        onClick={() => handleEdit(album)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteAlbum(album._id)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {album.images?.length > 0 && (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mt-4">
                      {album.images.map((image) => (
                        <div
                          key={image._id}
                          className="group overflow-hidden rounded-xl border border-ananda-gold/15 bg-white shadow-xs relative"
                        >
                          <img
                            src={image.url}
                            alt={album.title}
                            className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-3">
                            <button
                              onClick={() =>
                                handleDeleteImage(album._id, image._id)
                              }
                              className="font-display text-[9px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg transition duration-250 cursor-pointer shadow-sm"
                            >
                              Delete Image
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedAlbum && (
            <div className="mt-6 rounded-xl border border-ananda-gold/25 bg-ananda-gold/10 px-4 py-3 text-xs font-semibold text-ananda-dark-maroon flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ananda-gold animate-pulse" />
              <span>Selected album for upload:</span>
              <span className="font-bold underline">{selectedAlbum.title}</span>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

export default AdminGallery;