import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser,
    updateUser,
} from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { authorize } from "../middlewares/auth/authorize.js";

const router = Router();
router.get("/", authenticate, authorize("admin"), getAllUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);
router.post("/", createUser);
router.put("/:id", authenticate, authorize("admin"), updateUser);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);
router.post("/login", loginUser);

export default router;
