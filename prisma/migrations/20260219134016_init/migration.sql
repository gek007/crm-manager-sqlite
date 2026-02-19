-- CreateTable
CREATE TABLE "projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "projectName" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "serviceTypeId" INTEGER NOT NULL,
    "floors" INTEGER,
    "days" INTEGER,
    "material" TEXT,
    "gasFoodWater" REAL NOT NULL DEFAULT 0,
    "bama" REAL NOT NULL DEFAULT 0,
    "checker" REAL NOT NULL DEFAULT 0,
    "totalCost" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "service_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "employee_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "dayRate" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "employee_prices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "employeeTypeId" INTEGER NOT NULL,
    "workDays" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" REAL NOT NULL DEFAULT 0,
    "byPlan" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "employee_prices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employee_prices_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employee_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cost_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "general_costs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "costTypeId" INTEGER NOT NULL,
    "fromYear" INTEGER NOT NULL,
    "toYear" INTEGER NOT NULL,
    "fromDay" INTEGER NOT NULL,
    "toDay" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "general_costs_costTypeId_fkey" FOREIGN KEY ("costTypeId") REFERENCES "cost_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "projects_projectName_idx" ON "projects"("projectName");

-- CreateIndex
CREATE INDEX "projects_date_idx" ON "projects"("date");

-- CreateIndex
CREATE INDEX "projects_cityId_idx" ON "projects"("cityId");

-- CreateIndex
CREATE INDEX "cities_region_idx" ON "cities"("region");

-- CreateIndex
CREATE INDEX "employee_prices_projectId_idx" ON "employee_prices"("projectId");

-- CreateIndex
CREATE INDEX "general_costs_costTypeId_idx" ON "general_costs"("costTypeId");
