"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Course } from "@/context/AppContext";
import { api } from "@/utils/api";
import { Settings, Users, BookOpen, BarChart3, ShieldAlert, Sparkles, Plus, Trash2 } from "lucide-react";

export default function AdminPanel() {
  const { user, courses, setCoursesList, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<"users" | "courses" | "analytics">("users");

  // Mock list of registered students
  const [students, setStudents] = useState([
    { id: "1", name: "Sophia Spark", email: "sophia@example.com", role: "STUDENT", level: 3, xp: 1250, streak: 8 },
    { id: "2", name: "Professor Alex", email: "admin@ailearninghub.com", role: "ADMIN", level: 6, xp: 2500, streak: 5 },
    { id: "3", name: "Liam Web", email: "liam@example.com", role: "STUDENT", level: 2, xp: 720, streak: 4 },
    { id: "4", name: "Alice Python", email: "alice@example.com", role: "STUDENT", level: 1, xp: 320, streak: 2 }
  ]);

  // Form states for creating a new course
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCat, setNewCourseCat] = useState("Web Development");
  const [newCourseDiff, setNewCourseDiff] = useState("BEGINNER");

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseDesc.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Math.random().toString(36).substr(2, 9)}`,
      title: newCourseTitle,
      description: newCourseDesc,
      category: newCourseCat,
      difficulty: newCourseDiff,
      lessons: [
        { id: `lesson-${Math.random()}`, title: "Chapter 1: Getting Started Foundations", orderIndex: 1 }
      ],
      quizzes: [
        { id: `quiz-${Math.random()}`, title: "Module Checkpoint Assessment" }
      ]
    };

    setCoursesList([newCourseObj, ...courses]);
    addNotification("Course Created", `Track '${newCourseTitle}' has been added to catalog.`, "success");

    // Reset Form
    setNewCourseTitle("");
    setNewCourseDesc("");
  };

  const handleDeleteCourse = (courseId: string, title: string) => {
    setCoursesList(courses.filter((c) => c.id !== courseId));
    addNotification("Course Deleted", `Track '${title}' removed.`, "info");
  };

  const handleToggleUserRole = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextRole = s.role === "ADMIN" ? "STUDENT" : "ADMIN";
        addNotification("Role Updated", `${s.name} is now ${nextRole}`, "info");
        return { ...s, role: nextRole };
      }
      return s;
    }));
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Unauthorized Access</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mt-1.5">You do not have administrative privileges to access this control interface.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--card-border)] pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Settings className="h-6 w-6 text-indigo-400" />
              <span>Admin Management Hub</span>
            </h1>
            <p className="text-xs text-[var(--muted)]">Admin panel to add courses, update user roles, and monitor usage statistics.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1.5 border border-[var(--card-border)] rounded-xl p-1 bg-[var(--background)]/50 shrink-0">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center space-x-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "users" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center space-x-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "courses" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Courses Editor</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center space-x-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "analytics" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>AI Analytics</span>
            </button>
          </div>
        </div>

        {/* TAB content: STUDENTS */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--card-border)] pb-3 text-[var(--muted)] font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Learner</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Streak</th>
                  <th>Level / XP</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]/40">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-500/5 transition-colors font-medium">
                    <td className="py-3 flex items-center space-x-2">
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                        className="h-8 w-8 rounded-full bg-slate-800 p-0.5 border"
                        alt=""
                      />
                      <span className="text-[var(--foreground)]">{student.name}</span>
                    </td>
                    <td>{student.email}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.role === "ADMIN" ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}>
                        {student.role}
                      </span>
                    </td>
                    <td>🔥 {student.streak} days</td>
                    <td>Lvl {student.level} ({student.xp} XP)</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleUserRole(student.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB content: COURSES EDITOR */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Add course form */}
            <div className="lg:col-span-5 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel">
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <h3 className="font-extrabold text-sm flex items-center space-x-1 text-indigo-400 uppercase tracking-wider">
                  <Plus className="h-4.5 w-4.5" />
                  <span>Create Course</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--foreground)]/80 uppercase">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="E.g., Quantum Mechanics Basics"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-3 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--foreground)]/80 uppercase">Description</label>
                  <textarea
                    required
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    placeholder="Short course syllabus outline..."
                    className="w-full h-24 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-3 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--foreground)]/80 uppercase">Category</label>
                    <select
                      value={newCourseCat}
                      onChange={(e) => setNewCourseCat(e.target.value)}
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Programming">Programming</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--foreground)]/80 uppercase">Difficulty</label>
                    <select
                      value={newCourseDiff}
                      onChange={(e) => setNewCourseDiff(e.target.value)}
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2.5 text-xs font-bold shadow-md transition-colors"
                >
                  Publish Course Track
                </button>
              </form>
            </div>

            {/* Right: Existing courses edit/delete list */}
            <div className="lg:col-span-7 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel flex flex-col justify-start">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[var(--muted)] mb-4">Active Course Modules ({courses.length})</h3>
              <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/35 text-xs font-medium"
                  >
                    <div>
                      <p className="font-bold text-[var(--foreground)]">{c.title}</p>
                      <p className="text-[10px] text-[var(--muted)]">{c.category} • {c.lessons.length} chapters</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="p-2 rounded-lg border border-[var(--card-border)] hover:bg-red-500/10 hover:border-red-500/30 text-red-500 transition-colors"
                      title="Delete Course Track"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB content: AI USAGE ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Total AI Requests</p>
              <h3 className="text-3xl font-extrabold mt-2 text-indigo-400">8,421</h3>
              <p className="text-[10px] text-[var(--muted)] mt-2">Across tutor dialogue requests, image OCR parsing, and code compilation.</p>
            </div>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Tokens Consumed</p>
              <h3 className="text-3xl font-extrabold mt-2 text-pink-400">2.1M</h3>
              <p className="text-[10px] text-[var(--muted)] mt-2">OpenAI gpt-4o-mini completion and context logs parsed this week.</p>
            </div>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Student Retention Rate</p>
              <h3 className="text-3xl font-extrabold mt-2 text-emerald-400">92.4%</h3>
              <p className="text-[10px] text-[var(--muted)] mt-2">Calculated by weekly recurring streaks and quiz completions.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
