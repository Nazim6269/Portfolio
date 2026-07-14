import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const checkConnection = async () => {
  if (!supabaseUrl || supabaseUrl === "your_supabase_url") {
    console.warn(
      "⚠️ Supabase not configured: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    );
    return;
  }

  try {
    const { error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.warn("⚠️ Supabase connection error:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (err) {
    console.warn("⚠️ Supabase connection failed:", err.message);
  }
};

checkConnection();
