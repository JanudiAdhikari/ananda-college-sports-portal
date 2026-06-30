import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlayers } from "../../services/playerService";
import { getTeamById } from "../../services/teamService";

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
  const [players, setPlayers] = useState([]);

  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getTeamById(teamId)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setTeam(data.team);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load team.");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setLoadingTeam(false);
      });

    return () => {
      isMounted = false;
    };
  }, [teamId]);

  useEffect(() => {
    let isMounted = true;

    getPlayers({ team: teamId })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setPlayers(data.players);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load players.");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setLoadingPlayers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [teamId]);

  if (loadingTeam) {
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

      <h2 className="mb-4 text-2xl font-bold text-ananda-dark-maroon">
        Players
      </h2>

      {loadingPlayers && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading players...
        </div>
      )}

      {!loadingPlayers && players.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No players added for this team yet.
        </div>
      )}

      {!loadingPlayers && players.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {players.map((player) => (
            <Link
              key={player._id}
              to={`/players/${player._id}`}
              className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-ananda-light-gold text-2xl font-bold text-ananda-maroon">
                {player.fullName.charAt(0)}
              </div>

              <h3 className="text-lg font-bold text-ananda-maroon">
                {player.fullName}
              </h3>

              <p className="text-sm text-gray-600">
                {player.role || player.position || "Player"}
              </p>

              {player.jerseyNumber && (
                <p className="mt-2 text-sm font-semibold text-ananda-gold">
                  Jersey #{player.jerseyNumber}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default TeamDetails;