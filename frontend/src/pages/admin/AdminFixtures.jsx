import { useEffect, useState } from "react";
import { getSports } from "../../services/sportService";
import { getTeams } from "../../services/teamService";
import {
  createFixture,
  deleteFixture,
  getFixtures,
  updateFixture,
} from "../../services/fixtureService";

const initialFormData = {
  sport: "",
  team: "",
  title: "",
  opponent: "",
  venue: "",
  matchDate: "",
  matchType: "OTHER",
  status: "UPCOMING",
  anandaScore: "",
  opponentScore: "",
  resultText: "",
  summary: "",
  isFeatured: false,
};

const statusOptions = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "POSTPONED", label: "Postponed" },
];

const matchTypeOptions = [
  { value: "FRIENDLY", label: "Friendly" },
  { value: "TOURNAMENT", label: "Tournament" },
  { value: "BIG_MATCH", label: "Big Match" },
  { value: "ANNUAL_ENCOUNTER", label: "Annual Encounter" },
  { value: "OTHER", label: "Other" },
];

const getStatusLabel = (value) => {
  return statusOptions.find((item) => item.value === value)?.label || value;
};

const getMatchTypeLabel = (value) => {
  return matchTypeOptions.find((item) => item.value === value)?.label || value;
};

function AdminFixtures() {
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingFixtureId, setEditingFixtureId] = useState(null);

  const [filterSport, setFilterSport] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMatchType, setFilterMatchType] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildFixtureParams = () => {
    const params = {};

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    if (filterMatchType !== "ALL") {
      params.matchType = filterMatchType;
    }

    return params;
  };

  const loadFixtures = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFixtures(buildFixtureParams());
      setFixtures(data.fixtures);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load fixtures.");
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

        if (sportsData.sports.length > 0) {
          setFormData((previousData) => ({
            ...previousData,
            sport: previousData.sport || sportsData.sports[0]._id,
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

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    if (filterMatchType !== "ALL") {
      params.matchType = filterMatchType;
    }

    getFixtures(params)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setFixtures(data.fixtures);
        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load fixtures.");
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
  }, [filterSport, filterStatus, filterMatchType]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

  const handleFilterStatusChange = (event) => {
    setLoading(true);
    setFilterStatus(event.target.value);
    setMessage("");
    setError("");
  };

  const handleFilterMatchTypeChange = (event) => {
    setLoading(true);
    setFilterMatchType(event.target.value);
    setMessage("");
    setError("");
  };

  const getPayload = () => {
    return {
      sport: formData.sport,
      team: formData.team || undefined,
      title: formData.title,
      opponent: formData.opponent,
      venue: formData.venue,
      matchDate: formData.matchDate,
      matchType: formData.matchType,
      status: formData.status,
      isFeatured: formData.isFeatured,
      result: {
        anandaScore: formData.anandaScore,
        opponentScore: formData.opponentScore,
        resultText: formData.resultText,
        summary: formData.summary,
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingFixtureId) {
        await updateFixture(editingFixtureId, getPayload());
        setMessage("Fixture updated successfully.");
      } else {
        await createFixture(getPayload());
        setMessage("Fixture created successfully.");
      }

      setEditingFixtureId(null);
      setFormData({
        ...initialFormData,
        sport: sports[0]?._id || "",
      });

      await loadFixtures();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save fixture.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (fixture) => {
    setEditingFixtureId(fixture._id);

    setFormData({
      sport: fixture.sport?._id || fixture.sport || "",
      team: fixture.team?._id || fixture.team || "",
      title: fixture.title || "",
      opponent: fixture.opponent || "",
      venue: fixture.venue || "",
      matchDate: fixture.matchDate ? fixture.matchDate.slice(0, 16) : "",
      matchType: fixture.matchType || "OTHER",
      status: fixture.status || "UPCOMING",
      anandaScore: fixture.result?.anandaScore || "",
      opponentScore: fixture.result?.opponentScore || "",
      resultText: fixture.result?.resultText || "",
      summary: fixture.result?.summary || "",
      isFeatured: fixture.isFeatured || false,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingFixtureId(null);

    setFormData({
      ...initialFormData,
      sport: sports[0]?._id || "",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (fixtureId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fixture?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteFixture(fixtureId);
      setMessage("Fixture deleted successfully.");
      await loadFixtures();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete fixture.");
    }
  };

  const visibleTeams = formData.sport
    ? teams.filter((team) => {
        const sportId = team.sport?._id || team.sport;
        return sportId === formData.sport;
      })
    : teams;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Fixtures & Results
      </h1>

      <p className="mb-8 text-gray-700">
        Add upcoming matches and update completed match results.
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
            {editingFixtureId ? "Edit Fixture" : "Add Fixture"}
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
                Team
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              >
                <option value="">No specific team</option>
                {visibleTeams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name} | {team.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Fixture Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Ananda vs Nalanda Cricket Match"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Opponent
              </label>
              <input
                type="text"
                name="opponent"
                value={formData.opponent}
                onChange={handleChange}
                placeholder="Opponent school"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Match venue"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Match Date and Time
              </label>
              <input
                type="datetime-local"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Match Type
                </label>
                <select
                  name="matchType"
                  value={formData.matchType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                >
                  {matchTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-ananda-cream p-4">
              <h3 className="mb-3 font-bold text-ananda-maroon">
                Result Details
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  name="anandaScore"
                  value={formData.anandaScore}
                  onChange={handleChange}
                  placeholder="Ananda score"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />

                <input
                  type="text"
                  name="opponentScore"
                  value={formData.opponentScore}
                  onChange={handleChange}
                  placeholder="Opponent score"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />

                <input
                  type="text"
                  name="resultText"
                  value={formData.resultText}
                  onChange={handleChange}
                  placeholder="Example: Ananda won by 25 runs"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />

                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Short match summary"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-xl bg-ananda-cream px-4 py-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span className="font-semibold text-ananda-dark-maroon">
                Featured fixture
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving
                ? "Saving..."
                : editingFixtureId
                  ? "Update Fixture"
                  : "Create Fixture"}
            </button>

            {editingFixtureId && (
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
              Fixtures & Results List
            </h2>

            <div className="grid gap-3 md:grid-cols-3">
              <select
                value={filterSport}
                onChange={handleFilterSportChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Status</option>
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={filterMatchType}
                onChange={handleFilterMatchTypeChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Match Types</option>
                {matchTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading fixtures...</p>}

          {!loading && fixtures.length === 0 && (
            <p className="text-gray-600">No fixtures found.</p>
          )}

          {!loading && fixtures.length > 0 && (
            <div className="space-y-5">
              {fixtures.map((fixture) => (
                <div
                  key={fixture._id}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-1 text-sm font-semibold uppercase text-ananda-gold">
                        {fixture.sport?.name} | {getStatusLabel(fixture.status)}
                      </p>

                      <h3 className="text-xl font-bold text-ananda-maroon">
                        {fixture.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        Opponent: {fixture.opponent}
                      </p>

                      <p className="text-sm text-gray-500">
                        {fixture.venue || "Venue not added"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(fixture.matchDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(fixture)}
                        className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(fixture._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">Match Type</p>
                      <p className="font-bold text-ananda-maroon">
                        {getMatchTypeLabel(fixture.matchType)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">Ananda Score</p>
                      <p className="font-bold text-ananda-maroon">
                        {fixture.result?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">Opponent Score</p>
                      <p className="font-bold text-ananda-maroon">
                        {fixture.result?.opponentScore || "-"}
                      </p>
                    </div>
                  </div>

                  {fixture.result?.resultText && (
                    <p className="mt-4 rounded-xl bg-ananda-light-gold p-4 text-sm font-semibold text-ananda-dark-maroon">
                      {fixture.result.resultText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminFixtures;