import { useRef } from "react";

const schemes = {
  blue: {
    bar: "from-blue-500/80 via-blue-400/60 to-sky-300/40",
    glow: "from-blue-500/25 via-blue-400/10 to-transparent",
    icon: "text-blue-400 group-hover:text-blue-300",
    shadow: "rgba(59,130,246,0.2)",
  },
  emerald: {
    bar: "from-emerald-500/80 via-emerald-400/60 to-green-300/40",
    glow: "from-emerald-500/25 via-emerald-400/10 to-transparent",
    icon: "text-emerald-400 group-hover:text-emerald-300",
    shadow: "rgba(16,185,129,0.2)",
  },
  violet: {
    bar: "from-violet-500/80 via-violet-400/60 to-purple-300/40",
    glow: "from-violet-500/25 via-violet-400/10 to-transparent",
    icon: "text-violet-400 group-hover:text-violet-300",
    shadow: "rgba(139,92,246,0.2)",
  },
  amber: {
    bar: "from-amber-500/80 via-amber-400/60 to-yellow-300/40",
    glow: "from-amber-500/25 via-amber-400/10 to-transparent",
    icon: "text-amber-400 group-hover:text-amber-300",
    shadow: "rgba(245,158,11,0.2)",
  },
};

const FolderIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const CodeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ChatIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const StatCard = ({ label, value, icon: Icon, scheme = "blue" }) => {
  const cardRef = useRef(null);
  const s = schemes[scheme];

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = `0 8px 32px ${s.shadow}`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ "--x": "50%", "--y": "50%" }}
      className="group relative overflow-hidden rounded-xl p-5 border border-white/[0.06] bg-zinc-800/40 backdrop-blur-xl transition-all duration-500 ease-out cursor-pointer hover:border-white/20 hover:bg-zinc-800/60 hover:-translate-y-1"
    >
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${s.bar} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />

      <div
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${s.glow} opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-40 group-hover:scale-110`}
        style={{
          transform: "translate(calc((var(--x) - 140px) * 0.08), calc((var(--y) - 140px) * 0.08))",
        }}
      />

      <div className="relative z-10">
        <Icon className={`w-8 h-8 mb-3 transition-colors duration-300 ${s.icon}`} />
        <p className="text-3xl font-bold text-white mt-1 tracking-tight">
          {value}
        </p>
        <p className="text-gray-500 text-sm mt-0.5 font-medium tracking-wider uppercase">
          {label}
        </p>
      </div>
    </div>
  );
};

export { StatCard, FolderIcon, CodeIcon, BriefcaseIcon, ChatIcon };
export default StatCard;
