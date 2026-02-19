import { Sidebar } from "./sidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </>
  );
}
