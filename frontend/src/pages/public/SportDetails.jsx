import { useEffect, useState } from"react";
import { Link, useParams } from"react-router-dom";
import { getSportBySlug } from"../../services/sportService";
import { getTeams } from"../../services/teamService";

const ageGroupOptions = [
  { value:"ALL", label:"All" },
  { value:"UNDER_12", label:"Under 12" },
  { value:"UNDER_14", label:"Under 14" },
  { value:"UNDER_16", label:"Under 16" },
  { value:"UNDER_18", label:"Under 18" },
  { value:"UNDER_20", label:"Under 20" },
  { value:"FIRST_TEAM", label:"First Team" },
  { value:"SENIOR", label:"Senior" },
  { value:"OPEN", label:"Open" },
];

const getAgeGroupLabel = (value) => {
  return ageGroupOptions.find((item) => item.value === value)?.label || value;
};

function TeamCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ananda-gold/10 bg-white p-6 shadow-sm">
      <div className="mb-3 h-3 w-32 rounded bg-ananda-light-gold/40" />
      <div className="mb-4 h-7 w-1/2 rounded bg-gray-250/20" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-3 w-3/4 rounded bg-gray-150/15" />
        <div className="h-3 w-3/4 rounded bg-gray-150/15" />
      </div>
    </div>
  );
}

// // Scroll-triggered reveal wrapper — fades sections in once
// function Reveal({ children, className ="" }) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
// 
//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;
// 
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.15 }
//     );
// 
//     observer.observe(node);
//     return () => observer.disconnect();
//   }, []);
// 
//   return (
//     <div ref={ref} className={`${visible ?"reveal" :"opacity-0"} ${className}`}>
//       {children}
//     </div>
//   );
// }

function SportDetails() {
  const { sportId } = useParams();

  const [sport, setSport] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("ALL");

  const [loadingSport, setLoadingSport] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSport = async () => {
      try {
        setLoadingSport(true);
        setError("");

        const data = await getSportBySlug(sportId);
        setSport(data.sport);
      } catch (error) {
        setError(
          error.response?.data?.message ||"Failed to load sport details."
        );
      } finally {
        setLoadingSport(false);
      }
    };

    fetchSport();
  }, [sportId]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);

        const data = await getTeams({
          sportSlug: sportId,
          ageGroup: selectedAgeGroup,
        });

        setTeams(data.teams);
      } catch (error) {
        setError(error.response?.data?.message ||"Failed to load teams.");
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [sportId, selectedAgeGroup]);

  if (loadingSport) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
          <p className="font-display text-xs font-bold tracking-wider text-ananda-maroon animate-pulse">
            Loading sport details...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-ananda-dark-maroon via-ananda-maroon to-[#2d000a] text-white border-b border-ananda-gold/15">
        {/* Glowing visual accent spotlights */}
        <div className="absolute right-0 top-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-gradient-to-br from-ananda-gold/15 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-40 -mb-40 h-80 w-80 rounded-full bg-gradient-to-tr from-ananda-maroon/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 z-10">
          <Link
            to="/sports"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ananda-light-gold transition duration-200 hover:bg-white/10 hover:text-white hover:border-white/20 shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sports
          </Link>

          <p className="font-display mb-3 text-xs font-semibold tracking-[0.3em] text-ananda-gold">
            {sport.category}
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            {sport.name}
          </h1>

          <p className="mt-4 max-w-2xl text-xs font-semibold tracking-wider text-ananda-light-gold/80 leading-relaxed">
            {sport.description ||"Sport details will be added soon."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* ACHIEVEMENTS */}
        {sport.achievements?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display mb-5 text-xs font-bold tracking-wider text-ananda-gold">
              Honour Board
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {sport.achievements.map((achievement) => (
                <div
                  key={`${achievement.title}-${achievement.year}`}
                  className="flex gap-4 rounded-2xl border border-ananda-gold/15 bg-white p-5 shadow-sm hover:border-ananda-gold/30 hover:shadow-md transition duration-300"
                >
                  <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ananda-gold/10 border border-ananda-gold/25 text-lg">
                    🏆
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold tracking-tight text-ananda-dark-maroon">
                      {achievement.title}{""}
                      {achievement.year && (
                        <span className="text-ananda-gold font-extrabold ml-1">
                          &middot; {achievement.year}
                        </span>
                      )}
                    </p>

                    {achievement.description && (
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed font-semibold">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS HEADER */}
        <div className="mb-6 flex flex-col gap-4 border-b border-ananda-gold/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display mb-1.5 text-xs font-bold tracking-wider text-ananda-gold">
              Squads
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ananda-dark-maroon">
              Teams
            </h2>
          </div>
        </div>

        {/* AGE GROUP FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2">
          {ageGroupOptions.map((ageGroup) => {
            const active = selectedAgeGroup === ageGroup.value;
            return (
              <button
                key={ageGroup.value}
                type="button"
                onClick={() => setSelectedAgeGroup(ageGroup.value)}
                className={`font-display rounded-xl px-4 py-2.5 text-[10px] font-bold  tracking-wider transition cursor-pointer ${
                  active
                    ?"bg-ananda-maroon text-white shadow-sm"
                    :"bg-ananda-cream/40 text-ananda-dark-maroon hover:bg-ananda-gold/20"
                }`}
              >
                {ageGroup.label}
              </button>
            );
          })}
        </div>

        {/* TEAMS LIST */}
        {loadingTeams && (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loadingTeams && teams.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="font-display text-lg font-bold text-ananda-maroon">
              No teams yet
            </p>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              {selectedAgeGroup ==="ALL"
                ?"Teams for this sport will appear here once added."
                :"Try a different age group, or check back later."}
            </p>
          </div>
        )}

        {!loadingTeams && teams.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {teams.map((team, index) => (
              <Link
                key={team._id}
                to={`/teams/${team._id}`}
                style={{ animationDelay:`${index * 40}ms` }}
                className="reveal group rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ananda-gold/35 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <p className="font-display mb-1.5 text-[10px] font-bold tracking-wider text-ananda-gold">
                    {getAgeGroupLabel(team.ageGroup)} &middot; {team.year}
                  </p>

                  <h3 className="font-display mb-4 text-lg font-bold text-ananda-maroon transition duration-300 group-hover:text-ananda-dark-maroon">
                    {team.name}
                  </h3>

                  <div className="grid gap-4 border-t border-ananda-gold/10 pt-4 text-xs text-gray-600 md:grid-cols-2">
                    <div>
                      <span className="font-display text-[9px] font-bold tracking-wider text-gray-400">
                        Coach
                      </span>
                      <p className="mt-0.5 font-semibold text-gray-700">
                        {team.coachName ||"Not added"}
                      </p>
                    </div>

                    <div>
                      <span className="font-display text-[9px] font-bold tracking-wider text-gray-400">
                        Captain
                      </span>
                      <p className="mt-0.5 font-semibold text-gray-700">
                        {team.captain?.fullName ||"Not added"}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="font-display mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-ananda-maroon opacity-0 transition group-hover:opacity-100 duration-300">
                  View Squad Roster
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SportDetails;