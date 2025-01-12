import { BrowserRouter } from "react-router";
import Navbar from "./components/NavBar";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";


const App = () => (
  <BrowserRouter>
    <Navbar />
    <Hero />
    <Projects />
    <Skills />
    <Contact />
    <Footer />
  </BrowserRouter>
);

export default App;
