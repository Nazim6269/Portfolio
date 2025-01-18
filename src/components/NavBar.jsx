import { useEffect, useState } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <p className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Nazim.
        </p>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Contact
          </a>

          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col gap-1 z-50 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-white transition-all ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu lg:hidden ${isOpen ? "open" : ""}`}>
          <nav>
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name}>
                  <a href={link} onClick={closeMenu}>
                    {name}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" onClick={closeMenu} className="text-white">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
