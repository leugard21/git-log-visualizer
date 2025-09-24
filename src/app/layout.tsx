import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Log Visualizer",
  description:
    "Visualize git commit history with branches, filters, and search.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
