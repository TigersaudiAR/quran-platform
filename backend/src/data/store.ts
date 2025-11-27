import { User, MemorizationProgress, Halaqah, UserRole, MemorizationStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory stores
export const users: Map<string, User> = new Map();
export const progressRecords: Map<string, MemorizationProgress> = new Map();
export const halaqat: Map<string, Halaqah> = new Map();

// Initialize with default admin user
const initializeData = async () => {
  const adminId = uuidv4();
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser: User = {
    id: adminId,
    email: 'admin@quran-platform.com',
    password: hashedPassword,
    name: 'مدير النظام',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.set(adminId, adminUser);
  
  // Create a sample teacher
  const teacherId = uuidv4();
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  
  const teacherUser: User = {
    id: teacherId,
    email: 'teacher@quran-platform.com',
    password: teacherPassword,
    name: 'الشيخ أحمد',
    role: UserRole.TEACHER,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.set(teacherId, teacherUser);
  
  // Create a sample student
  const studentId = uuidv4();
  const studentPassword = await bcrypt.hash('student123', 10);
  
  const studentUser: User = {
    id: studentId,
    email: 'student@quran-platform.com',
    password: studentPassword,
    name: 'محمد عبدالله',
    role: UserRole.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.set(studentId, studentUser);
  
  // Create sample memorization progress for the student
  const progressId = uuidv4();
  const progress: MemorizationProgress = {
    id: progressId,
    userId: studentId,
    surahId: 1,
    ayahStart: 1,
    ayahEnd: 7,
    status: MemorizationStatus.MEMORIZED,
    lastReviewDate: new Date(),
    nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  progressRecords.set(progressId, progress);
  
  // Create a sample halaqah
  const halaqahId = uuidv4();
  const sampleHalaqah: Halaqah = {
    id: halaqahId,
    name: 'حلقة الفاتحين',
    teacherId: teacherId,
    studentIds: [studentId],
    description: 'حلقة لتحفيظ القرآن الكريم للمبتدئين',
    schedule: 'السبت والأحد والاثنين - 5:00 مساءً',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  halaqat.set(halaqahId, sampleHalaqah);
};

initializeData().catch(console.error);

export { initializeData };
