import Project from "../models/Project.js";

export async function listProjects(req, res) {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to list projects" });
  }
}

export async function createProject(req, res) {
  try {
    const { title, description, status, githubUrl } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    const project = await Project.create({
      userId: req.userId,
      title: title.trim(),
      description: description ?? "",
      status: status === "completed" ? "completed" : "ongoing",
      githubUrl: githubUrl ?? ""
    });
    return res.status(201).json({ project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Create failed" });
  }
}

export async function updateProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ error: "Not found" });
    const { title, description, status, githubUrl } = req.body;
    if (title !== undefined) project.title = String(title).trim();
    if (description !== undefined) project.description = String(description);
    if (status !== undefined) project.status = status === "completed" ? "completed" : "ongoing";
    if (githubUrl !== undefined) project.githubUrl = String(githubUrl);
    await project.save();
    return res.json({ project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
}

export async function deleteProject(req, res) {
  try {
    const result = await Project.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
}
