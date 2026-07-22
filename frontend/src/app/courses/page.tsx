"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Course } from "@/context/AppContext";
import { api } from "@/utils/api";
import { BookOpen, Compass, Search, Play, Award } from "lucide-react";
import Link from "next/link";

export default function CoursesCatalog() {
  const { setCoursesList, courses } = useApp();
  const [loading, setLoading] = useState(courses.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categories = ["All", "Web Development", "Programming", "Mathematics"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Compass className="h-6 w-6 text-indigo-400" />
              <span>Course Catalog</span>
            </h1>
            <p className="text-xs text-[var(--muted)]">Structured tracks designed to master new skills with AI instruction.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 py-2.5 pl-9 pr-4 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold border transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                  : "border-[var(--card-border)] bg-[var(--background)]/40 text-[var(--foreground)]/60 hover:bg-slate-500/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center py-20 text-xs text-[var(--muted)] font-medium">No courses found matching your query.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/35 p-6 glass-panel flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--muted)]">{course.difficulty}</span>
                  </div>
                  <h3 className="font-extrabold text-lg mt-4 text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--card-border)]/50 pt-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-[var(--muted)] font-medium">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons.length} chapters</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-pink-400" />
                      <span>{course.quizzes.length} exams</span>
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.id.replace("mock-", "")}`}
                    className="rounded-xl bg-indigo-600 group-hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md flex items-center space-x-2 transition-all"
                  >
                    <span>Launch Track</span>
                    <Play className="h-3 w-3 fill-white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
