import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Git Log Visualizer",
  description: "Visualize git commit history with branches, filters, and search.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased bg-background text-foreground">
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
