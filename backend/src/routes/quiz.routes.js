import { Router } from "express";
import {
    createAttempt,
    getAttempt,
    listUserAttempts,
} from "../controllers/quiz.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";

const router = Router();

router.post("/", authenticate, createAttempt);
router.get("/:id", authenticate, getAttempt);
router.get("/attempts", authenticate, listUserAttempts);

export default router;
