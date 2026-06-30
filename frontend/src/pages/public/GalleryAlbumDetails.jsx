import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGalleryAlbumBySlug } from "../../services/galleryService";

function GalleryAlbumDetails() {
  const { albumSlug } = useParams();

  const [album, setAlbum] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getGalleryAlbumBySlug(albumSlug)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setAlbum(data.album);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load album.");
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
  }, [albumSlug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading album...
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
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        {album.sport?.name || "General Event"}
      </p>

      <h1 className="mb-4 text-3xl font-bold text-ananda-dark-maroon">
        {album.title}
      </h1>

      <p className="mb-8 max-w-3xl text-gray-700">
        {album.description || "Photos from this event."}
      </p>

      {album.images?.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No images uploaded for this album yet.
        </div>
      )}

      {album.images?.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {album.images.map((image) => (
            <button
              key={image._id}
              onClick={() => setSelectedImage(image)}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={image.url}
                alt={album.title}
                className="h-64 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white">
            <img
              src={selectedImage.url}
              alt={album.title}
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default GalleryAlbumDetails;