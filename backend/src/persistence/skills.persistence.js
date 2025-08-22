import { Op } from "sequelize";
import Skill from "../models/skill.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function createSkill(data) {
  return await Skill.create(data);
}

export async function findSkillById(id) {
  return await Skill.findByPk(id);
}

export async function updateSkill(id, data) {
  const skill = await Skill.findByPk(id);
  if (!skill) return null;
  await skill.update(data);
  return skill;
}

export async function deleteSkill(id) {
  const skill = await Skill.findByPk(id);
  if (!skill) return null;
  await skill.destroy();
  return true;
}

export async function paginateSkills(query) {
  const { page, limit, offset } = getPagination(query);

  const where = query.search
    ? { name: { [Op.like]: `%${query.search}%` } }
    : {};

  const { rows, count } = await Skill.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  return { rows, count, page, limit };
}
