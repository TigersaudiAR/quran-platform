// User roles
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

// User interface
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Surah interface
export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  revelationType: 'meccan' | 'medinan';
  ayahCount: number;
  order: number;
}

// Ayah interface
export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  text: string;
  juz: number;
  page: number;
}

// Memorization status
export enum MemorizationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  MEMORIZED = 'memorized',
  NEEDS_REVIEW = 'needs_review'
}

// Memorization progress
export interface MemorizationProgress {
  id: string;
  userId: string;
  surahId: number;
  ayahStart: number;
  ayahEnd: number;
  status: MemorizationStatus;
  lastReviewDate: Date | null;
  nextReviewDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Halaqah (Class) interface
export interface Halaqah {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  description: string;
  schedule: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Auth request with user
export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
