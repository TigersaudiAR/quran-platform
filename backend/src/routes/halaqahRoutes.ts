import { Router } from 'express';
import {
  getAllHalaqat,
  getHalaqahById,
  createHalaqah,
  updateHalaqah,
  addStudentToHalaqah,
  removeStudentFromHalaqah,
  deleteHalaqah
} from '../controllers/halaqahController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get halaqat (filtered by role)
router.get('/', getAllHalaqat);
router.get('/:id', getHalaqahById);

// Create/Update halaqah - Admin and Teachers
router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), createHalaqah);
router.put('/:id', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), updateHalaqah);

// Manage students in halaqah
router.post('/:id/students', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), addStudentToHalaqah);
router.delete('/:id/students/:studentId', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), removeStudentFromHalaqah);

// Delete halaqah
router.delete('/:id', authorizeRoles(UserRole.ADMIN, UserRole.TEACHER), deleteHalaqah);

export default router;
