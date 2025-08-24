import { Op } from "sequelize";
import QuizAttempt from "../models/quizAttempt.model.js";
import Skill from "../models/skill.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function getUserPerformance(userId, query) {
  const { limit, offset, page } = getPagination(query);

  const { rows, count } = await QuizAttempt.findAndCountAll({
    where: { userId },
    limit,
    offset,
    include: [{ model: Skill, attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });

  return { rows, count, page, limit };
}

export async function getSkillAverages(userId) {
  const where = {};
  if (userId) where.userId = userId;
  const response = await QuizAttempt.findAll({
    where,
    attributes: [
      "skillId",
      [
        QuizAttempt.sequelize.fn("AVG", QuizAttempt.sequelize.col("score")),
        "avgScore",
      ],
    ],
    group: ["skillId"],
    include: [{ model: Skill, attributes: ["id", "name"] }],
  });
  return JSON.parse(JSON.stringify(response));
}

export async function findAttemptsByDateRange(userId, startDate, endDate) {
  const where = { createdAt: { [Op.between]: [startDate, endDate] } };
  if (userId) where.userId = userId;

  return JSON.parse(
    JSON.stringify(
      await QuizAttempt.findAll({
        where,
        include: [{ model: Skill, attributes: ["id", "name"] }],
        order: [["createdAt", "DESC"]],
      })
    )
  );
}
