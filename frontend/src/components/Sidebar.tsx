"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Terminal,
  FileText,
  Settings,
  Flame,
  Award,
  MessageSquare,
  GraduationCap
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useApp();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Class 1-12", href: "/standards", icon: GraduationCap },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "AI Tutor", href: "/tutor", icon: Sparkles },
    { name: "Coding Playground", href: "/playground", icon: Terminal },
    { name: "Homework Assistant", href: "/homework", icon: FileText },
  ];

  // Show Admin panel if user is admin
  if (user && user.role === "ADMIN") {
    menuItems.push({ name: "Admin Panel", href: "/admin", icon: Settings });
  }

  return (
    <aside className="w-full shrink-0 border-r border-[var(--card-border)] bg-[var(--background)] p-4 md:w-64 md:min-h-[calc(100vh-4rem)] transition-colors duration-300">
      <nav className="flex flex-row overflow-x-auto space-x-2 md:flex-col md:space-x-0 md:space-y-1.5 md:overflow-x-visible">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 md:shrink ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
                  : "text-[var(--foreground)]/70 hover:bg-slate-500/10 hover:text-[var(--foreground)] border border-transparent"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-indigo-400" : "text-[var(--foreground)]/60"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-8 border-t border-[var(--card-border)] pt-6 hidden md:block">
          <div className="rounded-2xl border border-[var(--card-border)] p-4 glass-panel glow-box">
            <h4 className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-pink-400">
              <Award className="h-4 w-4" />
              <span>Rank Status</span>
            </h4>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">Level</span>
              <span className="font-semibold text-indigo-400">{user.level}</span>
            </div>
            <div className="mt-2 text-xs">
              <div className="flex justify-between text-[var(--muted)] mb-1">
                <span>XP Progress</span>
                <span>{user.xp % 500} / 500 XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 rounded-xl bg-orange-500/10 p-2.5 border border-orange-500/20 text-orange-500 text-xs font-medium">
              <Flame className="h-4 w-4 fill-orange-500" />
              <span>Daily goal: 15 mins to go!</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
