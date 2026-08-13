"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/utils/api";
import { BookOpen, ArrowLeft, ChevronRight, Layers } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  _count?: {
    chapters: number;
  };
}

export default function SubjectsPage() {
  const params = useParams();
  const classNum = params.classNum as string;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, [classNum]);

  const fetchSubjects = async () => {
    try {
      const data = await apiFetch(`/standards/${classNum}/subjects`);
      if (Array.isArray(data)) {
        setSubjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "purple": return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "green": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "emerald": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "yellow": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "red": return "bg-red-500/10 border-red-500/30 text-red-400";
      case "teal": return "bg-teal-500/10 border-teal-500/30 text-teal-400";
      case "orange": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      default: return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Back Link & Header */}
        <div>
          <Link
            href="/standards"
            className="inline-flex items-center text-sm text-[var(--muted)] hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to All Classes
          </Link>

          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-xl">
              {classNum}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                Class {classNum} Subjects
              </h1>
              <p className="text-sm text-[var(--muted)] mt-0.5">
                Select a subject to view chapters and video explanations
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-700/30"
              />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-[var(--foreground)]">No Subjects Found</h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              No subjects have been added for Class {classNum} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                href={`/standards/${classNum}/${sub.id}`}
                className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{sub.icon}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBgColor(
                        sub.color
                      )}`}
                    >
                      {sub._count?.chapters || 0} Chapters
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1 flex items-center">
                      <Layers className="h-3.5 w-3.5 mr-1" />
                      Class {classNum} Syllabus
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex items-center justify-between text-sm font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>View Chapters</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
