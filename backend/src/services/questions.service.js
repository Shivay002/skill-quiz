import * as repo from "../persistence/questions.persistence.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function createQuestion(data) {
  if (!data.text) throw new Error("text is required");
  if (!Array.isArray(data.options) || data.options.length < 2)
    throw new Error("At least two options required");
  if (
    typeof data.correctOption !== "number" ||
    data.correctOption < 0 ||
    data.correctOption >= data.options.length
  ) {
    throw new Error("correctOption index invalid");
  }
  if (!data.skillId) throw new Error("skillId is required");
  return await repo.createQuestion(data);
}

export async function getQuestionById(id) {
  return await repo.findQuestionById(id);
}

export async function updateQuestion(id, data) {
  return await repo.updateQuestion(id, data);
}

export async function deleteQuestion(id) {
  return await repo.deleteQuestion(id);
}

export async function listQuestions(query) {
  const { limit, offset, page } = getPagination(query);
  const search = query.search ? String(query.search).trim() : "";
  const skillId = query.skillId ? parseInt(query.skillId, 10) : null;
  const { rows, count, skills } = await repo.paginateQuestions({
    limit,
    offset,
    search,
    skillId,
  });

  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: {
      details: skills,
    },
    meta: { page, limit, total: count, totalPages },
  };
}
