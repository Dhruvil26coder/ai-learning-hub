"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { api } from "@/utils/api";
import {
  Sparkles, Send, Plus, Trash2, MessageSquare,
  Copy, Check, Volume2, LogOut, User,
  Zap, BookOpen, Code2, Calculator, FlaskConical, Globe,
  Mic, MicOff, Languages
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const SUBJECTS = [
  { icon: Calculator, label: "Math", value: "Mathematics" },
  { icon: Code2, label: "Code", value: "Computer Science" },
  { icon: FlaskConical, label: "Science", value: "Physics" },
  { icon: BookOpen, label: "General", value: "General Study" },
  { icon: Globe, label: "Language", value: "Languages & Grammar" },
];

// Popular languages for speech recognition
const SPEECH_LANGUAGES = [
  { label: "Auto Detect", code: "" },
  { label: "English", code: "en-US" },
  { label: "Hindi (हिन्दी)", code: "hi-IN" },
  { label: "Gujarati (ગુજરાતી)", code: "gu-IN" },
  { label: "Spanish", code: "es-ES" },
  { label: "French", code: "fr-FR" },
  { label: "German", code: "de-DE" },
  { label: "Arabic (العربية)", code: "ar-SA" },
  { label: "Chinese (中文)", code: "zh-CN" },
  { label: "Japanese (日本語)", code: "ja-JP" },
  { label: "Korean (한국어)", code: "ko-KR" },
  { label: "Portuguese", code: "pt-BR" },
  { label: "Russian", code: "ru-RU" },
  { label: "Italian", code: "it-IT" },
  { label: "Bengali (বাংলা)", code: "bn-IN" },
  { label: "Tamil (தமிழ்)", code: "ta-IN" },
  { label: "Telugu (తెలుగు)", code: "te-IN" },
  { label: "Marathi (मराठी)", code: "mr-IN" },
  { label: "Urdu (اردو)", code: "ur-PK" },
  { label: "Turkish", code: "tr-TR" },
  { label: "Dutch", code: "nl-NL" },
  { label: "Polish", code: "pl-PL" },
];

const STARTER_PROMPTS = [
  "Explain how machine learning works",
  "Solve: 2x² + 5x - 3 = 0",
  "Write a Python function to sort a list",
  "What is the difference between DNA and RNA?",
  "Explain Newton's laws of motion",
  "How does the internet work?",
];

// Declare global SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function TypingDots() {
  return (
    <div className="flex items-center space-x-1 py-1">
      <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function MessageContent({ content }: { content: string }) {
  const formatInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={i} className="italic text-gray-300">{part.slice(1, -1)}</em>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-emerald-300">{part.slice(1, -1)}</code>;
      return part;
    });
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
        const code = codeLines.join("\n");
        elements.push(
          <div key={i} className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-xs text-gray-400 font-mono">{lang || "code"}</span>
              <CopyButton text={code} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-200 leading-relaxed"><code>{code}</code></pre>
          </div>
        );
        i++; continue;
      }
      if (line.startsWith("### ")) elements.push(<h3 key={i} className="text-base font-bold mt-4 mb-2 text-white">{line.slice(4)}</h3>);
      else if (line.startsWith("## ")) elements.push(<h2 key={i} className="text-lg font-bold mt-5 mb-2 text-white">{line.slice(3)}</h2>);
      else if (line.startsWith("# ")) elements.push(<h1 key={i} className="text-xl font-bold mt-5 mb-3 text-white">{line.slice(2)}</h1>);
      else if (line.startsWith("* ") || line.startsWith("- ")) elements.push(
        <div key={i} className="flex items-start space-x-2 my-1">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
          <span className="text-sm leading-relaxed text-gray-200">{formatInline(line.slice(2))}</span>
        </div>
      );
      else if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        elements.push(
          <div key={i} className="flex items-start space-x-3 my-1">
            <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600/30 text-indigo-400 text-xs font-bold">{num}</span>
            <span className="text-sm leading-relaxed text-gray-200">{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
          </div>
        );
      }
      else if (line === "---") elements.push(<hr key={i} className="my-4 border-white/10" />);
      else if (line.trim() === "") elements.push(<div key={i} className="h-2" />);
      else elements.push(<p key={i} className="text-sm leading-relaxed text-gray-200 my-1">{formatInline(line)}</p>);
      i++;
    }
    return elements;
  };

  return <div className="space-y-1">{renderContent(content)}</div>;
}

