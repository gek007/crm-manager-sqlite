"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage } from "@/components/ui/form-message";
import { EmployeePricesForm } from "@/components/projects/employee-prices-form";
import { createProject, updateProject } from "@/app/actions";

interface City {
  id: number;
  city: string;
  region: string | null;
}

interface ServiceType {
  id: number;
  description: string;
}

interface EmployeeType {
  id: number;
  description: string;
  dayRate: number;
}

interface ExistingProject {
  id: number;
  projectName: string;
  date: string;
  cityId: number;
  address: string;
  serviceTypeId: number;
  floors: number | null;
  days: number | null;
  material: string | null;
  gasFoodWater: number;
  bama: number;
  checker: number;
  totalPaid: number;
  employeePrices: {
    employeeTypeId: number;
    workDays: number;
    byPlan: number;
  }[];
}

interface ProjectFormProps {
  cities: City[];
  serviceTypes: ServiceType[];
  employeeTypes: EmployeeType[];
  project?: ExistingProject;
}

export function ProjectForm({ cities, serviceTypes, employeeTypes, project }: ProjectFormProps) {
  const action = project ? updateProject : createProject;
  const [state, formAction] = useActionState(action, undefined);

  const inputClass = "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <Card className="max-w-5xl border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">
          {project ? "Edit Project" : "Create New Project"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6" id="projectForm">
          {project && <input type="hidden" name="id" value={project.id} />}

          <FormMessage message={state?.error} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium">Project Name *</label>
                <input type="text" id="projectName" name="projectName" required className={inputClass} placeholder="Enter project name" defaultValue={project?.projectName ?? ""} />
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date *</label>
                <input type="date" id="date" name="date" required className={inputClass} defaultValue={project?.date ?? ""} />
              </div>
              <div className="space-y-2">
                <label htmlFor="cityId" className="text-sm font-medium">City *</label>
                <select id="cityId" name="cityId" required className={inputClass} defaultValue={project?.cityId ?? ""}>
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.city}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="serviceTypeId" className="text-sm font-medium">Service Type *</label>
                <select id="serviceTypeId" name="serviceTypeId" required className={inputClass} defaultValue={project?.serviceTypeId ?? ""}>
                  <option value="">Select service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.description}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address *</label>
              <input type="text" id="address" name="address" required className={inputClass} placeholder="Enter full address" defaultValue={project?.address ?? ""} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Project Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="floors" className="text-sm font-medium">Floors</label>
                <input type="number" id="floors" name="floors" min="0" className={inputClass} placeholder="0" defaultValue={project?.floors ?? ""} />
              </div>
              <div className="space-y-2">
                <label htmlFor="days" className="text-sm font-medium">Days</label>
                <input type="number" id="days" name="days" min="0" className={inputClass} placeholder="0" defaultValue={project?.days ?? ""} />
              </div>
              <div className="space-y-2">
                <label htmlFor="material" className="text-sm font-medium">Material</label>
                <input type="text" id="material" name="material" className={inputClass} placeholder="Material type" defaultValue={project?.material ?? ""} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Additional Costs</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="gasFoodWater" className="text-sm font-medium">Gas/Food/Water ($)</label>
                <input type="number" id="gasFoodWater" name="gasFoodWater" step="0.01" min="0" defaultValue={project?.gasFoodWater ?? 0} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="bama" className="text-sm font-medium">Bama ($)</label>
                <input type="number" id="bama" name="bama" step="0.01" min="0" defaultValue={project?.bama ?? 0} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="checker" className="text-sm font-medium">Checker ($)</label>
                <input type="number" id="checker" name="checker" step="0.01" min="0" defaultValue={project?.checker ?? 0} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="totalPaid" className="text-sm font-medium">Total Paid ($) *</label>
                <input type="number" id="totalPaid" name="totalPaid" step="0.01" min="0" defaultValue={project?.totalPaid ?? 0} required className={`${inputClass} font-semibold`} />
              </div>
            </div>
          </div>

          <EmployeePricesForm
            employeeTypes={employeeTypes}
            initialEntries={project?.employeePrices}
          />

          <div className="flex gap-3 pt-4 border-t border-border">
            <SubmitButton className="neon-glow">
              {project ? "Update Project" : "Create Project"}
            </SubmitButton>
            <a href="/projects">
              <Button type="button" variant="secondary">Cancel</Button>
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
