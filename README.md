This app is a Next.js project with Prisma + SQLite.

After cloning:

```bash
git clone … && cd crm-manager-sqlite
npm install          # copies .env from .env.example if missing; runs prisma generate (do not use --ignore-scripts)
npm run db:deploy    # creates SQLite DB and applies migrations
npm run dev
```

Then open http://localhost:3000 (or the URL printed in the terminal).

Optional: `npm run db:seed` to load seed data.
