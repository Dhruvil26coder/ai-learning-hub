import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import GoogleProvider from "@/components/GoogleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Learning Hub - Premium AI-Powered Education",
  description: "Learn Mathematics, Computer Science, Coding, Web Development, and Sciences with personalized AI tutors, interactive courses, quizzes, and gamified progress.",
  keywords: ["AI education", "tutor", "coding playground", "math solver", "gamified learning", "courses"],
  verification: {
    google: "h1CSKNHP1B3fLdulfCicCfUSvwA73ledroP_iXzyvoM",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <GoogleProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
