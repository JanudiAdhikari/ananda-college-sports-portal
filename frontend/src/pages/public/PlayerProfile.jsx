import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  <div className="mb-6 border-b border-ananda-gold/20 pb-3">
    {eyebrow && (
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
        {eyebrow}
      </p>
    )}
    <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
      {title}
    </h2>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-ananda-gold/10 bg-white p-4 shadow-sm hover:border-ananda-gold/30 hover:-translate-y-0.5 transition duration-300">
    <p className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
      {label}
    </p>
    <p className="font-display mt-1 text-2xl font-bold text-ananda-maroon">
      {value || 0}
    </p>
  </div>
);

const SkillBar = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-700">
      <span>{label}</span>
      <span className="font-display text-ananda-maroon font-bold">{value || 0}%</span>
    </div>
    <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-ananda-maroon to-ananda-gold transition-all duration-500"
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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display uppercase tracking-wide text-ananda-maroon animate-pulse">
            Loading player profile...
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
          {player.team?._id ? (
            <Link
              to={`/teams/${player.team._id}`}
              className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
            >
              &larr; Back to {player.team.name}
            </Link>
          ) : player.sport?.slug ? (
            <Link
              to={`/sports/${player.sport.slug}`}
              className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
            >
              &larr; Back to {player.sport.name}
            </Link>
          ) : (
            <Link
              to="/sports"
              className="font-display mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ananda-gold transition hover:text-white"
            >
              &larr; Back to Sports
            </Link>
          )}
          
          <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
            Player Profile &middot; {player.sport?.name} &middot; {ageGroupLabels[player.ageGroup] || player.ageGroup}
          </p>
          
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            {player.fullName}
          </h1>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: Player Identity & Bio */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Avatar Card */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <div className="font-display flex h-28 w-28 items-center justify-center rounded-full bg-ananda-light-gold text-5xl font-bold text-ananda-maroon border border-ananda-gold/30 shadow-inner mb-4">
                  {player.fullName.charAt(0)}
                </div>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
                  {player.fullName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {player.sport?.name} &middot; {player.team?.name || "No Team"}
                </p>
                {player.jerseyNumber && (
                  <span className="mt-3 inline-block bg-ananda-maroon text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
                    Jersey #{player.jerseyNumber}
                  </span>
                )}
              </div>
            </Reveal>

            {/* Quick Info Card */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <h3 className="font-display mb-5 text-lg font-bold uppercase tracking-wide text-ananda-dark-maroon border-b border-ananda-gold/10 pb-3">
                  Player Biography
                </h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Role / Position</p>
                    <p className="font-semibold text-gray-800">{player.role || player.position || "Not specified"}</p>
                  </div>
                  {(player.battingStyle || player.bowlingStyle) && (
                    <>
                      {player.battingStyle && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Batting Style</p>
                          <p className="font-semibold text-gray-800">{player.battingStyle}</p>
                        </div>
                      )}
                      {player.bowlingStyle && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bowling Style</p>
                          <p className="font-semibold text-gray-800">{player.bowlingStyle}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Stats & Performance */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Performance Summary */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <SectionHeader 
                  eyebrow="Performance"
                  title="Season Overview"
                />
                <p className="text-gray-700 leading-relaxed">
                  {player.performanceSummary || "Performance summary will be added soon."}
                </p>
              </div>
            </Reveal>

            {/* Statistics */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <SectionHeader 
                  eyebrow="Numbers"
                  title="Career Statistics"
                />
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
                  <StatCard label="Matches" value={player.statistics?.matches} />
                  <StatCard label="Runs" value={player.statistics?.runs} />
                  <StatCard label="Wickets" value={player.statistics?.wickets} />
                  <StatCard label="Goals" value={player.statistics?.goals} />
                  <StatCard label="Assists" value={player.statistics?.assists} />
                </div>

                {player.statistics?.bestPerformance && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-ananda-light-gold/40 border border-ananda-gold/20 p-4 text-ananda-dark-maroon">
                    <div className="mt-0.5 text-ananda-gold">
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ananda-maroon">Best Performance</p>
                      <p className="mt-0.5 font-semibold text-gray-800">{player.statistics.bestPerformance}</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Skill Assessment */}
            <Reveal>
              <div className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm">
                <SectionHeader 
                  eyebrow="Skills"
                  title="Attribute Ratings"
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <SkillBar label="Batting" value={player.skillsRating?.batting} />
                  <SkillBar label="Bowling" value={player.skillsRating?.bowling} />
                  <SkillBar label="Fielding" value={player.skillsRating?.fielding} />
                  <SkillBar label="Speed" value={player.skillsRating?.speed} />
                  <SkillBar label="Stamina" value={player.skillsRating?.stamina} />
                  <SkillBar label="Teamwork" value={player.skillsRating?.teamwork} />
                  <SkillBar label="Technique" value={player.skillsRating?.technique} />
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </section>
    </div>
  );
}

export default PlayerProfile;