# Zarif Nur Aiman — Portfolio

Personal site for **Zarif Nur Aiman Bin Khairul Bahri**, Graduate QA Engineer in Johor, Malaysia. Single page covering experience, selected work, skills, education, and contact, with a downloadable CV and a sample defect report.

**Open to QA and software quality roles.**  
[LinkedIn](https://www.linkedin.com/in/zarif-nur-aiman) · [GitHub](https://github.com/aimanzarif) · [Email](mailto:zarif@zarep.my)

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- React 19, TypeScript, Tailwind CSS v4
- Motion for interaction
- Docker for production

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy and content live in `lib/profile.ts`. Static files (photo, CV, sample defect report) live in `public/`.

## Docker

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000).

For a public URL (Open Graph / share card), rebuild with:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com docker compose up --build -d
```

`NEXT_PUBLIC_SITE_URL` is baked in at **build** time. Changing the domain later requires a rebuild.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
