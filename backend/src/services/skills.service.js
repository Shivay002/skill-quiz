import * as repo from "../persistence/skills.persistence.js";

export async function createSkill(data) {
  return await repo.createSkill(data);
}

export async function getSkillById(id) {
  return await repo.findSkillById(id);
}

export async function updateSkill(id, data) {
  return await repo.updateSkill(id, data);
}

export async function deleteSkill(id) {
  return await repo.deleteSkill(id);
}

export async function listSkills(query) {
  const { rows, count, page, limit } = await repo.paginateSkills(query);
  const totalPages = Math.ceil(count / limit) || 1;

  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}
