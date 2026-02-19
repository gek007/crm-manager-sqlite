# CRM Manager - UI/UX Design Specification

## Design Theme: Dark Neon

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background Primary** | Deep Black | `#0A0A0A` | Main page background |
| **Background Secondary** | Dark Gray | `#141414` | Cards, panels |
| **Background Tertiary** | Medium Dark | `#1C1C1C` | Form inputs, dropdowns |
| **Accent Primary** | Neon Green | `#00FF41` | Primary buttons, active states |
| **Accent Hover** | Bright Green | `#00CC33` | Hover states |
| **Accent Glow** | Green Glow | `rgba(0, 255, 65, 0.3)` | Shadows, glows |
| **Text Primary** | White | `#FFFFFF` | Main text |
| **Text Secondary** | Light Gray | `#A0A0A0` | Secondary text |
| **Text Muted** | Gray | `#6B7280` | Muted text |
| **Border** | Dark Border | `#2A2A2A` | Borders, dividers |
| **Error** | Neon Red | `#FF3366` | Errors, delete |
| **Warning** | Neon Orange | `#FF9500` | Warnings |
| **Success** | Neon Green | `#00FF41` | Success messages |
| **Info** | Neon Blue | `#00D4FF` | Information |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| **H1 - Page Title** | Inter | 32px | 700 |
| **H2 - Section Title** | Inter | 24px | 600 |
| **H3 - Card Title** | Inter | 18px | 600 |
| **Body** | Inter | 14px | 400 |
| **Small/Caption** | Inter | 12px | 400 |
| **Button** | Inter | 14px | 500 |

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius
- Small: 4px (inputs, buttons)
- Medium: 8px (cards)
- Large: 16px (modals)

### Shadows
- Neon Glow: `0 0 20px rgba(0, 255, 65, 0.3)`
- Card: `0 4px 6px rgba(0, 0, 0, 0.5)`
- Elevated: `0 10px 25px rgba(0, 0, 0, 0.7)`

---

## Layout Structure

### Main Layout
```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
│  [Logo] CRM Manager    [Search]     [New Project]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SIDEBAR          MAIN CONTENT                      │
│  ┌──────────┐    ┌─────────────────────────────┐   │
│  │ Dashboard│    │                             │   │
│  │ Projects │    │    Page Content             │   │
│  │ Cities   │    │                             │   │
│  │          │    │                             │   │
│  │ Settings │    │                             │   │
│  │          │    │                             │   │
│  └──────────┘    └─────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Navigation
- **Sidebar**: Fixed width 240px, collapsible on mobile
- **Header**: Fixed height 64px
- **Main**: Scrollable content area

---

## Page Designs

### 1. Dashboard Page

```
┌───────────────────────────────────────────────────────────────────┐
│  Stats Cards Row                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Total    │ │ Active   │ │ Completed│ │ Total    │              │
│  │ Projects │ │ Projects │ │ Projects │ │ Revenue  │              │
│  │ 24       │ │ 8        │ │ 16       │ │ $124,500 │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
├───────────────────────────────────────────────────────────────────┤
│  Charts Row                                                         │
│  ┌──────────────────────────┐ ┌──────────────────────────┐        │
│  │ Projects by Service Type │ │ Revenue by Month         │        │
│  │     [Pie Chart]          │ │     [Bar Chart]          │        │
│  └──────────────────────────┘ └──────────────────────────┘        │
├───────────────────────────────────────────────────────────────────┤
│  Recent Projects Table                                              │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ID │ Name        │ City    │ Status   │ Cost      │ Actions│  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ 001 │ Alpha Tower │ Dubai   │ Active   │ $12,500   │ View  │  │
│  │ 002 │ Delta Bldg  │ Abu Dhabi│ Done   │ $8,200    │ View  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### 2. Projects List Page

```
┌───────────────────────────────────────────────────────────────────┐
│  [Search Projects] [Filter ▼] [Export ▼]           [+ New Project]│
├───────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ ID │ Name        │ City    │ Service  │ Days   │ Cost    │   │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ 001 │ Alpha Tower │ Dubai   │ Flooring │ 15    │ $12,500 │   │  │
│  │ 002 │ Delta Bldg  │ Abu Dhabi│ Paint  │ 8     │ $8,200  │   │  │
│  │ 003 │ Gamma Hall  │ Riyadh  │ Electric│ 22    │ $18,600 │   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  [Previous] Page 1 of 3 [Next]                                    │
└───────────────────────────────────────────────────────────────────┘
```

