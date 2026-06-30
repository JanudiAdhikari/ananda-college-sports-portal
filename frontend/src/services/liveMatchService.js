import api from "./api";

export const getLiveMatches = async (params = {}) => {
  const response = await api.get("/live-matches", {
    params,
  });

  return response.data;
};

export const getLiveMatchById = async (liveMatchId) => {
  const response = await api.get(`/live-matches/${liveMatchId}`);

  return response.data;
};

export const createLiveMatch = async (liveMatchData) => {
  const response = await api.post("/live-matches", liveMatchData);

  return response.data;
};

export const updateLiveMatch = async (liveMatchId, liveMatchData) => {
  const response = await api.put(`/live-matches/${liveMatchId}`, liveMatchData);

  return response.data;
};

export const updateLiveScore = async (liveMatchId, scoreData) => {
  const response = await api.patch(
    `/live-matches/${liveMatchId}/score`,
    scoreData
  );

  return response.data;
};

export const deleteLiveMatch = async (liveMatchId) => {
  const response = await api.delete(`/live-matches/${liveMatchId}`);

  return response.data;
};