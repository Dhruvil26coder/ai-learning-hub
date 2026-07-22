"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Terminal, GraduationCap, Users, BookOpen, Star, HelpCircle, Shield, Menu, X, Play, Code } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [demoTopic, setDemoTopic] = useState<"math" | "python" | "science">("math");
  const [demoHistory, setDemoHistory] = useState([
    { sender: "user", text: "How do I solve 2x + 7 = 15?" },
    {
      sender: "bot",
      text: `### 🔢 Step-by-Step Math Solution:
Here is how you isolate $x$:

1. **Subtract 7** from both sides:
   $$2x = 15 - 7$$
   $$2x = 8$$
2. **Divide by 2** on both sides:
   $$x = \\frac{8}{2}$$
   $$x = 4$$

*Try changing topics below to see more capabilities!*`
    }
  ]);

  const handleTopicChange = (topic: "math" | "python" | "science") => {
    setDemoTopic(topic);
    if (topic === "math") {
      setDemoHistory([
        { sender: "user", text: "How do I solve 2x + 7 = 15?" },
        {
          sender: "bot",
          text: `### 🔢 Step-by-Step Math Solution:
Here is how you isolate $x$:

1. **Subtract 7** from both sides:
   $$2x = 15 - 7$$
   $$2x = 8$$
2. **Divide by 2** on both sides:
   $$x = \\frac{8}{2}$$
   $$x = 4$$

*Try changing topics below to see more capabilities!*`
        }
      ]);
    } else if (topic === "python") {
      setDemoHistory([
        { sender: "user", text: "Explain recursive functions in Python." },
        {
          sender: "bot",
          text: `### 💻 Recursive Factorial Function:
A function that calls itself to solve smaller sub-problems.

\`\`\`python
def factorial(n):
    if n <= 1: # Base Case
        return 1
    return n * factorial(n - 1) # Recursive Step
\`\`\`
*Calculates $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.*`
        }
      ]);
    } else {
      setDemoHistory([
        { sender: "user", text: "What are the components of an atom?" },
        {
          sender: "bot",
          text: `### 🔬 Atomic Structure:
An atom is composed of three primary subatomic particles:

1. **Protons**: Positively charged particles ($+$) in the nucleus.
2. **Neutrons**: Neutrally charged particles in the nucleus.
3. **Electrons**: Negatively charged particles ($-$) orbiting the nucleus in shells.

*The electromagnetic force binds the electrons to the nucleus.*`
        }
      ]);
    }
  };

  const faqs = [
    { q: "How does the AI Tutor adapt to my level?", a: "When you start a session, you can select Beginner, Intermediate, or Advanced difficulty. The AI modifies its vocabulary, concepts, complexity, and coding suggestions to match your background." },
    { q: "Can I try the coding playground for free?", a: "Yes! The standard HTML/CSS/JS and Python sandboxes are fully accessible in our free tier. Advanced AI-powered structural refactoring is included in the Pro tier." },
    { q: "How are the certificates of completion verified?", a: "Each certificate features a unique cryptographic identifier stored on our servers. You can easily share your verified certificate link on LinkedIn or with employers." },
    { q: "Can I upload images of my worksheets?", a: "Absolutely. The Homework Assistant supports PDF and image uploads. Our visual model parses the layout, extracts mathematical equations or textual questions, and builds step-by-step derivations." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-[var(--card-border)]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px] md:h-96 md:w-96" />
        <div className="absolute top-1/3 left-1/3 -z-10 h-64 w-64 rounded-full bg-pink-500/5 blur-[80px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Personalized Education</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-[var(--foreground)]">
            Master Any Subject with the{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent block mt-2">
              Power of Live AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[var(--muted)]">
            A premium, gamified learning platform featuring step-by-step AI tutoring, timed quizzes, certificates, coding playgrounds, and visual homework assistance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/auth"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-8 py-3.5 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-500/15 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4 fill-[var(--foreground)]" />
              <span>Watch Interactive Demo</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto border-t border-[var(--card-border)] pt-12">
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">98%</p>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] font-medium">Grade Improvement</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-pink-400">150K+</p>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] font-medium">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">45+</p>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] font-medium">AI Subjects</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">10M+</p>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] font-medium">Quizzes Solved</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Demo Area */}
      <section id="demo" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-[var(--card-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold text-[var(--foreground)] leading-tight">
              Meet Your Personal AI Study Buddy
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              Trained in advanced pedagogy, the AI Tutor goes beyond simple answers. It adapts concepts, generates step-by-step visual derivations, analyzes code structure, and writes customized study materials.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleTopicChange("math")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  demoTopic === "math"
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)]/70 hover:bg-slate-500/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="font-semibold text-sm">Step-by-Step Math Solver</p>
                    <p className="text-xs text-[var(--muted)]">Handles algebra, equations, and calculus derivations.</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleTopicChange("python")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  demoTopic === "python"
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)]/70 hover:bg-slate-500/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Terminal className="h-5 w-5 text-pink-400" />
                  <div>
                    <p className="font-semibold text-sm">Interactive Code Explainer</p>
                    <p className="text-xs text-[var(--muted)]">Deconstructs logic, data-types, and algorithms.</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleTopicChange("science")}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  demoTopic === "science"
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)]/70 hover:bg-slate-500/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-sm">Science Concepts Map</p>
                    <p className="text-xs text-[var(--muted)]">Explains physics, chemistry, and biology interactions.</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Chat Frame */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden shadow-2xl glass-panel relative flex flex-col h-[420px]">
            {/* Window header */}
            <div className="bg-[var(--background)]/80 border-b border-[var(--card-border)] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-semibold text-[var(--muted)]">AI Tutor Chat Preview</span>
              <div className="h-4 w-4" />
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
              {demoHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white font-medium shadow-md"
                        : "bg-[var(--background)]/60 text-[var(--foreground)]/90 border border-[var(--card-border)]"
                    }`}
                  >
                    {/* Render basic markdown/equations */}
                    <div className="whitespace-pre-line leading-relaxed space-y-2">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Input */}
            <div className="p-4 border-t border-[var(--card-border)] bg-[var(--background)]/40 flex items-center justify-between space-x-2">
              <span className="text-xs text-[var(--muted)]">Selected Mode: <strong className="text-indigo-400 capitalize">{demoTopic}</strong> Tutor</span>
              <Link
                href="/auth"
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-4 rounded-xl shadow transition-colors"
              >
                Try It Live
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses / Categories */}
      <section className="py-16 bg-[var(--background)] border-b border-[var(--card-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-[var(--foreground)]">Explore Core Disciplines</h2>
            <p className="text-[var(--muted)]">Structured tracks curated by industry researchers and educators, boosted by AI modules.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Mathematics", icon: Brain, color: "text-indigo-400 bg-indigo-500/10" },
              { name: "Programming", icon: Code, color: "text-pink-400 bg-pink-500/10" },
              { name: "Data Science", icon: Terminal, color: "text-emerald-400 bg-emerald-500/10" },
              { name: "Web Dev", icon: BookOpen, color: "text-amber-400 bg-amber-500/10" },
              { name: "Sciences", icon: GraduationCap, color: "text-cyan-400 bg-cyan-500/10" },
              { name: "AI & ML", icon: Sparkles, color: "text-purple-400 bg-purple-500/10" }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 flex flex-col items-center justify-center space-y-3 glass-panel glass-panel-hover"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-[var(--card-border)]">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-extrabold text-[var(--foreground)]">Simple, Transparent Pricing</h2>
          <p className="text-[var(--muted)]">Start learning for free today. Upgrade anytime to unlock unlimited AI features and credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 glass-panel relative flex flex-col">
            <h3 className="text-xl font-bold text-[var(--foreground)]">Standard Explorer</h3>
            <p className="text-xs text-[var(--muted)] mt-1">Perfect to get started with key courses.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">$0</span>
              <span className="text-[var(--muted)]"> / month</span>
            </div>
            <ul className="space-y-3.5 text-sm text-[var(--foreground)]/80 flex-1">
              <li className="flex items-center space-x-2">
                <Shield className="h-4.5 w-4.5 text-indigo-400" />
                <span>Access all foundational text lessons</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4.5 w-4.5 text-indigo-400" />
                <span>15 Free AI Tutor requests per day</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4.5 w-4.5 text-indigo-400" />
                <span>Standard HTML/JS coding playground</span>
              </li>
              <li className="flex items-center space-x-2 text-[var(--muted)]">
                <X className="h-4.5 w-4.5 text-red-500" />
                <span>No verified completion certificates</span>
              </li>
            </ul>
            <Link
              href="/auth"
              className="mt-8 block w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] hover:bg-slate-500/10 text-center py-3 text-sm font-semibold transition-colors"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="rounded-3xl border-2 border-indigo-500 bg-[var(--card-bg)] p-8 glass-panel relative flex flex-col glow-box">
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-1 text-xs font-bold text-white shadow-md">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Elite Learner</h3>
            <p className="text-xs text-[var(--muted)] mt-1">Unlock the complete AI power suite.</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">$15</span>
              <span className="text-[var(--muted)]"> / month</span>
            </div>
            <ul className="space-y-3.5 text-sm text-[var(--foreground)]/90 flex-1">
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span><strong>Unlimited</strong> AI Tutor interactions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span>Verified PDF Graduation Certificates</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span>AI Code review & Python workspace execution</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span>Visual Homework Solver (PDF/Image scan)</span>
              </li>
            </ul>
            <Link
              href="/auth?tier=pro"
              className="mt-8 block w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-center py-3 text-sm font-semibold shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all hover:scale-105"
            >
              Get Pro Access
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 border-b border-[var(--card-border)]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[var(--foreground)] mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 space-y-2 glass-panel">
              <h4 className="font-semibold text-base text-[var(--foreground)] flex items-start space-x-2">
                <HelpCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[var(--background)] mt-auto border-t border-[var(--card-border)]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} AI Learning Hub Inc. All rights reserved. Made for premium education.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-[var(--muted)]">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Stripe Pricing Details</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