### 3. New Project Form (Multi-step)

```
┌───────────────────────────────────────────────────────────────────┐
│  New Project                                   Step 1 of 3        │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Basic Information                                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Project Name *                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ Enter project name...                                    │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  │                                                               │  │
│  │ Date *              City *                   Service Type *   │  │
│  │ ┌──────────────┐    ┌──────────────┐       ┌──────────────┐ │  │
│  │ │ Pick date    │    │ Select city  │       │ Select type  │ │  │
│  │ └──────────────┘    └──────────────┘       └──────────────┘ │  │
│  │                                                               │  │
│  │ Address *                                                      │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ Enter full address...                                    │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Floors          Days            Material                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐    │
│  │          │    │          │    │                          │    │
│  └──────────┘    └──────────┘    └──────────────────────────┘    │
│                                                                    │
│  Gas/Food/Water     Bama            Checker                        │
│  ┌──────────────┐  ┌──────────┐    ┌──────────┐                   │
│  │              │  │          │    │          │                   │
│  └──────────────┘  └──────────┘    └──────────┘                   │
│                                                                    │
│                    [Previous]    [Next Step]                       │
└───────────────────────────────────────────────────────────────────┘
```

### 4. Project Details Page

```
┌───────────────────────────────────────────────────────────────────┐
│  Alpha Tower (PRJ-001)                      [Edit] [Delete]       │
├───────────────────────────────────────────────────────────────────┤
│  Overview                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ City: Dubai      Service: Flooring      Status: Active       │  │
│  │ Address: Sheikh Zayed Road, Building 45                      │  │
│  │ Floors: 12    Days: 15    Material: Imported                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Costs Summary                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Employee Costs    $8,500                                      │  │
│  │ Materials         $3,000                                      │  │
│  │ Additional Work   $1,000                                      │  │
│  │ ─────────────────────────────                                 │  │
│  │ Total Cost        $12,500                                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Employee Prices                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Type           Days      Rate       Total                    │  │
│  │ Technician      10       $200       $2,000    [Edit] [Del]  │  │
│  │ Laborer         15       $150       $2,250    [Edit] [Del]  │  │
│  │ [+ Add Employee Price]                                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Additional Work                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Type           By Plan    Days      Total                    │  │
│  │ Extra Paint    Yes       3         $450      [Edit] [Del]  │  │
│  │ [+ Add Additional Work]                                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## Components Specification

### Button
- **Primary**: Neon green background, black text, glow on hover
- **Secondary**: Transparent border, neon green text
- **Danger**: Neon red background
- **Size**: sm (32px), md (40px), lg (48px)

### Input
- Dark background (#1C1C1C)
- Green border on focus
- 4px border radius
- Neon glow on focus

### Card
- Dark background (#141414)
- 8px border radius
- Subtle shadow

### Table
- Row hover with green tint
- Neon green accent for active rows
- Sortable headers with icons

### Modal
- Center overlay with blur
- Dark background card
- Green border top

---

## Responsive Design

| Screen | Sidebar | Cards | Table |
|--------|---------|-------|-------|
| **Desktop (>1024px)** | Full | 4 columns | Full |
| **Tablet (768-1024px)** | Collapsed | 2 columns | Stacked |
| **Mobile (<768px)** | Hidden | 1 column | Cards |

---

## Accessibility

- Keyboard navigation support
- ARIA labels for all interactive elements
- Focus visible with neon green outline
- High contrast text (WCAG AAA)
- Screen reader compatible

---

## Animation & Micro-interactions

1. **Page Load**: Fade in (300ms)
2. **Hover**: Glow effect (200ms)
3. **Button Click**: Scale down (50ms)
4. **Modal**: Scale up with fade (300ms)
5. **Form Success**: Green flash (200ms)

---

## Icon Set (Lucide Icons)

- Dashboard: `layout-dashboard`
- Projects: `building-2`
- Cities: `map-pin`
- Settings: `settings`
- Plus: `plus`
- Edit: `pencil`
- Delete: `trash-2`
- Search: `search`
- Filter: `filter`
- Export: `download`
- Chevron: `chevron-right`
