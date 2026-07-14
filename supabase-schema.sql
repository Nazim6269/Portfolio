-- Run this in your Supabase SQL Editor to set up the database

-- 1. Projects table
CREATE TABLE projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  demo_link TEXT,
  github_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills table
CREATE TABLE skills (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Experience table
CREATE TABLE experience (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  img_path TEXT,
  logo_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contact messages table
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (recommended)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 6. Public read access for portfolio sections
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Allow public read messages" ON messages FOR SELECT USING (true);

-- 7. Authenticated full access (insert/update/delete) for dashboard
CREATE POLICY "Allow auth insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth insert experience" ON experience FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update experience" ON experience FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete experience" ON experience FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experience_updated_at
  BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. Insert sample data (optional)
INSERT INTO projects (title, description, technologies, demo_link, github_link) VALUES
  ('DineHub', 'A full-stack food ordering platform with secure authentication, Stripe payments, order lifecycle tracking, and a comprehensive admin dashboard.', ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'], 'https://dinhub.netlify.app/', 'https://github.com/Nazim6269/DineHub_MERN'),
  ('E-commerce Website', 'A full-stack e-commerce site featuring multi-step checkout, real-time tax calculation, Stripe payment processing, and dynamic multi-criteria filtering.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Stripe'], 'https://buyly-bd.netlify.app/', 'https://github.com/Nazim6269/buyly-bd'),
  ('Playlist Manager', 'A web app integrating YouTube Data API for playlist management, with localStorage session persistence and dynamic video embedding.', ARRAY['React', 'YouTube Data API', 'LocalStorage'], 'https://playlistinghub.netlify.app/', 'https://github.com/Nazim6269/playlistinghub'),
  ('Personal Blog Website', 'A blog platform with custom drag-and-drop image uploader, real-time markdown previews, and a Glassmorphism interface with seamless theme switching.', ARRAY['React', 'Tailwind CSS', 'Context API'], 'https://nazimblogs.netlify.app/', 'https://github.com/Nazim6269/nazimblogs'),
  ('Real-Time Geolocation', 'A live tracking system using Geolocation API and Leaflet.js with theme-aware maps, reverse geocoding, and real-time weather and seismic data.', ARRAY['React', 'Tailwind CSS', 'Leaflet.js', 'OpenWeatherMap API'], 'https://geolocationtrack.netlify.app/', 'https://github.com/Nazim6269/realtime-geolocation');

INSERT INTO skills (category, skills) VALUES
  ('Programming Languages', ARRAY['JavaScript', 'TypeScript', 'C', 'C++']),
  ('Frameworks & Libraries', ARRAY['NextJS', 'ReactJS', 'NodeJS', 'ExpressJS', 'MongoDB', 'Redux', 'TANSTACK Query']),
  ('UI & Animation', ARRAY['Material-UI', 'ShadCN-UI', 'Framer Motion', 'GSAP']),
  ('Tools & DevOps', ARRAY['Git', 'GitHub', 'VS Code', 'Postman', 'Vercel', 'Netlify']);

INSERT INTO experience (title, company, date, responsibilities, img_path, logo_path) VALUES
  ('Frontend Developer', 'Softvence Delta', 'Feb 2026 - Present',
   ARRAY[
     'Architect and ship production-grade web applications with Next.js, leveraging SSR, SSG, and API routes to optimize delivery speed and SEO performance.',
     'Engineer responsive, accessible UI systems using Tailwind CSS, ShadCN UI, and CSS Modules — ensuring cross-browser consistency and mobile-first design.',
     'Integrate and orchestrate RESTful APIs with modern data-fetching patterns, reducing client-side latency and improving perceived load times.',
     'Implement secure authentication flows and route protection strategies, safeguarding user sessions across the application.',
     'Drive frontend performance optimization — achieving measurable gains in Core Web Vitals, Lighthouse scores, and time-to-interactive metrics.',
     'Collaborate cross-functionally with backend engineers, designers, and product managers to scope, estimate, and deliver features within sprint timelines.'
   ],
   '/images/softvence_delta.jpeg',
   '/images/softvence_delta.jpeg'
);
