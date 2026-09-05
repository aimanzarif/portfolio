export const profile = {
  name: "Zarif Nur Aiman Bin Khairul Bahri",
  shortName: "Zarif Nur Aiman",
  firstName: "Zarif",
  title: "Graduate QA Engineer",
  location: "Johor, Malaysia",
  phone: "+60 11-19167843",
  phoneHref: "tel:+601119167843",
  email: "zarif@zarep.my",
  linkedin: "https://www.linkedin.com/in/zarif-nur-aiman",
  linkedinLabel: "linkedin.com/in/zarif-nur-aiman",
  github: "https://github.com/aimanzarif",
  githubLabel: "github.com/aimanzarif",
  cvHref: "/docs/zarif-nur-aiman-cv.pdf",
  cvLabel: "Download CV",
  availability: "Open to QA and software quality roles",
  summary:
    "Information Systems Engineering graduate with a 3.56 CGPA and CPRE certification, following a one-year internship delivering manual testing, REST API development, and requirements documentation across six concurrent projects at AMTIS Solutions, a Malaysian software house. Experienced in writing structured test cases, logging defect reports, and validating API behaviour using Postman and Laravel within Agile SDLC/STLC workflows and GitLab-based version control. Looking to bring a detail-oriented QA mindset into a growth environment and develop test automation skills in Playwright and TypeScript.",
  roles: [
    "Manual Testing",
    "API Testing",
    "Requirements Engineering",
    "Full-Stack Delivery",
  ],
  stats: [
    { number: 3.56, decimalPlaces: 2, suffix: "", label: "Bachelor CGPA", hint: "Dean's List · 2 semesters" },
    { number: 6, decimalPlaces: 0, suffix: "", label: "Concurrent projects", hint: "AMTIS internship" },
    { number: 50, decimalPlaces: 0, suffix: "+", label: "Test cases logged", hint: "Jerai Hill mobile app" },
    { number: 1, decimalPlaces: 0, suffix: " yr", label: "Industry experience", hint: "Junior Software Developer" },
  ],
  highlights: [
    {
      number: 40,
      prefix: "~",
      suffix: "%",
      title: "Faster reporting",
      detail:
        "Automated Excel export pipelines on the YMBI client project, cutting manual reporting time.",
    },
    {
      number: 30,
      prefix: "~",
      suffix: "%",
      title: "Fewer change requests",
      detail:
        "CPRE-aligned SRS, URS, and API specs across four projects reduced stakeholder churn during development.",
    },
    {
      number: 50,
      prefix: "~",
      suffix: "%",
      title: "Less manual data entry",
      detail:
        "Configurable Excel import with real-time validation let clients bulk-upload structured data independently.",
    },
    {
      number: 0,
      prefix: "",
      suffix: "",
      title: "Critical escapes",
      detail:
        "Pre-release regression and edge-case testing on Jerai Hill supported zero critical defects in production.",
    },
  ],
} as const;

export const experience = {
  role: "Junior Software Developer",
  company: "AMTIS Solutions Sdn. Bhd.",
  period: "March 2025 — March 2026",
  location: "Malaysia",
  bullets: [
    "Engineered 3 full-stack web modules for the YMBI client project using Laravel, Vue.js, and MySQL, reducing manual reporting time by approximately 40% through automated Excel export pipelines built with Maatwebsite.",
    "Executed end-to-end manual testing across iOS and Android platforms for the Jerai Hill project, documenting over 50 test cases and defects using structured STLC processes, achieving a defect detection rate that supported on-time UAT sign-off.",
    "Produced comprehensive technical documentation including SRS, URS, and API specifications across 4 concurrent projects, applying CPRE-certified requirements engineering practices that reduced stakeholder change requests during development by approximately 30%.",
    "Collaborated across 6 concurrent project streams including FlutterFlow frontend development (ASWARA LMS), stakeholder engagement (Digital Masjid), and developer training delivery, demonstrating cross-functional delivery within a structured modified waterfall SDLC environment.",
    "Developed dynamic Excel import functionality using Maatwebsite with configurable column mapping logic in Laravel, enabling clients to bulk-upload structured data with real-time validation and reducing manual data entry effort by an estimated 50%.",
  ],
} as const;

