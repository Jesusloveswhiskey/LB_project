import api from './axios';

export const getMovies = () => api.get("/movies/");
export const getMovie = (id) => api.get(`/movies/${id}/`);

//только админка может создавать, обновлять и удалять фильмы
export const createMovie = (data) => api.post("/movies/", data);
export const updateMovie = (id, data) => api.put(`/movies/${id}/`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}/`);
export const getMyMovies = () => api.get("/movies/my/");