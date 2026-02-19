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
          className="min-h-screen border-x border-black/5 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.02)] mx-auto max-w-[1600px] flex relative overflow-hidden"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] -z-10" />
          {children}
        </div>
      </body>
    </html>
  );
}
