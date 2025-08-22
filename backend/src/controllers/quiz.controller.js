import * as service from "../services/quiz.service.js";

export async function createAttempt(req, res) {
  try {
    const attempt = await service.createAttempt(
      req.user.id,
      req.body.skillId,
      req.body.answers
    );
    res.status(201).json(attempt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getAttempt(req, res) {
  try {
    const attempt = await service.getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Not found" });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listUserAttempts(req, res) {
  try {
    const attempts = await service.listUserAttempts(req.user.id);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
