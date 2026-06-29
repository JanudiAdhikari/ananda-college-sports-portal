import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSportBySlug } from "../../services/sportService";

const sampleTeams = [
  { id: "u14-a", name: "Under 14 A Team", ageGroup: "Under 14" },
  { id: "u14-b", name: "Under 14 B Team", ageGroup: "Under 14" },
  { id: "u16-a", name: "Under 16 A Team", ageGroup: "Under 16" },
  { id: "first-xi", name: "1st XI Team", ageGroup: "Senior" },
];

function SportDetails() {
  const { sportId } = useParams();

  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSport = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSportBySlug(sportId);
        setSport(data.sport);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load sport details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSport();
  }, [sportId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading sport details...
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
        {sport.category}
      </p>

      <h1 className="mb-4 text-3xl font-bold text-ananda-dark-maroon">
        {sport.name}
      </h1>

      <p className="mb-8 max-w-3xl text-gray-700">
        {sport.description || "Sport details will be added soon."}
      </p>

      {sport.achievements?.length > 0 && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
            Achievements
          </h2>

          <div className="space-y-3">
            {sport.achievements.map((achievement) => (
              <div
                key={`${achievement.title}-${achievement.year}`}
                className="rounded-xl bg-ananda-cream p-4"
              >
                <p className="font-semibold text-ananda-dark-maroon">
                  {achievement.title} {achievement.year && `(${achievement.year})`}
                </p>

                {achievement.description && (
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-2xl font-bold text-ananda-dark-maroon">
        Teams
      </h2>

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
            <h3 className="text-2xl font-bold text-ananda-maroon">
              {team.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SportDetails;