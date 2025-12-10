import api from "./axios";

// список отзывов, можно фильтровать по фильму
export const getReviews = (params = {}) => api.get("/reviews/", { params });
export const getReview = (id) => api.get(`/reviews/${id}/`);
export const createReview = (data) => api.post("/reviews/", data);
// data = { text, rating, movie }
export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}/`);