import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  StatCard,
  FolderIcon,
  CodeIcon,
  BriefcaseIcon,
  ChatIcon,
} from "../components/StatCard";

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
    { label: "Projects", value: stats.projects, icon: FolderIcon, scheme: "blue" },
    { label: "Skill Groups", value: stats.skills, icon: CodeIcon, scheme: "emerald" },
    { label: "Experiences", value: stats.experience, icon: BriefcaseIcon, scheme: "violet" },
    { label: "Messages", value: stats.messages, icon: ChatIcon, scheme: "amber" },
  ];

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-white/[0.06]">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            scheme={card.scheme}
          />
        ))}
      </div>

      <div className="bg-zinc-800/20 rounded-xl p-6 border border-white/[0.06]">
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
