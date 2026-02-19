import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Manager",
  description: "Construction project management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#E8E8E8] text-foreground antialiased">
        <div
          className="min-h-screen w-full flex relative overflow-hidden"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-[2px] -z-10" />
          {children}
        </div>
      </body>
    </html>
  );
}
