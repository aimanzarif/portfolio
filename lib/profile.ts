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
    "Hai, I'm Zarif. Quiet sikit at first, but once you know me, very the easygoing one. By day I fix other people's problems at ServerFreak. By night I run a RHEL laptop in Klang that hosts this whole site, because VPS also need money what, and the laptop already there.",
} as const;

export const currentRole = {
  role: "IT Support",
  company: "ServerFreak Technologies Sdn. Bhd.",
  period: "July 2026 — now",
  location: "Klang, Selangor",
  blurb:
    "Tickets, live chat, and sometimes a phone call where the person is literally waiting on the line, so cannot slow-slow. Best part of the job: someone comes in stuck, leaves unstuck. Even when they're not so nice about it, takpe lah, I still settle.",
} as const;

/** A typical queue at the help desk. Titles are the problem as it arrives, `fix` is what it usually turns into. */
export const tickets = [
  { title: "Forgot password again lah", fix: "Reset, verify, settle", channel: "Live chat" },
  { title: "Website kena hack!!", fix: "Malware cleaning", channel: "Ticket" },
  { title: "Email cannot send, why ah?", fix: "Mail delivery and client fixes", channel: "Ticket" },
  { title: "Server very slow one", fix: "Server optimisation, SQL tuning", channel: "Ticket" },
  { title: "WordPress white screen only", fix: "WordPress debugging", channel: "Ticket" },
  { title: "Outlook buat hal again", fix: "Microsoft 365 troubleshooting", channel: "Live chat" },
  { title: "Phone ringing. Someone on the line.", fix: "Fix while they wait, no pressure (got pressure)", channel: "Call" },
] as const;

export const incident = {
  id: "INC-2026-06",
  title: "The night I deleted SmartRoute.",
  rows: [
    { label: "When", value: "June 2026, night time (of course lah)" },
    { label: "What happened", value: "I terdelete SmartRoute from the server. Not on purpose, ok." },
    { label: "Root cause", value: "Me. Who else." },
    { label: "Time to recover", value: "About 3 hours" },
    { label: "Data lost", value: "Nothing. Dah recover everything. Fuh." },
    { label: "Lesson", value: "Night time, read the command two times before press Enter." },
  ],
  status: "Resolved. SmartRoute dah up balik, scroll up and click it lah.",
} as const;

export const homelab = {
  intro:
    "Why self-host? Budget lah, honestly. I just use what I already got: one Acer laptop, 32 GB RAM, and a lot of free evenings. Everything on this domain runs on it, and it only talks to the internet through an outbound Cloudflare Tunnel, so no ports open. Safe.",
  rack: [
    { unit: "U04", tag: "EDGE", name: "Cloudflare Tunnel", spec: "DNS · WAF", tall: false },
    { unit: "U03", tag: "ROUTING", name: "Nginx Proxy Manager", spec: "1 host per app", tall: false },
    { unit: "U02", tag: "APPS · DOCKER COMPOSE", name: "portfolio · ikango · smartroute", spec: "RHEL 10", tall: true },
    { unit: "U01", tag: "OPS", name: "Uptime Kuma · Netdata · malwatch", spec: "status", tall: false },
  ],
  notes: [
    {
      title: "Watching it",
      body: "Uptime Kuma, Netdata, and a Telegram ping when something tak kena. Live numbers right there.",
    },
    {
      title: "Protecting it",
      body: "SELinux enforcing, firewalld, Fail2ban, Tailscale for admin access, and malwatch, a YARA scanner I wrote in Go.",
    },
    {
      title: "Learning next",
      body: "GitHub Actions to GHCR, then k3s on a KVM guest, then Argo CD. Slowly lah, one by one.",
    },
  ],
  statusHref: "https://uptimekuma.zarep.my",
} as const;

export const ticker = [
  "Fixing things",
  "Linux",
  "Email cannot send",
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
    "Developer and tester at the same time, so I report bugs on my own code. Paiseh. My rule: if it breaks the app, fix first. Cosmetic one, wait your turn.",
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
      "At AMTIS I noticed got no one place to manage our APIs: who calling what, how many times, and whether they should be calling at all. So I built a rule and role-based API gateway for my final-year project. Yes, this is the one I terdelete in June. Dah ok now.",
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
      "My friend is a kaki pancing and wanted a website to collect every fish he catches. He builds the app, I jaga the server: the Next.js client, the fish-recognition model API and the database all run on my laptop.",
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
      "Manual regression and edge-case testing on iOS and Android, written up as test cases and defect reports the developer can actually reproduce, not just \"got bug, pls fix\". No critical defects reached production for the releases I tested.",
    stack: ["Manual testing", "Regression", "STLC", "iOS", "Android"],
    links: [{ label: "Sample defect report", href: "/docs/sample-defect-report.pdf" }],
  },
];

export const alsoBuilt = {
  name: "Internal Management System",
  where: "AMTIS · Sep 2025 — Feb 2026",
  story: "An internal ops platform with Excel import and export that non-technical staff can use on their own. Private one, so no demo. Sorry ah.",
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
  { href: "#work", label: "Work", path: "work" },
  { href: "#helpdesk", label: "Help desk", path: "help-desk" },
  { href: "#homelab", label: "Homelab", path: "homelab" },
  { href: "#experience", label: "Experience", path: "experience" },
] as const;

/** Plain-English versions for the recruiter view (/resume). */
export const resume = {
  summary:
    "IT Support at ServerFreak Technologies in Klang, resolving hosting, email, WordPress, Microsoft 365 and server issues through tickets, live chat and phone. Previously a junior software developer at AMTIS Solutions, building Laravel and Vue.js modules and carrying out manual QA. Runs a self-hosted RHEL server that hosts several live projects.",
  serverfreak: [
    "Resolve customer issues through tickets, live chat and phone, including time-critical calls.",
    "Malware cleanup on compromised websites.",
    "Email delivery, connectivity and mail client troubleshooting.",
    "Server optimisation and SQL tuning; WordPress debugging.",
    "Microsoft 365 suite troubleshooting and account and password support.",
  ],
  projects: [
    {
      name: "SmartRoute",
      meta: "Final-year project · Sep 2025 — Feb 2026",
      body: "Rule and role-based API gateway that centralises API routing, authentication and access control. Laravel 12, Laravel Passport, Google OAuth. Self-hosted with Docker.",
      href: "https://smartroute.zarep.my",
    },
    {
      name: "ikanGO",
      meta: "Server administrator · Ongoing",
      body: "Hosting and operating a friend's fish-collection web app: Next.js client, ONNX image-recognition API and FastAPI with PostgreSQL, each containerised.",
      href: "https://ikango.zarep.my",
    },
    {
      name: "Jerai Hill Resort mobile app",
      meta: "QA · AMTIS · Mar 2026 — May 2026",
      body: "Functional, regression and edge-case testing on iOS and Android, with structured test cases and reproducible defect reports. No critical defects reached production in the releases tested.",
    },
    {
      name: "Self-hosted homelab",
      meta: "Personal · Ongoing",
      body: "RHEL 10 server running Docker Compose behind Cloudflare Tunnel and Nginx Proxy Manager; SELinux, firewalld, Fail2ban and Tailscale; monitored with Uptime Kuma and Netdata. Wrote malwatch, a YARA-based malware scanner in Go.",
      href: "https://zarep.my/#homelab",
    },
  ],
} as const;
