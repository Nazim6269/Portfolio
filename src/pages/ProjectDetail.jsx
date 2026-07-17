import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useSiteConfig } from "../context/SiteConfigContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProject({
          id: data.id,
          title: data.title,
          des: data.description,
          keyFeatures: data.key_features,
          purpose: data.purpose,
          technologies: data.technologies,
          demoLink: data.demo_link,
          githubLink: data.github_link,
        });
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4">
        <p className="text-gray-400">Project not found</p>
        <Link
          to="/"
          className="text-blue-50 hover:text-white transition-colors text-sm"
        >
          &larr; Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors text-sm mb-12 inline-flex items-center gap-1"
        >
          &larr; Back
        </button>

        <div className="card-border rounded-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {project.title}
          </h1>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
            <div className="text-gray-400 leading-relaxed text-base space-y-4">
              {project.des.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {project.keyFeatures && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
              <div className="text-gray-400 leading-relaxed text-base space-y-4">
                {project.keyFeatures.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {project.purpose && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-white mb-3">Purpose</h2>
              <div className="text-gray-400 leading-relaxed text-base space-y-4">
                {project.purpose.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-2 mt-8">
            {project?.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm rounded-md bg-white/[0.03] text-gray-300 border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-10 pt-6 border-t border-white/[0.06]">
            {project.demoLink ? (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                style={{ backgroundColor: config?.accent_color || "#ffffff", color: config?.accent_text_color || "#000000" }}
              >
                Live Demo
              </a>
            ) : (
              <span className="inline-flex px-6 py-2.5 rounded-lg bg-white/5 text-gray-500 text-sm font-medium cursor-not-allowed">
                Live Demo
              </span>
            )}
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-6 py-2.5 rounded-lg border border-white/[0.12] text-gray-300 text-sm font-medium hover:bg-white/[0.04] transition-all duration-200"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
