import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getSummary,
  getState,
  toggleTask,
  resetWeek,
  getAnalytics
} from "../controllers/trackerController.js";

const router = Router();
router.use(authRequired);

router.get("/summary", getSummary);
router.get("/state", getState);
router.get("/analytics", getAnalytics);
router.patch("/toggle", toggleTask);
router.post("/week/:week/reset", resetWeek);

export default router;
