import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { supabase } from "./supabaseClient";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./dashboard/DashboardLayout";
import Overview from "./dashboard/Overview";
import ProjectsManager from "./dashboard/ProjectsManager";
import SkillsManager from "./dashboard/SkillsManager";
import ExperienceManager from "./dashboard/ExperienceManager";
import Messages from "./dashboard/Messages";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={setUser} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardLayout user={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="messages" element={<Messages />} />
        </Route>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Projects />
              <Skills />
              <Experience />
              <Contact />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
