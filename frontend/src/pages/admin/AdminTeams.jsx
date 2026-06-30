import { useEffect, useRef, useState } from "react";
import { getSports } from "../../services/sportService";
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
} from "../../services/teamService";

const currentYear = new Date().getFullYear();

const initialFormData = {
  sport: "",
  name: "",
  ageGroup: "UNDER_14",
  year: currentYear,
  coachName: "",
  assistantCoachName: "",
  summary: "",
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

function AdminTeams() {
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingTeamId, setEditingTeamId] = useState(null);

  const [filterSport, setFilterSport] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildTeamParams = () => {
    const params = {};

    if (filterSport) {
      params.sport = filterSport;
    }

    if (filterAgeGroup !== "ALL") {
      params.ageGroup = filterAgeGroup;
    }

    return params;
  };

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams(buildTeamParams());
      setTeams(data.teams);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getSports()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setSports(data.sports);

        if (data.sports.length > 0) {
          setFormData((previousData) => {
            if (previousData.sport) {
              return previousData;
            }

            return {
              ...previousData,
              sport: data.sports[0]._id,
            };
          });
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load sports.");
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

    if (filterAgeGroup !== "ALL") {
      params.ageGroup = filterAgeGroup;
    }

    getTeams(params)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setTeams(data.teams);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load teams.");
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
  }, [filterSport, filterAgeGroup]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
    setMessage("");
    setError("");
  };

  const handleFilterAgeGroupChange = (event) => {
    setLoading(true);
    setFilterAgeGroup(event.target.value);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...formData,
        year: Number(formData.year),
      };

      if (editingTeamId) {
        await updateTeam(editingTeamId, payload);
        setMessage("Team updated successfully.");
      } else {
        await createTeam(payload);
        setMessage("Team created successfully.");
      }

      setEditingTeamId(null);
      setFormData({
        ...initialFormData,
        sport: sports[0]?._id || "",
      });

      await loadTeams();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save team.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (team) => {
    setEditingTeamId(team._id);

    setFormData({
      sport: team.sport?._id || team.sport || "",
      name: team.name || "",
      ageGroup: team.ageGroup || "UNDER_14",
      year: team.year || currentYear,
      coachName: team.coachName || "",
      assistantCoachName: team.assistantCoachName || "",
      summary: team.summary || "",
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);

    setFormData({
      ...initialFormData,
      sport: sports[0]?._id || "",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (teamId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteTeam(teamId);
      setMessage("Team deleted successfully.");
      await loadTeams();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete team.");
    }
  };

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Teams
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Add teams under each sport, age group, and year.
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm lg:col-span-1 h-fit">
          <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
            {editingTeamId ? "Edit Team" : "Add New Team"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Sport
              </label>
              <div className="relative">
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required
                >
                  {sports.map((sport) => (
                    <option key={sport._id} value={sport._id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Team Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Under 14 A Team"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

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
                  required
                >
                  {ageGroupOptions.map((ageGroup) => (
                    <option key={ageGroup.value} value={ageGroup.value}>
                      {ageGroup.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Coach Name
              </label>
              <input
                type="text"
                name="coachName"
                value={formData.coachName}
                onChange={handleChange}
                placeholder="Coach name"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Assistant Coach Name
              </label>
              <input
                type="text"
                name="assistantCoachName"
                value={formData.assistantCoachName}
                onChange={handleChange}
                placeholder="Assistant coach name"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Team Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short summary about this team..."
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {saving
                  ? "Saving..."
                  : editingTeamId
                    ? "Update Team"
                    : "Add Team"}
              </button>

              {editingTeamId && (
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
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Teams List
            </h2>

            <div className="grid gap-3 grid-cols-2">
              {/* Sport Filter */}
              <div className="relative">
                <select
                  value={filterSport}
                  onChange={handleFilterSportChange}
                  className="appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
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

              {/* Age Group Filter */}
              <div className="relative">
                <select
                  value={filterAgeGroup}
                  onChange={handleFilterAgeGroupChange}
                  className="appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Ages</option>
                  {ageGroupOptions.map((ageGroup) => (
                    <option key={ageGroup.value} value={ageGroup.value}>
                      {ageGroup.label}
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
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading teams...</p>
            </div>
          )}

          {!loading && teams.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No teams found matching the filters.
            </div>
          )}

          {!loading && teams.length > 0 && (
            <div className="overflow-hidden border border-ananda-gold/15 rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ananda-gold/15 bg-ananda-cream/35 font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                      <th className="px-5 py-4">Team</th>
                      <th className="px-5 py-4">Sport</th>
                      <th className="px-5 py-4">Age Group</th>
                      <th className="px-5 py-4">Year</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {teams.map((team) => (
                      <tr key={team._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-ananda-dark-maroon">
                            {team.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Coach: {team.coachName || "Not added"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700 font-semibold">
                          {team.sport?.name || "Not added"}
                        </td>

                        <td className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          {getAgeGroupLabel(team.ageGroup)}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                          {team.year}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(team)}
                              className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(team._id)}
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

export default AdminTeams;