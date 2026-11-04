import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cancelled or Woke",
  description: "Search the web for reported concerns about a celebrity, band, or TV show.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
