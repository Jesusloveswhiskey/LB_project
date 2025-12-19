import api from "./axios";

export const getLikes = (params = {}) => api.get("/likes/", { params });
// data = { review: <reviewId>, is_like: true }
export const toggleLike = async (movieId) => {
  return await api.post("/likes/toggle/", {
    movie: movieId
  });
};
export const deleteLike = (id) => api.delete(`/likes/${id}/`);