export const profile = {
  name: "Zarif Nur Aiman Bin Khairul Bahri",
  shortName: "Zarif Nur Aiman",
  firstName: "Zarif",
  title: "IT Support & QA",
  location: "Klang, Malaysia",
  phone: "+60 11-19167843",
  phoneHref: "tel:+601119167843",
  email: "zarif@zarep.my",
  linkedin: "https://www.linkedin.com/in/zarif-nur-aiman",
  linkedinLabel: "linkedin.com/in/zarif-nur-aiman",
  github: "https://github.com/aimanzarif",
  githubLabel: "github.com/aimanzarif",
  cvHref: "/docs/zarif-nur-aiman-cv.pdf",
  cvLabel: "Download CV",
  intro:
    "Hi, I'm Zarif. Quiet at first, easygoing once you know me. By day I fix other people's problems at ServerFreak. By night I run a RHEL laptop in Klang that hosts this whole site, because a VPS costs money and the laptop was already here.",
} as const;

export const currentRole = {
  role: "IT Support",
  company: "ServerFreak Technologies Sdn. Bhd.",
  period: "July 2026 — now",
  location: "Klang, Selangor",
  blurb:
    "Tickets, live chat, and the occasional phone call where someone is literally waiting on the line. My favourite part of the job: someone shows up stuck and leaves unstuck. Even when they're not exactly nice about it.",
} as const;

/** A typical queue at the help desk. Titles are the problem as it arrives, `fix` is what it usually turns into. */
export const tickets = [
  { title: "Forgot password (again)", fix: "Reset, verified, done", channel: "Live chat" },
  { title: "My website got hacked", fix: "Malware cleaning", channel: "Ticket" },
  { title: "Email bounced / can't connect", fix: "Mail delivery and client fixes", channel: "Ticket" },
  { title: "Server is slow", fix: "Server optimisation, SQL tuning", channel: "Ticket" },
  { title: "WordPress shows a white screen", fix: "WordPress debugging", channel: "Ticket" },
  { title: "Outlook is doing Outlook things", fix: "Microsoft 365 troubleshooting", channel: "Live chat" },
  { title: "Phone ringing. Someone's on the line.", fix: "Fix it while they wait", channel: "Call" },
] as const;

export const incident = {
  id: "INC-2026-06",
  title: "The night I deleted SmartRoute.",
  rows: [
    { label: "When", value: "June 2026, at night (of course)" },
    { label: "What happened", value: "I deleted SmartRoute from the server. By accident. Mostly." },
    { label: "Root cause", value: "Me." },
    { label: "Time to recover", value: "About 3 hours" },
    { label: "Data lost", value: "None. Recovered all of it." },
    { label: "Lesson", value: "Read the command twice before pressing Enter at night." },
  ],
  status: "Resolved. SmartRoute is back up, scroll up and click it.",
} as const;

export const homelab = {
  intro:
    "Why self-host? Budget, honestly. I used what I already had: one Acer laptop with 32 GB of RAM and a lot of free evenings. Everything on this domain runs on it, and it only talks to the internet through an outbound Cloudflare Tunnel, so no ports are open.",
  rack: [
    { unit: "U04", tag: "EDGE", name: "Cloudflare Tunnel", spec: "DNS · WAF", tall: false },
    { unit: "U03", tag: "ROUTING", name: "Nginx Proxy Manager", spec: "1 host per app", tall: false },
    { unit: "U02", tag: "APPS · DOCKER COMPOSE", name: "portfolio · ikango · smartroute", spec: "RHEL 10", tall: true },
    { unit: "U01", tag: "OPS", name: "Uptime Kuma · Netdata · malwatch", spec: "status", tall: false },
  ],
  notes: [
    {
      title: "Watching it",
      body: "Uptime Kuma, Netdata, and a Telegram ping when something looks off. The live numbers are right there.",
    },
    {
      title: "Protecting it",
      body: "SELinux enforcing, firewalld, Fail2ban, Tailscale for admin access, and malwatch, a YARA scanner I wrote in Go.",
    },
    {
      title: "Learning next",
      body: "GitHub Actions to GHCR, then k3s on a KVM guest, then Argo CD. One thing at a time.",
    },
  ],
  statusHref: "https://uptimekuma.zarep.my",
} as const;

export const ticker = [
  "Fixing things",
  "Linux",
  "Email that won't send",
  "Docker",
  "WordPress",
  "SQL tuning",
  "Laravel",
  "Cloudflare",
  "Manual testing",
  "Kopi o kosong",
] as const;

export const experience = {
  role: "Junior Software Developer (industrial attachment)",
  company: "AMTIS Solutions Sdn. Bhd.",
  period: "March 2025 — March 2026",
  location: "Malaysia",
  blurb:
    "Developer and tester at the same time, so I got to file bugs against my own code. Rule I worked by: anything that breaks the app gets fixed first, cosmetic stuff waits its turn.",
  bullets: [
    "Engineered 3 full-stack web modules for the YMBI client project using Laravel, Vue.js, and MySQL, reducing manual reporting time by approximately 40% through automated Excel export pipelines built with Maatwebsite.",
    "Executed end-to-end manual testing across iOS and Android platforms for the Jerai Hill project, documenting over 50 test cases and defects using structured STLC processes, achieving a defect detection rate that supported on-time UAT sign-off.",
    "Produced comprehensive technical documentation including SRS, URS, and API specifications across 4 concurrent projects, applying CPRE-certified requirements engineering practices that reduced stakeholder change requests during development by approximately 30%.",
    "Collaborated across 6 concurrent project streams including FlutterFlow frontend development (ASWARA LMS), stakeholder engagement (Digital Masjid), and developer training delivery, demonstrating cross-functional delivery within a structured modified waterfall SDLC environment.",
    "Developed dynamic Excel import functionality using Maatwebsite with configurable column mapping logic in Laravel, enabling clients to bulk-upload structured data with real-time validation and reducing manual data entry effort by an estimated 50%.",
  ],
} as const;

