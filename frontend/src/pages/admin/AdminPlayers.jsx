import { useEffect, useState } from "react";
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
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Players
      </h1>

      <p className="mb-8 text-gray-700">
        Add player profiles, performance statistics, and skill ratings.
      </p>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md xl:col-span-1">
          <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
            {editingPlayerId ? "Edit Player" : "Add New Player"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Team
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              >
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.sport?.name} | {team.name} | {team.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Player full name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Admission Number
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Age Group
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                >
                  {ageGroupOptions.map((ageGroup) => (
                    <option key={ageGroup.value} value={ageGroup.value}>
                      {ageGroup.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Jersey Number
                </label>
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Captain, Batsman, Goalkeeper"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Forward, Bowler, Sprinter"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Batting Style
                </label>
                <input
                  type="text"
                  name="battingStyle"
                  value={formData.battingStyle}
                  onChange={handleChange}
                  placeholder="Right hand batsman"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Bowling Style
                </label>
                <input
                  type="text"
                  name="bowlingStyle"
                  value={formData.bowlingStyle}
                  onChange={handleChange}
                  placeholder="Right arm fast"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Performance Summary
              </label>
              <textarea
                name="performanceSummary"
                value={formData.performanceSummary}
                onChange={handleChange}
                rows="4"
                placeholder="Write a short performance summary..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <div>
              <h3 className="mb-3 font-bold text-ananda-maroon">
                Statistics
              </h3>

              <div className="grid gap-4 md:grid-cols-3">
                {["matches", "runs", "wickets", "goals", "assists"].map(
                  (field) => (
                    <div key={field}>
                      <label className="mb-2 block capitalize font-semibold text-gray-700">
                        {field}
                      </label>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-4">
                <label className="mb-2 block font-semibold text-gray-700">
                  Best Performance
                </label>
                <input
                  type="text"
                  name="bestPerformance"
                  value={formData.bestPerformance}
                  onChange={handleChange}
                  placeholder="Example: 75 runs and 3 wickets"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-bold text-ananda-maroon">
                Skills Rating
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "batting",
                  "bowling",
                  "fielding",
                  "speed",
                  "stamina",
                  "teamwork",
                  "technique",
                ].map((field) => (
                  <div key={field}>
                    <label className="mb-2 block capitalize font-semibold text-gray-700">
                      {field} ({formData[field]}%)
                    </label>
                    <input
                      type="range"
                      name={field}
                      min="0"
                      max="100"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
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
                className="w-full rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md xl:col-span-2">
          <div className="mb-5">
            <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
              Players List
            </h2>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search players..."
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              />

              <select
                value={filterSport}
                onChange={handleFilterSportChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <select
                value={filterTeam}
                onChange={handleFilterTeamChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="">All Teams</option>
                {visibleTeams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name} | {team.year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading players...</p>}

          {!loading && players.length === 0 && (
            <p className="text-gray-600">No players found.</p>
          )}

          {!loading && players.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-ananda-cream text-sm text-ananda-dark-maroon">
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Sport</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player) => (
                    <tr key={player._id} className="border-b">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ananda-dark-maroon">
                          {player.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getAgeGroupLabel(player.ageGroup)}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {player.sport?.name || "Not added"}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {player.team?.name || "Not added"}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {player.role || "Not added"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(player)}
                            className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(player._id)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminPlayers;