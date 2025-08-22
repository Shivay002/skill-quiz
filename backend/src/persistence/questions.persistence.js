import { Op } from "sequelize";
import Question from "../models/question.model.js";
import Skill from "../models/skill.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function createQuestion(data) {
  return await Question.create(data);
}

export async function findQuestionById(id) {
  return await Question.findByPk(id, { include: Skill });
}

export async function updateQuestion(id, data) {
  const q = await Question.findByPk(id);
  if (!q) return null;
  await q.update(data);
  return q;
}

export async function deleteQuestion(id) {
  const q = await Question.findByPk(id);
  if (!q) return null;
  await q.destroy();
  return true;
}

export async function paginateQuestions(query) {
  const { page, limit, offset } = getPagination(query);

  const where = {};
  if (query.search) {
    where.text = { [Op.like]: `%${query.search}%` };
  }
  if (query.skillId) {
    where.skillId = parseInt(query.skillId, 10);
  }

  const { rows, count } = await Question.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{ model: Skill }],
  });
  const plainRows = JSON.parse(JSON.stringify(rows));

  const skills = plainRows.reduce((acc, question) => {
    const skillId = question.Skill?.id || null;
    const skillName = question.Skill?.name || "Unknown Skill";
    if (!skillId) return acc;
    const { Skill: _removed, ...questionWithoutSkill } = question;

    let skillGroup = acc.find((g) => g.skillId === skillId);
    if (!skillGroup) {
      skillGroup = {
        skillId,
        name: skillName,
        questions: [],
      };
      acc.push(skillGroup);
    }

    skillGroup.questions.push(questionWithoutSkill);
    return acc;
  }, []);

  return {
    skills,
    count,
    page,
    limit,
  };
}

