import { useEffect, useState } from "react";
import { getLiveMatches } from "../../services/liveMatchService";

const getEmbedUrl = (url) => {
  if (!url) {
    return "";
  }

  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  return url;
};

function LiveMatches() {
  const [liveMatches, setLiveMatches] = useState([]);

  const [selectedMatchId, setSelectedMatchId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLiveMatches = () => {
      getLiveMatches({
        visibleOnly: "true",
      })
        .then((data) => {
          if (!isMounted) {
            return;
          }

          setLiveMatches(data.liveMatches);

          if (data.liveMatches.length > 0 && !selectedMatchId) {
            const liveMatch =
              data.liveMatches.find((match) => match.status === "LIVE") ||
              data.liveMatches[0];

            setSelectedMatchId(liveMatch._id);
          }

          setError("");
        })
        .catch((error) => {
          if (!isMounted) {
            return;
          }

          setError(
            error.response?.data?.message || "Failed to load live matches."
          );
        })
        .finally(() => {
          if (!isMounted) {
            return;
          }

          setLoading(false);
        });
    };

    fetchLiveMatches();

    const intervalId = setInterval(fetchLiveMatches, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedMatchId]);

  const selectedMatch = liveMatches.find(
    (match) => match._id === selectedMatchId
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Live Matches
      </h1>

      <p className="mb-8 text-gray-700">
        Watch live matches and follow live scores from Ananda College sports.
      </p>

      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading live matches...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {!loading && !error && liveMatches.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No live matches available at the moment.
        </div>
      )}

      {!loading && !error && selectedMatch && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                {selectedMatch.sport?.name} | {selectedMatch.status}
              </p>

              <h2 className="mb-4 text-2xl font-bold text-ananda-maroon">
                {selectedMatch.title}
              </h2>

              {selectedMatch.videoUrl ? (
                <div className="aspect-video overflow-hidden rounded-xl bg-gray-900">
                  <iframe
                    src={getEmbedUrl(selectedMatch.videoUrl)}
                    title={selectedMatch.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-xl bg-gray-900 text-white">
                  Live video link is not available yet.
                </div>
              )}
            </div>

            {liveMatches.length > 1 && (
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
                  Other Matches
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {liveMatches.map((match) => (
                    <button
                      key={match._id}
                      onClick={() => setSelectedMatchId(match._id)}
                      className={
                        selectedMatchId === match._id
                          ? "rounded-xl bg-ananda-maroon p-4 text-left text-white"
                          : "rounded-xl border border-gray-200 p-4 text-left hover:bg-ananda-cream"
                      }
                    >
                      <p className="text-sm font-semibold">
                        {match.sport?.name} | {match.status}
                      </p>
                      <p className="font-bold">{match.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
                Live Score
              </p>

              <h2 className="mb-4 text-2xl font-bold text-ananda-maroon">
                {selectedMatch.anandaTeamName} vs{" "}
                {selectedMatch.opponentTeamName}
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-ananda-cream p-4">
                  <p className="text-sm text-gray-500">
                    {selectedMatch.anandaTeamName}
                  </p>
                  <p className="text-2xl font-bold text-ananda-maroon">
                    {selectedMatch.score?.anandaScore || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-ananda-cream p-4">
                  <p className="text-sm text-gray-500">
                    {selectedMatch.opponentTeamName}
                  </p>
                  <p className="text-2xl font-bold text-ananda-maroon">
                    {selectedMatch.score?.opponentScore || "-"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-ananda-cream p-4">
                    <p className="text-sm text-gray-500">Overs</p>
                    <p className="text-2xl font-bold text-ananda-maroon">
                      {selectedMatch.score?.overs || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-ananda-cream p-4">
                    <p className="text-sm text-gray-500">Wickets</p>
                    <p className="text-2xl font-bold text-ananda-maroon">
                      {selectedMatch.score?.wickets || "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-ananda-light-gold p-4">
                  <p className="text-sm text-ananda-dark-maroon">Status</p>
                  <p className="font-semibold text-ananda-dark-maroon">
                    {selectedMatch.score?.currentStatus || selectedMatch.status}
                  </p>
                </div>
              </div>
            </div>

            {selectedMatch.updates?.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
                  Match Updates
                </h2>

                <div className="space-y-3">
                  {selectedMatch.updates.slice(0, 8).map((update) => (
                    <div
                      key={update._id}
                      className="rounded-xl bg-ananda-cream p-4"
                    >
                      <p className="text-xs font-semibold text-ananda-gold">
                        {update.time}
                      </p>
                      <p className="text-sm text-gray-700">{update.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LiveMatches;