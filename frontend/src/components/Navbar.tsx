"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, Bell, Flame, Trophy, LogOut, Sparkles, Award } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, theme, toggleTheme, logout, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--card-border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            AI Learning Hub
          </span>
        </Link>

        {/* User Info / Stats & Actions */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden items-center space-x-4 md:flex">
              {/* Streak */}
              <div className="flex items-center space-x-1 rounded-full bg-orange-500/10 px-3 h-8 border border-orange-500/20 text-orange-500 font-semibold text-sm">
                <Flame className="h-4 w-4 fill-orange-500" />
                <span>{user.streak} day streak</span>
              </div>

              {/* XP & Level */}
              <div className="flex items-center space-x-2 rounded-full bg-indigo-500/10 px-3 h-8 border border-indigo-500/20 text-indigo-400 font-semibold text-sm">
                <Trophy className="h-4 w-4" />
                <span>Lvl {user.level}</span>
                <span className="text-xs text-[var(--muted)]">({user.xp} XP)</span>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] hover:bg-slate-500/10 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] hover:bg-slate-500/10 transition-colors relative"
            >
              <Bell className="h-5 w-5 text-[var(--foreground)]" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 glow-box" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4 shadow-xl glass-panel animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-2 mb-2">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-[var(--muted)]">{notifications.length} new</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[var(--muted)] text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="text-xs border-b border-[var(--card-border)]/40 pb-2 last:border-0">
                        <div className="flex items-center space-x-1 font-medium text-[var(--foreground)]">
                          {n.type === "achievement" && <Award className="h-3 w-3 text-amber-500" />}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-[var(--muted)] mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="h-9 w-9 rounded-full bg-slate-700 p-0.5 border border-indigo-500/30"
                />
                <span className="hidden text-sm font-medium sm:block">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] hover:bg-pink-500/10 hover:border-pink-500/30 text-pink-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
