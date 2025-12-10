import api from "./axios";

export const register = (data) => api.post("/users/", data);
export const getUsers = () => api.get("/users/");
export const getUser = (id) => api.get(`/users/${id}/`);