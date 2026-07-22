# AI Learning Hub

A premium, production-ready AI-powered education platform designed for students to study core disciplines (Mathematics, Science, Programming, and Web Development) with step-by-step AI tutoring, timed quizzes, gamified achievements, interactive coding playgrounds, and visual homework scanning.

## Technology Stack

* **Frontend**: React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
* **Backend**: Node.js, Express, TypeScript, Prisma ORM, JSON Web Tokens (JWT), Bcrypt, OpenAI API.
* **Database**: SQLite (out-of-the-box local development), compatible with PostgreSQL.

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd "C:\website 05"
   ```

2. Install backend dependencies and set up the database:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

---

## Running the Application

### 1. Launch the Backend API Server
Navigate to the `backend` directory and run:
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

### 2. Launch the Frontend Next.js Client
Navigate to the `frontend` directory and run:
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Test Credentials

### Administrator Account
To log in as the default professor to access the **Admin Panel** (which includes user management, course publishing forms, and AI usage logs):
* **Email**: `admin@ailearninghub.com`
* **Password**: `admin123`

### Student Account
You can register an email using the signup form, or click the **Google Sign-In** button, which simulates an active student profile with immediate XP levels, learning streaks, and certificates.

---

## Key Features

1. **AI Tutor Chat**: adaptively explains topics at Beginner, Intermediate, or Advanced levels across 4 modes (Concept Explainer, Step-by-step mathematical derivation, Quiz maker, and Flashcards review).
2. **Interactive Courses**: complete textbook modules, play lecture recordings, and take timed checking exams to earn XP and cryptographic certificates of graduation.
3. **Coding Playground**: write HTML/CSS/JS with real-time browser preview, run Python programs, and get instant senior developer refactoring feedback.
4. **Homework Assistant**: drag-and-drop worksheets to run mock scanning loaders, extract text, and receive mathematical derivations.
5. **Gamification**: unlock achievements, increment study streaks, track levels, and monitor XP progress.
