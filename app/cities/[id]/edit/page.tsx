"use client";

import { useActionState, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { updateCity } from "@/app/actions";
import { useParams } from "next/navigation";

interface City {
  id: number;
  city: string;
  region: string | null;
}

export default function EditCityPage() {
  const params = useParams();
  const [state, formAction] = useActionState(updateCity, undefined);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cities/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setCity)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AppLayout>
        <Header title="Edit City" />
        <div className="p-6"><p className="text-muted-foreground text-center py-8">Loading...</p></div>
      </AppLayout>
    );
  }

  if (!city) {
    return (
      <AppLayout>
        <Header title="Edit City" />
        <div className="p-6"><p className="text-destructive text-center py-8">City not found.</p></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Edit City" />
      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Edit City</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={city.id} />
              <FormMessage message={state?.error} />

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City Name *</label>
                <input type="text" id="city" name="city" required defaultValue={city.city} className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>

              <div className="space-y-2">
                <label htmlFor="region" className="text-sm font-medium">Region</label>
                <input type="text" id="region" name="region" defaultValue={city.region ?? ""} className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>

              <div className="flex gap-3 pt-4">
                <SubmitButton>Update City</SubmitButton>
                <a href="/cities"><Button type="button" variant="secondary">Cancel</Button></a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
