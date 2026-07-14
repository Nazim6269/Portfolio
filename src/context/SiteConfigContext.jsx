import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const defaults = {
  site_name: "Nazim.",
  hero_name: "Nazim Uddin",
  hero_title: "Frontend Engineer",
  hero_bio:
    "Specializing in React, Next.js, and Node.js — I build performant web applications with clean architecture and thoughtful user experiences.",
  hero_badge: "Available for opportunities",
  footer_name: "Nazim Uddin",
  meta_title: "Nazim's — Portfolio",
};

const SiteConfigContext = createContext({ config: defaults, loading: true });

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) setConfig(data);
    } catch {
      // table might not exist yet
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (updates) => {
    const { data, error } = await supabase
      .from("site_config")
      .update(updates)
      .eq("id", 1)
      .select()
      .single();
    if (data) setConfig(data);
    return { success: !error, error };
  };

  return (
    <SiteConfigContext.Provider
      value={{ config, loading, refetch: fetchConfig, updateConfig }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
