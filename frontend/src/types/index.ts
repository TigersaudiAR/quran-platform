// User types
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Surah types
export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  revelationType: 'meccan' | 'medinan';
  ayahCount: number;
  order: number;
}

// Ayah types
export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  text: string;
  juz: number;
  page: number;
}

// Memorization types
export enum MemorizationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  MEMORIZED = 'memorized',
  NEEDS_REVIEW = 'needs_review'
}

export interface MemorizationProgress {
  id: string;
  userId: string;
  surahId: number;
  surahName?: string;
  surahNameArabic?: string;
  ayahStart: number;
  ayahEnd: number;
  status: MemorizationStatus;
  lastReviewDate: string | null;
  nextReviewDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  totalRecords: number;
  memorized: number;
  inProgress: number;
  needsReview: number;
  totalAyahsMemorized: number;
  surahsStarted: number;
}

// Halaqah types
export interface Halaqah {
  id: string;
  name: string;
  teacherId: string;
  teacherName?: string;
  studentIds: string[];
  studentCount?: number;
  description: string;
  schedule: string;
  createdAt: string;
  updatedAt: string;
}

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
