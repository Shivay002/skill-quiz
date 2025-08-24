import axiosInstance from "../api/axiosInstance";

export function getTimeReport({ userId, filter, from, to }) {
  return axiosInstance.get("/reports/time", {
    params: { userId, filter, from, to }
  });
}

export function getSkillGap() {
  return axiosInstance.get("/reports/skill-gap");
}

export function getUserReport({ userId, page = 1, limit = 10 }) {  
  return axiosInstance.get("/reports/user", {
    params: { userId, page, limit },
  });
}
export function getUserReportForAdmin({ userId, page, limit }) {
  return getUserReport({ userId, page, limit });
}
