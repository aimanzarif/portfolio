import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { InPageNav } from "@/components/in-page-nav";
import { EasterEggs } from "@/components/easter-eggs";
import {
  Contact,
  Education,
  Experience,
  HelpDesk,
  Homelab,
  Incident,
  Work,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <InPageNav />
      <EasterEggs />
      <div className="relative z-10">
        <a href="#work" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <Work />
          <HelpDesk />
          <Homelab />
          <Incident />
          <Experience />
          <Education />
          <Contact />
        </main>
      </div>
    </>
  );
}
