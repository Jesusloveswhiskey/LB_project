import api from "./axios";

export const getLikes = (params = {}) => api.get("/likes/", { params });
// data = { review: <reviewId>, is_like: true }
export const createLike = (data) => api.post("/likes/", data);
export const deleteLike = (id) => api.delete(`/likes/${id}/`);