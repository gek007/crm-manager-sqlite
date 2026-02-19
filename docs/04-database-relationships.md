# CRM Manager - Database Relationships & ERD

## Entity Relationship Diagram (ERD)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          PROJECT MANAGEMENT                                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────┐         ┌─────────────┐                                   ║
║  │    City     │         │ServiceType  │                                   ║
║  ├─────────────┤         ├─────────────┤                                   ║
║  │ id (PK)     │         │ id (PK)     │                                   ║
║  │ city        │         │description  │                                   ║
║  │ region      │         │created_at   │                                   ║
║  │ created_at  │         │             │                                   ║
║  └──────┬──────┘         └──────┬──────┘                                   ║
║         │ 1                    │ 1                                        ║
║         │                      │                                          ║
║         │ N                    │ N                                        ║
║         │                      │                                          ║
║         └──────────┬───────────┘                                           ║
║                    │                                                     ║
║                    │ N                                                   ║
║                    │                                                     ║
║         ┌──────────┴─────────────────────────────────┐                   ║
║         │              Project                       │                   ║
║         ├─────────────────────────────────────────────┤                   ║
║         │ id (PK)                                    │                   ║
║         │ date                                       │                   ║
║         │ project_name                               │                   ║
║         │ city_id (FK) ──────────────┐              │                   ║
║         │ address                    │              │                   ║
║         │ service_type_id (FK)       │              │                   ║
║         │ floors                     │              │                   ║
║         │ days                       │              │                   ║
║         │ material                   │              │                   ║
║         │ gas_food_water             │              │                   ║
║         │ bama                       │              │                   ║
║         │ checker                    │              │                   ║
║         │ total_cost                 │              │                   ║
║         │ created_at                 │              │                   ║
║         │ updated_at                 │              │                   ║
║         └─────────────────────────────┘              │                   ║
║                          │ 1                         │                   ║
║                          │                           │                   ║
║                          │ N                         │ N                 ║
║                          │                           │                   ║
║         ┌────────────────┴───────────┐  ┌───────────┴─────────────┐     ║
║         │       EmployeePrice        │  │    EmployeeType         │     ║
║         ├────────────────────────────┤  ├─────────────────────────┤     ║
║         │ id (PK)                    │  │ id (PK)                │     ║
║         │ project_id (FK)            │  │ description            │     ║
║         │ employee_type_id (FK) ─────┼──│ day_rate               │     ║
║         │ work_days                  │  │ created_at             │     ║
║         │ total_price                │  └─────────────────────────┘     ║
║         │ by_plan (1=plan, 2=mistake)│                               ║
║         │ created_at                 │                               ║
║         │ updated_at                 │                               ║
║         └────────────────────────────┘                               ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝


          ╔══════════════════════════════════════════════════════════════════╗
          ║              GENERAL COSTS (Independent)                         ║
          ╠══════════════════════════════════════════════════════════════════╣
          ║                                                                ║
          ║   ┌─────────────┐         ┌─────────────┐                      ║
          ║   │  CostType   │    ───▶  │ GeneralCost │                      ║
          ║   ├─────────────┤    1   N ├─────────────┤                      ║
          ║   │ id (PK)     │ ──────────│ id (PK)     │                      ║
          ║   │description  │           │cost_type_id │                      ║
          ║   │created_at   │           │from_year    │                      ║
          ║   │             │           │to_year      │                      ║
          ║   │             │           │from_day     │                      ║
          ║   │             │           │to_day       │                      ║
          ║   │             │           │total        │                      ║
          ║   │             │           │created_at   │                      ║
          ║   │             │           │updated_at   │                      ║
          ║   └─────────────┘           └─────────────┘                      ║
          ║                                                                ║
          ╚══════════════════════════════════════════════════════════════════╝
```

## Relationship Flow

```
City       ──(1:N)──┐
ServiceType──(1:N)──┼──► Project ──(1:N)── EmployeePrice ──(N:1)── EmployeeType
                      │
                      └── No direct relationship to EmployeeType
```

## Relationship Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| City → Project | One-to-Many | One city can have many projects |
| ServiceType → Project | One-to-Many | One service type can be used in many projects |
| Project → EmployeePrice | One-to-Many | One project can have many employee prices |
| EmployeeType → EmployeePrice | One-to-Many | One employee type can have many price records |
| CostType → GeneralCost | One-to-Many | One cost type can have many general cost records |

## Important Notes

**NO Direct Relationships:**
- ❌ EmployeeType ↔ Project (they connect through EmployeePrice only)
- ❌ EmployeeType ↔ City
- ❌ CostType ↔ Project
- ❌ CostType ↔ EmployeePrice

**EmployeeType** is a lookup table that stores employee types with their daily rates. It only connects to **EmployeePrice**.

## EmployeePrice Fields

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key |
| project_id | INTEGER | Foreign Key to Project |
| employee_type_id | INTEGER | Foreign Key to EmployeeType |
| work_days | INTEGER | Number of work days |
| total_price | DECIMAL | Total price (work_days × day_rate) |
| by_plan | INTEGER | 1 = by plan, 2 = by mistake |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Indexes

| Table | Index Name | Columns | Type |
|-------|------------|---------|------|
| Project | idx_project_name | project_name | INDEX |
| Project | idx_project_date | date | INDEX |
| Project | idx_city_id | city_id | INDEX |
| City | idx_city_region | region | INDEX |
| EmployeePrice | idx_project_id | project_id | INDEX |
| GeneralCost | idx_cost_type_id | cost_type_id | INDEX |
