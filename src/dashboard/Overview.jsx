import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Overview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: projects },
        { count: skills },
        { count: experience },
        { data: messages },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("experience").select("*", { count: "exact", head: true }),
        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        projects: projects ?? 0,
        skills: skills ?? 0,
        experience: experience ?? 0,
        messages: messages?.length ?? 0,
      });
      setRecentMessages(messages ?? []);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, color: "border-blue-500" },
    { label: "Skill Groups", value: stats.skills, color: "border-emerald-500" },
    { label: "Experiences", value: stats.experience, color: "border-violet-500" },
    { label: "Messages", value: stats.messages, color: "border-amber-500" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`card-border rounded-xl p-5 border-l-4 ${card.color}`}
          >
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Messages
        </h3>
        {recentMessages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="border border-white/[0.06] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {msg.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{msg.email}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
