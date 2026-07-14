import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const emptyForm = { category: "", skills: "" };

const SkillsManager = () => {
  const [skillGroups, setSkillGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setSkillGroups(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (group) => {
    setForm({
      category: group.category,
      skills: group.skills?.join(", ") || "",
    });
    setEditing(group.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill group?")) return;
    await supabase.from("skills").delete().eq("id", id);
    fetchSkills();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      category: form.category,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editing) {
      await supabase.from("skills").update(payload).eq("id", editing);
    } else {
      await supabase.from("skills").insert([payload]);
    }

    setShowForm(false);
    setLoading(false);
    fetchSkills();
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-all duration-200"
        >
          + Add Skill Group
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-black-100 border border-white/[0.06] rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editing ? "Edit Skill Group" : "New Skill Group"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label>Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Programming Languages"
                  required
                />
              </div>
              <div>
                <label>Skills (comma-separated)</label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, TypeScript, C"
                  required
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
        {skillGroups.map((group) => (
          <div
            key={group.id}
            className="bg-zinc-800/20 rounded-xl p-5 border border-white/[0.06] flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {group.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(group)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.05] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(group.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {skillGroups.length === 0 && (
          <p className="text-gray-500 text-sm">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
