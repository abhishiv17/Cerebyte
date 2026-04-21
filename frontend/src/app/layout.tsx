import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cerebyte — Where Algorithms Meet Intelligence",
  description:
    "Master Data Structures, Algorithms, and DBMS with an integrated code execution engine, AI tutor, and visual ER diagram builder.",
  keywords: ["DSA", "algorithms", "DBMS", "coding", "learning", "AI tutor"],
  authors: [{ name: "Cerebyte Team" }],
  openGraph: {
    title: "Cerebyte",
    description: "Where Algorithms Meet Intelligence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-surface-900 text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
