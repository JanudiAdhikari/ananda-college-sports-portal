import { useEffect, useState } from "react";
import { getSports } from "../../services/sportService";
import { getFixtures } from "../../services/fixtureService";

const statusOptions = [
  { value: "ALL", label: "All" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live" },
  { value: "COMPLETED", label: "Completed" },
  { value: "POSTPONED", label: "Postponed" },
];

const getStatusLabel = (value) => {
  return statusOptions.find((item) => item.value === value)?.label || value;
};

function FixturesResults() {
  const [sports, setSports] = useState([]);
  const [fixtures, setFixtures] = useState([]);

  const [filterSport, setFilterSport] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getSports()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setSports(data.sports);
      })
      .catch(() => {});

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
  }, [filterSport, filterStatus]);

  const handleFilterSportChange = (event) => {
    setLoading(true);
    setFilterSport(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setLoading(true);
    setFilterStatus(event.target.value);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-ananda-dark-maroon">
        Fixtures & Results
      </h1>

      <p className="mb-8 text-gray-700">
        View upcoming matches, completed results, match summaries, and featured fixtures.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <select
          value={filterSport}
          onChange={handleFilterSportChange}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
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
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-ananda-maroon"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          Loading fixtures and results...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {!loading && !error && fixtures.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-700 shadow-md">
          No fixtures or results found.
        </div>
      )}

      {!loading && !error && fixtures.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {fixtures.map((fixture) => (
            <div
              key={fixture._id}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-ananda-gold">
                  {fixture.sport?.name}
                </p>

                <span className="rounded-full bg-ananda-cream px-3 py-1 text-sm font-semibold text-ananda-maroon">
                  {getStatusLabel(fixture.status)}
                </span>
              </div>

              <h2 className="mb-2 text-xl font-bold text-ananda-maroon">
                {fixture.title}
              </h2>

              <p className="mb-1 text-gray-600">
                Ananda College vs {fixture.opponent}
              </p>

              <p className="text-sm text-gray-500">
                {fixture.venue || "Venue not added"}
              </p>

              <p className="mb-5 text-sm text-gray-500">
                {new Date(fixture.matchDate).toLocaleString()}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-ananda-cream p-4">
                  <p className="text-sm text-gray-500">Ananda College</p>
                  <p className="text-xl font-bold text-ananda-maroon">
                    {fixture.result?.anandaScore || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-ananda-cream p-4">
                  <p className="text-sm text-gray-500">{fixture.opponent}</p>
                  <p className="text-xl font-bold text-ananda-maroon">
                    {fixture.result?.opponentScore || "-"}
                  </p>
                </div>
              </div>

              {fixture.result?.resultText && (
                <div className="mt-4 rounded-xl bg-ananda-light-gold p-4 text-sm font-semibold text-ananda-dark-maroon">
                  {fixture.result.resultText}
                </div>
              )}

              {fixture.result?.summary && (
                <p className="mt-4 text-sm text-gray-700">
                  {fixture.result.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FixturesResults;