import { Router } from 'express';
import {
  getMyProgress,
  createProgress,
  updateProgress,
  deleteProgress,
  getProgressStats,
  getStudentProgress
} from '../controllers/progressController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Student/Personal progress routes
router.get('/', getMyProgress);
router.get('/stats', getProgressStats);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.delete('/:id', deleteProgress);

// Teacher/Admin routes - view student progress
router.get('/student/:studentId', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), getStudentProgress);

export default router;