export type ProjectLink = { label: string; href: string };

export const projects: readonly {
  id: string;
  name: string;
  tagline: string;
  period: string;
  role: string;
  live: boolean;
  story: string;
  stack: readonly string[];
  image?: { src: string; alt: string };
  links: readonly ProjectLink[];
}[] = [
  {
    id: "smartroute",
    name: "SmartRoute",
    tagline: "One place to manage APIs.",
    period: "Sep 2025 — Feb 2026",
    role: "Built it",
    live: true,
    story:
      "At AMTIS I noticed there wasn't one place to manage our APIs: who's calling what, how often, and whether they should be. So I built a rule and role-based API gateway for my final-year project. It's the one I deleted in June. It's fine now.",
    stack: ["Laravel 12", "Passport", "Google OAuth", "Tailwind", "Alpine.js", "Docker"],
    image: { src: "/projects/smartroute.webp", alt: "SmartRoute sign-in page" },
    links: [
      { label: "Live demo", href: "https://smartroute.zarep.my" },
      { label: "GitHub", href: "https://github.com/aimanzarif/fyp-api-gateway" },
      {
        label: "SRS",
        href: "https://github.com/aimanzarif/fyp-api-gateway/blob/main/public/docs/SRS%20SmartRoute_Zarif%20Nur%20Aiman.pdf",
      },
      {
        label: "SDD",
        href: "https://github.com/aimanzarif/fyp-api-gateway/blob/main/public/docs/SDD%20SmartRoute_Zarif%20Nur%20Aiman.pdf",
      },
    ],
  },
  {
    id: "ikango",
    name: "ikanGO",
    tagline: "Catch fish. Log fish.",
    period: "Ongoing",
    role: "Server admin",
    live: true,
    story:
      "My friend is an angler and wanted a website to collect every fish he catches. He builds the app, I keep it alive: the Next.js client, the fish-recognition model API and the database all run on my laptop.",
    stack: ["Next.js", "FastAPI", "ONNX", "PostgreSQL", "Docker"],
    image: { src: "/projects/ikango.webp", alt: "ikanGO sign-in page over an underwater coral background" },
    links: [{ label: "Live demo", href: "https://ikango.zarep.my" }],
  },
  {
    id: "jerai",
    name: "Jerai Hill Resort",
    tagline: "Mobile app QA, iOS and Android.",
    period: "Mar 2026 — May 2026",
    role: "Tester",
    live: false,
    story:
      "Manual regression and edge-case testing across iOS and Android, written up as test cases and defect reports a developer can actually reproduce. No critical defects reached production across the releases I tested.",
    stack: ["Manual testing", "Regression", "STLC", "iOS", "Android"],
    links: [{ label: "Sample defect report", href: "/docs/sample-defect-report.pdf" }],
  },
];

export const alsoBuilt = {
  name: "Internal Management System",
  where: "AMTIS · Sep 2025 — Feb 2026",
  story: "An internal ops platform with Excel import and export that non-technical staff could use on their own. Private, so no demo, sorry.",
  stack: ["Laravel", "Vue.js", "Shadcn UI", "MySQL"],
} as const;

export const skillGroups = [
  {
    id: "support",
    label: "Support & ops",
    items: ["Email delivery", "Malware cleanup", "WordPress", "Microsoft 365", "cPanel / WHM", "SQL tuning"],
  },
  {
    id: "qa",
    label: "Testing & QA",
    items: ["Manual testing", "Regression", "Exploratory", "API testing", "Test cases", "Defect reports"],
  },
  {
    id: "web",
    label: "Build",
    items: ["Laravel", "Vue.js", "Next.js", "PHP", "JavaScript", "TypeScript (basic)", "SQL"],
  },
  {
    id: "devops",
    label: "Infra",
    items: ["RHEL", "Docker", "Nginx", "Cloudflare", "Tailscale", "Git", "GitHub Actions"],
  },
  {
    id: "docs",
    label: "Docs",
    items: ["SRS", "URS", "API specs", "StarUML"],
  },
] as const;

export const education = [
  {
    school: "Universiti Teknologi MARA (UiTM)",
    credential: "Bachelor of Information Systems Engineering (Hons.)",
    year: "2026",
    meta: "CGPA 3.56 · Dean's List for two semesters",
  },
  {
    school: "Universiti Teknologi MARA (UiTM)",
    credential: "Diploma in Computer Science",
    year: "2023",
    meta: "CGPA 3.72 · Dean's List for three semesters",
  },
] as const;

export const certifications = [
  {
    name: "Certified Professional Requirements Engineer Foundation Level (CPRE-FL)",
    year: "2024",
    meta: "ID MY-CPRE-FL-2024-00036",
  },
  {
    name: "Microsoft Full-Stack Developer Professional Certificate",
    year: "Ongoing",
    meta: "In progress",
  },
] as const;

export const languages = [
  { name: "Bahasa Melayu", level: "Native" },
  { name: "English", level: "Conversational" },
] as const;

export const navItems = [
  { href: "#work", label: "Work" },
  { href: "#helpdesk", label: "Help desk" },
  { href: "#homelab", label: "Homelab" },
  { href: "#experience", label: "Experience" },
] as const;
