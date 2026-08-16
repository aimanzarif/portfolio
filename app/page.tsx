import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PointerBackground } from "@/components/pointer-background";
import {
  About,
  Contact,
  Education,
  Experience,
  Footer,
  Skills,
  Work,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <PointerBackground />
      <div className="relative z-10">
        <a href="#about" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <About />
          <Experience />
          <Work />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
