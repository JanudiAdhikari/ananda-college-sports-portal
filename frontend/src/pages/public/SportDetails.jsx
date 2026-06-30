import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSportBySlug } from "../../services/sportService";
import { getTeams } from "../../services/teamService";

const ageGroupOptions = [
  { value: "ALL", label: "All" },
  { value: "UNDER_12", label: "Under 12" },
  { value: "UNDER_14", label: "Under 14" },
  { value: "UNDER_16", label: "Under 16" },
  { value: "UNDER_18", label: "Under 18" },
  { value: "UNDER_20", label: "Under 20" },
  { value: "FIRST_TEAM", label: "First Team" },
  { value: "SENIOR", label: "Senior" },
  { value: "OPEN", label: "Open" },
];

const getAgeGroupLabel = (value) => {
  return ageGroupOptions.find((item) => item.value === value)?.label || value;
};

function SportDetails() {
  const { sportId } = useParams();

  const [sport, setSport] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("ALL");

  const [loadingSport, setLoadingSport] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSport = async () => {
      try {
        setLoadingSport(true);
        setError("");

        const data = await getSportBySlug(sportId);
        setSport(data.sport);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load sport details."
        );
      } finally {
        setLoadingSport(false);
      }
    };

    fetchSport();
  }, [sportId]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);

        const data = await getTeams({
          sportSlug: sportId,
          ageGroup: selectedAgeGroup,
        });

        setTeams(data.teams);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load teams.");
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [sportId, selectedAgeGroup]);

  if (loadingSport) {
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
                  {achievement.title}{" "}
                  {achievement.year && `(${achievement.year})`}
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
        {ageGroupOptions.map((ageGroup) => (
          <button
            key={ageGroup.value}
            onClick={() => setSelectedAgeGroup(ageGroup.value)}
            className={
              selectedAgeGroup === ageGroup.value
                ? "rounded-full bg-ananda-maroon px-5 py-2 text-white"
                : "rounded-full border border-ananda-maroon px-5 py-2 text-ananda-maroon hover:bg-ananda-light-gold"
            }
          >
            {ageGroup.label}
          </button>
        ))}
      </div>

      {loadingTeams && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading teams...
        </div>
      )}

      {!loadingTeams && teams.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No teams added for this sport yet.
        </div>
      )}

      {!loadingTeams && teams.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <Link
              key={team._id}
              to={`/teams/${team._id}`}
              className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="mb-2 text-sm font-semibold text-ananda-gold">
                {getAgeGroupLabel(team.ageGroup)} | {team.year}
              </p>

              <h3 className="mb-3 text-2xl font-bold text-ananda-maroon">
                {team.name}
              </h3>

              <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Coach:</span>{" "}
                  {team.coachName || "Not added"}
                </p>

                <p>
                  <span className="font-semibold">Captain:</span>{" "}
                  {team.captain?.fullName || "Not added"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default SportDetails;