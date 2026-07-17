import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlowCard from "../components/GlowCard";
import { supabase } from "../supabaseClient";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("grid");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("position", { ascending: true });
      if (data && data.length > 0) {
        setProjects(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            des: p.description,
            technologies: p.technologies,
            demoLink: p.demo_link,
            githubLink: p.github_link,
          }))
        );
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="section-padding max-w-7xl mx-auto min-h-screen">
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">All Projects</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
                aria-label="Grid view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
                aria-label="List view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {projects.map((project, index) => (
              <GlowCard card={project} key={project.id} index={index}>
                <h3 className="font-semibold text-base text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{project.des}</p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project?.technologies?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.04] text-sm">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-blue-50 hover:text-white transition-colors duration-200"
                  >
                    Details
                  </Link>
                  <Link
                    to={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-50 hover:text-white transition-colors duration-200"
                  >
                    Live Demo
                  </Link>
                  <Link
                    to={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  >
                    Source
                  </Link>
                </div>
              </GlowCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-12">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="card-border rounded-xl p-5 border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-mono">#{index + 1}</span>
                    <h3 className="font-semibold text-base text-white">{project.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1.5 leading-relaxed line-clamp-2">
                    {project.des}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project?.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 flex-shrink-0">
                  <Link
                    to={`/projects/${project.id}`}
                    className="px-4 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Details
                  </Link>
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-white/[0.12] text-gray-300 text-xs font-medium hover:bg-white/[0.04] transition-all duration-200"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-white/[0.12] text-gray-500 text-xs font-medium hover:bg-white/[0.04] transition-all duration-200"
                  >
                    Source
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-20">No projects yet.</p>
        )}
      </div>
    </section>
  );
};

export default AllProjects;
