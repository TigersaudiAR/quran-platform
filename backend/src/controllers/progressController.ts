import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { progressRecords, users } from '../data/store';
import { surahs } from '../data/surahs';
import { MemorizationProgress, MemorizationStatus } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getMyProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const userProgress = Array.from(progressRecords.values()).filter(p => p.userId === userId);
    
    // Enrich with surah info
    const enrichedProgress = userProgress.map(p => {
      const surah = surahs.find(s => s.id === p.surahId);
      return {
        ...p,
        surahName: surah?.name,
        surahNameArabic: surah?.nameArabic
      };
    });

    res.json({
      success: true,
      data: enrichedProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { surahId, ayahStart, ayahEnd, status } = req.body;

    // Validate input
    if (!surahId || !ayahStart || !ayahEnd) {
      res.status(400).json({ success: false, error: 'surahId, ayahStart, and ayahEnd are required' });
      return;
    }

    // Check if surah exists
    const surah = surahs.find(s => s.id === surahId);
    if (!surah) {
      res.status(404).json({ success: false, error: 'Surah not found' });
      return;
    }

    // Validate ayah range
    if (ayahStart < 1 || ayahEnd > surah.ayahCount || ayahStart > ayahEnd) {
      res.status(400).json({ success: false, error: 'Invalid ayah range' });
      return;
    }

    const progressId = uuidv4();
    const newProgress: MemorizationProgress = {
      id: progressId,
      userId,
      surahId,
      ayahStart,
      ayahEnd,
      status: status || MemorizationStatus.IN_PROGRESS,
      lastReviewDate: null,
      nextReviewDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    progressRecords.set(progressId, newProgress);

    res.status(201).json({
      success: true,
      data: {
        ...newProgress,
        surahName: surah.name,
        surahNameArabic: surah.nameArabic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const progressId = req.params.id;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const progress = progressRecords.get(progressId);
    
    if (!progress) {
      res.status(404).json({ success: false, error: 'Progress record not found' });
      return;
    }

    if (progress.userId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to update this record' });
      return;
    }

    const { status, lastReviewDate, nextReviewDate } = req.body;

    if (status) {
      progress.status = status;
    }
    if (lastReviewDate) {
      progress.lastReviewDate = new Date(lastReviewDate);
    }
    if (nextReviewDate) {
      progress.nextReviewDate = new Date(nextReviewDate);
    }
    progress.updatedAt = new Date();

    progressRecords.set(progressId, progress);

    const surah = surahs.find(s => s.id === progress.surahId);

    res.json({
      success: true,
      data: {
        ...progress,
        surahName: surah?.name,
        surahNameArabic: surah?.nameArabic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const progressId = req.params.id;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const progress = progressRecords.get(progressId);
    
    if (!progress) {
      res.status(404).json({ success: false, error: 'Progress record not found' });
      return;
    }

    if (progress.userId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to delete this record' });
      return;
    }

    progressRecords.delete(progressId);

    res.json({
      success: true,
      message: 'Progress record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getProgressStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const userProgress = Array.from(progressRecords.values()).filter(p => p.userId === userId);
    
    const stats = {
      totalRecords: userProgress.length,
      memorized: userProgress.filter(p => p.status === MemorizationStatus.MEMORIZED).length,
      inProgress: userProgress.filter(p => p.status === MemorizationStatus.IN_PROGRESS).length,
      needsReview: userProgress.filter(p => p.status === MemorizationStatus.NEEDS_REVIEW).length,
      totalAyahsMemorized: userProgress
        .filter(p => p.status === MemorizationStatus.MEMORIZED)
        .reduce((sum, p) => sum + (p.ayahEnd - p.ayahStart + 1), 0),
      surahsStarted: [...new Set(userProgress.map(p => p.surahId))].length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getStudentProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.params.studentId;
    
    const student = users.get(studentId);
    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    const studentProgress = Array.from(progressRecords.values()).filter(p => p.userId === studentId);
    
    const enrichedProgress = studentProgress.map(p => {
      const surah = surahs.find(s => s.id === p.surahId);
      return {
        ...p,
        surahName: surah?.name,
        surahNameArabic: surah?.nameArabic
      };
    });

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          email: student.email
        },
        progress: enrichedProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
