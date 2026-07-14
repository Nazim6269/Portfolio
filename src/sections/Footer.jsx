import { Link } from "react-router-dom";
import { socialImgs } from "../constants";
import { useSiteConfig } from "../context/SiteConfigContext";

const Footer = () => {
  const { config } = useSiteConfig();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p className="font-medium text-gray-400">{config?.footer_name || "Nazim Uddin"}</p>
        </div>
        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <Link key={index} to={socialImg.link} target="_blank" rel="noopener noreferrer" aria-label={socialImg.name}>
              <div className="icon">
                <img src={socialImg.imgPath} alt={socialImg.name} />
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
