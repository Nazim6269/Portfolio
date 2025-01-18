const Button = ({ text, className, href = "#projects" }) => {
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
      className={`${className ?? ""} inline-flex items-center justify-center rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors duration-200`}
    >
      {text}
    </a>
  );
};

export default Button;
