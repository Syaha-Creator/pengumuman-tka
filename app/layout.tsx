import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SCHOOL_NAME
    ? `Pengumuman TKA - ${process.env.NEXT_PUBLIC_SCHOOL_NAME}`
    : "Pengumuman Nilai TKA 2025/2026",
  description: "Portal pengumuman nilai TKA untuk siswa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
