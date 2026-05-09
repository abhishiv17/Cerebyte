import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Anton } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AppProviders from "@/components/AppProviders";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
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
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${anton.variable}`}>
      <body className="bg-brand-cream text-brand-black antialiased font-sans selection:bg-brand-green selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProviders>
            {children}
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
