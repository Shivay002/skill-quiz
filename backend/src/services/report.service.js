import * as reportRepo from "../persistence/report.persistence.js";

export async function getUserPerformance(userId, { page, limit }) {
  const { rows, count } = await reportRepo.getUserPerformance(userId, {
    page,
    limit,
  });
  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}

export async function getSkillGapReport(userId) {
  return await reportRepo.getSkillAverages(userId);
}

export async function getTimeBasedReport(userId, query) {
  let { filter, from, to } = query;
  let startDate, endDate;
  const now = new Date();

  switch (filter) {
    case "week":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      endDate = now;
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = now;
      break;
    default:
      if (from) startDate = new Date(from);
      if (to) endDate = new Date(to);
      break;
  }

  if (!(startDate instanceof Date && !isNaN(startDate))) {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
  }
  if (!(endDate instanceof Date && !isNaN(endDate))) {
    endDate = now;
  }

  const attempts = await reportRepo.findAttemptsByDateRange(
    userId,
    startDate,
    endDate
  );

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

// export async function getTimeBasedReport(userId, query) {
//   let { filter, from, to } = query;
//   let startDate, endDate;

//   const now = new Date();

//   switch (filter) {
//     case "week":
//       startDate = new Date(now);
//       startDate.setDate(startDate.getDate() - 7);
//       endDate = now;
//       break;
//     case "month":
//       startDate = new Date(now);
//       startDate.setMonth(startDate.getMonth() - 1);
//       endDate = now;
//       break;
//     default:
//       if (from) startDate = new Date(from);
//       if (to) endDate = new Date(to);
//       break;
//   }

//   // Default if dates missing/invalid
//   if (!(startDate instanceof Date && !isNaN(startDate))) {
//     startDate = new Date(now);
//     startDate.setMonth(startDate.getMonth() - 1);
//   }
//   if (!(endDate instanceof Date && !isNaN(endDate))) {
//     endDate = now;
//   }

//   const attempts = await repo.findAttemptsByDateRange(userId, startDate, endDate);

//   return {
//     data: attempts,
//     meta: {
//       filter: filter || "custom",
//       from: startDate,
//       to: endDate,
//       total: attempts.length,
//     },
//   };
// }
