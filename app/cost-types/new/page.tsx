"use client";

import { useActionState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { createCostType } from "@/app/actions";

export default function NewCostTypePage() {
  const [state, formAction] = useActionState(createCostType, undefined);

  return (
    <AppLayout>
      <Header title="Add Cost Type" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New Cost Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <FormMessage message={state?.error} />

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g., Transportation, Equipment Rental"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <SubmitButton>Save Cost Type</SubmitButton>
                <a href="/cost-types">
                  <Button type="button" variant="secondary">Cancel</Button>
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
