import axiosInstance from "../api/axiosInstance";

export function getAllUsers(params = {}) {
  return axiosInstance.get("/users", { params });
}
