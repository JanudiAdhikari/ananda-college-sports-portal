import api from "./api";

export const getTeams = async (params = {}) => {
  const response = await api.get("/teams", {
    params,
  });

  return response.data;
};

export const getTeamById = async (teamId) => {
  const response = await api.get(`/teams/${teamId}`);

  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await api.post("/teams", teamData);

  return response.data;
};

export const updateTeam = async (teamId, teamData) => {
  const response = await api.put(`/teams/${teamId}`, teamData);

  return response.data;
};

export const deleteTeam = async (teamId) => {
  const response = await api.delete(`/teams/${teamId}`);

  return response.data;
};