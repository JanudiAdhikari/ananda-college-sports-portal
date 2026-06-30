import { useEffect, useRef, useState } from "react";
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "LIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
            Live
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
            Completed
          </span>
        );
      case "UPCOMING":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Upcoming
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Cancelled
          </span>
        );
      case "POSTPONED":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-700">
            Postponed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      <p className="font-display mb-1 text-xs font-semibold uppercase tracking-wider text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight text-ananda-dark-maroon">
        Manage Fixtures & Results
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Add upcoming matches and update completed match results.
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
            {editingFixtureId ? "Edit Fixture" : "Add Fixture"}
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
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-550">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

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
                >
                  <option value="">No specific team</option>
                  {visibleTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} | {team.year}
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
                Fixture Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Ananda vs Nalanda Big Match"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Opponent
              </label>
              <input
                type="text"
                name="opponent"
                value={formData.opponent}
                onChange={handleChange}
                placeholder="Opponent school name"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Match venue"
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                Match Date and Time
              </label>
              <input
                type="datetime-local"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm text-gray-700"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Match Type
                </label>
                <div className="relative">
                  <select
                    name="matchType"
                    value={formData.matchType}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  >
                    {matchTypeOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
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
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  >
                    {statusOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
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
            </div>

            {/* Results sub-panel */}
            <div className="rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 p-4 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-tight text-ananda-maroon border-b border-ananda-gold/15 pb-2">
                Result Details
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  name="anandaScore"
                  value={formData.anandaScore}
                  onChange={handleChange}
                  placeholder="Ananda score (e.g. 245/8)"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                />

                <input
                  type="text"
                  name="opponentScore"
                  value={formData.opponentScore}
                  onChange={handleChange}
                  placeholder="Opponent score (e.g. 182)"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                />

                <input
                  type="text"
                  name="resultText"
                  value={formData.resultText}
                  onChange={handleChange}
                  placeholder="Example: Ananda won by 63 runs"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                />

                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detailed match summary..."
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                />
              </div>
            </div>

            {/* Featured Toggler */}
            <label className="flex items-center gap-3 rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 px-4 py-3.5 cursor-pointer hover:bg-ananda-cream/35 transition">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="rounded border-ananda-gold/25 text-ananda-maroon focus:ring-ananda-maroon h-4 w-4 cursor-pointer"
              />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                Featured fixture
              </span>
            </label>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
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
              Fixtures & Results List
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              {/* Sport Filter */}
              <div className="relative">
                <select
                  value={filterSport}
                  onChange={handleFilterSportChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Sports</option>
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

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Status</option>
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-505">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Match Type Filter */}
              <div className="relative">
                <select
                  value={filterMatchType}
                  onChange={handleFilterMatchTypeChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Match Types</option>
                  {matchTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
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
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading fixtures...</p>
            </div>
          )}

          {!loading && fixtures.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No fixtures found.
            </div>
          )}

          {!loading && fixtures.length > 0 && (
            <div className="space-y-5">
              {fixtures.map((fixture) => (
                <div
                  key={fixture._id}
                  className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm hover:border-ananda-gold/35 transition duration-250"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
                          {fixture.sport?.name}
                        </span>
                        <span className="text-gray-300 text-xs">|</span>
                        {getStatusBadge(fixture.status)}
                      </div>

                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
                        {fixture.title}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Opponent: {fixture.opponent}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {fixture.venue || "Venue not added"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(fixture.matchDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(fixture)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(fixture._id)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 grid-cols-3 mt-4">
                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Match Type</p>
                      <p className="font-display text-xs font-extrabold text-ananda-maroon mt-0.5">
                        {getMatchTypeLabel(fixture.matchType)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ananda Score</p>
                      <p className="font-display text-xs font-extrabold text-ananda-maroon mt-0.5">
                        {fixture.result?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Opponent Score</p>
                      <p className="font-display text-xs font-extrabold text-ananda-maroon mt-0.5">
                        {fixture.result?.opponentScore || "-"}
                      </p>
                    </div>
                  </div>

                  {fixture.result?.resultText && (
                    <div className="mt-4 rounded-xl bg-ananda-gold/15 border border-ananda-gold/25 p-3.5 text-xs font-semibold text-ananda-dark-maroon leading-relaxed">
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-maroon block mb-1">Result Summary</span>
                      {fixture.result.resultText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

export default AdminFixtures;