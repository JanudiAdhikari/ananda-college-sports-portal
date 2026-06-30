import api from "./api";

export const getSports = async (params = {}) => {
  const response = await api.get("/sports", {
    params,
  });

  return response.data;
};

export const getSportBySlug = async (slug) => {
  const response = await api.get(`/sports/${slug}`);

  return response.data;
};

export const createSport = async (sportData) => {
  const response = await api.post("/sports", sportData);

  return response.data;
};

export const updateSport = async (sportId, sportData) => {
  const response = await api.put(`/sports/${sportId}`, sportData);

  return response.data;
};

export const deleteSport = async (sportId) => {
  const response = await api.delete(`/sports/${sportId}`);

  return response.data;
};