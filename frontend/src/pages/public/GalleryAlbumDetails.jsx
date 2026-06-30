import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGalleryAlbumBySlug } from "../../services/galleryService";

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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display uppercase tracking-wide text-ananda-maroon animate-pulse">
            Loading album...
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
            to="/gallery"
            className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
          >
            &larr; Back to Gallery
          </Link>
          
          <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
            {album.sport?.name || "General Event"}
          </p>
          
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            {album.title}
          </h1>
          
          <p className="mt-4 max-w-3xl text-base text-ananda-light-gold/90 leading-relaxed">
            {album.description || "Photos from this event."}
          </p>
        </div>
      </section>

      {/* ALBUM IMAGES */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        
        {album.images?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-505 shadow-sm">
            No images uploaded for this album yet.
          </div>
        )}

        {album.images?.length > 0 && (
          <Reveal className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {album.images.map((image) => (
              <button
                key={image._id}
                onClick={() => setSelectedImage(image)}
                className="group overflow-hidden rounded-2xl border border-ananda-gold/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-ananda-maroon"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={image.url}
                    alt={album.title}
                    className="h-full w-full object-cover transition duration-505 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <span className="bg-white/95 backdrop-blur-xs text-ananda-dark-maroon text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md scale-95 transition duration-300 group-hover:scale-100">
                      View Large
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </Reveal>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition duration-300 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl p-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={album.title}
              className="max-h-[82vh] w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryAlbumDetails;