# CRM Manager - Project Setup & Implementation Plan

## Quick Start Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest crm-manager --typescript --tailwind --app --no-src-dir

# 2. Install dependencies
cd crm-manager
npm install prisma @prisma/client
npm install react-hook-form @hookform/resolvers zod
npm install recharts lucide-react clsx tailwind-merge
npm install date-fns

# 3. Install shadcn/ui
npx shadcn-ui@latest init

# 4. Add shadcn components
npx shadcn-ui@latest add button input label select card table dialog form

# 5. Initialize Prisma
npx prisma init --datasource-provider sqlite

# 6. Create database schema (use schema from 06-prisma-schema.prisma)

# 7. Generate Prisma client and create database
npx prisma generate
npx prisma migrate dev --name init

# 8. Run development server
npm run dev
```

## File Creation Checklist

### Phase 1: Core Setup
- [ ] Create Next.js project
- [ ] Configure Tailwind CSS with custom colors
- [ ] Set up Prisma with SQLite
- [ ] Create database schema
- [ ] Run initial migration

### Phase 2: Database & API
- [ ] Create lib/db.ts for database connection
- [ ] Create API routes for all entities
- [ ] Add Zod validation schemas

### Phase 3: UI Components
- [ ] Set up shadcn/ui
- [ ] Create layout components (Sidebar, Header)
- [ ] Create form components
- [ ] Create table components
- [ ] Create dashboard cards

### Phase 4: Pages
- [ ] Dashboard page with charts
- [ ] Projects list page
- [ ] New project form page
- [ ] Project details page
- [ ] Settings pages for lookup data

### Phase 5: Features
- [ ] Search and filter functionality
- [ ] Export to Excel
- [ ] Form validation
- [ ] Error handling

### Phase 6: Polish
- [ ] Add animations
- [ ] Test all functionality
- [ ] Fix bugs
- [ ] Final UI polish

## Environment Variables (.env.local)

```env
# Database
DATABASE_URL="file:./dev.db"

# App
NEXT_PUBLIC_APP_NAME="CRM Manager"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## Scripts to Add to package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        card: "#141414",
        "card-foreground": "#FFFFFF",
        primary: {
          DEFAULT: "#00FF41",
          foreground: "#000000",
          hover: "#00CC33",
        },
        secondary: {
          DEFAULT: "#1C1C1C",
          foreground: "#FFFFFF",
        },
        muted: "#2A2A2A",
        "muted-foreground": "#A0A0A0",
        accent: "#00FF41",
        destructive: "#FF3366",
        border: "#2A2A2A",
        input: "#1C1C1C",
        ring: "#00FF41",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 65, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## Global CSS (app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 100%;
    --card: 0 0% 8%;
    --card-foreground: 0 0% 100%;
    --primary: 123 100% 50%;
    --primary-foreground: 0 0% 0%;
    --secondary: 0 0% 11%;
    --muted: 0 0% 16%;
    --muted-foreground: 0 0% 63%;
    --accent: 123 100% 50%;
    --destructive: 350 100% 60%;
    --border: 0 0% 16%;
    --input: 0 0% 11%;
    --ring: 123 100% 50%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }

  /* Neon glow effect */
  .neon-glow {
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }

  .neon-glow-text {
    text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #141414;
  }

  ::-webkit-scrollbar-thumb {
    background: #2A2A2A;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00FF41;
  }
}
```
