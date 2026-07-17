import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlowCard from "../components/GlowCard";
import { supabase } from "../supabaseClient";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);

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
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            &larr; Back to Home
          </Link>
        </div>

        <div className="lg:columns-3 md:columns-2 columns-1 mt-12">
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

        {projects.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-20">No projects yet.</p>
        )}
      </div>
    </section>
  );
};

export default AllProjects;
