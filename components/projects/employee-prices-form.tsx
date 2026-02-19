"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EmployeeType {
  id: number;
  description: string;
  dayRate: number;
}

interface EmployeePriceEntry {
  employeeTypeId: number;
  workDays: number;
  byPlan: 1 | 2;
}

interface EmployeePricesFormProps {
  employeeTypes: EmployeeType[];
  initialEntries?: { employeeTypeId: number; workDays: number; byPlan: number }[];
}

export function EmployeePricesForm({ employeeTypes, initialEntries }: EmployeePricesFormProps) {
  const [entries, setEntries] = useState<EmployeePriceEntry[]>(
    initialEntries?.map((e) => ({
      employeeTypeId: e.employeeTypeId,
      workDays: e.workDays,
      byPlan: e.byPlan as 1 | 2,
    })) ?? []
  );

  const addEntry = () => {
    setEntries([...entries, { employeeTypeId: employeeTypes[0]?.id || 0, workDays: 0, byPlan: 1 }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof EmployeePriceEntry, value: number) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const getTotalPrice = (entry: EmployeePriceEntry) => {
    const empType = employeeTypes.find((e) => e.id === entry.employeeTypeId);
    return empType ? entry.workDays * empType.dayRate : 0;
  };

  const grandTotal = entries.reduce((sum, entry) => sum + getTotalPrice(entry), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Employee Prices</h3>
        <Button type="button" size="sm" onClick={addEntry}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
          No employees added. Click "Add Employee" to add employee pricing.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const empType = employeeTypes.find((e) => e.id === entry.employeeTypeId);
            const totalPrice = getTotalPrice(entry);

            return (
              <div key={index} className="flex items-center gap-3 p-4 border border-border rounded-lg bg-secondary">
                <div className="flex-1 grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Employee Type</label>
                    <select
                      value={entry.employeeTypeId}
                      onChange={(e) => updateEntry(index, "employeeTypeId", parseInt(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-border bg-input px-2 py-1 text-sm"
                      required
                    >
                      {employeeTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Rate</label>
                    <div className="text-sm">${empType?.dayRate}/day</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Work Days</label>
                    <input
                      type="number"
                      min="0"
                      value={entry.workDays || ""}
                      onChange={(e) => updateEntry(index, "workDays", parseInt(e.target.value) || 0)}
                      className="flex h-9 w-full rounded-md border border-border bg-input px-2 py-1 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">By Plan</label>
                    <select
                      value={entry.byPlan}
                      onChange={(e) => updateEntry(index, "byPlan", parseInt(e.target.value) as 1 | 2)}
                      className="flex h-9 w-full rounded-md border border-border bg-input px-2 py-1 text-sm"
                    >
                      <option value={1}>By Plan</option>
                      <option value={2}>By Mistake</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-primary min-w-[80px]">
                    ${totalPrice.toLocaleString()}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive h-8 w-8 p-0"
                    onClick={() => removeEntry(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Hidden inputs for form submission */}
                <input type="hidden" name="employeeTypeId" value={entry.employeeTypeId} />
                <input type="hidden" name="workDays" value={entry.workDays.toString()} />
                <input type="hidden" name="byPlan" value={entry.byPlan.toString()} />
              </div>
            );
          })}

          {entries.length > 0 && (
            <div className="flex justify-between p-3 border-t-2 border-border bg-secondary/50 rounded-lg">
              <span className="font-semibold">Employee Costs Total</span>
              <span className="font-bold text-lg text-primary">${grandTotal.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
