import { db } from '@/lib/db';

interface UserStats {
  completedLessons: string[];
  failedLessons: string[];
  lastStudyDate: Date | null;
  skillLevels: Record<string, number>;
}

interface LessonScore {
  lessonId: string;
  score: number;
}

export async function getNextLessons(userId: string, limit: number = 5): Promise<string[]> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lastStudyDate: true },
  });

  const completedIds = await db.userLesson.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });

  const failedIds = await db.userLesson.findMany({
    where: { userId, completed: false, attempts: { gt: 0 } },
    select: { lessonId: true },
  });

  const stats: UserStats = {
    completedLessons: completedIds.map((l) => l.lessonId),
    failedLessons: failedIds.map((l) => l.lessonId),
    lastStudyDate: user?.lastStudyDate || null,
    skillLevels: {},
  };

  const lessons = await db.lesson.findMany({
    where: { isPublished: true, id: { notIn: stats.completedLessons } },
    select: { id: true, difficulty: true },
  });

  const scored = rankLessons(lessons, stats);
  return scored.slice(0, limit).map((s) => s.lessonId);
}

export function rankLessons(
  lessons: Array<{ id: string; difficulty: number }>,
  stats: UserStats
): LessonScore[] {
  const now = Date.now();
  const daysSinceStudy = stats.lastStudyDate
    ? (now - stats.lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
    : 7;

  return lessons
    .map((lesson) => {
      const skillGap = lesson.difficulty * 0.4;
      const recentFailure = stats.failedLessons.includes(lesson.id) ? 0.3 : 0;
      const timeDecay = Math.min(daysSinceStudy / 7, 1) * 0.2;
      const interest = 0.1;

      const score = skillGap + recentFailure + timeDecay + interest;
      return { lessonId: lesson.id, score };
    })
    .sort((a, b) => b.score - a.score);
}
