import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { InPageNav } from "@/components/in-page-nav";
import { EasterEggs } from "@/components/easter-eggs";
import { Voyager } from "@/components/voyager";
import { Travel } from "@/components/travel";
import { Playlist } from "@/components/playlist";
import { NowListening } from "@/components/now-listening";
import { AboutMe } from "@/components/about-me";
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
          <AboutMe>
            <Travel />
            <NowListening />
            <Playlist />
          </AboutMe>
          <Contact />
        </main>
      </div>
    </>
  );
}
