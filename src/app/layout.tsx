import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Brand]",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-foreground antialiased">
        <SmoothScroll />
        <div className="container mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}