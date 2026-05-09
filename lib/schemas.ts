import { z } from "zod";

export const citySchema = z.object({
  city: z.string().min(1, "Укажите название города").max(100),
  region: z.string().max(100).optional().default(""),
});

export const serviceTypeSchema = z.object({
  description: z.string().min(1, "Укажите описание").max(200),
});

export const employeeTypeSchema = z.object({
  description: z.string().min(1, "Укажите описание").max(200),
  dayRate: z.number().min(0, "Ставка за день не может быть отрицательной"),
});

export const costTypeSchema = z.object({
  description: z.string().min(1, "Укажите описание").max(200),
});

export const generalCostSchema = z.object({
  costTypeId: z.number().int().positive("Выберите тип затрат"),
  fromYear: z.number().int().min(1900).max(2100),
  toYear: z.number().int().min(1900).max(2100),
  fromDay: z.number().int().min(1).max(31),
  toDay: z.number().int().min(1).max(31),
  total: z.number().min(0, "Сумма должна быть не меньше 0"),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, "Укажите название проекта").max(200),
  date: z.string().min(1, "Укажите дату"),
  cityId: z.number().int().positive("Выберите город"),
  address: z.string().min(1, "Укажите адрес").max(500),
  serviceTypeId: z.number().int().positive("Выберите тип услуги"),
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
  workDays: z.number().int().min(1, "Дней должно быть не меньше 1"),
  byPlan: z.union([z.literal(1), z.literal(2)]),
});

export type CityInput = z.infer<typeof citySchema>;
export type ServiceTypeInput = z.infer<typeof serviceTypeSchema>;
export type EmployeeTypeInput = z.infer<typeof employeeTypeSchema>;
export type CostTypeInput = z.infer<typeof costTypeSchema>;
export type GeneralCostInput = z.infer<typeof generalCostSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type EmployeePriceEntry = z.infer<typeof employeePriceEntrySchema>;
