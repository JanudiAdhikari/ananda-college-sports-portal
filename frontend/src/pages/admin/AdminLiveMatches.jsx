import { useEffect, useState } from "react";
import { getSports } from "../../services/sportService";
import {
  createLiveMatch,
  deleteLiveMatch,
  getLiveMatches,
  updateLiveMatch,
  updateLiveScore,
} from "../../services/liveMatchService";

const initialFormData = {
  sport: "",
  title: "",
  anandaTeamName: "Ananda College",
  opponentTeamName: "",
  venue: "",
  matchDate: "",
  videoUrl: "",
  status: "SCHEDULED",
  isVisible: true,
  anandaScore: "",
  opponentScore: "",
  currentStatus: "",
  overs: "",
  wickets: "",
};

const statusOptions = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "LIVE", label: "Live" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function AdminLiveMatches() {
  const [sports, setSports] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingLiveMatchId, setEditingLiveMatchId] = useState(null);

  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [scoreFormData, setScoreFormData] = useState({
    anandaScore: "",
    opponentScore: "",
    currentStatus: "",
    overs: "",
    wickets: "",
    updateText: "",
  });

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSport, setFilterSport] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingScore, setUpdatingScore] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildParams = () => {
    const params = {};

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    return params;
  };

  const loadLiveMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLiveMatches(buildParams());
      setLiveMatches(data.liveMatches);

      if (data.liveMatches.length > 0 && !selectedMatchId) {
        const firstMatch = data.liveMatches[0];
        setSelectedMatchId(firstMatch._id);

        setScoreFormData({
          anandaScore: firstMatch.score?.anandaScore || "",
          opponentScore: firstMatch.score?.opponentScore || "",
          currentStatus: firstMatch.score?.currentStatus || "",
          overs: firstMatch.score?.overs || "",
          wickets: firstMatch.score?.wickets || "",
          updateText: "",
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load live matches.");
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
          setFormData((previousData) => ({
            ...previousData,
            sport: previousData.sport || data.sports[0]._id,
          }));
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

    if (filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    if (filterSport !== "ALL") {
      params.sport = filterSport;
    }

    getLiveMatches(params)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setLiveMatches(data.liveMatches);

        if (data.liveMatches.length > 0 && !selectedMatchId) {
          const firstMatch = data.liveMatches[0];
          setSelectedMatchId(firstMatch._id);

          setScoreFormData({
            anandaScore: firstMatch.score?.anandaScore || "",
            opponentScore: firstMatch.score?.opponentScore || "",
            currentStatus: firstMatch.score?.currentStatus || "",
            overs: firstMatch.score?.overs || "",
            wickets: firstMatch.score?.wickets || "",
            updateText: "",
          });
        }

        setError("");
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setError(error.response?.data?.message || "Failed to load live matches.");
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
  }, [filterStatus, filterSport, selectedMatchId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setMessage("");
    setError("");
  };

  const handleScoreChange = (event) => {
    const { name, value } = event.target;

    setScoreFormData({
      ...scoreFormData,
      [name]: value,
    });

    setMessage("");
    setError("");
  };

  const handleFilterStatusChange = (event) => {
    setLoading(true);
    setFilterStatus(event.target.value);
    setMessage("");
    setError("");
  };

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
    setMessage("");
    setError("");
  };

  const getPayload = () => {
    return {
      sport: formData.sport,
      title: formData.title,
      anandaTeamName: formData.anandaTeamName,
      opponentTeamName: formData.opponentTeamName,
      venue: formData.venue,
      matchDate: formData.matchDate,
      videoUrl: formData.videoUrl,
      status: formData.status,
      isVisible: formData.isVisible,
      score: {
        anandaScore: formData.anandaScore,
        opponentScore: formData.opponentScore,
        currentStatus: formData.currentStatus,
        overs: formData.overs,
        wickets: formData.wickets,
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingLiveMatchId) {
        await updateLiveMatch(editingLiveMatchId, getPayload());
        setMessage("Live match updated successfully.");
      } else {
        await createLiveMatch(getPayload());
        setMessage("Live match created successfully.");
      }

      setEditingLiveMatchId(null);
      setFormData({
        ...initialFormData,
        sport: sports[0]?._id || "",
      });

      await loadLiveMatches();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save live match.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (liveMatch) => {
    setEditingLiveMatchId(liveMatch._id);

    setFormData({
      sport: liveMatch.sport?._id || liveMatch.sport || "",
      title: liveMatch.title || "",
      anandaTeamName: liveMatch.anandaTeamName || "Ananda College",
      opponentTeamName: liveMatch.opponentTeamName || "",
      venue: liveMatch.venue || "",
      matchDate: liveMatch.matchDate ? liveMatch.matchDate.slice(0, 16) : "",
      videoUrl: liveMatch.videoUrl || "",
      status: liveMatch.status || "SCHEDULED",
      isVisible: liveMatch.isVisible,
      anandaScore: liveMatch.score?.anandaScore || "",
      opponentScore: liveMatch.score?.opponentScore || "",
      currentStatus: liveMatch.score?.currentStatus || "",
      overs: liveMatch.score?.overs || "",
      wickets: liveMatch.score?.wickets || "",
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingLiveMatchId(null);

    setFormData({
      ...initialFormData,
      sport: sports[0]?._id || "",
    });

    setMessage("");
    setError("");
  };

  const handleSelectScoreMatch = (event) => {
    const selectedId = event.target.value;
    setSelectedMatchId(selectedId);

    const selectedMatch = liveMatches.find((match) => match._id === selectedId);

    if (selectedMatch) {
      setScoreFormData({
        anandaScore: selectedMatch.score?.anandaScore || "",
        opponentScore: selectedMatch.score?.opponentScore || "",
        currentStatus: selectedMatch.score?.currentStatus || "",
        overs: selectedMatch.score?.overs || "",
        wickets: selectedMatch.score?.wickets || "",
        updateText: "",
      });
    }

    setMessage("");
    setError("");
  };

  const handleScoreSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMatchId) {
      setError("Please select a match.");
      return;
    }

    try {
      setUpdatingScore(true);
      setMessage("");
      setError("");

      await updateLiveScore(selectedMatchId, scoreFormData);

      setMessage("Live score updated successfully.");
      setScoreFormData({
        ...scoreFormData,
        updateText: "",
      });

      await loadLiveMatches();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update live score.");
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleDelete = async (liveMatchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this live match?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteLiveMatch(liveMatchId);
      setMessage("Live match removed successfully.");
      setSelectedMatchId("");
      await loadLiveMatches();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove live match.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-2 text-sm font-semibold uppercase text-ananda-gold">
        Admin Panel
      </p>

      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Manage Live Matches
      </h1>

      <p className="mb-8 text-gray-700">
        Add live match links and update live scores.
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
        <div className="space-y-8 xl:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
              {editingLiveMatchId ? "Edit Live Match" : "Add Live Match"}
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
                  Match Title
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Ananda Team Name
                  </label>
                  <input
                    type="text"
                    name="anandaTeamName"
                    value={formData.anandaTeamName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Opponent
                  </label>
                  <input
                    type="text"
                    name="opponentTeamName"
                    value={formData.opponentTeamName}
                    onChange={handleChange}
                    placeholder="Opponent school"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                    required
                  />
                </div>
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
                  placeholder="Example: Ananda College Ground"
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

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Live Video URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="YouTube or Facebook live link"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
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
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-ananda-cream p-4">
                <h3 className="mb-3 font-bold text-ananda-maroon">
                  Initial Score
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="anandaScore"
                    value={formData.anandaScore}
                    onChange={handleChange}
                    placeholder="Ananda score, example: 145/4"
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
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    placeholder="Example: Ananda needs 20 runs from 12 balls"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="overs"
                      value={formData.overs}
                      onChange={handleChange}
                      placeholder="Overs"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                    />

                    <input
                      type="text"
                      name="wickets"
                      value={formData.wickets}
                      onChange={handleChange}
                      placeholder="Wickets"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-ananda-cream px-4 py-3">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                />
                <span className="font-semibold text-ananda-dark-maroon">
                  Visible on public website
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving
                  ? "Saving..."
                  : editingLiveMatchId
                    ? "Update Match"
                    : "Create Match"}
              </button>

              {editingLiveMatchId && (
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

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-bold text-ananda-maroon">
              Update Live Score
            </h2>

            <form className="space-y-5" onSubmit={handleScoreSubmit}>
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Select Match
                </label>
                <select
                  value={selectedMatchId}
                  onChange={handleSelectScoreMatch}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                  required
                >
                  <option value="">Select match</option>
                  {liveMatches.map((match) => (
                    <option key={match._id} value={match._id}>
                      {match.title}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                name="anandaScore"
                value={scoreFormData.anandaScore}
                onChange={handleScoreChange}
                placeholder="Ananda score"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />

              <input
                type="text"
                name="opponentScore"
                value={scoreFormData.opponentScore}
                onChange={handleScoreChange}
                placeholder="Opponent score"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />

              <input
                type="text"
                name="currentStatus"
                value={scoreFormData.currentStatus}
                onChange={handleScoreChange}
                placeholder="Current status"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="overs"
                  value={scoreFormData.overs}
                  onChange={handleScoreChange}
                  placeholder="Overs"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />

                <input
                  type="text"
                  name="wickets"
                  value={scoreFormData.wickets}
                  onChange={handleScoreChange}
                  placeholder="Wickets"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
                />
              </div>

              <textarea
                name="updateText"
                value={scoreFormData.updateText}
                onChange={handleScoreChange}
                rows="3"
                placeholder="Short update, example: Four runs from the last ball"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
              />

              <button
                type="submit"
                disabled={updatingScore}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70"
              >
                {updatingScore ? "Updating..." : "Update Score"}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md xl:col-span-2">
          <div className="mb-5">
            <h2 className="mb-4 text-xl font-bold text-ananda-maroon">
              Live Matches List
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-ananda-maroon"
              >
                <option value="ALL">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

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
            </div>
          </div>

          {loading && <p className="text-gray-600">Loading live matches...</p>}

          {!loading && liveMatches.length === 0 && (
            <p className="text-gray-600">No live matches found.</p>
          )}

          {!loading && liveMatches.length > 0 && (
            <div className="space-y-6">
              {liveMatches.map((match) => (
                <div
                  key={match._id}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-1 text-sm font-semibold uppercase text-ananda-gold">
                        {match.sport?.name} | {match.status}
                      </p>

                      <h3 className="text-xl font-bold text-ananda-maroon">
                        {match.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {match.anandaTeamName} vs {match.opponentTeamName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {match.venue || "Venue not added"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="rounded-lg bg-ananda-gold px-3 py-2 text-sm font-semibold text-ananda-dark-maroon hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(match._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">
                        {match.anandaTeamName}
                      </p>
                      <p className="text-xl font-bold text-ananda-maroon">
                        {match.score?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">
                        {match.opponentTeamName}
                      </p>
                      <p className="text-xl font-bold text-ananda-maroon">
                        {match.score?.opponentScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">Overs</p>
                      <p className="text-xl font-bold text-ananda-maroon">
                        {match.score?.overs || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-ananda-cream p-4">
                      <p className="text-sm text-gray-500">Visible</p>
                      <p className="text-xl font-bold text-ananda-maroon">
                        {match.isVisible ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {match.score?.currentStatus && (
                    <p className="mt-4 rounded-xl bg-ananda-light-gold p-4 text-sm font-semibold text-ananda-dark-maroon">
                      {match.score.currentStatus}
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

export default AdminLiveMatches;