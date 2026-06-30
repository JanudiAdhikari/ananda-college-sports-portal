import { useEffect, useRef, useState } from "react";
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
      { threshold: 0.15 }
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

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="mb-8 border-b border-ananda-gold/20 pb-4">
    {eyebrow && (
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
        {eyebrow}
      </p>
    )}
    <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
      {title}
    </h2>
    {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
  </div>
);

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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display uppercase tracking-wide text-ananda-maroon animate-pulse">
            Loading team details...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-ananda-dark-maroon py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            to={`/sports/${team.sport?.slug || ""}`}
            className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
          >
            &larr; Back to {team.sport?.name || "Sport"}
          </Link>
          
          <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
            {team.sport?.name} &middot; {ageGroupLabels[team.ageGroup] || team.ageGroup} &middot; {team.year}
          </p>
          
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            {team.name}
          </h1>
          
          <p className="mt-4 max-w-3xl text-base text-ananda-light-gold/90 leading-relaxed">
            {team.summary || "Team summary will be added soon."}
          </p>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: Management & Leadership */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Management Card */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <h3 className="font-display mb-5 text-lg font-bold uppercase tracking-wide text-ananda-dark-maroon border-b border-ananda-gold/10 pb-3">
                  Team Management
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ananda-cream text-ananda-maroon">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Head Coach</p>
                      <p className="font-semibold text-gray-800">{team.coachName || "Not added"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ananda-cream text-ananda-maroon">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assistant Coach</p>
                      <p className="font-semibold text-gray-800">{team.assistantCoachName || "Not added"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Leadership Card */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <h3 className="font-display mb-5 text-lg font-bold uppercase tracking-wide text-ananda-dark-maroon border-b border-ananda-gold/10 pb-3">
                  Team Leadership
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ananda-light-gold text-sm font-bold text-ananda-maroon">
                      C
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Captain</p>
                      {team.captain ? (
                        <Link
                          to={`/players/${team.captain._id}`}
                          className="font-semibold text-ananda-maroon transition hover:text-ananda-dark-maroon hover:underline"
                        >
                          {team.captain.fullName}
                        </Link>
                      ) : (
                        <p className="font-semibold text-gray-500">Not assigned</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ananda-cream text-sm font-bold text-ananda-maroon">
                      VC
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Vice Captain</p>
                      {team.viceCaptain ? (
                        <Link
                          to={`/players/${team.viceCaptain._id}`}
                          className="font-semibold text-ananda-maroon transition hover:text-ananda-dark-maroon hover:underline"
                        >
                          {team.viceCaptain.fullName}
                        </Link>
                      ) : (
                        <p className="font-semibold text-gray-500">Not assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Players Roster */}
          <div className="lg:col-span-8">
            <Reveal>
              <SectionHeader
                eyebrow="Roster"
                title="Squad Players"
                description={`Meet the players representing Ananda College in the ${team.name} squad.`}
              />
            </Reveal>

            {loadingPlayers && (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
                <p className="font-display text-sm uppercase tracking-wide text-ananda-maroon">
                  Loading roster...
                </p>
              </div>
            )}

            {!loadingPlayers && players.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 shadow-sm">
                No players added for this team yet.
              </div>
            )}

            {!loadingPlayers && players.length > 0 && (
              <Reveal className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {players.map((player) => {
                  const isCaptain = team.captain?._id === player._id;
                  const isViceCaptain = team.viceCaptain?._id === player._id;
                  
                  return (
                    <Link
                      key={player._id}
                      to={`/players/${player._id}`}
                      className="group relative overflow-hidden rounded-2xl border border-ananda-gold/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg flex flex-col items-center text-center"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        {player.jerseyNumber && (
                          <span className="bg-ananda-gold/10 border border-ananda-gold/30 text-ananda-dark-maroon text-[10px] font-bold px-2 py-0.5 rounded-full">
                            #{player.jerseyNumber}
                          </span>
                        )}
                        {isCaptain && (
                          <span className="bg-ananda-maroon text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">
                            Captain
                          </span>
                        )}
                        {isViceCaptain && (
                          <span className="bg-ananda-gold text-ananda-dark-maroon text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">
                            Vice Captain
                          </span>
                        )}
                      </div>

                      {/* Initial Avatar */}
                      <div className="font-display mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ananda-light-gold/40 text-3xl font-bold text-ananda-maroon transition duration-300 group-hover:bg-ananda-gold group-hover:text-ananda-dark-maroon">
                        {player.fullName.charAt(0)}
                      </div>

                      {/* Name */}
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon transition duration-300 group-hover:text-ananda-dark-maroon line-clamp-1">
                        {player.fullName}
                      </h3>

                      {/* Role */}
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">
                        {player.role || player.position || "Player"}
                      </p>
                      
                      {/* Interactive indicator */}
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ananda-gold opacity-0 transition duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        View Profile &rarr;
                      </div>
                    </Link>
                  );
                })}
              </Reveal>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}

export default TeamDetails;