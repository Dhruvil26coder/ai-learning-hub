"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/utils/api";
import {
  ArrowLeft,
  Video,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  orderIndex: number;
  keyConcepts: string;
}

export default function ChaptersPage() {
  const params = useParams();
  const classNum = params.classNum as string;
  const subjectId = params.subjectId as string;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
    fetchProgress();
  }, [classNum, subjectId]);

  const fetchChapters = async () => {
    try {
      const data = await apiFetch(`/standards/${classNum}/subjects/${subjectId}/chapters`);
      if (Array.isArray(data)) {
        setChapters(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const data = await apiFetch("/standards/progress/me");
      if (Array.isArray(data)) {
        setCompletedIds(data);
      }
    } catch (err) {
      // User might not be logged in
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Back Link & Header */}
        <div>
          <Link
            href={`/standards/${classNum}`}
            className="inline-flex items-center text-sm text-[var(--muted)] hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Class {classNum} Subjects
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                Class {classNum} Chapters
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                Watch video explanations and master each chapter step-by-step
              </p>
            </div>

            {chapters.length > 0 && (
              <div className="inline-flex items-center space-x-2 rounded-xl bg-indigo-500/10 px-4 py-2 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>
                  {completedIds.filter(id => chapters.some(c => c.id === id)).length} / {chapters.length} Completed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chapters List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-700/30"
              />
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-[var(--foreground)]">No Chapters Found</h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              Chapters for this subject are being added soon!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((ch, idx) => {
              const isCompleted = completedIds.includes(ch.id);
              let concepts: string[] = [];
              try {
                concepts = JSON.parse(ch.keyConcepts || "[]");
              } catch (e) {}

              return (
                <Link
                  key={ch.id}
                  href={`/standards/chapters/${ch.id}`}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isCompleted
                      ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                      : "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-indigo-500/40"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-base ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
                          {ch.title}
                        </h3>
                        {isCompleted && (
                          <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)] line-clamp-2 max-w-3xl leading-relaxed">
                        {ch.summary}
                      </p>

                      {concepts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {concepts.slice(0, 4).map((concept, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/40"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Video className="h-4 w-4" />
                      <span>Watch & Learn</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
