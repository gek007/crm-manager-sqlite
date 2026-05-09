"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { updateCostType } from "@/app/actions";
import { useParams } from "next/navigation";

interface CostType {
  id: number;
  description: string;
}

export default function EditCostTypePage() {
  const params = useParams();
  const [state, formAction] = useActionState(updateCostType, undefined);
  const [item, setItem] = useState<CostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cost-types/${params.id}`)
      .then((r) => { if (!r.ok) throw new Error("Не найдено"); return r.json(); })
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <AppLayout><Header title="Редактирование типа затрат" /><div className="p-6"><p className="text-muted-foreground text-center py-8">Загрузка...</p></div></AppLayout>;
  }
  if (!item) {
    return <AppLayout><Header title="Редактирование типа затрат" /><div className="p-6"><p className="text-destructive text-center py-8">Тип затрат не найден.</p></div></AppLayout>;
  }

  return (
    <AppLayout>
      <Header title="Редактирование типа затрат" />
      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader><CardTitle className="text-lg">Изменить тип затрат</CardTitle></CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <FormMessage message={state?.error} />
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Описание *</label>
                <input type="text" id="description" name="description" required defaultValue={item.description} className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="flex gap-3 pt-4">
                <SubmitButton>Сохранить изменения</SubmitButton>
                <Link href="/cost-types" className={buttonVariants({ variant: "secondary" })}>
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
