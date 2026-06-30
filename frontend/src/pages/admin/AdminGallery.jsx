import { useEffect, useState } from "react";
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
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Gallery
      </h1>

      <p className="mb-8 text-gray-700">
        Create event albums and upload sports event images.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
              {editingAlbumId ? "Edit Album" : "Create Album"}
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Album Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Sports Meet 2026"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Related Sport
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                >
                  <option value="">General Event</option>
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a short description..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
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
                  className="w-full rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
              Upload Images
            </h2>

            <form className="space-y-5" onSubmit={handleUploadImages}>
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Select Album
                </label>
                <select
                  value={selectedAlbumId}
                  onChange={(event) => setSelectedAlbumId(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                  required
                >
                  <option value="">Select album</option>
                  {albums.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Images
                </label>
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setSelectedFiles(event.target.files)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Maximum 20 images. Each image should be under 5MB.
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
          <div className="mb-5">
            <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
              Gallery Albums
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search albums..."
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              />

              <select
                value={filterSport}
                onChange={handleFilterSportChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading albums...</p>}

          {!loading && albums.length === 0 && (
            <p className="text-gray-600">No albums found.</p>
          )}

          {!loading && albums.length > 0 && (
            <div className="space-y-6">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-1 text-sm font-semibold uppercase text-ananda-gold">
                        {album.sport?.name || "General Event"}
                      </p>

                      <h3 className="text-xl font-bold text-ananda-maroon">
                        {album.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {album.images?.length || 0} images
                      </p>

                      {album.description && (
                        <p className="mt-2 text-gray-600">
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
                        className="rounded-lg bg-ananda-maroon px-3 py-2 text-sm font-semibold text-white hover:bg-ananda-dark-maroon"
                      >
                        Select
                      </button>

                      <button
                        onClick={() => handleEdit(album)}
                        className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteAlbum(album._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {album.images?.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                      {album.images.map((image) => (
                        <div
                          key={image._id}
                          className="overflow-hidden rounded-xl border border-gray-200"
                        >
                          <img
                            src={image.url}
                            alt={album.title}
                            className="h-40 w-full object-cover"
                          />

                          <div className="p-3">
                            <button
                              onClick={() =>
                                handleDeleteImage(album._id, image._id)
                              }
                              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
            <div className="mt-6 rounded-xl bg-ananda-cream px-4 py-3 text-sm text-ananda-dark-maroon">
              Selected album for upload:{" "}
              <span className="font-bold">{selectedAlbum.title}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminGallery;