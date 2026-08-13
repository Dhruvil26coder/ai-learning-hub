"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/utils/api";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  CheckCircle2,
  Video,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  PlayCircle
} from "lucide-react";

interface ChapterDetail {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  orderIndex: number;
  keyConcepts: string;
  subject: {
    name: string;
    standard: {
      id: number;
      name: string;
    };
  };
}

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const { user, refreshUser } = useApp();

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchChapterDetail();
    checkCompletion();
  }, [chapterId]);

  const fetchChapterDetail = async () => {
    try {
      const data = await apiFetch(`/standards/chapters/${chapterId}`);
      if (data && data.id) {
        setChapter(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkCompletion = async () => {
    try {
      const data = await apiFetch("/standards/progress/me");
      if (Array.isArray(data) && data.includes(chapterId)) {
        setCompleted(true);
      }
    } catch (err) {}
  };

  const handleMarkComplete = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    setCompleting(true);
    try {
      const res = await apiFetch(`/standards/chapters/${chapterId}/complete`, {
        method: "POST"
      });
      setCompleted(true);
      setMsg(res.message || "Chapter completed! +25 XP");
      refreshUser();
    } catch (err: any) {
      setMsg(err.message || "Failed to mark complete");
    } finally {
      setCompleting(false);
    }
  };

  let concepts: string[] = [];
  if (chapter?.keyConcepts) {
    try {
      concepts = JSON.parse(chapter.keyConcepts);
    } catch (e) {}
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Navigation Breadcrumbs */}
        <div>
          {chapter && (
            <Link
              href={`/standards/${chapter.subject.standard.id}/${chapter.subject.name}`}
              className="inline-flex items-center text-sm text-[var(--muted)] hover:text-indigo-400 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to {chapter.subject.standard.name} {chapter.subject.name}
            </Link>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                <span>{chapter?.subject.standard.name}</span>
                <span>•</span>
                <span>{chapter?.subject.name}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                {chapter?.title || "Loading Chapter..."}
              </h1>
            </div>

            {/* Complete Button */}
            <button
              onClick={handleMarkComplete}
              disabled={completed || completing}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                completed
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-95"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{completed ? "Completed! (+25 XP)" : completing ? "Saving..." : "Mark as Completed"}</span>
            </button>
          </div>

          {msg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>{msg}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-3xl bg-slate-800/40 animate-pulse border border-slate-700/30" />
            <div className="h-40 rounded-3xl bg-slate-800/40 animate-pulse border border-slate-700/30" />
          </div>
        ) : chapter ? (
          <div className="space-y-8">
            {/* Video Player Box */}
            <div className="overflow-hidden rounded-3xl border border-[var(--card-border)] bg-black shadow-2xl">
              <div className="relative aspect-video w-full">
                <iframe
                  src={chapter.videoUrl}
                  title={chapter.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Summary & Concepts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Summary Notes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-lg">
                    <BookOpen className="h-5 w-5" />
                    <h2>Chapter Summary</h2>
                  </div>
                  <p className="text-[var(--foreground)]/90 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {chapter.summary}
                  </p>
                </div>

                {/* AI Tutor Prompt Banner */}
                <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Have questions about this chapter?</h4>
                      <p className="text-xs text-slate-300">Ask our AI Tutor for instant explanations and problem solving!</p>
                    </div>
                  </div>

                  <Link
                    href={`/tutor?prompt=Explain%20${encodeURIComponent(chapter.title)}%20for%20${encodeURIComponent(chapter.subject.standard.name)}`}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
                  >
                    Ask AI Tutor
                  </Link>
                </div>
              </div>

              {/* Sidebar: Key Concepts */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-pink-400 font-bold text-base">
                    <Layers className="h-5 w-5" />
                    <h3>Key Concepts</h3>
                  </div>

                  <ul className="space-y-2.5">
                    {concepts.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-3 text-xs font-semibold text-[var(--foreground)]/90 bg-slate-800/40 border border-slate-700/40 p-3 rounded-xl"
                      >
                        <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
