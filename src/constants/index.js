const navLinks = [
  {
    name: "Projects",
    link: "#projects",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Contact",
    link: "#contact",
  },
];

const groupedSkills = [
  {
    category: "Programming Languages",
    skills: ["JavaScript", "TypeScript", "C", "C++"]
  },
  {
    category: "Frameworks & Libraries",
    skills: ["NextJS", "ReactJS", "NodeJS", "ExpressJS", "MongoDB", "Redux", "TANSTACK Query"]
  },
  {
    category: "UI & Animation",
    skills: ["Material-UI", "ShadCN-UI", "Framer Motion", "GSAP"]
  },
  {
    category: "Tools & DevOps",
    skills: ["Git", "GitHub", "VS Code", "Postman", "Vercel", "Netlify"]
  }
];

const projects = [
  {
    id: 1,
    title: "DineHub",
    des: "A full-stack food ordering platform with secure authentication, Stripe payments, order lifecycle tracking, and a comprehensive admin dashboard.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    demoLink: "https://dinhub.netlify.app/",
    githubLink: "https://github.com/Nazim6269/DineHub_MERN",
  },
  {
    id: 2,
    title: "E-commerce Website",
    des: "A full-stack e-commerce site featuring multi-step checkout, real-time tax calculation, Stripe payment processing, and dynamic multi-criteria filtering.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Stripe"],
    demoLink: "https://buyly-bd.netlify.app/",
    githubLink: "https://github.com/Nazim6269/Project04_e-commerce_nextjs_one",
  },
  {
    id: 3,
    title: "Playlist Manager",
    des: "A web app integrating YouTube Data API for playlist management, with localStorage session persistence and dynamic video embedding.",
    technologies: ["React", "YouTube Data API", "LocalStorage"],
    demoLink: "https://playlistinghub.netlify.app/",
    githubLink: "https://github.com/Nazim6269/Project07_Youtube_Playlist_Manager",
  },
  {
    id: 4,
    title: "Blog Application",
    des: "A blog platform with custom drag-and-drop image uploader, real-time markdown previews, and a Glassmorphism interface with seamless theme switching.",
    technologies: ["React", "Tailwind CSS", "Context API"],
    demoLink: "https://nazimblogs.netlify.app/",
    githubLink: "https://github.com/Nazim6269/Project09_Blog_App",
  },
  {
    id: 5,
    title: "Real-Time Geolocation",
    des: "A live tracking system using Geolocation API and Leaflet.js with theme-aware maps, reverse geocoding, and real-time weather and seismic data.",
    technologies: ["React", "Tailwind CSS", "Leaflet.js", "OpenWeatherMap API"],
    demoLink: "https://geolocationtrack.netlify.app/",
    githubLink: "https://github.com/Nazim6269/Project05_Location_Tracker",
  },
];

const socialImgs = [
  {
    name: "github",
    imgPath: "/images/x.png",
    link: "https://github.com/Nazim6269",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    link: "https://www.linkedin.com/in/nazim-uddin-23a93a216/",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
    link: "https://www.facebook.com/profile.php?id=100047297413525",
  },
];

export {
  navLinks,
  groupedSkills,
  projects,
  socialImgs,
};
