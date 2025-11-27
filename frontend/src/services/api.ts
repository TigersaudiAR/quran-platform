import axios from 'axios';
import type { 
  ApiResponse, 
  AuthResponse, 
  User, 
  Surah, 
  Ayah, 
  MemorizationProgress, 
  ProgressStats, 
  Halaqah 
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { email, password, name });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Registration failed');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get profile');
  },
};

// Quran API
export const quranApi = {
  getSurahs: async (): Promise<Surah[]> => {
    const response = await api.get<ApiResponse<Surah[]>>('/quran/surahs');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get surahs');
  },

  getSurah: async (id: number): Promise<Surah> => {
    const response = await api.get<ApiResponse<Surah>>(`/quran/surahs/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get surah');
  },

  getAyahs: async (surahId: number): Promise<{ surah: Surah; ayahs: Ayah[] }> => {
    const response = await api.get<ApiResponse<{ surah: Surah; ayahs: Ayah[] }>>(`/quran/surahs/${surahId}/ayahs`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get ayahs');
  },

  getPage: async (pageNumber: number): Promise<{ page: number; ayahs: Ayah[] }> => {
    const response = await api.get<ApiResponse<{ page: number; ayahs: Ayah[] }>>(`/quran/pages/${pageNumber}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get page');
  },
};

// Progress API
export const progressApi = {
  getProgress: async (): Promise<MemorizationProgress[]> => {
    const response = await api.get<ApiResponse<MemorizationProgress[]>>('/progress');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get progress');
  },

  getStats: async (): Promise<ProgressStats> => {
    const response = await api.get<ApiResponse<ProgressStats>>('/progress/stats');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get stats');
  },

  createProgress: async (data: {
    surahId: number;
    ayahStart: number;
    ayahEnd: number;
    status?: string;
  }): Promise<MemorizationProgress> => {
    const response = await api.post<ApiResponse<MemorizationProgress>>('/progress', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create progress');
  },

  updateProgress: async (id: string, data: {
    status?: string;
    lastReviewDate?: string;
    nextReviewDate?: string;
  }): Promise<MemorizationProgress> => {
    const response = await api.put<ApiResponse<MemorizationProgress>>(`/progress/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update progress');
  },

  deleteProgress: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/progress/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete progress');
    }
  },
};

// Halaqah API
export const halaqahApi = {
  getHalaqat: async (): Promise<Halaqah[]> => {
    const response = await api.get<ApiResponse<Halaqah[]>>('/halaqat');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get halaqat');
  },

  getHalaqah: async (id: string): Promise<Halaqah> => {
    const response = await api.get<ApiResponse<Halaqah>>(`/halaqat/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get halaqah');
  },

  createHalaqah: async (data: {
    name: string;
    description?: string;
    schedule?: string;
  }): Promise<Halaqah> => {
    const response = await api.post<ApiResponse<Halaqah>>('/halaqat', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create halaqah');
  },

  addStudent: async (halaqahId: string, studentId: string): Promise<void> => {
    const response = await api.post<ApiResponse<void>>(`/halaqat/${halaqahId}/students`, { studentId });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to add student');
    }
  },

  removeStudent: async (halaqahId: string, studentId: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/halaqat/${halaqahId}/students/${studentId}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to remove student');
    }
  },
};

export default api;
