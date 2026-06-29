import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeamById } from "../../services/teamService";

const samplePlayers = [
  { id: "player-1", name: "Player One", role: "Captain / Batsman" },
  { id: "player-2", name: "Player Two", role: "Bowler" },
  { id: "player-3", name: "Player Three", role: "All-rounder" },
  { id: "player-4", name: "Player Four", role: "Wicketkeeper" },
];

const ageGroupLabels = {
  UNDER_12: "Under 12",
  UNDER_14: "Under 14",
  UNDER_16: "Under 16",
  UNDER_18: "Under 18",
  UNDER_20: "Under 20",
  FIRST_TEAM: "First Team",
  SENIOR: "Senior",
  OPEN: "Open",
};

function TeamDetails() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTeamById(teamId);
        setTeam(data.team);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load team.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading team details...
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
        {team.sport?.name} | {ageGroupLabels[team.ageGroup] || team.ageGroup}
      </p>

      <h1 className="mb-4 text-3xl font-bold text-ananda-dark-maroon">
        {team.name}
      </h1>

      <p className="mb-8 max-w-3xl text-gray-700">
        {team.summary || "Team summary will be added soon."}
      </p>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
          Team Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Sport</p>
            <p className="font-semibold">{team.sport?.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="font-semibold">{team.year}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Coach</p>
            <p className="font-semibold">{team.coachName || "Not added"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Assistant Coach</p>
            <p className="font-semibold">
              {team.assistantCoachName || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Captain</p>
            <p className="font-semibold">
              {team.captain?.fullName || "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vice Captain</p>
            <p className="font-semibold">
              {team.viceCaptain?.fullName || "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      {team.achievements?.length > 0 && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
            Team Achievements
          </h2>

          <div className="space-y-3">
            {team.achievements.map((achievement) => (
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
        Players
      </h2>

      <div className="mb-4 rounded-xl bg-ananda-light-gold px-4 py-3 text-sm text-ananda-dark-maroon">
        Player data is still sample data. In the next step, we will connect this
        section to real player profiles from MongoDB.
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {samplePlayers.map((player) => (
          <Link
            key={player.id}
            to={`/players/${player.id}`}
            className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg"
          >
            <div className="mb-4 h-24 w-24 rounded-full bg-ananda-light-gold"></div>

            <h3 className="text-lg font-bold text-ananda-maroon">
              {player.name}
            </h3>

            <p className="text-sm text-gray-600">{player.role}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TeamDetails;