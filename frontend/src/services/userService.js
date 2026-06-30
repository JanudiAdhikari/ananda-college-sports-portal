import api from "./api";

export const getUsers = async (params = {}) => {
  const response = await api.get("/auth/users", {
    params,
  });

  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/auth/users", userData);

  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/auth/users/${userId}`, userData);

  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await api.delete(`/auth/users/${userId}`);

  return response.data;
};