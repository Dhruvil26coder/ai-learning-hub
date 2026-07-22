"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { api } from "@/utils/api";
import { useGoogleLogin } from "@react-oauth/google";
import { Sparkles, Mail, Lock, User, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("tier") === "pro") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error("Name is required");
        const res = await api.register({ email, password, name });
        login(res.token, res.user);
      } else {
        const res = await api.login({ email, password });
        login(res.token, res.user);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Real Google OAuth login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        // Fetch user info from Google using the access token
        const googleUserRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await googleUserRes.json();

        // Send to our backend to create/login user
        const res = await api.loginGoogle({
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
        });
        login(res.token, res.user);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Google Sign-In failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Sign-In was cancelled or failed. Please try again.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-pink-500/10 blur-[80px]" />

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              AI Learning Hub
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            {isSignUp ? "Start your journey today" : "Access your personalized workspace"}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-xl glass-panel relative">
          {error && (
            <div className="mb-4 flex items-center space-x-2 rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-red-500 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 rounded-xl border border-[var(--card-border)] bg-white hover:bg-gray-50 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md disabled:opacity-50 mb-6"
          >
            {/* Official Google SVG Logo */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          <div className="my-5 flex items-center justify-between">
            <span className="w-2/5 border-b border-[var(--card-border)]" />
            <span className="text-xs uppercase tracking-wider text-[var(--muted)]">or</span>
            <span className="w-2/5 border-b border-[var(--card-border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--foreground)]/80">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alice Cooper"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--foreground)]/80">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--foreground)]/80">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset link simulated sent to your email!")}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg transition-colors flex items-center justify-center space-x-2 disabled:bg-indigo-700 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : isSignUp ? "Sign Up" : "Sign In"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[var(--muted)] font-medium hover:text-indigo-400 transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-md" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
