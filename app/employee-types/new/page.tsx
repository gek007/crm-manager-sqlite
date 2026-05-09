"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { createEmployeeType } from "@/app/actions";

export default function NewEmployeeTypePage() {
  const [state, formAction] = useActionState(createEmployeeType, undefined);

  return (
    <AppLayout>
      <Header title="Add Employee Type" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New Employee Type</CardTitle>
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
                  placeholder="e.g., Technician, Laborer, Supervisor"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dayRate" className="text-sm font-medium">
                  Day Rate ($) *
                </label>
                <input
                  type="number"
                  id="dayRate"
                  name="dayRate"
                  step="0.01"
                  min="0"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <SubmitButton>Save Employee Type</SubmitButton>
                <Link href="/employee-types" className={buttonVariants({ variant: "secondary" })}>
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
