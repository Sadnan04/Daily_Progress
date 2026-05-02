import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = Router();
router.use(authRequired);

router.get("/", listProjects);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
