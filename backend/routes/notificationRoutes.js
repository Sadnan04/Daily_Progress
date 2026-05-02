import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { getNotificationCapabilities } from "../controllers/notificationController.js";

const router = Router();
router.use(authRequired);

router.get("/capabilities", getNotificationCapabilities);

export default router;
