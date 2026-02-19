"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteProjectButtonProps {
  projectId: number;
  projectName: string;
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/projects");
        router.refresh();
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Failed to delete project");
        setIsDeleting(false);
        setShowConfirm(false);
      }
    } catch {
      setError("Network error while deleting project");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full mb-2 right-0 w-64 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      {!showConfirm ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowConfirm(false); setError(null); }}
            disabled={isDeleting}
            className="bg-background"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      )}
    </div>
  );
}
