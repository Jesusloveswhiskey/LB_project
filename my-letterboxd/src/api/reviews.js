import api from "./axios";

export const getReviews = (movieId) =>
  api.get("/reviews/", { params: { movie: movieId } });

export const createReview = (movieId, text) =>
  api.post("/reviews/", { movie: movieId, text });

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}/`);