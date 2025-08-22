import axiosInstance from "../api/axiosInstance";

export function getTimeReport({ userId, startDate, endDate }) {
  return axiosInstance.get("/reports/time", {
    params: { userId, startDate, endDate },
  });
}

export function getSkillGap() {
  return axiosInstance.get("/reports/skill-gap");
}

export function getUserReport({ userId, page = 1, limit = 10 }) {
  return axiosInstance.get("/reports/user", { params: { userId, page, limit } });
}