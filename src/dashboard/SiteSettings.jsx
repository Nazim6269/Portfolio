import { useEffect, useState } from "react";
import { useSiteConfig } from "../context/SiteConfigContext";

const SiteSettings = () => {
  const { config, updateConfig, refetch } = useSiteConfig();
  const [form, setForm] = useState({ ...config });

  useEffect(() => {
    setForm({ ...config });
  }, [config]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { success } = await updateConfig(form);
    if (success) {
      setMsg("Saved successfully");
      refetch();
    } else {
      setMsg("Failed to save");
    }
    setSaving(false);
  };

  const fields = [
    { label: "Site Name (navbar)", name: "site_name" },
    { label: "Hero Name", name: "hero_name" },
    { label: "Hero Title", name: "hero_title" },
    { label: "Hero Bio", name: "hero_bio", type: "textarea" },
    { label: "Hero Badge", name: "hero_badge" },
    { label: "Accent Color", name: "accent_color", type: "color" },
    { label: "Accent Text Color", name: "accent_text_color", type: "color" },
    { label: "Footer Name", name: "footer_name" },
    { label: "Meta Title (browser tab)", name: "meta_title" },
  ];

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-white/[0.06]">
      <h2 className="text-2xl font-bold text-white mb-6">Site Settings</h2>

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">
        {fields.map(({ label, name, type }) => (
          <div key={name}>
            <label>{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                rows={3}
                required
              />
            ) : type === "color" ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name={name}
                  value={form[name] || "#ffffff"}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-md cursor-pointer border border-white/[0.08] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                  className="flex-1 font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
            ) : (
              <input
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {msg && (
            <span
              className={`text-sm ${
                msg === "Saved successfully"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {msg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
