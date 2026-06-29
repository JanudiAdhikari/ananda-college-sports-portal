import { useParams } from "react-router-dom";

function PlayerProfile() {
  const { playerId } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
          Player Profile
        </p>

        <h1 className="mb-6 text-3xl font-bold text-ananda-dark-maroon">
          {playerId}
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 h-48 w-48 rounded-2xl bg-ananda-light-gold"></div>
            <h2 className="text-xl font-bold text-ananda-maroon">
              Player Name
            </h2>
            <p className="text-gray-600">Cricket / Under 14 A</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-xl font-bold text-ananda-maroon">
              Performance Summary
            </h3>

            <p className="mb-6 text-gray-700">
              Player performance summary, achievements, match statistics,
              and skill ratings will be shown here.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Matches</p>
                <p className="text-2xl font-bold text-ananda-maroon">12</p>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Runs</p>
                <p className="text-2xl font-bold text-ananda-maroon">340</p>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <p className="text-sm text-gray-500">Wickets</p>
                <p className="text-2xl font-bold text-ananda-maroon">18</p>
              </div>
            </div>

            <h3 className="mb-3 mt-8 text-xl font-bold text-ananda-maroon">
              Skills Rating
            </h3>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-semibold">Batting</p>
                <div className="h-3 rounded-full bg-gray-200">
                  <div className="h-3 w-4/5 rounded-full bg-ananda-gold"></div>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold">Bowling</p>
                <div className="h-3 rounded-full bg-gray-200">
                  <div className="h-3 w-3/5 rounded-full bg-ananda-gold"></div>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold">Fielding</p>
                <div className="h-3 rounded-full bg-gray-200">
                  <div className="h-3 w-5/6 rounded-full bg-ananda-gold"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlayerProfile;