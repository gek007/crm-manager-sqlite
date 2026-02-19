"use client";

import { useActionState, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { updateGeneralCost } from "@/app/actions";
import { useParams } from "next/navigation";

interface CostType {
  id: number;
  description: string;
}

interface GeneralCost {
  id: number;
  costTypeId: number;
  fromYear: number;
  toYear: number;
  fromDay: number;
  toDay: number;
  total: number;
}

export default function EditGeneralCostPage() {
  const params = useParams();
  const [state, formAction] = useActionState(updateGeneralCost, undefined);
  const [item, setItem] = useState<GeneralCost | null>(null);
  const [costTypes, setCostTypes] = useState<CostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/general-costs/${params.id}`).then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); }),
      fetch("/api/cost-types").then((r) => r.json()),
    ])
      .then(([gc, ct]) => { setItem(gc); setCostTypes(ct); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const inputClass = "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (loading) {
    return <AppLayout><Header title="Edit General Cost" /><div className="p-6"><p className="text-muted-foreground text-center py-8">Loading...</p></div></AppLayout>;
  }
  if (!item) {
    return <AppLayout><Header title="Edit General Cost" /><div className="p-6"><p className="text-destructive text-center py-8">General cost not found.</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <Header title="Edit General Cost" />
      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader><CardTitle className="text-lg">Edit General Cost</CardTitle></CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <FormMessage message={state?.error} />

              <div className="space-y-2">
                <label htmlFor="costTypeId" className="text-sm font-medium">Cost Type *</label>
                <select id="costTypeId" name="costTypeId" required defaultValue={item.costTypeId} className={inputClass}>
                  <option value="">Select cost type</option>
                  {costTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.description}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fromYear" className="text-sm font-medium">From Year *</label>
                  <input type="number" id="fromYear" name="fromYear" required defaultValue={item.fromYear} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="toYear" className="text-sm font-medium">To Year *</label>
                  <input type="number" id="toYear" name="toYear" required defaultValue={item.toYear} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fromDay" className="text-sm font-medium">From Day *</label>
                  <input type="number" id="fromDay" name="fromDay" required min="1" max="31" defaultValue={item.fromDay} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="toDay" className="text-sm font-medium">To Day *</label>
                  <input type="number" id="toDay" name="toDay" required min="1" max="31" defaultValue={item.toDay} className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="total" className="text-sm font-medium">Total Cost ($) *</label>
                <input type="number" id="total" name="total" step="0.01" min="0" required defaultValue={item.total} className={inputClass} />
              </div>

              <div className="flex gap-3 pt-4">
                <SubmitButton>Update General Cost</SubmitButton>
                <a href="/general-costs"><Button type="button" variant="secondary">Cancel</Button></a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
