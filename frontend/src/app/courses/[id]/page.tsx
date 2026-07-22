"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/utils/api";
import { useApp, Course } from "@/context/AppContext";
import { BookOpen, Award, CheckCircle, Play, Video, ChevronRight, Volume2, Sparkles, HelpCircle, FileText } from "lucide-react";
import confetti from "canvas-confetti";

export default function CourseDetails() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, updateUserStats, addNotification } = useApp();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<{ type: "lesson" | "quiz"; id: string }>({ type: "lesson", id: "" });
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Load course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.getCourse(id);
        setCourse(data);
        if (data.lessons.length > 0) {
          setActiveItem({ type: "lesson", id: data.lessons[0].id });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const activeLesson = course?.lessons.find((l) => l.id === activeItem.id);
  const activeQuiz = course?.quizzes.find((q) => q.id === activeItem.id);

  const handleCompleteLesson = async () => {
    if (!course || !activeLesson) return;
    try {
      const res = await api.completeLesson(course.id, activeLesson.id);
      setCompletedItems((prev) => new Set([...prev, activeLesson.id]));

      // Award XP
      if (res.xpResult) {
        updateUserStats(res.xpResult.xp, res.xpResult.level);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
        addNotification("Chapter Complete!", "+50 XP gained!", "success");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitQuiz = async () => {
    if (!course || !activeQuiz || submittingQuiz) return;
    setSubmittingQuiz(true);
    try {
      const res = await api.submitQuiz(course.id, activeQuiz.id, selectedAnswers);
      setQuizResult(res);

      if (res.passed) {
        setCompletedItems((prev) => new Set([...prev, activeQuiz.id]));
        updateUserStats(res.xpResult.xp, res.xpResult.level);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.7 }
        });
        addNotification("Quiz Passed!", `Congratulations! You scored ${res.score}%.`, "success");

        if (res.certificateUnlocked) {
          setShowCertificate(true);
          addNotification("Course Graduated!", `You have earned the ${course.title} certificate!`, "achievement");
        }
      } else {
        addNotification("Quiz Failed", "Scored below 70%. You can review the course and retry.", "info");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizResult(null);
    setSelectedAnswers({});
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[300px] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-[var(--muted)]">Course not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-8rem)]">
        {/* Left Side: Track Map */}
        <div className="lg:col-span-4 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold truncate">{course.title}</h2>
            <p className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded w-max">
              {course.category}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-4 glass-panel space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Syllabus Progress</h3>
            <div className="space-y-2">
              {/* Lessons List */}
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveItem({ type: "lesson", id: lesson.id });
                    setQuizResult(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    activeItem.type === "lesson" && activeItem.id === lesson.id
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                      : "border-[var(--card-border)] bg-[var(--background)]/35 text-[var(--foreground)]/70 hover:bg-slate-500/5"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-[10px] text-[var(--muted)] font-bold">C.{idx + 1}</span>
                    <span className="text-xs font-semibold truncate">{lesson.title}</span>
                  </div>
                  {completedItems.has(lesson.id) ? (
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Play className="h-3 w-3 text-[var(--muted)] shrink-0" />
                  )}
                </button>
              ))}

              {/* Quizzes List */}
              {course.quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setActiveItem({ type: "quiz", id: quiz.id });
                    setQuizResult(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    activeItem.type === "quiz" && activeItem.id === quiz.id
                      ? "bg-pink-600/15 border-pink-500 text-pink-400"
                      : "border-[var(--card-border)] bg-[var(--background)]/35 text-[var(--foreground)]/70 hover:bg-slate-500/5"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Award className="h-4 w-4 text-pink-400" />
                    <span className="text-xs font-semibold truncate">{quiz.title}</span>
                  </div>
                  {completedItems.has(quiz.id) ? (
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[var(--muted)] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Main Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* RENDER LESSON */}
          {activeItem.type === "lesson" && activeLesson && (
            <div className="space-y-6">
              {/* Simulated Lecture Video Player */}
              <div className="relative aspect-video rounded-3xl border border-[var(--card-border)] bg-slate-900 overflow-hidden shadow-md flex items-center justify-center group">
                <Video className="h-16 w-16 text-indigo-400/50 group-hover:scale-110 transition-transform cursor-pointer" />
                {/* Control bar mock */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-3">
                    <Play className="h-4.5 w-4.5 fill-white cursor-pointer" />
                    <span>0:00 / 12:45</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 cursor-pointer" />
                    <span className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
                      <span className="bg-indigo-500 h-full block w-3/4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/35 p-6 glass-panel font-sans">
                <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap space-y-4">
                  {activeLesson.content}
                </div>

                <div className="mt-8 border-t border-[var(--card-border)]/50 pt-6 flex justify-end">
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completedItems.has(activeLesson.id)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 disabled:text-indigo-400/60 disabled:border-indigo-500/10 px-6 py-3 text-xs font-semibold text-white shadow-md transition-all flex items-center space-x-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{completedItems.has(activeLesson.id) ? "Lesson Completed" : "Mark Lesson Completed (+50 XP)"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RENDER QUIZ */}
          {activeItem.type === "quiz" && activeQuiz && (
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/35 p-6 glass-panel font-sans space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--card-border)]/50 pb-3">
                <h3 className="font-extrabold text-base flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-pink-400" />
                  <span>{activeQuiz.title}</span>
                </h3>
                <span className="text-[10px] bg-slate-800 border border-slate-700/50 rounded px-2.5 py-1 text-[var(--muted)]">
                  Time Limit: <strong>5 mins</strong>
                </span>
              </div>

              {quizResult ? (
                /* QUIZ RESULT PANEL */
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 relative">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">Your Score</p>
                    <h2 className={`text-5xl font-extrabold mt-2 ${quizResult.passed ? "text-emerald-400" : "text-red-500"}`}>
                      {quizResult.score}%
                    </h2>
                    <p className="text-xs mt-3 text-[var(--foreground)]/80">
                      {quizResult.passed
                        ? `🎉 Congratulations! You passed the challenge and earned +150 XP.`
                        : `❌ You scored below the 70% passing mark. Review the resources and try again.`}
                    </p>
                    <button
                      onClick={handleResetQuiz}
                      className="mt-6 rounded-xl border border-[var(--card-border)] hover:bg-slate-500/10 px-5 py-2 text-xs font-semibold transition-all"
                    >
                      Try Again
                    </button>
                  </div>

                  {/* Step explanations list */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm">Question Breakdown:</h4>
                    {quizResult.results.map((res: any, i: number) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 text-xs space-y-2 ${
                          res.correct ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
                        }`}
                      >
                        <p className="font-semibold text-[var(--foreground)]">{res.questionText}</p>
                        <p className="text-[var(--muted)]">Your Answer: <strong className={res.correct ? "text-emerald-400" : "text-red-400"}>{res.studentAnswer}</strong></p>
                        <p className="text-[var(--muted)]">Correct Answer: <strong className="text-indigo-400">{res.correctAnswer}</strong></p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* QUIZ FORM */
                <div className="space-y-6">
                  {(activeQuiz.questions || []).map((question, idx) => {
                    const optionsList: string[] = JSON.parse(question.options);
                    return (
                      <div key={question.id} className="space-y-3">
                        <p className="text-xs font-semibold text-[var(--foreground)]">
                          {idx + 1}. {question.questionText}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {optionsList.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(question.id, opt)}
                              className={`rounded-xl p-3 text-xs text-left border font-medium transition-all ${
                                selectedAnswers[question.id] === opt
                                  ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                                  : "border-[var(--card-border)] bg-[var(--background)]/35 text-[var(--foreground)]/70 hover:bg-slate-500/5"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-8 border-t border-[var(--card-border)]/50 pt-5 flex justify-end">
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < (activeQuiz.questions || []).length || submittingQuiz}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 px-6 py-3 text-xs font-semibold text-white shadow-md transition-colors"
                    >
                      {submittingQuiz ? "Evaluating Answers..." : "Submit Answers (+150 XP)"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Graduation Certificate Dialog Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 p-8 text-center text-white relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="h-8 w-8 rounded-full border border-slate-700 hover:bg-slate-800 flex items-center justify-center text-xs text-white/80 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Certificate Layout */}
            <div className="border-4 border-double border-amber-500/30 p-8 rounded-2xl space-y-6 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
              <span className="text-5xl shrink-0 text-amber-500">🏆</span>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Certificate of Completion</p>
                <h2 className="font-serif text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  AI Learning Hub Graduation
                </h2>
              </div>

              <div className="space-y-1.5 py-4 border-y border-amber-500/10">
                <p className="text-xs text-slate-400">This certifies that student</p>
                <p className="font-semibold text-lg text-white underline">{user?.name || "Student Learner"}</p>
                <p className="text-xs text-slate-400">has successfully completed all requirements and exam checkpoints for</p>
                <p className="font-extrabold text-base text-indigo-400">{course.title}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
                <div>
                  <p>Instructor Signature</p>
                  <p className="font-serif text-xs font-semibold text-slate-300 italic mt-1">Professor Alex</p>
                </div>
                <div>
                  <p>Verification Code</p>
                  <p className="font-mono text-[9px] text-amber-500/80 mt-1">HASH-SHA256: 8a34dfb892a00cde9</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                onClick={() => alert("Certificate PDF Download simulation started!")}
                className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 text-xs shadow-md transition-colors"
              >
                Download PDF Copy
              </button>
              <button
                onClick={() => alert("Graduation posted to LinkedIn!")}
                className="w-full sm:w-auto rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold px-6 py-2.5 text-xs transition-colors"
              >
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
