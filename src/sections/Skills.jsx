import { useEffect, useState } from "react";
import TitleHeader from "../components/TitleHeader";
import { supabase } from "../supabaseClient";

export default function Skills() {
  const [skillGroups, setSkillGroups] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("created_at", { ascending: true });
      if (data && data.length > 0) {
        setSkillGroups(
          data.map((s) => ({
            category: s.category,
            skills: s.skills,
          }))
        );
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="section-padding max-w-7xl mx-auto">
      <div className="w-full h-full">
        <TitleHeader
          title="Technical Skills"
          sub="Stack & Tools"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {skillGroups.map((group, index) => (
            <div key={index} className="card-border rounded-xl p-6 hover:bg-white/[0.02] transition-all duration-300">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-50 mb-5">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm rounded-md bg-white/[0.03] text-gray-300 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white hover:border-white/10 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
