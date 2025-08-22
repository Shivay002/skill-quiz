import Question from "../models/question.model.js";
import QuizAnswer from "../models/quizAnswer.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Skill from "../models/skill.model.js";
import User from "../models/user.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function createAttempt(data, answers) {
  const attempt = await QuizAttempt.create(data);
  for (const ans of answers) {
    await QuizAnswer.create({ ...ans, attemptId: attempt.id });
  }
  return attempt;
}

export async function findAttemptById(id) {
  return await QuizAttempt.findByPk(id, {
    include: [
      { model: User, attributes: ["id", "name", "email"] },
      { model: Skill, attributes: ["id", "name"] },
      { model: QuizAnswer, include: [{ model: Question }] },
    ],
  });
}

export async function listAttempts(query, userId) {
  const { page, limit, offset } = getPagination(query);

  const where = {};
  if (userId) where.userId = userId;

  const { rows, count } = await QuizAttempt.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{ model: Skill }],
  });

  return { rows, count, page, limit };
}
