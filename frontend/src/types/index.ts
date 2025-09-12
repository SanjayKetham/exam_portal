export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  category: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  grade: string;
  passed: boolean;
}

export interface Certificate {
  id: string;
  examId: string;
  examTitle: string;
  issuedAt: string;
  certificateUrl: string;
  grade: string;
}

export type SidebarSection = 'overview' | 'exams' | 'results' | 'certificates' | 'settings';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    role?: 'user' | 'admin';
  };
}