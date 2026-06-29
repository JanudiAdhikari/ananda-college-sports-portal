import { Link, useParams } from "react-router-dom";

const samplePlayers = [
  { id: "player-1", name: "Player One", role: "Captain / Batsman" },
  { id: "player-2", name: "Player Two", role: "Bowler" },
  { id: "player-3", name: "Player Three", role: "All-rounder" },
  { id: "player-4", name: "Player Four", role: "Wicketkeeper" },
];

function TeamDetails() {
  const { teamId } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Team Card
      </p>

      <h1 className="mb-4 text-3xl font-bold text-ananda-dark-maroon">
        {teamId.toUpperCase()} Team
      </h1>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
          Team Summary
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Coach</p>
            <p className="font-semibold">To be added</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Captain</p>
            <p className="font-semibold">To be added</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="font-semibold">2026</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-ananda-dark-maroon">
        Players
      </h2>

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