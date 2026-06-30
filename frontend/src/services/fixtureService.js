import api from "./api";

export const getFixtures = async (params = {}) => {
  const response = await api.get("/fixtures", {
    params,
  });

  return response.data;
};

export const getFixtureById = async (fixtureId) => {
  const response = await api.get(`/fixtures/${fixtureId}`);

  return response.data;
};

export const createFixture = async (fixtureData) => {
  const response = await api.post("/fixtures", fixtureData);

  return response.data;
};

export const updateFixture = async (fixtureId, fixtureData) => {
  const response = await api.put(`/fixtures/${fixtureId}`, fixtureData);

  return response.data;
};

export const deleteFixture = async (fixtureId) => {
  const response = await api.delete(`/fixtures/${fixtureId}`);

  return response.data;
};