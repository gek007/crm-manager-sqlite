import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { join } from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST() {
  try {
    // Get current date for folder name
    const now = new Date();
    const dateFolder = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' +
                      now.toTimeString().split(' ')[0].replace(/:/g, '-');

    // Create Excel directory with date subfolder
    const excelDir = join(process.cwd(), 'excel', dateFolder);
    if (!existsSync(excelDir)) {
      await mkdir(excelDir, { recursive: true });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Fetch all data with explicit typed queries
    const [projects, cities, serviceTypes, employeeTypes, employeePrices, costTypes, generalCosts] =
      await Promise.all([
        prisma.project.findMany({ include: { city: true, serviceType: true, employeePrices: { include: { employeeType: true } } } }),
        prisma.city.findMany(),
        prisma.serviceType.findMany(),
        prisma.employeeType.findMany(),
        prisma.employeePrice.findMany({ include: { project: true, employeeType: true } }),
        prisma.costType.findMany(),
        prisma.generalCost.findMany({ include: { costType: true } }),
      ]);

    const data = {
      projects,
      cities,
      service_types: serviceTypes,
      employee_types: employeeTypes,
      employee_prices: employeePrices,
      cost_types: costTypes,
      general_costs: generalCosts,
    };

    // Create schema sheet
    const schemaSheet = workbook.addWorksheet('Schema');
    schemaSheet.columns = [
      { header: 'Table Name', key: 'table', width: 30 },
      { header: 'Column Name', key: 'column', width: 25 },
      { header: 'Data Type', key: 'type', width: 15 },
      { header: 'Required', key: 'required', width: 10 },
      { header: 'Description', key: 'description', width: 40 },
    ];

    // Add schema info
    const schemaData = [
      // Projects
      { table: 'projects', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'projects', column: 'date', type: 'DATETIME', required: 'YES', description: 'Project start date' },
      { table: 'projects', column: 'projectName', type: 'VARCHAR', required: 'YES', description: 'Name of the project' },
      { table: 'projects', column: 'cityId', type: 'INTEGER', required: 'YES', description: 'FK -> cities.id' },
      { table: 'projects', column: 'address', type: 'VARCHAR', required: 'YES', description: 'Project address' },
      { table: 'projects', column: 'serviceTypeId', type: 'INTEGER', required: 'YES', description: 'FK -> service_types.id' },
      { table: 'projects', column: 'floors', type: 'INTEGER', required: 'NO', description: 'Number of floors' },
      { table: 'projects', column: 'days', type: 'INTEGER', required: 'NO', description: 'Expected work days' },
      { table: 'projects', column: 'material', type: 'VARCHAR', required: 'NO', description: 'Material type' },
      { table: 'projects', column: 'gasFoodWater', type: 'FLOAT', required: 'NO', description: 'Gas/Food/Water cost' },
      { table: 'projects', column: 'bama', type: 'FLOAT', required: 'NO', description: 'Bama cost' },
      { table: 'projects', column: 'checker', type: 'FLOAT', required: 'NO', description: 'Checker cost' },
      { table: 'projects', column: 'totalPaid', type: 'FLOAT', required: 'NO', description: 'Total amount paid (user-entered)' },
      { table: 'projects', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },
      { table: 'projects', column: 'updatedAt', type: 'DATETIME', required: 'YES', description: 'Last update timestamp' },

      // Cities
      { table: 'cities', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'cities', column: 'city', type: 'VARCHAR', required: 'YES', description: 'City name' },
      { table: 'cities', column: 'region', type: 'VARCHAR', required: 'NO', description: 'Region name' },
      { table: 'cities', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },

      // Service Types
      { table: 'service_types', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'service_types', column: 'description', type: 'VARCHAR', required: 'YES', description: 'Service description' },
      { table: 'service_types', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },

      // Employee Types
      { table: 'employee_types', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'employee_types', column: 'description', type: 'VARCHAR', required: 'YES', description: 'Employee type description' },
      { table: 'employee_types', column: 'dayRate', type: 'FLOAT', required: 'YES', description: 'Cost per day' },
      { table: 'employee_types', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },

      // Employee Prices
      { table: 'employee_prices', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'employee_prices', column: 'projectId', type: 'INTEGER', required: 'YES', description: 'FK -> projects.id' },
      { table: 'employee_prices', column: 'employeeTypeId', type: 'INTEGER', required: 'YES', description: 'FK -> employee_types.id' },
      { table: 'employee_prices', column: 'workDays', type: 'INTEGER', required: 'NO', description: 'Number of work days' },
      { table: 'employee_prices', column: 'totalPrice', type: 'FLOAT', required: 'NO', description: 'Total price (work_days * day_rate)' },
      { table: 'employee_prices', column: 'byPlan', type: 'INTEGER', required: 'YES', description: '1 = by plan, 2 = by mistake' },
      { table: 'employee_prices', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },
      { table: 'employee_prices', column: 'updatedAt', type: 'DATETIME', required: 'YES', description: 'Last update timestamp' },

      // Cost Types
      { table: 'cost_types', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'cost_types', column: 'description', type: 'VARCHAR', required: 'YES', description: 'Cost type description' },
      { table: 'cost_types', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },

      // General Costs
      { table: 'general_costs', column: 'id', type: 'INTEGER', required: 'YES', description: 'Primary Key' },
      { table: 'general_costs', column: 'costTypeId', type: 'INTEGER', required: 'YES', description: 'FK -> cost_types.id' },
      { table: 'general_costs', column: 'fromYear', type: 'INTEGER', required: 'YES', description: 'Start year' },
      { table: 'general_costs', column: 'toYear', type: 'INTEGER', required: 'YES', description: 'End year' },
      { table: 'general_costs', column: 'fromDay', type: 'INTEGER', required: 'YES', description: 'Start day' },
      { table: 'general_costs', column: 'toDay', type: 'INTEGER', required: 'YES', description: 'End day' },
      { table: 'general_costs', column: 'total', type: 'FLOAT', required: 'YES', description: 'Total cost amount' },
      { table: 'general_costs', column: 'createdAt', type: 'DATETIME', required: 'YES', description: 'Creation timestamp' },
      { table: 'general_costs', column: 'updatedAt', type: 'DATETIME', required: 'YES', description: 'Last update timestamp' },
    ];

    schemaSheet.addRows(schemaData);

    // Create data sheets for each table
    // Projects Sheet
    const projectsSheet = workbook.addWorksheet('Projects');
    projectsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Project Name', key: 'projectName', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Floors', key: 'floors', width: 10 },
      { header: 'Days', key: 'days', width: 10 },
      { header: 'Material', key: 'material', width: 20 },
      { header: 'Gas/Food/Water', key: 'gasFoodWater', width: 15 },
      { header: 'Bama', key: 'bama', width: 15 },
      { header: 'Checker', key: 'checker', width: 15 },
      { header: 'Total Paid', key: 'totalPaid', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    data.projects.forEach((p) => {
      projectsSheet.addRow({
        id: p.id,
        projectName: p.projectName,
        date: new Date(p.date).toLocaleDateString(),
        city: p.city?.city || '',
        address: p.address,
        serviceType: p.serviceType?.description || '',
        floors: p.floors || '',
        days: p.days || '',
        material: p.material || '',
        gasFoodWater: p.gasFoodWater,
        bama: p.bama,
        checker: p.checker,
        totalPaid: p.totalPaid,
        createdAt: new Date(p.createdAt).toLocaleString(),
      });
    });

    // Employee Prices Sheet
    const empPricesSheet = workbook.addWorksheet('Employee Prices');
    empPricesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Project', key: 'project', width: 30 },
      { header: 'Employee Type', key: 'employeeType', width: 20 },
      { header: 'Day Rate', key: 'dayRate', width: 12 },
      { header: 'Work Days', key: 'workDays', width: 12 },
      { header: 'Total Price', key: 'totalPrice', width: 15 },
      { header: 'By Plan', key: 'byPlan', width: 12 },
    ];

    data.employee_prices.forEach((ep) => {
      empPricesSheet.addRow({
        id: ep.id,
        project: ep.project?.projectName || '',
        employeeType: ep.employeeType?.description || '',
        dayRate: ep.employeeType?.dayRate || 0,
        workDays: ep.workDays,
        totalPrice: ep.totalPrice,
        byPlan: ep.byPlan === 1 ? 'By Plan' : 'By Mistake',
      });
    });

    // Cities Sheet
    const citiesSheet = workbook.addWorksheet('Cities');
    citiesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'City', key: 'city', width: 25 },
      { header: 'Region', key: 'region', width: 25 },
    ];
    data.cities.forEach((c) => {
      citiesSheet.addRow({ id: c.id, city: c.city, region: c.region || '' });
    });

    // Service Types Sheet
    const serviceTypesSheet = workbook.addWorksheet('Service Types');
    serviceTypesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Description', key: 'description', width: 40 },
    ];
    data.service_types.forEach((st) => {
      serviceTypesSheet.addRow({ id: st.id, description: st.description });
    });

    // Employee Types Sheet
    const empTypesSheet = workbook.addWorksheet('Employee Types');
    empTypesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Day Rate', key: 'dayRate', width: 15 },
    ];
    data.employee_types.forEach((et) => {
      empTypesSheet.addRow({ id: et.id, description: et.description, dayRate: et.dayRate });
    });

    // Cost Types Sheet
    const costTypesSheet = workbook.addWorksheet('Cost Types');
    costTypesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Description', key: 'description', width: 40 },
    ];
    data.cost_types.forEach((ct) => {
      costTypesSheet.addRow({ id: ct.id, description: ct.description });
    });

    // General Costs Sheet
    const generalCostsSheet = workbook.addWorksheet('General Costs');
    generalCostsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Cost Type', key: 'costType', width: 25 },
      { header: 'From Year', key: 'fromYear', width: 12 },
      { header: 'To Year', key: 'toYear', width: 12 },
      { header: 'From Day', key: 'fromDay', width: 12 },
      { header: 'To Day', key: 'toDay', width: 12 },
      { header: 'Total', key: 'total', width: 15 },
    ];
    data.general_costs.forEach((gc) => {
      generalCostsSheet.addRow({
        id: gc.id,
        costType: gc.costType?.description || '',
        fromYear: gc.fromYear,
        toYear: gc.toYear,
        fromDay: gc.fromDay,
        toDay: gc.toDay,
        total: gc.total,
      });
    });

    // Style headers
    workbook.eachSheet((sheet) => {
      sheet.getRow(1).font = { bold: true, size: 12 };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00FF41' },
      };
      sheet.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };

      // Auto filter
      sheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + sheet.columnCount - 1)}1`,
      };
    });

    // Generate filename
    const fileName = `CRM_Export_${timestamp}.xlsx`;
    const filePath = join(excelDir, fileName);

    // Write file
    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({
      success: true,
      message: 'Excel file created successfully',
      filePath: `excel/${dateFolder}/${fileName}`,
      fileName,
      recordCounts: {
        projects: data.projects.length,
        cities: data.cities.length,
        service_types: data.service_types.length,
        employee_types: data.employee_types.length,
        employee_prices: data.employee_prices.length,
        cost_types: data.cost_types.length,
        general_costs: data.general_costs.length,
      },
    });

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return NextResponse.json(
      { error: 'Failed to export to Excel', details: String(error) },
      { status: 500 }
    );
  }
}
