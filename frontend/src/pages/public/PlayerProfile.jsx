import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayerById } from "../../services/playerService";

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

const StatCard = ({ label, value }) => (
  <div className="rounded-xl bg-ananda-cream p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-ananda-maroon">{value || 0}</p>
  </div>
);

const SkillBar = ({ label, value }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm font-semibold">
      <span>{label}</span>
      <span>{value || 0}%</span>
    </div>
    <div className="h-3 rounded-full bg-gray-200">
      <div
        className="h-3 rounded-full bg-ananda-gold"
        style={{ width: `${value || 0}%` }}
      ></div>
    </div>
  </div>
);

function PlayerProfile() {
  const { playerId } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getPlayerById(playerId)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setPlayer(data.player);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(
          error.response?.data?.message || "Failed to load player profile."
        );
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
  }, [playerId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading player profile...
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
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
          Player Profile
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-2xl bg-ananda-light-gold text-6xl font-bold text-ananda-maroon">
              {player.fullName.charAt(0)}
            </div>

            <h1 className="text-3xl font-bold text-ananda-dark-maroon">
              {player.fullName}
            </h1>

            <p className="mt-2 text-gray-600">
              {player.sport?.name} | {player.team?.name}
            </p>

            <p className="mt-1 text-gray-600">
              {ageGroupLabels[player.ageGroup] || player.ageGroup}
            </p>

            {player.jerseyNumber && (
              <p className="mt-3 inline-block rounded-full bg-ananda-maroon px-4 py-2 text-sm font-semibold text-white">
                Jersey #{player.jerseyNumber}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-3 text-xl font-bold text-ananda-maroon">
              Player Details
            </h2>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold">
                  {player.role || "Not added"}
                </p>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold">
                  {player.position || "Not added"}
                </p>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Batting Style</p>
                <p className="font-semibold">
                  {player.battingStyle || "Not added"}
                </p>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Bowling Style</p>
                <p className="font-semibold">
                  {player.bowlingStyle || "Not added"}
                </p>
              </div>
            </div>

            <h2 className="mb-3 text-xl font-bold text-ananda-maroon">
              Performance Summary
            </h2>

            <p className="mb-6 text-gray-700">
              {player.performanceSummary ||
                "Performance summary will be added soon."}
            </p>

            <div className="mb-8 grid gap-4 md:grid-cols-5">
              <StatCard label="Matches" value={player.statistics?.matches} />
              <StatCard label="Runs" value={player.statistics?.runs} />
              <StatCard label="Wickets" value={player.statistics?.wickets} />
              <StatCard label="Goals" value={player.statistics?.goals} />
              <StatCard label="Assists" value={player.statistics?.assists} />
            </div>

            {player.statistics?.bestPerformance && (
              <div className="mb-8 rounded-xl bg-ananda-light-gold p-4 text-ananda-dark-maroon">
                <p className="text-sm font-semibold">Best Performance</p>
                <p>{player.statistics.bestPerformance}</p>
              </div>
            )}

            <h2 className="mb-3 text-xl font-bold text-ananda-maroon">
              Skills Rating
            </h2>

            <div className="space-y-4">
              <SkillBar label="Batting" value={player.skillsRating?.batting} />
              <SkillBar label="Bowling" value={player.skillsRating?.bowling} />
              <SkillBar label="Fielding" value={player.skillsRating?.fielding} />
              <SkillBar label="Speed" value={player.skillsRating?.speed} />
              <SkillBar label="Stamina" value={player.skillsRating?.stamina} />
              <SkillBar label="Teamwork" value={player.skillsRating?.teamwork} />
              <SkillBar
                label="Technique"
                value={player.skillsRating?.technique}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlayerProfile;