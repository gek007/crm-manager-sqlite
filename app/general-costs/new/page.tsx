"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { createGeneralCost } from "@/app/actions";

interface CostType {
  id: number;
  description: string;
}

export default function NewGeneralCostPage() {
  const [state, formAction] = useActionState(createGeneralCost, undefined);
  const [costTypes, setCostTypes] = useState<CostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cost-types")
      .then((r) => r.json())
      .then(setCostTypes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Header title="Add General Cost" />
        <div className="p-6">
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Add General Cost" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New General Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <FormMessage message={state?.error} />

              <div className="space-y-2">
                <label htmlFor="costTypeId" className="text-sm font-medium">
                  Cost Type *
                </label>
                <select
                  id="costTypeId"
                  name="costTypeId"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select cost type</option>
                  {costTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fromYear" className="text-sm font-medium">From Year *</label>
                  <input type="number" id="fromYear" name="fromYear" required className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="2024" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="toYear" className="text-sm font-medium">To Year *</label>
                  <input type="number" id="toYear" name="toYear" required className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="2024" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fromDay" className="text-sm font-medium">From Day *</label>
                  <input type="number" id="fromDay" name="fromDay" required min="1" max="31" className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="toDay" className="text-sm font-medium">To Day *</label>
                  <input type="number" id="toDay" name="toDay" required min="1" max="31" className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="31" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="total" className="text-sm font-medium">Total Cost ($) *</label>
                <input type="number" id="total" name="total" step="0.01" min="0" required className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="0.00" />
              </div>

              <div className="flex gap-3 pt-4">
                <SubmitButton>Save General Cost</SubmitButton>
                <Link href="/general-costs" className={buttonVariants({ variant: "secondary" })}>
                  Cancel
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
