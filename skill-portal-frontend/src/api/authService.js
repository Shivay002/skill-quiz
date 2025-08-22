import axiosInstance from "./axiosInstance.js";

export const register = async (data) => {
  const response = await axiosInstance.post("/users/", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};
