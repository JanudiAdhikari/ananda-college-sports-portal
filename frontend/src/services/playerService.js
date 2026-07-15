import api from "./api";

export const getPlayers = async (params = {}) => {
  const response = await api.get("/players", {
    params,
  });

  return response.data;
};

export const getPlayerById = async (playerId) => {
  const response = await api.get(`/players/${playerId}`);

  return response.data;
};

export const createPlayer = async (playerData) => {
  const response = await api.post("/players", playerData);

  return response.data;
};

export const updatePlayer = async (playerId, playerData) => {
  const response = await api.put(`/players/${playerId}`, playerData);

  return response.data;
};

export const deletePlayer = async (playerId) => {
  const response = await api.delete(`/players/${playerId}`);

  return response.data;
};

export const uploadPlayerPhoto = async (playerId, file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.put(`/players/${playerId}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deletePlayerPhoto = async (playerId) => {
  const response = await api.delete(`/players/${playerId}/photo`);

  return response.data;
};