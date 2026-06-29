function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Gallery
      </h1>

      <p className="mb-8 text-gray-700">
        View albums and photos from school sports events.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((album) => (
          <div key={album} className="rounded-2xl bg-white shadow-md">
            <div className="h-48 rounded-t-2xl bg-ananda-light-gold"></div>

            <div className="p-5">
              <h2 className="text-xl font-bold text-ananda-maroon">
                Event Album {album}
              </h2>
              <p className="text-gray-600">Photos from sports event</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;