import { Router } from "express";
import {
    createQuestion,
    deleteQuestion,
    getQuestionById,
    listQuestions,
    updateQuestion,
} from "../controllers/questions.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = Router();

router.get("/list", listQuestions);
router.get("/:id", getQuestionById);
router.post("/", authenticate, authorize("admin"), createQuestion);
router.put("/:id", authenticate, authorize("admin"), updateQuestion);
router.delete("/:id", authenticate, authorize("admin"), deleteQuestion);

export default router;
