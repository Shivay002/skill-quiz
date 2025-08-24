import Question from "../models/question.model.js";
import * as repo from "../persistence/quiz.persistence.js";

export async function createAttempt(userId, skillId, submittedAnswers) {  
  const questionIds = submittedAnswers.map(a => a.questionId);
  const questions = await Question.findAll({ where: { id: questionIds } });

  let correctCount = 0;
  const answers = [];

  for (const ans of submittedAnswers) {
    const q = questions.find(q => q.id === ans.questionId);
    if (!q) throw new Error(`Invalid questionId: ${ans.questionId}`);
    const isCorrect = q.correctOption === ans.selectedOption;
    if (isCorrect) correctCount++;
    answers.push({
      questionId: q.id,
      selectedOption: ans.selectedOption,
      isCorrect,
    });
  }

  const total = questions.length;
  const score = Math.round((correctCount / total) * 100);

  const attempt = await repo.createAttempt(
    { userId, skillId, score, totalQuestions: total, correctAnswers: correctCount },
    answers
  );

  return await repo.findAttemptById(attempt.id);
}

export async function getAttempt(id) {
  return await repo.findAttemptById(id);
}

export async function listUserAttempts(userId, query) {
  const { rows, count, page, limit } = await repo.listAttempts(query, userId);

  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}

export async function listAllAttempts(query) {
  const { rows, count, page, limit } = await repo.listAttempts(query, null);

  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}

