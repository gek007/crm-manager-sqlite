import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Manager",
  description: "Construction project management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="min-h-screen w-full flex">
          {children}
        </div>
      </body>
    </html>
  );
}
