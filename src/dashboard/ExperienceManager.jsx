import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const emptyForm = {
  title: "",
  company: "",
  date: "",
  responsibilities: "",
  img_path: "",
  logo_path: "",
};

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setExperiences(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (exp) => {
    setForm({
      title: exp.title,
      company: exp.company || "",
      date: exp.date,
      responsibilities: exp.responsibilities?.join("\n") || "",
      img_path: exp.img_path || "",
      logo_path: exp.logo_path || "",
    });
    setEditing(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    await supabase.from("experience").delete().eq("id", id);
    fetchExperiences();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      responsibilities: form.responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    if (editing) {
      await supabase.from("experience").update(payload).eq("id", editing);
    } else {
      await supabase.from("experience").insert([payload]);
    }

    setShowForm(false);
    setLoading(false);
    fetchExperiences();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-all duration-200"
        >
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-black-100 border border-white/[0.06] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editing ? "Edit Experience" : "New Experience"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              <div>
                <label>Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Softvence Delta"
                />
              </div>
              <div>
                <label>Date</label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g. Feb 2026 - Present"
                  required
                />
              </div>
              <div>
                <label>Responsibilities (one per line)</label>
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Architect and ship production-grade web applications..."
                  required
                />
              </div>
              <div>
                <label>Image Path</label>
                <input
                  name="img_path"
                  value={form.img_path}
                  onChange={handleChange}
                  placeholder="/images/softvence_delta.jpeg"
                />
              </div>
              <div>
                <label>Logo Path</label>
                <input
                  name="logo_path"
                  value={form.logo_path}
                  onChange={handleChange}
                  placeholder="/images/softvence_delta.jpeg"
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
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="card-border rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {exp.logo_path && (
                  <img
                    src={exp.logo_path}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-white/[0.06]"
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold">
                    {exp.title}
                    {exp.company && (
                      <span className="text-gray-400 font-normal">
                        {" — "}
                        {exp.company}
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-blue-50">{exp.date}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {exp.responsibilities?.slice(0, 3).map((r, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-50 mt-1.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
                {exp.responsibilities?.length > 3 && (
                  <li className="text-xs text-gray-500">
                    +{exp.responsibilities.length - 3} more
                  </li>
                )}
              </ul>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(exp)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.05] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-gray-500 text-sm">No experience entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;
