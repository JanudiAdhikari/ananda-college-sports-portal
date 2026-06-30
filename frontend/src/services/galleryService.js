import api from "./api";

export const getGalleryAlbums = async (params = {}) => {
  const response = await api.get("/gallery/albums", {
    params,
  });

  return response.data;
};

export const getGalleryAlbumBySlug = async (slug) => {
  const response = await api.get(`/gallery/albums/${slug}`);

  return response.data;
};

export const createGalleryAlbum = async (albumData) => {
  const response = await api.post("/gallery/albums", albumData);

  return response.data;
};

export const updateGalleryAlbum = async (albumId, albumData) => {
  const response = await api.put(`/gallery/albums/${albumId}`, albumData);

  return response.data;
};

export const deleteGalleryAlbum = async (albumId) => {
  const response = await api.delete(`/gallery/albums/${albumId}`);

  return response.data;
};

export const uploadAlbumImages = async (albumId, files) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(
    `/gallery/albums/${albumId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteAlbumImage = async (albumId, imageId) => {
  const response = await api.delete(
    `/gallery/albums/${albumId}/images/${imageId}`
  );

  return response.data;
};