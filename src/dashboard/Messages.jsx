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
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left card-border rounded-xl p-4 transition-all duration-200 ${
                selected?.id === msg.id
                  ? "border-white/20 bg-white/[0.04]"
                  : "hover:bg-white/[0.02]"
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
            <div className="card-border rounded-xl p-6">
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
            <div className="card-border rounded-xl p-6 flex items-center justify-center h-40">
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
