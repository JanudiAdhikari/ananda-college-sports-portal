import { useEffect, useRef, useState } from "react";
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

// Scroll-triggered reveal wrapper — fades sections in once
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ? "reveal" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

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
      <section className="relative overflow-hidden bg-gradient-to-r from-ananda-dark-maroon via-ananda-maroon to-[#2d000a] text-white border-b border-ananda-gold/15">
        {/* Glowing visual accent spotlights */}
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-gradient-to-br from-ananda-gold/15 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-40 -mb-40 h-80 w-80 rounded-full bg-gradient-to-tr from-ananda-maroon/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 z-10">
          <p className="font-display mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-ananda-gold">
            {liveMatches.some((m) => m.status === "LIVE") && (
              <span className="live-dot h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            )}
            Live Coverage
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            Live Matches
          </h1>
          <p className="mt-3 max-w-xl text-xs font-semibold uppercase tracking-wider text-ananda-light-gold/80 leading-relaxed">
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
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && liveMatches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="font-display text-lg font-bold uppercase text-ananda-maroon">
              Nothing live right now
            </p>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              Check back during the next school fixture for live video and
              scores.
            </p>
          </div>
        )}

        {!loading && !error && selectedMatch && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* VIDEO + MATCH LIST */}
            <div className="space-y-6 lg:col-span-2">
              <Reveal className="overflow-hidden rounded-2xl border border-ananda-gold/15 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-ananda-gold/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
                        {selectedMatch.sport?.name}
                      </span>
                      <span className="text-gray-300 text-xs">|</span>
                      {selectedMatch.status === "LIVE" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          Live Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                          {selectedMatch.status}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display mt-1 text-lg font-bold uppercase text-ananda-maroon">
                      {selectedMatch.title}
                    </h2>
                  </div>
                </div>

                {selectedMatch.videoUrl ? (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getEmbedUrl(selectedMatch.videoUrl)}
                      title={selectedMatch.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-gray-950 text-center text-white border-b border-ananda-gold/15">
                    <span className="text-4xl">📺</span>
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-ananda-gold animate-pulse">
                      Live video stream is not active yet.
                    </p>
                  </div>
                )}
              </Reveal>

              {liveMatches.length > 1 && (
                <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                  <h2 className="font-display mb-4 text-xs font-bold uppercase tracking-wider text-ananda-gold">
                    Other Matches
                  </h2>

                  <div className="grid gap-3 md:grid-cols-2">
                    {liveMatches.map((match) => {
                      const active = selectedMatchId === match._id;
                      return (
                        <button
                          key={match._id}
                          onClick={() => setSelectedMatchId(match._id)}
                          className={`rounded-xl p-4 text-left transition duration-300 cursor-pointer ${
                            active
                              ? "bg-ananda-maroon text-white shadow-md border border-transparent"
                              : "border border-ananda-gold/15 bg-white hover:border-ananda-gold/30 hover:bg-ananda-cream/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-display text-[9px] font-bold uppercase tracking-wider text-ananda-gold">
                              {match.sport?.name}
                            </span>
                            <span className="text-gray-300 text-xs">|</span>
                            {match.status === "LIVE" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400 animate-pulse">
                                <span className="h-1 w-1 rounded-full bg-red-500" />
                                Live
                              </span>
                            ) : (
                              <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                                active
                                  ? "bg-white/20 border-white/30 text-white"
                                  : "bg-blue-50 border-blue-200 text-blue-600"
                              }`}>
                                {match.status}
                              </span>
                            )}
                          </div>
                          <p className="font-display font-bold uppercase tracking-tight text-sm line-clamp-1">
                            {match.title}
                          </p>
                          <p className={`mt-1 text-xs font-semibold ${
                            active ? "text-ananda-light-gold/80" : "text-gray-500"
                          }`}>
                            {match.anandaTeamName} vs {match.opponentTeamName}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </Reveal>
              )}
            </div>

            {/* SCOREBOARD (sticky, signature element) */}
            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <Reveal className="overflow-hidden rounded-2xl border border-ananda-gold/30 bg-ananda-maroon shadow-lg">
                <div className="flex items-center justify-between border-b border-ananda-gold/25 px-6 py-4 bg-ananda-dark-maroon/40">
                  <span className="font-display flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ananda-gold">
                    {selectedMatch.status === "LIVE" && (
                      <span className="live-dot h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    Live Scoreboard
                  </span>
                </div>

                <div className="px-6 py-6">
                  <h2 className="font-display mb-5 text-center text-xs font-bold uppercase tracking-wider text-white/90">
                    {selectedMatch.anandaTeamName}
                    <span className="px-2 text-ananda-gold">&bull; VS &bull;</span>
                    {selectedMatch.opponentTeamName}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-black/20 p-4 text-center border border-white/5">
                      <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-wider text-ananda-light-gold/60">
                        {selectedMatch.anandaTeamName}
                      </p>
                      <p className="font-display text-3xl font-extrabold text-white">
                        {selectedMatch.score?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/20 p-4 text-center border border-white/5">
                      <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-wider text-ananda-light-gold/60">
                        {selectedMatch.opponentTeamName}
                      </p>
                      <p className="font-display text-3xl font-extrabold text-white">
                        {selectedMatch.score?.opponentScore || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-black/15 p-3 text-center border border-white/5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-ananda-light-gold/50">
                        Overs
                      </p>
                      <p className="font-display text-lg font-bold text-white mt-0.5">
                        {selectedMatch.score?.overs || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/15 p-3 text-center border border-white/5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-ananda-light-gold/50">
                        Wickets
                      </p>
                      <p className="font-display text-lg font-bold text-white mt-0.5">
                        {selectedMatch.score?.wickets || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="font-display mt-5 rounded-lg bg-ananda-gold/10 border border-ananda-gold/25 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-ananda-gold">
                    {selectedMatch.score?.currentStatus || selectedMatch.status}
                  </div>
                </div>
              </Reveal>

              {selectedMatch.updates?.length > 0 && (
                <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                  <h2 className="font-display mb-4 text-xs font-bold uppercase tracking-wider text-ananda-gold">
                    Commentary Updates
                  </h2>

                  <div className="max-h-80 space-y-0 overflow-y-auto pr-1">
                    {selectedMatch.updates.slice(0, 8).map((update) => (
                      <div
                        key={update._id}
                        className="relative border-l-2 border-ananda-gold/20 py-3.5 pl-5 last:border-transparent"
                      >
                        <span className="absolute -left-[5px] top-4.5 h-2 w-2 rounded-full bg-ananda-gold border border-white" />
                        <p className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
                          {update.time}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-700 font-semibold leading-relaxed">
                          {update.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default LiveMatches;