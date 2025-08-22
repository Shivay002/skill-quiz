import * as service from "../services/skills.service.js";

export async function createSkill(req, res) {
  try {
    const skill = await service.createSkill(req.body);
    res.status(201).json(skill);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Skill name already exists" });
    }
    res.status(400).json({ message: err.message });
  }
}

export async function getSkillById(req, res) {
  try {
    const skill = await service.getSkillById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Not found" });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateSkill(req, res) {
  try {
    const updated = await service.updateSkill(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Skill name already exists" });
    }
    res.status(400).json({ message: err.message });
  }
}

export async function deleteSkill(req, res) {
  try {
    const ok = await service.deleteSkill(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listSkills(req, res) {
  try {
    const result = await service.listSkills(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
