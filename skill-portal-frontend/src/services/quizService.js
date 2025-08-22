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
  return {
    skillId,
    questions: res.data || [],
  };
}

export async function submitQuiz(quizId, answers) {
  const res = await axiosInstance.post(`/quiz/${quizId}/submit`, { answers });
  return res.data;
}

export async function fetchUserAttempts() {
  const res = await axiosInstance.get("/quiz/attempts");
  return res.data;
}

export function submitAttempt({ skillId, submittedAnswers }) {
  return axiosInstance.post("/quiz", { skillId, submittedAnswers });
}
