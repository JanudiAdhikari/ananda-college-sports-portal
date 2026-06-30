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
      getLiveMatches({ visibleOnly: "true" })
        .then((data) => {
          if (!isMounted) return;

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
          if (!isMounted) return;
          setError(
            error.response?.data?.message || "Failed to load live matches."
          );
        })
        .finally(() => {
          if (!isMounted) return;
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
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden bg-ananda-dark-maroon">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <p className="font-display mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-ananda-gold">
            {liveMatches.some((m) => m.status === "LIVE") && (
              <span className="live-dot h-2 w-2 rounded-full bg-red-400" />
            )}
            Live Coverage
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            Live Matches
          </h1>
          <p className="mt-3 max-w-xl text-ananda-light-gold/90">
            Watch live matches and follow live scores from Ananda College
            sports as they happen.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {loading && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="animate-pulse space-y-6 lg:col-span-2">
              <div className="aspect-video rounded-2xl bg-gray-200" />
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-44 rounded-2xl bg-gray-200" />
              <div className="h-32 rounded-2xl bg-gray-100" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && liveMatches.length === 0 && (
          <div className="rounded-2xl border border-ananda-gold/15 bg-white p-12 text-center shadow-sm">
            <p className="font-display text-lg font-semibold uppercase text-ananda-maroon">
              Nothing live right now
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Check back during the next school fixture for live video and
              scores.
            </p>
          </div>
        )}

        {!loading && !error && selectedMatch && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* VIDEO + MATCH LIST */}
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-ananda-gold/15 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-display flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                      {selectedMatch.status === "LIVE" && (
                        <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
                      )}
                      {selectedMatch.sport?.name} &middot; {selectedMatch.status}
                    </p>
                    <h2 className="font-display mt-1 text-xl font-bold uppercase text-ananda-maroon">
                      {selectedMatch.title}
                    </h2>
                  </div>
                </div>

                {selectedMatch.videoUrl ? (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getEmbedUrl(selectedMatch.videoUrl)}
                      title={selectedMatch.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-gray-900 text-center text-white">
                    <span className="text-2xl">📺</span>
                    <p className="text-sm text-gray-300">
                      Live video link is not available yet.
                    </p>
                  </div>
                )}
              </div>

              {liveMatches.length > 1 && (
                <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                  <h2 className="font-display mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
                    Other Matches
                  </h2>

                  <div className="grid gap-3 md:grid-cols-2">
                    {liveMatches.map((match) => {
                      const active = selectedMatchId === match._id;
                      return (
                        <button
                          key={match._id}
                          onClick={() => setSelectedMatchId(match._id)}
                          className={`rounded-xl p-4 text-left transition ${
                            active
                              ? "bg-ananda-maroon text-white shadow-sm"
                              : "border border-gray-200 hover:border-ananda-gold/40 hover:bg-ananda-cream/40"
                          }`}
                        >
                          <p
                            className={`font-display flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${
                              active ? "text-ananda-gold" : "text-ananda-gold"
                            }`}
                          >
                            {match.status === "LIVE" && (
                              <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-400" />
                            )}
                            {match.sport?.name} &middot; {match.status}
                          </p>
                          <p className="font-display mt-1 font-bold uppercase tracking-tight">
                            {match.title}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              active ? "text-ananda-light-gold/80" : "text-gray-500"
                            }`}
                          >
                            {match.anandaTeamName} vs {match.opponentTeamName}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SCOREBOARD (sticky, signature element) */}
            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-ananda-gold/30 bg-ananda-maroon shadow-lg">
                <div className="flex items-center justify-between border-b border-ananda-gold/25 px-6 py-4">
                  <span className="font-display flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ananda-gold">
                    {selectedMatch.status === "LIVE" && (
                      <span className="live-dot h-2 w-2 rounded-full bg-red-400" />
                    )}
                    Scoreboard
                  </span>
                </div>

                <div className="px-6 py-6">
                  <h2 className="font-display mb-5 text-center text-sm font-semibold uppercase tracking-wide text-white/90">
                    {selectedMatch.anandaTeamName}
                    <span className="px-2 text-ananda-gold">vs</span>
                    {selectedMatch.opponentTeamName}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-black/20 p-4 text-center">
                      <p className="mb-1 truncate text-xs font-medium uppercase tracking-wide text-ananda-light-gold/70">
                        {selectedMatch.anandaTeamName}
                      </p>
                      <p className="font-display text-4xl font-bold text-white">
                        {selectedMatch.score?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/20 p-4 text-center">
                      <p className="mb-1 truncate text-xs font-medium uppercase tracking-wide text-ananda-light-gold/70">
                        {selectedMatch.opponentTeamName}
                      </p>
                      <p className="font-display text-4xl font-bold text-white">
                        {selectedMatch.score?.opponentScore || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-black/15 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-ananda-light-gold/60">
                        Overs
                      </p>
                      <p className="font-display text-xl font-bold text-white">
                        {selectedMatch.score?.overs || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/15 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-ananda-light-gold/60">
                        Wickets
                      </p>
                      <p className="font-display text-xl font-bold text-white">
                        {selectedMatch.score?.wickets || "-"}
                      </p>
                    </div>
                  </div>

                  <p className="font-display mt-5 rounded-lg bg-ananda-gold/15 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-ananda-gold">
                    {selectedMatch.score?.currentStatus || selectedMatch.status}
                  </p>
                </div>
              </div>

              {selectedMatch.updates?.length > 0 && (
                <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                  <h2 className="font-display mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
                    Match Updates
                  </h2>

                  <div className="max-h-80 space-y-0 overflow-y-auto pr-1">
                    {selectedMatch.updates.slice(0, 8).map((update) => (
                      <div
                        key={update._id}
                        className="relative border-l-2 border-ananda-light-gold py-3 pl-5 last:border-transparent"
                      >
                        <span className="absolute -left-[5px] top-3.5 h-2 w-2 rounded-full bg-ananda-gold" />
                        <p className="font-display text-xs font-semibold text-ananda-gold">
                          {update.time}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-700">
                          {update.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default LiveMatches;