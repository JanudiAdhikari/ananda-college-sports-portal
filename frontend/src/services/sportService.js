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