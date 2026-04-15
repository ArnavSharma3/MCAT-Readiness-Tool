import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calm MCAT Readiness",
  description: "A gentle MCAT readiness companion for focused prep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
