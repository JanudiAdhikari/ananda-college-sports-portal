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
  const [activeForm, setActiveForm] = useState(null); // null, 'ALBUM', or 'UPLOAD'

  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const addFiles = (newFiles) => {
    setSelectedFiles((prev) => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 20) {
        setError("You can only upload up to 20 images at a time. The list has been trimmed to 20.");
        return combined.slice(0, 20);
      }
      setError("");
      return combined;
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
      addFiles(files);
    }
  };

  const [search, setSearch] = useState("");
  const [filterSport, setFilterSport] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      setCurrentPage(1);

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
          setCurrentPage(1);

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
      setActiveForm(null);

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
    setActiveForm("ALBUM");
  };

  const handleCancelEdit = () => {
    setEditingAlbumId(null);
    setFormData(initialFormData);
    setActiveForm(null);
    setMessage("");
    setError("");
  };

  const handleDeleteAlbum = async (e, albumId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      
      // Update local state inline to prevent full-page layout refetch flashing
      setAlbums((prevAlbums) => prevAlbums.filter((album) => album._id !== albumId));
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
      setSelectedFiles([]);
      setFileInputKey((previousKey) => previousKey + 1);
      setActiveForm(null);

      await loadAlbums();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (e, albumId, imageId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      
      // Update local state inline to prevent full-page layout refetch flashing
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) => {
          if (album._id === albumId) {
            const updatedImages = album.images.filter((img) => img._id !== imageId);
            return {
              ...album,
              images: updatedImages,
            };
          }
          return album;
        })
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete image.");
    }
  };

  const selectedAlbum = albums.find((album) => album._id === selectedAlbumId);

  // Pagination Logic
  const totalPages = Math.ceil(albums.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlbums = albums.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
            Manage Gallery
          </h1>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              setEditingAlbumId(null);
              setFormData(initialFormData);
              setActiveForm("ALBUM");
              setMessage("");
              setError("");
            }}
            className="font-display rounded-xl bg-ananda-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon hover:bg-ananda-light-gold transition cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create Album
          </button>
        </div>
      </div>

      <p className="mb-8 text-sm text-gray-600">
        Create event albums and upload sports event images.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700 animate-fade-in">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      {/* Full-width spacious view */}
      <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
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
              className="rounded-xl border border-ananda-gold/25 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
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
          <div>
            <div className="space-y-6">
              {paginatedAlbums.map((album) => (
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
                        <p className="mt-2 text-xs text-gray-650 leading-relaxed">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAlbumId(album._id);
                          setActiveForm("UPLOAD");
                          setMessage("");
                          setError("");
                        }}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-maroon hover:bg-ananda-dark-maroon text-white px-3.5 py-1.5 rounded-lg transition duration-250 cursor-pointer flex items-center gap-1 hover:scale-[1.02] shadow-xs"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Photos
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(album)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteAlbum(e, album._id)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {album.images?.length > 0 && (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4">
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
                              type="button"
                              onClick={(e) =>
                                handleDeleteImage(e, album._id, image._id)
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, albums.length)} of {albums.length} entries
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="font-display text-[10px] font-bold uppercase tracking-wider border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`font-display text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer ${
                        currentPage === page
                          ? "bg-ananda-maroon text-white shadow-xs"
                          : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="font-display text-[10px] font-bold uppercase tracking-wider border border-gray-200 bg-white hover:bg-gray-50 text-gray-750 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


      </Reveal>

      {/* Album Creation/Edit Overlay Modal */}
      {activeForm === "ALBUM" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCancelEdit}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-655 cursor-pointer transition hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-ananda-maroon px-6 py-3.5 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
                >
                  {saving
                    ? "Saving..."
                    : editingAlbumId
                      ? "Update Album"
                      : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Images Overlay Modal */}
      {activeForm === "UPLOAD" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveForm(null);
                setSelectedFiles([]);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-655 cursor-pointer transition hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Upload Images
            </h2>

            <form className="space-y-5" onSubmit={handleUploadImages}>
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Target Album
                </label>
                <div className="rounded-xl border border-ananda-gold/15 bg-ananda-gold/10 px-4 py-3 text-sm font-bold text-ananda-dark-maroon shadow-xs">
                  {selectedAlbum?.title || "Loading..."}
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Images
                </label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload-input").click()}
                  className={`w-full rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDragActive
                      ? "border-ananda-maroon bg-ananda-gold/10"
                      : "border-ananda-gold/30 hover:border-ananda-maroon bg-gray-50/50 hover:bg-white"
                  }`}
                >
                  <svg className="h-8 w-8 text-ananda-maroon opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-600 font-semibold mt-1">
                    Drag & drop your images here, or <span className="text-ananda-maroon underline font-bold">click to browse</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Maximum 20 images. Each image should be under 5MB.
                  </p>
                  <input
                    id="file-upload-input"
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      if (event.target.files && event.target.files.length > 0) {
                        addFiles(Array.from(event.target.files));
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Previews Section */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">
                        Selected ({selectedFiles.length} of 20):
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-[10px] font-bold text-red-600 uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-2 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      {previews.map((url, index) => {
                        const file = selectedFiles[index];
                        return (
                          <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-ananda-gold/20 shadow-xs bg-white">
                            <img src={url} alt={file?.name || "Preview"} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedFile(index);
                                }}
                                className="rounded-full bg-red-600 text-white p-1 hover:bg-red-700 transition transform hover:scale-110 cursor-pointer shadow-xs"
                                title="Remove image"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            {file?.size && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 px-1 truncate text-center font-mono">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="w-full rounded-xl bg-ananda-maroon px-6 py-3.5 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
                >
                  {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Image${selectedFiles.length === 1 ? "" : "s"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGallery;