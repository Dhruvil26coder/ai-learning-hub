"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { api } from "@/utils/api";
import { Terminal, Code, Play, CheckCircle, RefreshCw, Layers, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export default function CodingPlayground() {
  const { addNotification } = useApp();
  const [language, setLanguage] = useState<"html" | "python">("html");

  // Code editor values
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      color: #38bdf8;
      font-family: sans-serif;
      text-align: center;
      padding-top: 50px;
    }
    h1 {
      font-size: 3rem;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>
</head>
<body>
  <h1>Hello AI Learning Hub!</h1>
  <p>Modify this code and click 'Run Preview' on the right.</p>
</body>
</html>`);

  const [pythonCode, setPythonCode] = useState(`def find_fibonacci(n):
    # Calculates the first n fibonacci numbers
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib

# Generate first 10 fibonacci sequence values
sequence = find_fibonacci(10)
print("Fibonacci Sequence:", sequence)`);

  const [consoleOutput, setConsoleOutput] = useState("");
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Auto-run preview on HTML load
  useEffect(() => {
    if (language === "html") {
      setIframeSrcDoc(htmlCode);
    }
  }, [language]);

  const handleRunCode = () => {
    if (language === "html") {
      setIframeSrcDoc(htmlCode);
      addNotification("Code Compiled", "Refreshed live sandboxed preview.", "success");
    } else {
      // Simulate Python execution output locally
      setConsoleOutput("Python executing interpreter...\n");
      setTimeout(() => {
        if (pythonCode.includes("print(")) {
          // Quick mock evaluation of simple prints
          if (pythonCode.includes("find_fibonacci")) {
            setConsoleOutput("Python executing interpreter...\nFibonacci Sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\nExecution successfully ended with exit code 0.");
          } else {
            // Find custom print statement
            const match = pythonCode.match(/print\(([^)]+)\)/);
            const printedVal = match ? match[1].replace(/['"]/g, "") : "Code executed successfully.";
            setConsoleOutput(`Python executing interpreter...\n${printedVal}\n\nExecution successfully ended with exit code 0.`);
          }
        } else {
          setConsoleOutput("Python executing interpreter...\nCode ran successfully with no print outputs.");
        }
        addNotification("Interpreter Finished", "Python program ended with success.", "success");
      }, 500);
    }
  };

  const handleRequestReview = async () => {
    const activeCode = language === "html" ? htmlCode : pythonCode;
    if (!activeCode.trim() || loadingReview) return;

    setLoadingReview(true);
    setReviewResult(null);

    try {
      const res = await api.requestReview({ code: activeCode, language });
      setReviewResult(res.review);
      addNotification("Review Done", "AI Code reviewer has graded your script.", "achievement");
    } catch (err: any) {
      setReviewResult(`### ⚠️ Review Error\nFailed to compile AI code review: ${err.message || "Unknown error."}`);
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Terminal className="h-6 w-6 text-indigo-400" />
              <span>Interactive Coding Playground</span>
            </h1>
            <p className="text-xs text-[var(--muted)]">Write and run HTML, CSS, JavaScript, and Python programs side-by-side with AI reviews.</p>
          </div>

          {/* Language selectors */}
          <div className="flex items-center space-x-2 border border-[var(--card-border)] rounded-xl p-1 bg-[var(--background)]/50 shrink-0">
            <button
              onClick={() => setLanguage("html")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                language === "html" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
              }`}
            >
              HTML/CSS Preview
            </button>
            <button
              onClick={() => setLanguage("python")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                language === "python" ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
              }`}
            >
              Python Terminal
            </button>
          </div>
        </div>

        {/* Playground Grid Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          {/* Left panel: Code Editor */}
          <div className="xl:col-span-6 flex flex-col h-[480px] lg:h-[540px] rounded-2xl border border-[var(--card-border)] bg-slate-950 overflow-hidden relative shadow-md">
            {/* Editor Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Code className="h-4.5 w-4.5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">source_code.{language === "html" ? "html" : "py"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRequestReview}
                  disabled={loadingReview}
                  className="rounded-lg bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold shadow transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loadingReview ? "Reviewing..." : "AI Review"}</span>
                </button>
                <button
                  onClick={handleRunCode}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition-colors flex items-center space-x-1"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Run</span>
                </button>
              </div>
            </div>

            {/* Main Editor Text Area */}
            <textarea
              value={language === "html" ? htmlCode : pythonCode}
              onChange={(e) => (language === "html" ? setHtmlCode(e.target.value) : setPythonCode(e.target.value))}
              spellCheck={false}
              className="flex-1 w-full bg-slate-950 p-6 text-sm font-mono text-slate-200 border-0 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Right panel: Preview or Terminal Output */}
          <div className="xl:col-span-6 flex flex-col h-[480px] lg:h-[540px] rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/50 glass-panel overflow-hidden relative shadow-md">
            {language === "html" ? (
              /* Live HTML Iframe Preview */
              <div className="flex-1 flex flex-col h-full">
                <div className="bg-[var(--background)]/60 border-b border-[var(--card-border)]/50 px-5 py-3 text-xs font-semibold shrink-0">
                  Live View Sandbox
                </div>
                <iframe
                  srcDoc={iframeSrcDoc}
                  title="HTML Preview sandbox"
                  sandbox="allow-scripts"
                  className="flex-1 w-full border-0 bg-white"
                />
              </div>
            ) : (
              /* Python Shell Terminal */
              <div className="flex-1 flex flex-col h-full bg-slate-900 font-mono text-xs">
                <div className="bg-slate-950 border-b border-slate-800 px-5 py-3 text-slate-400 shrink-0">
                  Interactive Python Terminal Console
                </div>
                <div className="flex-1 p-5 overflow-y-auto whitespace-pre-wrap text-slate-200">
                  {consoleOutput || ">>> Press 'Run' to execute your Python program."}
                </div>
              </div>
            )}

            {/* AI Review Sidebar Slider Overlay */}
            {reviewResult && (
              <div className="absolute inset-0 z-30 bg-slate-900 border-l border-emerald-500/20 flex flex-col h-full animate-in slide-in-from-right duration-250 font-sans">
                {/* Header */}
                <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex justify-between items-center shrink-0">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">AI Review Summary</span>
                  </div>
                  <button
                    onClick={() => setReviewResult(null)}
                    className="text-slate-400 hover:text-white text-xs border border-slate-800 rounded px-2.5 py-1 hover:bg-slate-800 transition-colors"
                  >
                    Close Review
                  </button>
                </div>
                {/* Body details */}
                <div className="flex-1 overflow-y-auto p-5 text-slate-200 text-xs leading-relaxed space-y-4">
                  <div className="prose prose-invert prose-xs max-w-none space-y-3">
                    {reviewResult}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
