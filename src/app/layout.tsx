import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StuddyBuddy AI",
  description: "Local-first AI chat with persistent conversation history",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
