import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { listNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";

const router = Router();
router.use(authRequired);

router.get("/", listNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
