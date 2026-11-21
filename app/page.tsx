import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { InPageNav } from "@/components/in-page-nav";
import {
  Contact,
  Education,
  Experience,
  Homelab,
  Work,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <InPageNav />
      <div className="relative z-10">
        <a href="#work" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <Work />
          <Homelab />
          <Experience />
          <Education />
          <Contact />
        </main>
      </div>
    </>
  );
}
