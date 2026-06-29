import { Link } from "react-router-dom";

const sampleSports = [
  { id: "cricket", name: "Cricket", teams: "Under 12, Under 14, Under 16, 1st XI" },
  { id: "rugby", name: "Rugby", teams: "Under 14, Under 16, Under 18, 1st XV" },
  { id: "football", name: "Football", teams: "Junior, Senior" },
  { id: "athletics", name: "Athletics", teams: "Track and Field" },
];

function Sports() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Sports
      </h1>

      <p className="mb-8 text-gray-700">
        Browse all sports available at Ananda College.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search sports..."
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        />

        <select className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon">
          <option>All Categories</option>
          <option>Team Sports</option>
          <option>Individual Sports</option>
          <option>Aquatic Sports</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleSports.map((sport) => (
          <Link
            key={sport.id}
            to={`/sports/${sport.id}`}
            className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-bold text-ananda-maroon">
              {sport.name}
            </h2>

            <p className="text-gray-600">{sport.teams}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Sports;