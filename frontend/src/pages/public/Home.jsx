import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl bg-white p-10 shadow-lg">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ananda-gold">
          Ananda College, Colombo 10
        </p>

        <h1 className="mb-4 text-4xl font-bold text-ananda-dark-maroon">
          Official Sports Information Portal
        </h1>

        <p className="max-w-3xl text-lg text-gray-700">
          View school sports, teams, player profiles, fixtures, results,
          galleries, live matches, and achievements in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/sports"
            className="rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon"
          >
            Explore Sports
          </Link>

          <Link
            to="/live-matches"
            className="rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
          >
            View Live Matches
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;