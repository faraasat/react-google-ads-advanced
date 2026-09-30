import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { TopNav } from "@/components/topnav";
import "react-google-ads-advanced/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "react-google-ads-advanced — live demo",
  description:
    "Google AdSense for React that collapses unfilled slots instead of leaving blank gaps.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TopNav pkg="react-google-ads-advanced" />
        {children}
        <Analytics packageName="react-google-ads-advanced" />
      </body>
    </html>
  );
}
