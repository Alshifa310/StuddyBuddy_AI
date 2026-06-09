import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StuddyBuddy AI - Frontend Demo Chat",
  description: "Frontend-only portfolio chatbot demo with local conversation history",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
