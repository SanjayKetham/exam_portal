import { Exam, ExamResult, Certificate } from '../types';

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    duration: 60,
    totalQuestions: 30,
    status: 'upcoming',
    startDate: '2025-01-15T09:00:00Z',
    endDate: '2025-01-15T10:00:00Z',
    category: 'Programming'
  },
  {
    id: '2',
    title: 'React Development',
    description: 'Comprehensive test covering React hooks, components, and state management.',
    duration: 90,
    totalQuestions: 45,
    status: 'completed',
    startDate: '2025-01-10T14:00:00Z',
    endDate: '2025-01-10T15:30:00Z',
    category: 'Web Development'
  },
  {
    id: '3',
    title: 'Database Design',
    description: 'Test your understanding of database concepts, SQL queries, and data modeling.',
    duration: 75,
    totalQuestions: 35,
    status: 'in-progress',
    startDate: '2025-01-12T10:00:00Z',
    endDate: '2025-01-12T11:15:00Z',
    category: 'Database'
  }
];

export const mockResults: ExamResult[] = [
  {
    id: '1',
    examId: '2',
    examTitle: 'React Development',
    score: 85,
    totalQuestions: 45,
    correctAnswers: 38,
    completedAt: '2025-01-10T15:30:00Z',
    grade: 'A',
    passed: true
  },
  {
    id: '2',
    examId: '4',
    examTitle: 'CSS Advanced Concepts',
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    completedAt: '2025-01-08T16:45:00Z',
    grade: 'A+',
    passed: true
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    examId: '2',
    examTitle: 'React Development',
    issuedAt: '2025-01-10T15:30:00Z',
    certificateUrl: '#',
    grade: 'A'
  },
  {
    id: '2',
    examId: '4',
    examTitle: 'CSS Advanced Concepts',
    issuedAt: '2025-01-08T16:45:00Z',
    certificateUrl: '#',
    grade: 'A+'
  }
];