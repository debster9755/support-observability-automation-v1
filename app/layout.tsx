import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pacera Support Nexus",
  description: "Support observability dashboard with LLM-powered recommendations for Pacera Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
