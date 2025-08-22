import { Router } from "express";
import { getSkillGap, getTimeReport, getUserPerformance } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = Router();

router.get("/user", authenticate, authorize(["user", "admin"]), getUserPerformance);
router.get("/skill-gap", authenticate, authorize("admin"), getSkillGap);
router.get("/time", authenticate, authorize(["user", "admin"]), getTimeReport);

export default router;
