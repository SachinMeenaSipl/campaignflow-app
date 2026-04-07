import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CampaignFlow",
  description: "Timeline-based bulk email planning and delivery for modern teams."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
