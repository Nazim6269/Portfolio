import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlowCard from "../components/GlowCard";
import TitleHeader from "../components/TitleHeader";
import { supabase } from "../supabaseClient";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
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
    <section id="projects" className="section-padding max-w-7xl mx-auto">
      <div className="w-full h-full">
        <TitleHeader
          title="Selected Projects"
          sub="Recent Work"
        />

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
      </div>
    </section>
  );
};

export default Projects;
