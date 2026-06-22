import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for the Midnight Gold identity (login wordmark + headlines).
// Used with restraint — body/UI text stays on Geist Sans.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Task Manager",
  description: "Milestone 1 — Task Management App frontend (mock data)",
};

// Root layout: wraps every page in the app. For this milestone we only ship the
// App layout shell + navigation, plus the login page. <AppChrome> renders the
// navbar app-wide but skips it on the auth screens (so login stays standalone).
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen font-sans antialiased"
        suppressHydrationWarning
      >
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
