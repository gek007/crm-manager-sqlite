# CRM Manager - Architecture & Tech Stack

## Project Overview
A modern CRM web application for managing construction projects with dark neon theme UI, built as a single-user local application.

---

## 1. Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js 15** | React framework with App Router | 15.x |
| **TypeScript** | Type-safe development | 5.x |
| **Tailwind CSS** | Utility-first styling | 3.x |
| **shadcn/ui** | Reusable UI components | Latest |
| **React Hook Form** | Form management | 7.x |
| **Zod** | Schema validation | 3.x |
| **Recharts** | Data visualization | 2.x |
| **Lucide Icons** | Icon library | Latest |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Backend API | Built-in |
| **Prisma ORM** | Database toolkit | 5.x |
| **SQLite** | Local database | 3.x |
| **Zod** | Input validation | 3.x |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **husky** | Git hooks |

---

## 2. Architecture

### Project Structure
```
crm-manager/
├── app/
│   ├── api/                 # API routes
│   │   ├── projects/        # Project CRUD endpoints
│   │   ├── cities/          # City endpoints
│   │   ├── service-types/   # Service type endpoints
│   │   ├── employee-types/  # Employee type endpoints
│   │   ├── employee-prices/ # Employee price endpoints
│   │   ├── general-costs/   # General cost endpoints
│   │   └── cost-types/      # Cost type endpoints
│   ├── dashboard/           # Dashboard page
│   ├── projects/            # Projects pages
│   │   ├── page.tsx         # Projects list
│   │   ├── new/page.tsx     # New project form
│   │   └── [id]/page.tsx    # Project details
│   ├── settings/            # Settings page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home/redirect
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   ├── projects/            # Project components
│   ├── forms/               # Form components
│   └── layout/              # Layout components
├── lib/
│   ├── db.ts                # Database connection
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── types/                   # TypeScript types
└── public/                  # Static assets
```

### Data Flow
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│ Next.js App  │────▶│   SQLite    │
│  (Next.js)  │◀────│   (API)      │◀────│  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## 3. API Design

### RESTful Endpoints

#### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/[id]` | Get project by ID |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

#### Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities` | List all cities |
| POST | `/api/cities` | Create city |
| PUT | `/api/cities/[id]` | Update city |
| DELETE | `/api/cities/[id]` | Delete city |

#### Service Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/service-types` | List all service types |
| POST | `/api/service-types` | Create service type |
| PUT | `/api/service-types/[id]` | Update service type |
| DELETE | `/api/service-types/[id]` | Delete service type |

#### Employee Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employee-types` | List all employee types |
| POST | `/api/employee-types` | Create employee type |
| PUT | `/api/employee-types/[id]` | Update employee type |
| DELETE | `/api/employee-types/[id]` | Delete employee type |

#### Employee Prices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employee-prices?projectId=[id]` | Get prices by project |
| POST | `/api/employee-prices` | Create employee price |
| PUT | `/api/employee-prices/[id]` | Update employee price |
| DELETE | `/api/employee-prices/[id]` | Delete employee price |

#### General Costs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/general-costs` | List all general costs |
| POST | `/api/general-costs` | Create general cost |
| PUT | `/api/general-costs/[id]` | Update general cost |
| DELETE | `/api/general-costs/[id]` | Delete general cost |

#### Cost Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cost-types` | List all cost types |
| POST | `/api/cost-types` | Create cost type |
| PUT | `/api/cost-types/[id]` | Update cost type |
| DELETE | `/api/cost-types/[id]` | Delete cost type |

#### Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/excel` | Export to Excel |
| GET | `/api/export/pdf` | Export to PDF |

---

## 4. Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **SQL Injection**: Prevented by Prisma ORM
3. **Error Handling**: Proper error messages without exposing sensitive data
4. **CORS**: Configured for local development only

---

## 5. Performance Optimizations

1. **React Server Components** for faster initial load
2. **Prisma query optimization** with `select` for specific fields
3. **Image optimization** using Next.js Image component
4. **Code splitting** with dynamic imports

---

## 6. Development Workflow

1. Setup Next.js project with TypeScript
2. Configure Prisma with SQLite
3. Design and create database schema
4. Set up shadcn/ui components
5. Create API routes
6. Build UI components
7. Implement dashboard with charts
8. Add export functionality
9. Testing and refinement

---

## 7. Deployment (Local)

1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate`
3. Run migrations: `npx prisma migrate dev`
4. Start dev server: `npm run dev`
5. Open: `http://localhost:3000`

---

## 8. Future Enhancements (Optional)

- [ ] User authentication
- [ ] Role-based access control
- [ ] PostgreSQL migration support
- [ ] Cloud deployment option
- [ ] Arabic/English language support
- [ ] Advanced reporting
- [ ] Mobile app
