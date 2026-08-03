import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GSTGenius — AI-Powered GST Filing",
  description: "Automated GST return filing powered by AI for CA firms",
};

// Root layout is just the HTML shell. The sidebar chrome lives in the (app)
// route group; (auth) pages (login/register) render without it.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-50">{children}</body>
    </html>
  );
}
