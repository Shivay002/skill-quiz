import * as repo from "../persistence/report.persistence.js";

export async function getUserPerformance(userId, query) {
  const { rows, count, page, limit } = await repo.getUserPerformance(
    userId,
    query
  );
  const totalPages = Math.ceil(count / limit) || 1;

  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}

export async function getSkillAverages() {
  return await repo.getSkillAverages();
}

export async function getTimeBasedReport(userId, query) {
  let { filter, from, to } = query;
  let startDate, endDate;
  if (filter === "week") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    endDate = new Date();
  } else if (filter === "month") {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate = new Date();
  }
  if (from) startDate = new Date(from);
  if (to) endDate = new Date(to);

  if (!startDate || !endDate) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate = new Date();
  }
  const attempts = await repo.findAttemptsByDateRange(userId, startDate, endDate);

  return {
    data: attempts,
    meta: {
      filter: filter || "custom",
      from: startDate,
      to: endDate,
      total: attempts.length,
    },
  };
}
