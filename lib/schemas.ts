import { z } from "zod";

export const citySchema = z.object({
  city: z.string().min(1, "City name is required").max(100),
  region: z.string().max(100).optional().default(""),
});

export const serviceTypeSchema = z.object({
  description: z.string().min(1, "Description is required").max(200),
});

export const employeeTypeSchema = z.object({
  description: z.string().min(1, "Description is required").max(200),
  dayRate: z.number().min(0, "Day rate must be positive"),
});

export const costTypeSchema = z.object({
  description: z.string().min(1, "Description is required").max(200),
});

export const generalCostSchema = z.object({
  costTypeId: z.number().int().positive("Cost type is required"),
  fromYear: z.number().int().min(1900).max(2100),
  toYear: z.number().int().min(1900).max(2100),
  fromDay: z.number().int().min(1).max(31),
  toDay: z.number().int().min(1).max(31),
  total: z.number().min(0, "Total must be positive"),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(200),
  date: z.string().min(1, "Date is required"),
  cityId: z.number().int().positive("City is required"),
  address: z.string().min(1, "Address is required").max(500),
  serviceTypeId: z.number().int().positive("Service type is required"),
  floors: z.number().int().min(0).nullable().optional(),
  days: z.number().int().min(0).nullable().optional(),
  material: z.string().max(200).nullable().optional(),
  gasFoodWater: z.number().min(0).default(0),
  bama: z.number().min(0).default(0),
  checker: z.number().min(0).default(0),
  totalPaid: z.number().min(0).default(0),
});

export const employeePriceEntrySchema = z.object({
  employeeTypeId: z.number().int().positive(),
  workDays: z.number().int().min(1, "Work days must be at least 1"),
  byPlan: z.union([z.literal(1), z.literal(2)]),
});

export type CityInput = z.infer<typeof citySchema>;
export type ServiceTypeInput = z.infer<typeof serviceTypeSchema>;
export type EmployeeTypeInput = z.infer<typeof employeeTypeSchema>;
export type CostTypeInput = z.infer<typeof costTypeSchema>;
export type GeneralCostInput = z.infer<typeof generalCostSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type EmployeePriceEntry = z.infer<typeof employeePriceEntrySchema>;
