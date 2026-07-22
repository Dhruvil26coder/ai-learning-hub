import { Router, Response } from "express";
import prisma from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Helper function to add XP and calculate level ups
async function rewardXP(userId: string, xpAmount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const newXp = user.xp + xpAmount;
  // Let's say each level requires: level * 500 XP
  // E.g., level 1 -> 500 XP to get to level 2.
  // level 2 -> 1000 XP to get to level 3, etc.
  // Or simpler: Level = floor(xp / 500) + 1
  const newLevel = Math.floor(newXp / 500) + 1;
  const leveledUp = newLevel > user.level;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel
    }
  });

  if (leveledUp) {
    // Add level up achievement
    await prisma.achievement.create({
      data: {
        userId,
        title: `Reached Level ${newLevel}!`,
        description: `Unlocked higher tier courses and topics.`,
        badgeIcon: "Award"
      }
    });
  }

  return {
    xp: updatedUser.xp,
    level: updatedUser.level,
    leveledUp
  };
}

// @route   GET /api/courses
// @desc    Get all courses, optionally by category
router.get("/", async (req: any, res: any) => {
  try {
    const { category } = req.query;
    const whereClause = category ? { category: String(category) } : {};

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        lessons: {
          select: { id: true, title: true, orderIndex: true }
        },
        quizzes: {
          select: { id: true, title: true }
        }
      }
    });

    res.json(courses);
  } catch (error: any) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   GET /api/courses/leaderboard
// @desc    Get top learners sorted by XP
router.get("/leaderboard", async (req: any, res: any) => {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        xp: true,
        level: true,
        streak: true
      },
      orderBy: { xp: "desc" },
      take: 10
    });
    res.json(topUsers);
  } catch (error: any) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course with details
router.get("/:id", async (req: any, res: any) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" }
        },
        quizzes: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error: any) {
    console.error("Get Course Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @desc    Mark a lesson as completed
router.post(
  "/:id/lessons/:lessonId/complete",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { lessonId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if already completed
      const existing = await prisma.progress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId }
        }
      });

      if (existing) {
        return res.json({ message: "Lesson already completed", xpGained: 0 });
      }

      // Record progress
      await prisma.progress.create({
        data: { userId, lessonId }
      });

      // Reward 50 XP
      const xpResult = await rewardXP(userId, 50);

      res.json({
        message: "Lesson completed successfully!",
        xpGained: 50,
        xpResult
      });
    } catch (error: any) {
      console.error("Complete Lesson Error:", error);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }
);

// @route   POST /api/courses/:id/quizzes/:quizId/submit
// @desc    Submit a quiz score
router.post(
  "/:id/quizzes/:quizId/submit",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { quizId } = req.params;
      const { answers } = req.body; // Map of questionId -> studentAnswer string

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true }
      });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      let correctCount = 0;
      const results = quiz.questions.map((q) => {
        const studentAns = answers?.[q.id] || "";
        const isCorrect = q.correctAnswer.trim().toLowerCase() === studentAns.trim().toLowerCase();
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
          studentAnswer: studentAns,
          correct: isCorrect
        };
      });

      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const passed = score >= 70; // 70% passing threshold

      // Save submission
      await prisma.submission.create({
        data: {
          userId,
          quizId,
          score,
          passed
        }
      });

      // Reward XP (+150 for passing, +25 participation for failing)
      const xpReward = passed ? 150 : 25;
      const xpResult = await rewardXP(userId, xpReward);

      // Check if they completed all quizzes in this course -> Award Course Completion Certificate
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: { quizzes: true }
      });

      let certificateUnlocked = false;
      if (course && passed) {
        const allQuizIds = course.quizzes.map((q) => q.id);
        const successfulSubmissions = await prisma.submission.findMany({
          where: {
            userId,
            quizId: { in: allQuizIds },
            passed: true
          }
        });

        const completedQuizIds = new Set(successfulSubmissions.map((s) => s.quizId));
        const allCompleted = allQuizIds.every((id) => completedQuizIds.has(id));

        if (allCompleted) {
          // Check if certificate achievement already exists
          const existingCert = await prisma.achievement.findFirst({
            where: {
              userId,
              title: `${course.title} Graduate`
            }
          });

          if (!existingCert) {
            certificateUnlocked = true;
            await prisma.achievement.create({
              data: {
                userId,
                title: `${course.title} Graduate`,
                description: `Successfully mastered all concepts and passed the examinations for ${course.title}.`,
                badgeIcon: "ShieldAlert" // Let's use a nice icon representation
              }
            });
            // Extra XP bonus for graduating
            await rewardXP(userId, 300);
          }
        }
      }

      res.json({
        score,
        passed,
        correctCount,
        totalQuestions: quiz.questions.length,
        results,
        xpGained: xpReward,
        xpResult,
        certificateUnlocked
      });
    } catch (error: any) {
      console.error("Submit Quiz Error:", error);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  }
);

export default router;
