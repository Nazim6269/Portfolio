import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "../supabaseClient";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  demo_link: "",
  github_link: "",
  key_features: "",
  purpose: "",
};

const SortableItem = ({ project, openEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-zinc-800/20 rounded-xl p-5 border border-white/[0.06] flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1 -ml-1"
          aria-label="Drag to reorder"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="5" r="2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="5" r="2" fill="currentColor" stroke="none" />
            <circle cx="9" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="9" cy="19" r="2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="19" r="2" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <div className="min-w-0">
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
  );
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("position", { ascending: true });
    if (data) setProjects(data);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const persistOrder = useCallback(async (ordered) => {
    for (let i = 0; i < ordered.length; i++) {
      const { error } = await supabase
        .from("projects")
        .update({ position: i })
        .eq("id", ordered[i].id);
      if (error) console.error("Failed to persist order:", error);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setProjects((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id);
        const newIndex = prev.findIndex((p) => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(prev, oldIndex, newIndex);
        persistOrder(reordered);
        return reordered;
      });
    },
    [persistOrder]
  );

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
      key_features: project.key_features || "",
      purpose: project.purpose || "",
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
      const nextPosition = projects.length;
      await supabase
        .from("projects")
        .insert([{ ...payload, position: nextPosition }]);
    }

    setShowForm(false);
    setLoading(false);
    fetchProjects();
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-white/[0.06]">
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
                <label>Key Features</label>
                <textarea
                  name="key_features"
                  value={form.key_features}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div>
                <label>Purpose</label>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  rows={3}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {projects.map((project) => (
              <SortableItem
                key={project.id}
                project={project}
                openEdit={openEdit}
                handleDelete={handleDelete}
              />
            ))}
            {projects.length === 0 && (
              <p className="text-gray-500 text-sm">No projects yet.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectsManager;
