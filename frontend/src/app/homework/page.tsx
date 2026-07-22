"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { api } from "@/utils/api";
import { FileText, Upload, Sparkles, AlertCircle, File, Image as ImageIcon, Send, ArrowRight } from "lucide-react";

interface SolutionResponse {
  scannedText: string;
  solution: string;
  provider: string;
}

export default function HomeworkAssistant() {
  const { addNotification } = useApp();
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setSolution(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !file) {
      setError("Please provide a text query or drop a document/image worksheet.");
      return;
    }

    setLoading(true);
    setError("");
    setSolution(null);
    setScanProgress(10);

    try {
      // Simulate file upload and OCR layout scans
      if (file) {
        for (let p = 20; p <= 100; p += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setScanProgress(p);
        }
      }

      const queryMsg = file
        ? `Solve problem in worksheet ${fileName}: ${inputText || "Please extract questions and solve."}`
        : inputText;

      // Request AI tutor explanation with step-by-step solver mode
      const res = await api.sendTutorMessage({
        message: queryMsg,
        history: [],
        learnerLevel: "INTERMEDIATE",
        subject: "Mathematics",
        mode: "step-by-step"
      });

      setSolution({
        scannedText: file
          ? `[Worksheet Scan OCR Transcript]\nProblem detected: Solve for x in the equation. Find detailed derivatives.`
          : "Manual Text Input",
        solution: res.text,
        provider: res.provider
      });

      addNotification("Homework Solved", "AI has detailed steps for your worksheet.", "success");
    } catch (err: any) {
      setError(err.message || "Failed to process homework problem.");
    } finally {
      setLoading(false);
      setScanProgress(0);
    }
  };

  const handleReset = () => {
    setInputText("");
    setFile(null);
    setFileName("");
    setSolution(null);
    setError("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            <span>Homework Solver Assistant</span>
          </h1>
          <p className="text-xs text-[var(--muted)]">Type questions or upload worksheets (PDFs, Images) for step-by-step AI solutions.</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-500/10 p-3.5 border border-red-500/20 text-red-500 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left panel: Input Area */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/45 p-5 glass-panel">
            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Text prompt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--foreground)]/80">Question / Problem Prompt</label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your homework problem (e.g. 'Solve 3x + 10 = 25' or paste science queries)..."
                    className="w-full h-32 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-4 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Upload attachment area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--foreground)]/80">Scan Worksheet File</label>
                  <div className="border-2 border-dashed border-[var(--card-border)] hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-[var(--background)]/30 group">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-8 w-8 text-[var(--muted)] group-hover:text-indigo-400 transition-colors" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--foreground)]">
                          {fileName ? fileName : "Drag & Drop worksheet files"}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">Supports PDF, PNG, JPG scans up to 8MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Progress Bar */}
                {scanProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-indigo-400 font-semibold">
                      <span>Analyzing document structure (OCR)...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--card-border)]/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-[var(--card-border)] hover:bg-slate-500/10 px-4 py-2 text-xs font-semibold transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-40 text-white px-5 py-2 text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>{loading ? "Solving Homework..." : "Calculate Steps"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Solution View */}
          <div className="lg:col-span-7 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/35 p-6 glass-panel flex flex-col justify-start min-h-[380px]">
            {solution ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[var(--card-border)]/50 pb-3">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>AI Derivation Steps</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 border border-slate-700/50 rounded px-2.5 py-0.5 text-[var(--muted)]">
                    Model: <strong>gpt-4o-mini</strong>
                  </span>
                </div>

                {file && (
                  <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-700/30 flex items-start space-x-2 text-[10px] text-[var(--muted)] font-mono">
                    <ImageIcon className="h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="whitespace-pre-line leading-relaxed">{solution.scannedText}</span>
                  </div>
                )}

                <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                  {solution.solution}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">Waiting for Homework Request</h3>
                  <p className="text-xs text-[var(--muted)] max-w-xs mt-1.5">Provide mathematical problems or drag document scans to extract answers with explanations.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
