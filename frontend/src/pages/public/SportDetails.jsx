import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSportBySlug } from "../../services/sportService";
import { getTeams } from "../../services/teamService";

const ageGroupOptions = [
  { value: "ALL", label: "All" },
  { value: "UNDER_12", label: "Under 12" },
  { value: "UNDER_14", label: "Under 14" },
  { value: "UNDER_16", label: "Under 16" },
  { value: "UNDER_18", label: "Under 18" },
  { value: "UNDER_20", label: "Under 20" },
  { value: "FIRST_TEAM", label: "First Team" },
  { value: "SENIOR", label: "Senior" },
  { value: "OPEN", label: "Open" },
];

const getAgeGroupLabel = (value) => {
  return ageGroupOptions.find((item) => item.value === value)?.label || value;
};

function TeamCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ananda-gold/10 bg-white p-6 shadow-sm">
      <div className="mb-3 h-3 w-32 rounded bg-ananda-light-gold" />
      <div className="mb-4 h-7 w-1/2 rounded bg-gray-200" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-3 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-3/4 rounded bg-gray-100" />
      </div>
    </div>
  );
}

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
          error.response?.data?.message || "Failed to load sport details."
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
        setError(error.response?.data?.message || "Failed to load teams.");
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
          <p className="font-display uppercase tracking-wide text-ananda-maroon">
            Loading sport details...
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
          <Link
            to="/sports"
            className="font-display mb-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ananda-light-gold/80 transition hover:text-ananda-gold"
          >
            &larr; All Sports
          </Link>

          <p className="font-display mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-ananda-gold">
            {sport.category}
          </p>

          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            {sport.name}
          </h1>

          <p className="mt-4 max-w-2xl text-ananda-light-gold/90">
            {sport.description || "Sport details will be added soon."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* ACHIEVEMENTS */}
        {sport.achievements?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
              Achievements
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {sport.achievements.map((achievement) => (
                <div
                  key={`${achievement.title}-${achievement.year}`}
                  className="flex gap-4 rounded-2xl border border-ananda-gold/15 bg-white p-5 shadow-sm"
                >
                  <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ananda-light-gold text-ananda-maroon">
                    🏆
                  </div>
                  <div>
                    <p className="font-display font-bold uppercase tracking-tight text-ananda-dark-maroon">
                      {achievement.title}{" "}
                      {achievement.year && (
                        <span className="text-ananda-gold">
                          &middot; {achievement.year}
                        </span>
                      )}
                    </p>

                    {achievement.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS */}
        <div className="mb-6 flex flex-col gap-5 border-b border-ananda-gold/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ananda-gold">
              Squads
            </p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
              Teams
            </h2>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {ageGroupOptions.map((ageGroup) => {
            const active = selectedAgeGroup === ageGroup.value;
            return (
              <button
                key={ageGroup.value}
                type="button"
                onClick={() => setSelectedAgeGroup(ageGroup.value)}
                className={`font-display rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  active
                    ? "bg-ananda-maroon text-white shadow-sm"
                    : "bg-ananda-cream text-ananda-dark-maroon hover:bg-ananda-light-gold"
                }`}
              >
                {ageGroup.label}
              </button>
            );
          })}
        </div>

        {loadingTeams && (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loadingTeams && teams.length === 0 && (
          <div className="rounded-2xl border border-ananda-gold/15 bg-white p-12 text-center shadow-sm">
            <p className="font-display text-lg font-semibold uppercase text-ananda-maroon">
              No teams yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {selectedAgeGroup === "ALL"
                ? "Teams for this sport will appear here once added."
                : "Try a different age group, or check back later."}
            </p>
          </div>
        )}

        {!loadingTeams && teams.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {teams.map((team, index) => (
              <Link
                key={team._id}
                to={`/teams/${team._id}`}
                style={{ animationDelay: `${index * 40}ms` }}
                className="reveal group rounded-2xl border border-transparent bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-ananda-gold/40 hover:shadow-lg"
              >
                <p className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ananda-gold">
                  {getAgeGroupLabel(team.ageGroup)} &middot; {team.year}
                </p>

                <h3 className="font-display mb-4 text-xl font-bold uppercase text-ananda-maroon transition group-hover:text-ananda-dark-maroon">
                  {team.name}
                </h3>

                <div className="grid gap-3 border-t border-ananda-gold/10 pt-4 text-sm text-gray-600 md:grid-cols-2">
                  <p>
                    <span className="font-display text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Coach
                    </span>
                    <br />
                    {team.coachName || "Not added"}
                  </p>

                  <p>
                    <span className="font-display text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Captain
                    </span>
                    <br />
                    {team.captain?.fullName || "Not added"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SportDetails;