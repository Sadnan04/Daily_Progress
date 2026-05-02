export default function ProjectCard({ project, onToggleStatus, onDelete }) {
  return (
    <article className="glass flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{project.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            project.status === "completed"
              ? "bg-emerald-500/20 text-emerald-200"
              : "bg-amber-500/20 text-amber-100"
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{project.description || "—"}</p>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-sm text-violet-400 hover:underline"
        >
          GitHub →
        </a>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus(project)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          Mark {project.status === "completed" ? "ongoing" : "completed"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(project._id)}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
