import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "ai_learning_hub_super_secret_key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

// Helper to sign JWT
const signToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new student
router.post("/register", async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: email.startsWith("admin@") ? "ADMIN" : "STUDENT",
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        xp: 100, // starting XP
        level: 1,
        streak: 1
      }
    });

    // Create a welcome achievement
    await prisma.achievement.create({
      data: {
        userId: user.id,
        title: "Welcome aboard!",
        description: "Successfully created your AI Learning Hub account.",
        badgeIcon: "Sparkles"
      }
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login student
router.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Update daily streak
    let currentStreak = user.streak;
    const now = new Date();
    if (user.lastActive) {
      const diffMs = now.getTime() - new Date(user.lastActive).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 24 && diffHours <= 48) {
        currentStreak += 1;
      } else if (diffHours > 48) {
        currentStreak = 1; // reset streak
      }
    } else {
      currentStreak = 1;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActive: now,
        streak: currentStreak
      }
    });

    const token = signToken(updatedUser);

    res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak
      }
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Google Sign-In integration
router.post("/google", async (req: any, res: any) => {
  try {
    const { email, name, avatarUrl } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Missing email or name from Google response" });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: "STUDENT",
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
          xp: 100,
          level: 1,
          streak: 1,
          lastActive: new Date()
        }
      });

      await prisma.achievement.create({
        data: {
          userId: user.id,
          title: "Google Explorer",
          description: "Connected your account via Google Sign-In.",
          badgeIcon: "Chrome"
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastActive: new Date(),
          avatarUrl: avatarUrl || user.avatarUrl
        }
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile and gamification status
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        notes: {
          orderBy: { updatedAt: "desc" },
          take: 5
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
          take: 5
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        createdAt: user.createdAt,
        achievements: user.achievements,
        notes: user.notes,
        submissions: user.submissions
      }
    });
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
