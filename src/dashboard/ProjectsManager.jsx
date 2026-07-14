import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  demo_link: "",
  github_link: "",
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(", ") || "",
      demo_link: project.demo_link || "",
      github_link: project.github_link || "",
    });
    setEditing(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editing) {
      await supabase.from("projects").update(payload).eq("id", editing);
    } else {
      await supabase.from("projects").insert([payload]);
    }

    setShowForm(false);
    setLoading(false);
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-all duration-200"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-black-100 border border-white/[0.06] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editing ? "Edit Project" : "New Project"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label>Technologies (comma-separated)</label>
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
              <div>
                <label>Demo Link</label>
                <input
                  name="demo_link"
                  value={form.demo_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>GitHub Link</label>
                <input
                  name="github_link"
                  value={form.github_link}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-gray-400 hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-border rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold">{project.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(project)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.05] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-gray-500 text-sm">No projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