export const projects = [
  {
    id: "gateway",
    name: "Rule-Based API Gateway",
    period: "September 2025 — February 2026",
    stack: ["Laravel", "GitHub Actions", "DigitalOcean VPS", "OAuth"],
    kind: "Engineering",
    summary:
      "A centralised, role-based API gateway that secures routing across internal services with OAuth, CI/CD, and production-grade documentation.",
    bullets: [
      "Developed a rule-based, role-based API gateway using Laravel to centralise and secure API routing across multiple internal services, enforcing authentication and access control across all registered endpoints.",
      "Delivered a fully documented system accepted as an MJCS 2025 journal paper submission, with complete SRS and API documentation covering endpoint specifications, authentication flows, and business rules.",
      "Used GitHub Actions to implement a CI/CD pipeline with automated deployment to DigitalOcean VPS, enabling zero-downtime production releases.",
      "Applied Laravel Passport for OAuth-based API authentication in a live production environment, enforcing token-based access control across gateway endpoints to secure inter-service communication.",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aimanzarif/fyp-api-gateway",
      },
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
    id: "ims",
    name: "Internal Management System",
    period: "September 2025 — February 2026",
    stack: ["Laravel", "Vue.js", "MySQL", "Shadcn UI"],
    kind: "Full-stack",
    summary:
      "Full-stack internal operations platform covering the SDLC from requirements through production, with self-serve Excel data workflows.",
    bullets: [
      "Developed full-stack features using Laravel as the backend, Vue.js with Shadcn UI as the frontend, and MySQL as the database, covering the full SDLC from requirements gathering to production deployment.",
      "Delivered dynamic Excel import and export functionality with configurable column mapping using Maatwebsite, enabling non-technical users to upload and process structured data independently.",
      "Used GitLab for version control and collaborative development, maintaining a structured branching strategy and conducting peer code reviews across a multi-developer team.",
    ],
  },
  {
    id: "jerai",
    name: "Jerai Hill Resort",
    period: "March 2026 — May 2026",
    stack: ["Manual Testing", "iOS", "Android", "STLC"],
    kind: "QA",
    summary:
      "Structured mobile QA for a cross-platform resort app, with regression discipline that kept critical defects out of production.",
    links: [
      {
        label: "Sample defect report",
        href: "/docs/sample-defect-report.pdf",
      },
    ],
    bullets: [
      "Designed and executed structured manual test cases covering functional, regression, and exploratory scenarios for a cross-platform mobile application across iOS and Android devices.",
      "Contributed to zero critical defects escaping to production across all tested releases through thorough pre-release regression testing and edge-case validation, following a modified waterfall delivery process.",
      "Used structured Excel-based test logs to document defect reports with steps to reproduce, screenshots, and expected vs. actual results, supporting faster developer resolution and clear audit trails.",
      "Applied STLC principles across multiple test cycles, validating UI consistency, navigation flows, and cross-device behaviour across varying screen sizes and OS versions.",
    ],
  },
] as const;

export const skillGroups = [
  {
    id: "qa",
    label: "Testing & QA",
    items: [
      "Manual Testing",
      "Regression Testing",
      "Exploratory Testing",
      "API Testing",
      "Test Case Authoring",
      "Defect Reporting",
      "SDLC",
      "STLC",
    ],
  },
  {
    id: "languages",
    label: "Languages",
    items: ["PHP", "JavaScript", "TypeScript (basic)", "SQL"],
  },
  {
    id: "web",
    label: "Web & Frameworks",
    items: ["Laravel", "Vue.js", "Tailwind CSS", "HTML", "CSS", "Shadcn UI"],
  },
  {
    id: "api",
    label: "API & Backend",
    items: ["RESTful APIs", "Postman", "Scramble", "Laravel Passport (OAuth)"],
  },
  {
    id: "devops",
    label: "DevOps & VCS",
    items: ["Git", "GitHub Actions (CI/CD)", "GitLab", "Nginx", "DigitalOcean VPS"],
  },
  {
    id: "docs",
    label: "Documentation",
    items: ["SRS", "URS", "STD", "Microsoft Excel", "Microsoft Word", "StarUML"],
  },
] as const;

export const education = [
  {
    school: "Universiti Teknologi MARA (UiTM)",
    credential:
      "Bachelor of Information System Engineering (Hons.) Information Systems Engineering",
    year: "2026",
    cgpa: 3.56,
    deansList: 2,
    meta: "CGPA 3.56 · Dean's List for two semesters",
  },
  {
    school: "Universiti Teknologi MARA (UiTM)",
    credential: "Diploma in Computer Science",
    year: "2023",
    cgpa: 3.72,
    deansList: 3,
    meta: "CGPA 3.72 · Dean's List for three semesters",
  },
] as const;

export const certifications = [
  {
    name: "Certified Professional Requirements Engineer Foundation Level (CPRE-FL)",
    year: "2024",
    meta: "Certification ID: MY-CPRE-FL-2024-00036",
  },
  {
    name: "Microsoft Full-Stack Developer Professional Certificate",
    year: "Ongoing",
    meta: "In progress",
  },
] as const;

export const languages = [
  { name: "Bahasa Malaysia", level: "Native", proficiency: 100 },
  { name: "English", level: "Conversational", proficiency: 72 },
] as const;

export const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;
