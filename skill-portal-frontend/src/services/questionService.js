import axiosInstance from "../api/axiosInstance";

export function getAllQuestions(params = {}) {
  return axiosInstance.get("/questions/list", {
    params,
  });
}

export function getQuestionById(id) {
  return axiosInstance.get(`/questions/${id}`);
}

export function createQuestion(questionData) {
  return axiosInstance.post("/questions", questionData);
}

export function updateQuestion(id, questionData) {
  return axiosInstance.put(`/questions/${id}`, questionData);
}

export function deleteQuestion(id) {
  return axiosInstance.delete(`/questions/${id}`);
}
