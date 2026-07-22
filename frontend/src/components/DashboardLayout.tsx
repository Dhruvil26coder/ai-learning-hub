"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, token } = useApp();
  const router = useRouter();

  // Redirect to signin if not authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem("hub_token");
    if (!storedToken) {
      router.push("/auth");
    }
  }, [token, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-md" />
          <p className="text-sm font-semibold tracking-wide text-[var(--muted)]">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-sm overflow-hidden transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
