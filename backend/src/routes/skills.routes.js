import { Router } from "express";
import {
    createSkill,
    deleteSkill,
    getSkillById,
    listSkills,
    updateSkill,
} from "../controllers/skills.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = Router();

router.get("/", listSkills);
router.get("/:id", getSkillById);
router.post("/", authenticate, authorize("admin"), createSkill);
router.put("/:id", authenticate, authorize("admin"), updateSkill);
router.delete("/:id", authenticate, authorize("admin"), deleteSkill);

export default router;
