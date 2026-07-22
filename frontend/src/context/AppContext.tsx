"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  unlockedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageUrl?: string;
  lessons: { id: string; title: string; content?: string; orderIndex: number }[];
  quizzes: { id: string; title: string; questions?: { id: string; questionText: string; type: string; options: string; correctAnswer: string }[] }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "achievement";
  time: Date;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  theme: "dark" | "light";
  courses: Course[];
  notifications: Notification[];
  login: (token: string, user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  addNotification: (title: string, message: string, type: Notification["type"]) => void;
  updateUserStats: (xp: number, level: number, achievements?: Achievement[]) => void;
  setCoursesList: (courses: Course[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load auth state from LocalStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("hub_token");
    const storedUser = localStorage.getItem("hub_user");
    const storedTheme = localStorage.getItem("hub_theme") as "dark" | "light";

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.className = storedTheme === "light" ? "light-theme" : "";
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("hub_token", newToken);
    localStorage.setItem("hub_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    addNotification("Welcome!", `Glad to have you back, ${newUser.name}!`, "success");
  };

  const logout = () => {
    localStorage.removeItem("hub_token");
    localStorage.removeItem("hub_user");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("hub_theme", nextTheme);
    document.documentElement.className = nextTheme === "light" ? "light-theme" : "";
    addNotification("Theme Updated", `Switched to ${nextTheme} mode.`, "info");
  };

  const addNotification = (title: string, message: string, type: Notification["type"]) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      time: new Date()
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 15)); // Keep last 15
  };

  const updateUserStats = (xp: number, level: number, achievements?: Achievement[]) => {
    if (!user) return;
    const updatedUser = { ...user, xp, level };
    if (achievements) {
      updatedUser.achievements = achievements;
    }
    setUser(updatedUser);
    localStorage.setItem("hub_user", JSON.stringify(updatedUser));
  };

  const setCoursesList = (coursesList: Course[]) => {
    setCourses(coursesList);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        theme,
        courses,
        notifications,
        login,
        logout,
        toggleTheme,
        addNotification,
        updateUserStats,
        setCoursesList
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
