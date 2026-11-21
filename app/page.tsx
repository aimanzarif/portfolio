import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { InPageNav } from "@/components/in-page-nav";
import { EasterEggs } from "@/components/easter-eggs";
import { Voyager } from "@/components/voyager";
import { RocketLaunch } from "@/components/rocket-launch";
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
      <Voyager />
      <RocketLaunch />
      <div className="relative z-10">
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
