import axiosInstance from "../api/axiosInstance";

export async function fetchSkills() {
  const res = await axiosInstance.get("/skills");
  return res.data;
}
// src/services/quizService.js
export async function startQuiz(skillId) {
  const res = await axiosInstance.get("/questions/list", {
    params: { skillId },
  });
  const questions = res.data?.data?.details[0].questions || [];
  return { skillId, questions };
}

export async function submitQuiz(quizId, answers) {
  const res = await axiosInstance.post(`/quiz/${quizId}/submit`, { answers });
  return res.data;
}

export function submitAttempt({ skillId, answers }) {
  return axiosInstance.post("/quiz", { skillId, answers });
}

export function fetchUserAttempts(params) {
  return axiosInstance.get("/reports/user", { params });
}

export function getAttemptById(id) {
  return axiosInstance.get(`/quiz/${id}`);
}
