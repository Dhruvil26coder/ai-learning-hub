import { Router } from "express";
import prisma from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/standards — All classes 1-12
router.get("/", async (req: any, res: any) => {
  try {
    const standards = await prisma.standard.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: { select: { subjects: true } }
      }
    });
    res.json(standards);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// GET /api/standards/:classNum/subjects — All subjects for a class
router.get("/:classNum/subjects", async (req: any, res: any) => {
  try {
    const classNum = parseInt(req.params.classNum);
    const subjects = await prisma.subject.findMany({
      where: { standardId: classNum },
      include: {
        _count: { select: { chapters: true } }
      },
      orderBy: { name: "asc" }
    });
    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// GET /api/standards/:classNum/subjects/:subjectId/chapters — All chapters
router.get("/:classNum/subjects/:subjectId/chapters", async (req: any, res: any) => {
  try {
    const { subjectId } = req.params;
    const chapters = await prisma.chapter.findMany({
      where: { subjectId },
      orderBy: { orderIndex: "asc" }
    });
    res.json(chapters);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// GET /api/standards/chapters/:chapterId — Single chapter detail
router.get("/chapters/:chapterId", async (req: any, res: any) => {
  try {
    const { chapterId } = req.params;
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { subject: { include: { standard: true } } }
    });
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.json(chapter);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// POST /api/standards/chapters/:chapterId/complete — Mark chapter as complete
router.post("/chapters/:chapterId/complete", authenticateToken, async (req: AuthenticatedRequest, res: any) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user?.id!;
    const existing = await prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } }
    });
    if (existing) return res.json({ message: "Already completed", progress: existing });

    const progress = await prisma.chapterProgress.create({
      data: { userId, chapterId }
    });

    // Award XP for completing a chapter
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 25 } }
    });

    res.json({ message: "Chapter completed! +25 XP", progress });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// GET /api/standards/progress — Get user's completed chapters
router.get("/progress/me", authenticateToken, async (req: AuthenticatedRequest, res: any) => {
  try {
    const userId = req.user?.id!;
    const progress = await prisma.chapterProgress.findMany({
      where: { userId },
      select: { chapterId: true }
    });
    res.json(progress.map(p => p.chapterId));
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export default router;
