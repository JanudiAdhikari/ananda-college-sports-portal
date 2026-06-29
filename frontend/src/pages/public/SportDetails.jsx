import { Link, useParams } from "react-router-dom";

const sampleTeams = [
  { id: "u14-a", name: "Under 14 A Team", ageGroup: "Under 14" },
  { id: "u14-b", name: "Under 14 B Team", ageGroup: "Under 14" },
  { id: "u16-a", name: "Under 16 A Team", ageGroup: "Under 16" },
  { id: "first-xi", name: "1st XI Team", ageGroup: "Senior" },
];

function SportDetails() {
  const { sportId } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Sport Details
      </p>

      <h1 className="mb-4 text-3xl font-bold capitalize text-ananda-dark-maroon">
        {sportId}
      </h1>

      <p className="mb-8 max-w-3xl text-gray-700">
        Select an age group or team to view player details, performance,
        achievements, and team information.
      </p>

      <div className="mb-8 flex flex-wrap gap-3">
        <button className="rounded-full bg-ananda-maroon px-5 py-2 text-white">
          All
        </button>
        <button className="rounded-full border border-ananda-maroon px-5 py-2 text-ananda-maroon">
          Under 12
        </button>
        <button className="rounded-full border border-ananda-maroon px-5 py-2 text-ananda-maroon">
          Under 14
        </button>
        <button className="rounded-full border border-ananda-maroon px-5 py-2 text-ananda-maroon">
          Under 16
        </button>
        <button className="rounded-full border border-ananda-maroon px-5 py-2 text-ananda-maroon">
          Senior
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sampleTeams.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg"
          >
            <p className="mb-2 text-sm font-semibold text-ananda-gold">
              {team.ageGroup}
            </p>
            <h2 className="text-2xl font-bold text-ananda-maroon">
              {team.name}
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SportDetails;