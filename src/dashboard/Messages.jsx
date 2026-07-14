import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-white/[0.06]">
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left bg-zinc-800/20 rounded-xl p-4 border border-white/[0.06] transition-all duration-200 ${
                selected?.id === msg.id
                  ? "border-white/20 bg-zinc-800/40"
                  : "hover:bg-zinc-800/40"
              }`}
            >
              <p className="text-sm font-medium text-white truncate">
                {msg.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{msg.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm">No messages yet.</p>
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-zinc-800/20 rounded-xl p-6 border border-white/[0.06]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-blue-50">{selected.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-800/20 rounded-xl p-6 border border-white/[0.06] flex items-center justify-center h-40">
              <p className="text-gray-500 text-sm">
                Select a message to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
