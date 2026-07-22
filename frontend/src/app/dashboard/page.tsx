"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Course } from "@/context/AppContext";
import { api } from "@/utils/api";
import { Trophy, Flame, Play, BookOpen, Compass, Award, Calendar, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, setCoursesList, courses, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: "Read intro lesson on HTML5 Semantics", completed: false, xpReward: 50 },
    { id: 2, text: "Try python function playground coding", completed: false, xpReward: 50 },
    { id: 3, text: "Take Linear Equations checkpoint quiz", completed: false, xpReward: 150 }
  ]);

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCoursesList(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setCoursesList]);

  const handleCompleteTodo = (id: number, text: string) => {
    setTodoItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    addNotification("Goal Checked!", `You marked '${text}' as completed!`, "success");
  };

  const getWeekDays = () => {
    const today = new Date().getDay();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Rotate so today is near the center, or just show Sunday-Saturday with today marked
    return days.map((day, idx) => {
      const isToday = idx === today;
      const isCompleted = user && user.streak > 0 && idx <= today && idx >= (today - user.streak + 1);
      return { day, isToday, isCompleted };
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 p-8 shadow-lg text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Learner"}! 👋
            </h1>
            <p className="text-white/80 text-sm max-w-xl">
              You are on a <span className="font-bold underline">{user?.streak}-day streak</span>. Complete your daily targets to maintain your position on the leaderboards.
            </p>
          </div>
        </div>

        {/* Top Grid: Gamification Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level Stats */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-6 glass-panel flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Current Tier</p>
                <h3 className="text-2xl font-bold mt-1">Level {user?.level || 1}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-[var(--muted)] font-medium">
                <span>XP Level Progression</span>
                <span>{user ? user.xp % 500 : 0} / 500 XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(((user?.xp || 0) % 500) / 500) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-[var(--muted)]">Gain 50 XP per lesson and 150 XP per quiz to level up.</p>
            </div>
          </div>

          {/* Daily Streak Grid */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-6 glass-panel flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Active Streak</p>
                <h3 className="text-2xl font-bold mt-1">{user?.streak || 0} Days</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                <Flame className="h-6 w-6 fill-orange-500/20" />
              </div>
            </div>
            {/* Calendar list */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-[var(--muted)] mb-2 flex items-center space-x-1.5">
                <Calendar className="h-4.5 w-4.5" />
                <span>Weekly Activity</span>
              </p>
              <div className="flex justify-between items-center bg-slate-800/40 border border-slate-700/30 rounded-xl p-2.5">
                {getWeekDays().map((dayObj, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] font-medium text-[var(--muted)]">{dayObj.day.substring(0, 1)}</span>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        dayObj.isToday
                          ? "ring-2 ring-indigo-500 bg-indigo-600/20 text-indigo-400"
                          : dayObj.isCompleted
                          ? "bg-orange-500 text-white shadow"
                          : "bg-slate-700/20 text-[var(--muted)]"
                      }`}
                    >
                      {dayObj.isCompleted ? "✓" : "•"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Summary */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-6 glass-panel flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Unlocked Badges</p>
                <h3 className="text-2xl font-bold mt-1">{(user?.achievements || []).length + 1} Badges</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                <Award className="h-6 w-6" />
              </div>
            </div>
            {/* Badges row */}
            <div className="mt-6 flex items-center space-x-2.5 overflow-x-auto pb-1">
              <div className="h-9 w-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500" title="Welcome aboard badge">
                ★
              </div>
              {(user?.achievements || []).map((ach, idx) => (
                <div
                  key={idx}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-xs"
                  title={ach.description}
                >
                  🏆
                </div>
              ))}
              <div className="h-9 w-9 rounded-full border border-dashed border-[var(--card-border)] flex items-center justify-center shrink-0 text-xs text-[var(--muted)] font-medium">
                +
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Course Catalog & Daily Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center space-x-2">
                <Compass className="h-5 w-5 text-indigo-400" />
                <span>Recommended Courses</span>
              </h2>
              <Link href="/courses" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    className="group rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/35 p-5 glass-panel flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                          {course.category}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--muted)]">{course.difficulty}</span>
                      </div>
                      <h3 className="font-bold text-base mt-3 text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-5 border-t border-[var(--card-border)]/50 pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[var(--muted)] flex items-center space-x-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{course.lessons.length} Lessons</span>
                      </span>
                      <Link
                        href={`/courses/${course.id.replace("mock-", "")}`}
                        className="rounded-lg bg-indigo-600 group-hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow flex items-center space-x-1 transition-all"
                      >
                        <span>Start</span>
                        <Play className="h-3 w-3 fill-white" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Todo Checklist */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-pink-400" />
              <span>Daily Study Plan</span>
            </h2>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel space-y-3.5">
              {todoItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCompleteTodo(item.id, item.text)}
                  className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    item.completed
                      ? "bg-slate-500/5 border-slate-700/30 line-through text-[var(--muted)]"
                      : "bg-slate-800/20 border-[var(--card-border)] hover:bg-slate-500/5 text-[var(--foreground)]"
                  }`}
                >
                  <div
                    className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      item.completed ? "bg-indigo-600 border-indigo-500 text-white" : "border-[var(--card-border)]"
                    }`}
                  >
                    {item.completed && "✓"}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{item.text}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">+{item.xpReward} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
