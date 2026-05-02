import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import ProjectCard from "../features/projects/ProjectCard.jsx";
import ProjectForm from "../features/projects/ProjectForm.jsx";
import * as projectService from "../services/projectService.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const list = await projectService.listProjects();
    setProjects(list);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  async function handleCreate(form) {
    await projectService.createProject(form);
    await load();
  }

  async function handleToggle(p) {
    await projectService.updateProject(p._id, {
      status: p.status === "completed" ? "ongoing" : "completed"
    });
    await load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    await projectService.deleteProject(id);
    await load();
  }

  if (loading) return <p className="text-slate-500">Loading projects…</p>;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-lg font-semibold text-white">New project</h2>
        <div className="mt-4">
          <ProjectForm onSubmit={handleCreate} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p._id} project={p} onToggleStatus={handleToggle} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
