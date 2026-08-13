const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("hub_token") : null;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Something went wrong");
  }

  return response.json();
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  return request(path, options);
}

// Client-side fallback mocks if backend server isn't running
const MOCK_COURSES = [
  {
    id: "mock-webdev",
    title: "Mastering Modern Web Development",
    description: "Learn how to build responsive, accessible, and fast web applications using HTML, CSS, and modern JavaScript.",
    category: "Web Development",
    difficulty: "BEGINNER",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b81169b7b?auto=format&fit=crop&w=800&q=80",
    lessons: [
      { id: "html5-intro", title: "Introduction to HTML5 and Semantics", orderIndex: 1 },
      { id: "css-layouts", title: "CSS Layouts: Flexbox and Grid", orderIndex: 2 }
    ],
    quizzes: [
      { id: "quiz-webdev", title: "Web Foundations Assessment" }
    ]
  },
  {
    id: "mock-python",
    title: "Introduction to Python Programming",
    description: "Dive into computer science concepts using Python. Learn variables, conditionals, loops, functions, and basic algorithms.",
    category: "Programming",
    difficulty: "BEGINNER",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    lessons: [
      { id: "python-basics", title: "Variables and Control Flow in Python", orderIndex: 1 },
      { id: "python-funcs", title: "Writing Reusable Functions", orderIndex: 2 }
    ],
    quizzes: [
      { id: "quiz-python", title: "Python Basics Challenge" }
    ]
  },
  {
    id: "mock-math",
    title: "Foundations of Algebra",
    description: "Master algebraic equations, systems of equations, variables, and coordinate plotting.",
    category: "Mathematics",
    difficulty: "INTERMEDIATE",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    lessons: [
      { id: "algebra-basics", title: "Solving Single Variable Equations", orderIndex: 1 }
    ],
    quizzes: [
      { id: "quiz-math", title: "Linear Equations Checkpoint" }
    ]
  }
];

export const api = {
  // Auth
  async register(data: any) {
    try {
      return await request("/auth/register", { method: "POST", body: JSON.stringify(data) });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        // Mock fallback registration
        const mockUser = {
          id: "mock-student-id",
          email: data.email,
          name: data.name,
          role: "STUDENT",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
          xp: 100,
          level: 1,
          streak: 1
        };
        return { token: "mock_jwt_token", user: mockUser };
      }
      throw err;
    }
  },

  async login(data: any) {
    try {
      return await request("/auth/login", { method: "POST", body: JSON.stringify(data) });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        // Mock fallback login
        const mockUser = {
          id: "mock-student-id",
          email: data.email,
          name: data.name || "Alex Learner",
          role: "STUDENT",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=Alex`,
          xp: 220,
          level: 1,
          streak: 3
        };
        return { token: "mock_jwt_token", user: mockUser };
      }
      throw err;
    }
  },

  async loginGoogle(data: any) {
    try {
      return await request("/auth/google", { method: "POST", body: JSON.stringify(data) });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        const mockUser = {
          id: "mock-google-id",
          email: data.email,
          name: data.name,
          role: "STUDENT",
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
          xp: 150,
          level: 1,
          streak: 1
        };
        return { token: "mock_jwt_token", user: mockUser };
      }
      throw err;
    }
  },

  async getMe() {
    try {
      return await request("/auth/me");
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        const storedUser = localStorage.getItem("hub_user");
        return { user: storedUser ? JSON.parse(storedUser) : null };
      }
      throw err;
    }
  },

  // Courses
  async getCourses(category?: string) {
    try {
      const url = category ? `/courses?category=${encodeURIComponent(category)}` : "/courses";
      return await request(url);
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        if (category) {
          return MOCK_COURSES.filter((c) => c.category === category);
        }
        return MOCK_COURSES;
      }
      throw err;
    }
  },

  async getCourse(id: string) {
    try {
      return await request(`/courses/${id}`);
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        const course = MOCK_COURSES.find((c) => c.id === id || c.id === `mock-${id}`);
        if (!course) throw new Error("Course not found");
        // Inject fuller mock lessons content and questions
        const enhancedLessons = course.lessons.map(l => ({
          ...l,
          content: l.id === "html5-intro" 
            ? `### 🌐 HTML5 Semantics\nHTML5 semantic elements clearly describe their meaning to both the browser and the developer.`
            : `### 🎨 Grid Layout\nCSS Grid is a 2D layout engine for aligning elements in rows and columns.`
        }));
        const enhancedQuizzes = course.quizzes.map(q => ({
          ...q,
          questions: [
            {
              id: "q1",
              questionText: "Is <nav> a semantic HTML5 element?",
              type: "TRUE_FALSE",
              options: JSON.stringify(["True", "False"]),
              correctAnswer: "True"
            }
          ]
        }));
        return { ...course, lessons: enhancedLessons, quizzes: enhancedQuizzes };
      }
      throw err;
    }
  },

  async completeLesson(courseId: string, lessonId: string) {
    try {
      return await request(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: "POST" });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        return { xpGained: 50, xpResult: { xp: 270, level: 1, leveledUp: false } };
      }
      throw err;
    }
  },

  async submitQuiz(courseId: string, quizId: string, answers: any) {
    try {
      return await request(`/courses/${courseId}/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers })
      });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        return {
          score: 100,
          passed: true,
          correctCount: 1,
          totalQuestions: 1,
          xpGained: 150,
          xpResult: { xp: 420, level: 1, leveledUp: false },
          certificateUnlocked: true
        };
      }
      throw err;
    }
  },

  async getLeaderboard() {
    try {
      return await request("/courses/leaderboard");
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        return [
          { id: "1", name: "Sophia Spark", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sophia", xp: 1250, level: 3, streak: 8 },
          { id: "2", name: "Professor Alex", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex", xp: 950, level: 2, streak: 5 },
          { id: "3", name: "Liam Web", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Liam", xp: 720, level: 2, streak: 4 }
        ];
      }
      throw err;
    }
  },

  // AI Tutor
  async sendTutorMessage(data: { message: string; history: any[]; learnerLevel: string; subject: string; mode: string }) {
    try {
      return await request("/tutor/chat", { method: "POST", body: JSON.stringify(data) });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        // Fallback offline simulator logic
        const responseText = `### 🤖 AI Tutor Offline Mode
This response is simulated because the backend server is offline.

* **Concept**: You asked about *"${data.message}"* under the subject *"${data.subject}"* at a **${data.learnerLevel}** level.
* **Explanation**: To master this concept, practice active coding or working out equations.
* **Suggested Next Step**: Read the introductory chapters of the course and try to solve the matching checkpoint quiz.

*Tip: Running the backend server locally using 'npm run dev' enables dynamic explanations.*`;
        return { text: responseText, provider: "client-side-simulation" };
      }
      throw err;
    }
  },

  // Code Playground Review
  async requestReview(data: { code: string; language: string }) {
    try {
      return await request("/playground/review", { method: "POST", body: JSON.stringify(data) });
    } catch (err: any) {
      if (err.message.includes("Failed to fetch")) {
        const reviewText = `### 📊 AI Code Review (Local Simulation)
**Language**: \`${data.language.toUpperCase()}\`

* **Indentation & Structure**: Code layout looks solid.
* **Variable Scoping**: Good scoping choice.
* **Recommendation**: If building large projects, modularize your functions and write unit tests.
* **Optimization**: Time complexity is O(N) where N is the code length. Space complexity is O(1).`;
        return { review: reviewText, provider: "client-side-simulation" };
      }
      throw err;
    }
  }
};
