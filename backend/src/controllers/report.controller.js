import * as reportService from "../services/report.service.js";

export async function getUserPerformance(req, res) {
  try {
    const targetUserId =
      req.user.role === "admin" && req.query.userId
        ? parseInt(req.query.userId, 10)
        : req.user.id;

    const { page = 1, limit = 10 } = req.query;
    const data = await reportService.getUserPerformance(targetUserId, {
      page,
      limit,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getSkillGap(req, res) {
  try {
    const { userId } = req.query;
    const data = await reportService.getSkillGapReport(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getTimeReport(req, res) {
  try {
    const targetUserId =
      req.user.role === "admin"
        ? req.query.userId
          ? parseInt(req.query.userId, 10)
          : null
        : req.user.id;

    const data = await reportService.getTimeBasedReport(
      targetUserId,
      req.query
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
