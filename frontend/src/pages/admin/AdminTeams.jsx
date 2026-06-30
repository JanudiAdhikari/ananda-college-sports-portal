import { useEffect, useState } from "react";
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
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Teams
      </h1>

      <p className="mb-8 text-gray-700">
        Add teams under each sport, age group, and year.
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

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-1">
          <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
            {editingTeamId ? "Edit Team" : "Add New Team"}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Sport
              </label>
              <select
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              >
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Team Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Under 14 A Team"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Age Group
              </label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
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
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Coach Name
              </label>
              <input
                type="text"
                name="coachName"
                value={formData.coachName}
                onChange={handleChange}
                placeholder="Coach name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Assistant Coach Name
              </label>
              <input
                type="text"
                name="assistantCoachName"
                value={formData.assistantCoachName}
                onChange={handleChange}
                placeholder="Assistant coach name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Team Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short summary about this team..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
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
                className="w-full rounded-xl border border-ananda-maroon px-6 py-3 font-semibold text-ananda-maroon hover:bg-ananda-light-gold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-ananda-maroon">
              Teams List
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
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
                value={filterAgeGroup}
                onChange={handleFilterAgeGroupChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Age Groups</option>
                {ageGroupOptions.map((ageGroup) => (
                  <option key={ageGroup.value} value={ageGroup.value}>
                    {ageGroup.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading teams...</p>}

          {!loading && teams.length === 0 && (
            <p className="text-gray-600">No teams found.</p>
          )}

          {!loading && teams.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-ananda-cream text-sm text-ananda-dark-maroon">
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Sport</th>
                    <th className="px-4 py-3">Age Group</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id} className="border-b">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-ananda-dark-maroon">
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Coach: {team.coachName || "Not added"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {team.sport?.name || "Not added"}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {getAgeGroupLabel(team.ageGroup)}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {team.year}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(team)}
                            className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(team._id)}
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

export default AdminTeams;