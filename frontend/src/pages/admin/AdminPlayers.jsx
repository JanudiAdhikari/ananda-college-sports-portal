import { useEffect, useRef, useState } from "react";
import { getSports } from "../../services/sportService";
import { getTeams } from "../../services/teamService";
import {
  createPlayer,
  deletePlayer,
  getPlayers,
  updatePlayer,
} from "../../services/playerService";

const initialFormData = {
  team: "",
  fullName: "",
  admissionNumber: "",
  dateOfBirth: "",
  ageGroup: "UNDER_14",
  jerseyNumber: "",
  role: "",
  position: "",
  battingStyle: "",
  bowlingStyle: "",
  performanceSummary: "",
  matches: 0,
  runs: 0,
  wickets: 0,
  goals: 0,
  assists: 0,
  bestPerformance: "",
  batting: 0,
  bowling: 0,
  fielding: 0,
  speed: 0,
  stamina: 0,
  teamwork: 0,
  technique: 0,
};

const ageGroupOptions = [
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

function AdminPlayers() {
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  const [filterSport, setFilterSport] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildPlayerParams = () => {
    const params = {};

    if (filterSport) {
      params.sport = filterSport;
    }

    if (filterTeam) {
      params.team = filterTeam;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    return params;
  };

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPlayers(buildPlayerParams());
      setPlayers(data.players);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load players.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([getSports(), getTeams()])
      .then(([sportsData, teamsData]) => {
        if (!isMounted) {
          return;
        }

        setSports(sportsData.sports);
        setTeams(teamsData.teams);

        if (teamsData.teams.length > 0) {
          const firstTeam = teamsData.teams[0];

          setFormData((previousData) => ({
            ...previousData,
            team: previousData.team || firstTeam._id,
            ageGroup: previousData.ageGroup || firstTeam.ageGroup,
          }));
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(
          error.response?.data?.message || "Failed to load sports and teams."
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const params = {};

    if (filterSport) {
      params.sport = filterSport;
    }

    if (filterTeam) {
      params.team = filterTeam;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    const timeoutId = setTimeout(() => {
      getPlayers(params)
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

          setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [filterSport, filterTeam, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "team") {
      const selectedTeam = teams.find((team) => team._id === value);

      setFormData({
        ...formData,
        team: value,
        ageGroup: selectedTeam?.ageGroup || formData.ageGroup,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setMessage("");
    setError("");
  };

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
    setFilterTeam("");
    setMessage("");
    setError("");
  };

  const handleFilterTeamChange = (event) => {
    setLoading(true);
    setFilterTeam(event.target.value);
    setMessage("");
    setError("");
  };

  const handleSearchChange = (event) => {
    setLoading(true);
    setSearch(event.target.value);
    setMessage("");
    setError("");
  };

  const getPayload = () => {
    return {
      team: formData.team,
      fullName: formData.fullName,
      admissionNumber: formData.admissionNumber,
      dateOfBirth: formData.dateOfBirth,
      ageGroup: formData.ageGroup,
      jerseyNumber: formData.jerseyNumber
        ? Number(formData.jerseyNumber)
        : undefined,
      role: formData.role,
      position: formData.position,
      battingStyle: formData.battingStyle,
      bowlingStyle: formData.bowlingStyle,
      performanceSummary: formData.performanceSummary,
      statistics: {
        matches: Number(formData.matches),
        runs: Number(formData.runs),
        wickets: Number(formData.wickets),
        goals: Number(formData.goals),
        assists: Number(formData.assists),
        bestPerformance: formData.bestPerformance,
      },
      skillsRating: {
        batting: Number(formData.batting),
        bowling: Number(formData.bowling),
        fielding: Number(formData.fielding),
        speed: Number(formData.speed),
        stamina: Number(formData.stamina),
        teamwork: Number(formData.teamwork),
        technique: Number(formData.technique),
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingPlayerId) {
        await updatePlayer(editingPlayerId, getPayload());
        setMessage("Player updated successfully.");
      } else {
        await createPlayer(getPayload());
        setMessage("Player created successfully.");
      }

      setEditingPlayerId(null);
      setFormData({
        ...initialFormData,
        team: teams[0]?._id || "",
        ageGroup: teams[0]?.ageGroup || "UNDER_14",
      });

      await loadPlayers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save player.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayerId(player._id);

    setFormData({
      team: player.team?._id || player.team || "",
      fullName: player.fullName || "",
      admissionNumber: player.admissionNumber || "",
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.slice(0, 10) : "",
      ageGroup: player.ageGroup || "UNDER_14",
      jerseyNumber: player.jerseyNumber || "",
      role: player.role || "",
      position: player.position || "",
      battingStyle: player.battingStyle || "",
      bowlingStyle: player.bowlingStyle || "",
      performanceSummary: player.performanceSummary || "",
      matches: player.statistics?.matches || 0,
      runs: player.statistics?.runs || 0,
      wickets: player.statistics?.wickets || 0,
      goals: player.statistics?.goals || 0,
      assists: player.statistics?.assists || 0,
      bestPerformance: player.statistics?.bestPerformance || "",
      batting: player.skillsRating?.batting || 0,
      bowling: player.skillsRating?.bowling || 0,
      fielding: player.skillsRating?.fielding || 0,
      speed: player.skillsRating?.speed || 0,
      stamina: player.skillsRating?.stamina || 0,
      teamwork: player.skillsRating?.teamwork || 0,
      technique: player.skillsRating?.technique || 0,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);

    setFormData({
      ...initialFormData,
      team: teams[0]?._id || "",
      ageGroup: teams[0]?.ageGroup || "UNDER_14",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (playerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this player?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deletePlayer(playerId);
      setMessage("Player deleted successfully.");
      await loadPlayers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete player.");
    }
  };

  const visibleTeams = filterSport
    ? teams.filter((team) => {
        const sportId = team.sport?._id || team.sport;
        return sportId === filterSport;
      })
    : teams;

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Players
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Add player profiles, performance statistics, and skill ratings.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Form Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm xl:col-span-1 h-fit">
          <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
            {editingPlayerId ? "Edit Player" : "Add New Player"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Team
              </label>
              <div className="relative">
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required
                >
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.sport?.name} | {team.name} | {team.year}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-550">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Player full name"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Admission No
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  placeholder="e.g. 24500"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Age Group
                </label>
                <div className="relative">
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  >
                    {ageGroupOptions.map((ageGroup) => (
                      <option key={ageGroup.value} value={ageGroup.value}>
                        {ageGroup.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-550">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Jersey Number
                </label>
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Captain, Batsman"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Forward, Bowler"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Batting Style
                </label>
                <input
                  type="text"
                  name="battingStyle"
                  value={formData.battingStyle}
                  onChange={handleChange}
                  placeholder="Right hand batsman"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Bowling Style
                </label>
                <input
                  type="text"
                  name="bowlingStyle"
                  value={formData.bowlingStyle}
                  onChange={handleChange}
                  placeholder="Right arm fast"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Performance Summary
              </label>
              <textarea
                name="performanceSummary"
                value={formData.performanceSummary}
                onChange={handleChange}
                rows="4"
                placeholder="Write a short performance summary..."
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            {/* Statistics Sub-form */}
            <div className="rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 p-4 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-tight text-ananda-maroon border-b border-ananda-gold/15 pb-2">
                Statistics
              </h3>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                {["matches", "runs", "wickets", "goals", "assists"].map(
                  (field) => (
                    <div key={field}>
                      <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                        {field}
                      </label>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-ananda-gold/25 bg-white px-3 py-2 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="pt-2">
                <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                  Best Performance
                </label>
                <input
                  type="text"
                  name="bestPerformance"
                  value={formData.bestPerformance}
                  onChange={handleChange}
                  placeholder="e.g. 75 runs and 3 wickets"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-3 py-2 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                />
              </div>
            </div>

            {/* Skills Rating Sub-form */}
            <div className="rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 p-4 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-tight text-ananda-maroon border-b border-ananda-gold/15 pb-2">
                Skills Rating
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "batting",
                  "bowling",
                  "fielding",
                  "speed",
                  "stamina",
                  "teamwork",
                  "technique",
                ].map((field) => (
                  <div key={field} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      <span>{field}</span>
                      <span className="text-ananda-maroon">{formData[field]}%</span>
                    </div>
                    <input
                      type="range"
                      name={field}
                      min="0"
                      max="100"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ananda-maroon"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {saving
                  ? "Saving..."
                  : editingPlayerId
                    ? "Update Player"
                    : "Add Player"}
              </button>

              {editingPlayerId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full rounded-xl border border-ananda-maroon/30 px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-cream/45 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </Reveal>

        {/* List Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Players List
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search players..."
                className="rounded-xl border border-ananda-gold/25 bg-white px-4 py-2 text-xs font-semibold outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
              />

              {/* Sport Filter */}
              <div className="relative">
                <select
                  value={filterSport}
                  onChange={handleFilterSportChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="">All Sports</option>
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-505">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Team Filter */}
              <div className="relative">
                <select
                  value={filterTeam}
                  onChange={handleFilterTeamChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="">All Teams</option>
                  {visibleTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} | {team.year}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-505">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading players...</p>
            </div>
          )}

          {!loading && players.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No players found matching the search criteria.
            </div>
          )}

          {!loading && players.length > 0 && (
            <div className="overflow-hidden border border-ananda-gold/15 rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ananda-gold/15 bg-ananda-cream/35 font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                      <th className="px-5 py-4">Player</th>
                      <th className="px-5 py-4">Sport</th>
                      <th className="px-5 py-4">Team</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {players.map((player) => (
                      <tr key={player._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ananda-dark-maroon">
                            {player.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getAgeGroupLabel(player.ageGroup)}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700 font-semibold">
                          {player.sport?.name || "Not added"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700 font-semibold">
                          {player.team?.name || "Not added"}
                        </td>

                        <td className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          {player.role || "Not added"}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(player)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(player._id)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

export default AdminPlayers;