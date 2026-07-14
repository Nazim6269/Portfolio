import { useEffect, useState } from "react";
import TitleHeader from "../components/TitleHeader";
import { supabase } from "../supabaseClient";

const Experience = () => {
  const [expCards, setExpCards] = useState([]);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setExpCards(
          data.map((e) => ({
            title: e.company
              ? `${e.title} — ${e.company}`
              : e.title,
            date: e.date,
            imgPath: e.img_path || "",
            logoPath: e.logo_path || "",
            responsibilities: e.responsibilities,
          }))
        );
      }
    };
    fetchExperience();
  }, []);

  return (
    <section
      id="experience"
      className="section-padding max-w-7xl mx-auto"
    >
      <div className="w-full h-full">
        <TitleHeader
          title="Professional Experience"
          sub="Career"
        />
        <div className="mt-12 flex flex-col gap-8">
          {expCards.map((card) => (
            <div
              key={card.title}
              className="card-border rounded-xl p-6 md:p-8 hover:bg-white/[0.02] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                {card.logoPath && (
                  <img
                    src={card.logoPath}
                    alt="logo"
                    className="w-14 h-14 rounded-lg object-cover border border-white/[0.06] flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-semibold text-xl text-white">
                      {card.title}
                    </h3>
                    <span className="text-sm text-blue-50 font-medium whitespace-nowrap">
                      {card.date}
                    </span>
                  </div>

                  <ul className="mt-5 flex flex-col gap-3">
                    {card.responsibilities.map((responsibility, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-400 text-[15px] leading-relaxed"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-50 mt-2.5 flex-shrink-0" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
