const Button = ({ text, className, href = "#projects", bgColor, textColor }) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = window.innerHeight * 0.1;
          const top =
            target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }}
      className={`${className ?? ""} inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100 active:scale-[0.98] transition-all duration-200`}
      style={{ backgroundColor: bgColor || "#ffffff", color: textColor || "#000000" }}
    >
      {text}
    </a>
  );
};

export default Button;
