import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata: Metadata = {
  title: "Continuum Transformation | Enterprise Transformation, De-Risked",
  description:
    "We partner with CMOs, CDOs, and growth leaders to de-risk transformation and deliver outcomes without Big-4 bloat.",
  keywords: "enterprise transformation, consulting, change management, CDO, CMO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body><SidebarProvider>{children}</SidebarProvider></body>
      
    </html>
  );
}
