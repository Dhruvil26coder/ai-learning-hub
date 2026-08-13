"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/utils/api";
import { GraduationCap, BookOpen, ChevronRight } from "lucide-react";

interface StandardItem {
  id: number;
  name: string;
  _count?: {
    subjects: number;
  };
}

export default function StandardsPage() {
  const [standards, setStandards] = useState<StandardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const data = await apiFetch("/standards");
      if (Array.isArray(data) && data.length > 0) {
        setStandards(data);
      } else {
        setStandards(
          Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: `Class ${i + 1}`,
          }))
        );
      }
    } catch (err) {
      console.error(err);
      setStandards(
        Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          name: `Class ${i + 1}`,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const getClassGradient = (num: number) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-indigo-500 to-blue-500",
      "from-blue-500 to-cyan-500",
      "from-teal-500 to-emerald-500",
      "from-emerald-500 to-green-500",
      "from-amber-500 to-yellow-500",
      "from-orange-500 to-amber-500",
      "from-red-500 to-rose-500",
      "from-fuchsia-500 to-pink-500",
      "from-violet-500 to-purple-500",
      "from-sky-500 to-indigo-500",
    ];
    return gradients[(num - 1) % gradients.length];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-8 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/10 px-4 py-1.5 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              <span>School Curriculum</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Class 1 to Class 12 Curriculum
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
              Explore chapter-wise video explanations, animated lessons, and quick summary notes tailored specifically for your grade level!
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <GraduationCap className="h-72 w-72 text-indigo-400" />
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-700/30"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {standards.map((std) => (
              <Link
                key={std.id}
                href={`/standards/${std.id}`}
                className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getClassGradient(
                      std.id
                    )} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    {std.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                      {std.name}
                    </h3>
                    <p className="text-xs text-[var(--muted)] flex items-center mt-1">
                      <BookOpen className="h-3.5 w-3.5 mr-1" />
                      Subjects & Videos
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
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
