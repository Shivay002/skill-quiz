import * as service from "../services/questions.service.js";

export async function createQuestion(req, res) {
  try {
    const q = await service.createQuestion(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getQuestionById(req, res) {
  try {
    const q = await service.getQuestionById(req.params.id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateQuestion(req, res) {
  try {
    const q = await service.updateQuestion(req.params.id, req.body);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const ok = await service.deleteQuestion(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listQuestions(req, res) {
  try {
    const result = await service.listQuestions(req.query);    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
