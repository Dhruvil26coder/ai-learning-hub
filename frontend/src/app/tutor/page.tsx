"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { api } from "@/utils/api";
import { Sparkles, Send, Brain, GraduationCap, RefreshCw, Layers, Volume2, BookOpen, Clock } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  provider?: string;
}

export default function AITutor() {
  const { addNotification } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "### Hello! I am your AI Study Tutor. 🎓\nI can explain complex concepts, solve mathematics step-by-step, review code, translate subjects, and generate custom study materials.\n\n*Choose a subject, difficulty level, and instruction mode from the options, then write your question below!*"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [level, setLevel] = useState("INTERMEDIATE");
  const [mode, setMode] = useState("normal");
  const [loading, setLoading] = useState(false);

  const subjects = [
    "Mathematics",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Finance & Business",
    "Languages & Grammar",
    "History & Geography"
  ];

  const modes = [
    { id: "normal", name: "Concept Explainer", desc: "Adapt explanations for revision" },
    { id: "step-by-step", name: "Step-by-Step Solver", desc: "Detailed derivations and code trace" },
    { id: "quiz", name: "Quiz Generator", desc: "Create practice questions" },
    { id: "flashcard", name: "Flashcard Deck", desc: "Generate revision lists" }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage = inputText;
    setInputText("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Build chat context history from state
      const history = messages
        .filter((msg) => msg.text.length < 800) // limit size
        .slice(-6); // last 6 messages

      const res = await api.sendTutorMessage({
        message: userMessage,
        history,
        learnerLevel: level,
        subject,
        mode
      });

      setMessages((prev) => [...prev, { sender: "bot", text: res.text, provider: res.provider }]);
      addNotification("AI Answered", "The AI Tutor replied to your query.", "info");
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `⚠️ **Error**: ${err.message || "Failed to fetch response."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    // Clean markdown headings, equations, and code blocks before speaking
    const cleanText = text
      .replace(/#+\s/g, "")
      .replace(/\*\*+/g, "")
      .replace(/\$\$[\s\S]*?\$\$/g, "[Equation]")
      .replace(/\`\`\`[\s\S]*?\`\`\`/g, "[Codeblock]")
      .replace(/[\*\`\$]/g, "");

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 300) + (cleanText.length > 300 ? "..." : ""));
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    addNotification("Text-to-Speech", "Speaking tutoring response...", "info");
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-8rem)]">
        {/* Left Side: Settings Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span>Tutor Settings</span>
            </h2>
            <p className="text-xs text-[var(--muted)]">Customize the AI personality, vocabulary, and explanation layout.</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 p-5 glass-panel space-y-5">
            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]/80">Active Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-indigo-500"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Learner Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]/80">Cognitive Level</label>
              <div className="grid grid-cols-3 gap-2">
                {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`rounded-lg py-1.5 text-[10px] font-bold border transition-all ${
                      level === lvl
                        ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                        : "border-[var(--card-border)] bg-[var(--background)]/50 text-[var(--foreground)]/60 hover:bg-slate-500/10"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--foreground)]/80">Tutoring Engine Mode</label>
              <div className="space-y-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      mode === m.id
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                        : "border-[var(--card-border)] bg-[var(--background)]/30 text-[var(--foreground)]/70 hover:bg-slate-500/5"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold">{m.name}</p>
                      <p className="text-[10px] text-[var(--muted)]">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Arena */}
        <div className="lg:col-span-8 flex flex-col h-[520px] lg:h-[620px] rounded-2xl border border-[var(--card-border)] bg-[var(--background)]/40 glass-panel overflow-hidden relative">
          {/* Chat Window Header */}
          <div className="px-5 py-4 border-b border-[var(--card-border)]/50 bg-[var(--background)]/60 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 glow-box" />
              <span className="text-xs font-semibold text-[var(--foreground)]">AI Study Assistant</span>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700/50 rounded px-2 py-0.5 text-[var(--muted)]">
              Model: <strong className="text-indigo-400">Gemini AI</strong>
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white font-medium"
                      : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)]"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed space-y-2">
                    {msg.text}
                  </div>
                  {/* Speak message button */}
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="absolute right-2 bottom-2 p-1 rounded hover:bg-slate-500/10 text-[var(--muted)] hover:text-indigo-400 transition-colors"
                      title="Read explanation aloud"
                    >
                      <Volume2 className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex items-center space-x-2 shadow-sm">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs text-[var(--muted)]">AI is formulating steps...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--card-border)]/50 bg-[var(--background)]/60 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask a question in ${subject} (${level.toLowerCase()})...`}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 py-3.5 pl-4 pr-12 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="absolute right-2.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
