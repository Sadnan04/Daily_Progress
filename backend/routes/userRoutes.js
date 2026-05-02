import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  updateProfile,
  changePassword,
  updateSettings,
  resetProgress
} from "../controllers/userController.js";

const router = Router();
router.use(authRequired);

router.patch("/me", updateProfile);
router.patch("/me/password", changePassword);
router.patch("/me/settings", updateSettings);
router.post("/me/reset-progress", resetProgress);

export default router;