export default function ChatGPTPage() {
  const { user, logout } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("General Study");
  const [level, setLevel] = useState("INTERMEDIATE");

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-US");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Check browser voice support
  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setVoiceSupported(true);
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, loading]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Close lang picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Stop listening when component unmounts
  useEffect(() => {
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceLang || ""; // empty = browser default (auto-detect)

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(interim);
      if (final) {
        setInput((prev) => prev + final + " ");
        setTranscript("");
      }
    };

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e.error);
      setIsListening(false);
      setTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceLang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTranscript("");
  }, []);

  const toggleVoice = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const createNewConversation = useCallback(() => {
    const id = `conv-${Date.now()}`;
    setConversations((prev) => [{ id, title: "New Chat", messages: [], createdAt: new Date() }, ...prev]);
    setActiveConvId(id);
    setInput("");
    stopListening();
  }, [stopListening]);

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  const sendMessage = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || loading) return;
    if (isListening) stopListening();

    let convId = activeConvId;
    if (!convId) {
      convId = `conv-${Date.now()}`;
      setConversations((prev) => [{ id: convId!, title: text.slice(0, 45) + (text.length > 45 ? "..." : ""), messages: [], createdAt: new Date() }, ...prev]);
      setActiveConvId(convId);
    }

    const userMsg: Message = { id: `msg-${Date.now()}`, role: "user", content: text, timestamp: new Date() };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const updated = { ...c, messages: [...c.messages, userMsg] };
        if (c.messages.length === 0) updated.title = text.slice(0, 45) + (text.length > 45 ? "..." : "");
        return updated;
      })
    );

    setInput("");
    setLoading(true);

    try {
      const history = (activeConv?.messages || []).slice(-8).map((m) => ({ sender: m.role === "user" ? "user" : "bot", text: m.content }));
      const res = await api.sendTutorMessage({ message: text, history, learnerLevel: level, subject, mode: "normal" });
      const botMsg: Message = { id: `msg-${Date.now()}-bot`, role: "assistant", content: res.text, timestamp: new Date() };
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, messages: [...c.messages, botMsg] } : c));
    } catch (err: any) {
      const errMsg: Message = { id: `msg-${Date.now()}-err`, role: "assistant", content: `❌ **Error:** ${err.message || "Failed to get a response."}`, timestamp: new Date() };
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, messages: [...c.messages, errMsg] } : c));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const clean = text.replace(/[#*`$]/g, "").replace(/```[\s\S]*?```/g, "[code block]");
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(clean.slice(0, 600));
    // Try to match TTS language to selected voice language
    utt.lang = voiceLang || "en-US";
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* ─── Sidebar ─── */}
      <div className="w-64 shrink-0 flex flex-col bg-[#171717] border-r border-white/5">
        <div className="p-4 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">AI Learning Hub</span>
          </Link>
          <button onClick={createNewConversation} className="w-full flex items-center space-x-2 rounded-xl border border-white/10 hover:border-indigo-500/50 bg-white/5 hover:bg-indigo-600/10 px-3 py-2.5 text-sm transition-all group">
            <Plus className="h-4 w-4 text-gray-400 group-hover:text-indigo-400" />
            <span className="text-gray-300 group-hover:text-white text-sm">New Chat</span>
          </button>
        </div>

        {/* Subject */}
        <div className="px-3 pt-3 pb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">Subject</p>
          <div className="grid grid-cols-5 gap-1">
            {SUBJECTS.map((s) => (
              <button key={s.value} onClick={() => setSubject(s.value)} title={s.label}
                className={`flex flex-col items-center p-1.5 rounded-lg transition-all ${subject === s.value ? "bg-indigo-600/20 text-indigo-400" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                <s.icon className="h-3.5 w-3.5" />
                <span className="text-[9px] mt-0.5">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="px-3 pb-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 px-1">Level</p>
          <div className="flex gap-1">
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`flex-1 py-1 rounded-lg text-[9px] font-bold border transition-all ${level === l ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400" : "border-white/5 text-gray-500 hover:bg-white/5"}`}>
                {l.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 py-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No conversations yet</p>
            </div>
          ) : conversations.map((conv) => (
            <div key={conv.id} onClick={() => setActiveConvId(conv.id)}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all ${activeConvId === conv.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}>
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                <span className="text-xs truncate">{conv.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all ml-1 shrink-0">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer group">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600/30 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">{user?.name || "Guest"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || ""}</p>
            </div>
            <button onClick={logout} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all" title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Chat ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold text-sm text-white">AI Chat</span>
            </div>
            <span className="text-[10px] bg-indigo-600/20 border border-indigo-500/30 rounded-full px-2.5 py-0.5 text-indigo-400 font-medium">{subject}</span>
            {isListening && (
              <span className="flex items-center space-x-1 text-[10px] bg-red-500/20 border border-red-500/30 rounded-full px-2.5 py-0.5 text-red-400 font-medium animate-pulse">
                <span className="h-1.5 w-1.5 bg-red-500 rounded-full inline-block" />
                <span>Listening...</span>
              </span>
            )}
          </div>
          <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Dashboard</Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-lg mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">How can I help you today?</h1>
              <p className="text-gray-400 text-sm mb-3 text-center max-w-md">
                Ask me anything — type or <span className="text-indigo-400 font-medium">speak in any language 🎤</span>
              </p>
              {voiceSupported && (
                <p className="text-xs text-gray-600 mb-8">
                  Current voice language: <span className="text-gray-400">{SPEECH_LANGUAGES.find(l => l.code === voiceLang)?.label || "Auto"}</span>
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt)}
                    className="text-left p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 hover:border-indigo-500/40 transition-all group">
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
              {activeConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 mr-3 mt-0.5">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === "user" ? "bg-indigo-600 text-white rounded-3xl rounded-br-lg px-5 py-3" : "bg-[#1e1e1e] border border-white/8 rounded-3xl rounded-tl-lg px-5 py-4"}`}>
                    {msg.role === "user"
                      ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      : <MessageContent content={msg.content} />
                    }
                    {msg.role === "assistant" && (
                      <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-white/5">
                        <CopyButton text={msg.content} />
                        <button onClick={() => handleSpeak(msg.content)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Read aloud">
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700/50 ml-3 mt-0.5 overflow-hidden">
                      {user?.avatarUrl
                        ? <img src={user.avatarUrl} alt="you" className="h-8 w-8 rounded-full object-cover" />
                        : <User className="h-4 w-4 text-white" />}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 mr-3 mt-0.5">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-[#1e1e1e] border border-white/8 rounded-3xl rounded-tl-lg px-5 py-4">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ─── Input Area ─── */}
        <div className="px-4 pb-6 pt-4 border-t border-white/5 bg-[#0f0f0f]">
          <div className="max-w-3xl mx-auto">

            {/* Live transcript preview */}
            {transcript && (
              <div className="mb-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 animate-pulse">
                🎤 {transcript}
              </div>
            )}

            <div className={`relative flex items-end rounded-2xl border bg-[#1e1e1e] transition-colors shadow-lg ${isListening ? "border-red-500/50" : "border-white/10 focus-within:border-indigo-500/50"}`}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... speak now 🎤" : "Message AI Learning Hub or click 🎤 to speak..."}
                rows={1}
                className="flex-1 resize-none bg-transparent px-5 py-4 text-sm text-white placeholder-gray-500 outline-none max-h-48 leading-relaxed"
              />
              <div className="flex items-center px-3 pb-3 space-x-2">

                {/* Language picker + mic */}
                {voiceSupported && (
                  <div className="relative" ref={langPickerRef}>
                    <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                      {/* Language selector button */}
                      <button
                        onClick={() => setShowLangPicker((v) => !v)}
                        className="flex items-center space-x-1 px-2 py-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-white border-r border-white/10"
                        title="Select language"
                      >
                        <Languages className="h-3.5 w-3.5" />
                        <span className="text-[10px] max-w-[40px] truncate">
                          {SPEECH_LANGUAGES.find(l => l.code === voiceLang)?.label.split(" ")[0] || "Auto"}
                        </span>
                      </button>

                      {/* Mic button */}
                      <button
                        onClick={toggleVoice}
                        className={`p-2 transition-all ${isListening ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-indigo-400"}`}
                        title={isListening ? "Stop listening" : "Start voice input"}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4 animate-pulse" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Language Picker Dropdown */}
                    {showLangPicker && (
                      <div className="absolute bottom-12 right-0 w-56 rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden z-50">
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Choose Language</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1">
                          {SPEECH_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => { setVoiceLang(lang.code); setShowLangPicker(false); }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-white/5 ${voiceLang === lang.code ? "text-indigo-400 bg-indigo-600/10" : "text-gray-300"}`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Send button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || (!input.trim() && !isListening)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:opacity-40 text-white transition-all shadow"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] text-gray-600 mt-3 flex items-center justify-center gap-3 flex-wrap">
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono text-[10px]">Enter</kbd> to send</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono text-[10px]">Shift+Enter</kbd> new line</span>
              {voiceSupported && <span>🎤 Click mic to speak in any language</span>}
              {!voiceSupported && <span className="text-yellow-600">⚠️ Use Chrome/Edge for voice input</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
