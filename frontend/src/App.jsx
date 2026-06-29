function App() {
  return (
    <div className="min-h-screen bg-ananda-cream">
      <header className="bg-ananda-maroon text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            Ananda College Sports Portal
          </h1>

          <nav className="hidden gap-6 md:flex">
            <a href="#" className="hover:text-ananda-gold">Home</a>
            <a href="#" className="hover:text-ananda-gold">Sports</a>
            <a href="#" className="hover:text-ananda-gold">Gallery</a>
            <a href="#" className="hover:text-ananda-gold">Live Matches</a>
            <a href="#" className="hover:text-ananda-gold">Login</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="rounded-3xl bg-white p-10 shadow-lg">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ananda-gold">
            Colombo 10, Sri Lanka
          </p>

          <h2 className="mb-4 text-4xl font-bold text-ananda-dark-maroon">
            Official Sports Information Portal
          </h2>

          <p className="max-w-2xl text-lg text-gray-700">
            View school sports, teams, player profiles, fixtures, results,
            galleries, live matches, and achievements in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon">
              Explore Sports
            </button>

            <button className="rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold">
              View Live Matches
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;