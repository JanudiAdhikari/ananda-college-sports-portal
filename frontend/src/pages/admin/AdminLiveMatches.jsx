import { useEffect, useRef, useState } from "react";
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "LIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            Live Match
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
            Completed
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Scheduled
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Cancelled
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
        Manage Live Matches
      </h1>

      <p className="mb-8 text-sm text-gray-600">
        Add live match links and update live scores.
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
        {/* Form and Score Updates Column */}
        <div className="space-y-8 xl:col-span-1">
          {/* Add/Edit Form */}
          <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm h-fit">
            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              {editingLiveMatchId ? "Edit Live Match" : "Add Live Match"}
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
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Match Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Ananda vs Nalanda Big Match"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Ananda Team Name
                  </label>
                  <input
                    type="text"
                    name="anandaTeamName"
                    value={formData.anandaTeamName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  />
                </div>

                <div>
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                    Opponent
                  </label>
                  <input
                    type="text"
                    name="opponentTeamName"
                    value={formData.opponentTeamName}
                    onChange={handleChange}
                    placeholder="Opponent school"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                    required
                  />
                </div>
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
                  placeholder="Example: R. Premadasa Stadium"
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

              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Live Video URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="YouTube or Facebook live link"
                  className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                />
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
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Score Sub-Panel */}
              <div className="rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 p-4 space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-tight text-ananda-maroon border-b border-ananda-gold/15 pb-2">
                  Initial Score
                </h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    name="anandaScore"
                    value={formData.anandaScore}
                    onChange={handleChange}
                    placeholder="Ananda score (e.g. 145/4)"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                  />

                  <input
                    type="text"
                    name="opponentScore"
                    value={formData.opponentScore}
                    onChange={handleChange}
                    placeholder="Opponent score"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                  />

                  <input
                    type="text"
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    placeholder="Example: Ananda needs 20 runs from 12 balls"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                  />

                  <div className="grid gap-3 grid-cols-2">
                    <input
                      type="text"
                      name="overs"
                      value={formData.overs}
                      onChange={handleChange}
                      placeholder="Overs"
                      className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                    />

                    <input
                      type="text"
                      name="wickets"
                      value={formData.wickets}
                      onChange={handleChange}
                      placeholder="Wickets"
                      className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon transition text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Visiblity toggler */}
              <label className="flex items-center gap-3 rounded-xl border border-ananda-gold/15 bg-ananda-cream/15 px-4 py-3.5 cursor-pointer hover:bg-ananda-cream/35 transition">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                  className="rounded border-ananda-gold/25 text-ananda-maroon focus:ring-ananda-maroon h-4 w-4 cursor-pointer"
                />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-ananda-dark-maroon">
                  Visible on public website
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
                    : editingLiveMatchId
                      ? "Update Match"
                      : "Create Match"}
                </button>

                {editingLiveMatchId && (
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

          {/* Quick Score Update Form */}
          <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm h-fit">
            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Update Live Score
            </h2>

            <form className="space-y-5" onSubmit={handleScoreSubmit}>
              <div>
                <label className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Select Match
                </label>
                <div className="relative">
                  <select
                    value={selectedMatchId}
                    onChange={handleSelectScoreMatch}
                    className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 pr-10 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                    required
                  >
                    <option value="">Select match</option>
                    {liveMatches.map((match) => (
                      <option key={match._id} value={match._id}>
                        {match.title}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-555">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Ananda Score</label>
                  <input
                    type="text"
                    name="anandaScore"
                    value={scoreFormData.anandaScore}
                    onChange={handleScoreChange}
                    placeholder="Ananda score"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  />
                </div>

                <div>
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Opponent Score</label>
                  <input
                    type="text"
                    name="opponentScore"
                    value={scoreFormData.opponentScore}
                    onChange={handleScoreChange}
                    placeholder="Opponent score"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  />
                </div>

                <div>
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Current Status</label>
                  <input
                    type="text"
                    name="currentStatus"
                    value={scoreFormData.currentStatus}
                    onChange={handleScoreChange}
                    placeholder="Current status"
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Overs</label>
                    <input
                      type="text"
                      name="overs"
                      value={scoreFormData.overs}
                      onChange={handleScoreChange}
                      placeholder="Overs"
                      className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Wickets</label>
                    <input
                      type="text"
                      name="wickets"
                      value={scoreFormData.wickets}
                      onChange={handleScoreChange}
                      placeholder="Wickets"
                      className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Update Commentary Text</label>
                  <textarea
                    name="updateText"
                    value={scoreFormData.updateText}
                    onChange={handleScoreChange}
                    rows="3"
                    placeholder="e.g. Sixer! Ananda batsmen are hitting boundaries."
                    className="w-full rounded-xl border border-ananda-gold/25 bg-white px-4 py-3 outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingScore}
                className="w-full rounded-xl bg-ananda-maroon px-6 py-3 font-semibold text-white hover:bg-ananda-dark-maroon disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 font-display text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01]"
              >
                {updatingScore ? "Updating..." : "Update Score"}
              </button>
            </form>
          </Reveal>
        </div>

        {/* Live Matches List Column */}
        <Reveal className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
              Live Matches List
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  className="w-full appearance-none rounded-xl border border-ananda-gold/25 bg-white pl-3 pr-8 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none focus:border-ananda-maroon focus:ring-1 focus:ring-ananda-maroon transition shadow-sm"
                >
                  <option value="ALL">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-555">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

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
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-555">
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
              <p className="font-display text-xs uppercase tracking-wider text-ananda-maroon animate-pulse">Loading live matches...</p>
            </div>
          )}

          {!loading && liveMatches.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No live matches found.
            </div>
          )}

          {!loading && liveMatches.length > 0 && (
            <div className="space-y-6">
              {liveMatches.map((match) => (
                <div
                  key={match._id}
                  className="rounded-2xl border border-ananda-gold/15 bg-white p-6 shadow-sm hover:border-ananda-gold/35 transition duration-250"
                >
                  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-gold">
                          {match.sport?.name}
                        </span>
                        <span className="text-gray-300 text-xs">|</span>
                        {getStatusBadge(match.status)}
                      </div>

                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ananda-maroon">
                        {match.title}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Teams: {match.anandaTeamName} vs {match.opponentTeamName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Venue: {match.venue || "Venue not added"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date: {new Date(match.matchDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-ananda-gold hover:bg-ananda-light-gold text-ananda-dark-maroon px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(match._id)}
                        className="font-display text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-250 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mt-4">
                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">{match.anandaTeamName}</p>
                      <p className="font-display text-sm font-extrabold text-ananda-maroon mt-0.5">
                        {match.score?.anandaScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">{match.opponentTeamName}</p>
                      <p className="font-display text-sm font-extrabold text-ananda-maroon mt-0.5">
                        {match.score?.opponentScore || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Overs / Wickets</p>
                      <p className="font-display text-sm font-extrabold text-ananda-maroon mt-0.5">
                        {match.score?.overs || "-"}{match.score?.wickets ? ` (${match.score.wickets} Wkts)` : ""}
                      </p>
                    </div>

                    <div className="rounded-xl border border-ananda-gold/10 bg-ananda-cream/15 p-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Public Visibility</p>
                      <p className="font-display text-xs font-bold text-gray-600 mt-0.5 uppercase tracking-wide">
                        {match.isVisible ? "Visible" : "Hidden"}
                      </p>
                    </div>
                  </div>

                  {match.score?.currentStatus && (
                    <div className="mt-4 rounded-xl bg-ananda-gold/15 border border-ananda-gold/25 p-3.5 text-xs font-semibold text-ananda-dark-maroon leading-relaxed">
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider text-ananda-maroon block mb-1">Live Status</span>
                      {match.score.currentStatus}
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

export default AdminLiveMatches;