import * as reportService from "../services/report.service.js";

export async function getUserPerformance(req, res) {
  try {
    const data = await reportService.getUserPerformance(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getSkillGap(req, res) {
  try {
    const data = await reportService.getSkillGapReport();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getTimeReport(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const data = await reportService.getTimeBasedReport(req.user.id, startDate, endDate);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
