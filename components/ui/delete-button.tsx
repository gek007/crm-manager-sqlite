"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/app/actions";

interface DeleteButtonProps {
  id: number;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  confirmLabel?: string;
}

export function DeleteButton({ id, action, confirmLabel = "Confirm" }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(action, undefined);

  if (!showConfirm) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {state?.error && (
        <span className="text-xs text-destructive mr-1">{state.error}</span>
      )}
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <Button variant="destructive" size="sm" type="submit" disabled={isPending}>
          {isPending ? "..." : confirmLabel}
        </Button>
      </form>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(false)}
        disabled={isPending}
      >
        Cancel
      </Button>
    </div>
  );
}
