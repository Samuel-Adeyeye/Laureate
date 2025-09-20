export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetUniversity: string;
  subjects: string[];
  currentLevel: string;
  studyGoal: string;
  createdAt: Date;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  totalWeeks: number;
  currentWeek: number;
  subjects: Subject[];
  progress: number;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  progress: number;
  topics: Topic[];
  nextLesson?: MicroLesson;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

export interface MicroLesson {
  id: string;
  title: string;
  subject: string;
  content: string;
  audioNote?: string;
  duration: number;
  questions: Question[];
  completed: boolean;
  scheduledDate: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
  year?: number;
}

export interface MockTest {
  id: string;
  title: string;
  type: 'UTME' | 'POST-UTME';
  duration: number;
  subjects: string[];
  questions: Question[];
  totalMarks: number;
  passThreshold: number;
}

export interface TestResult {
  id: string;
  mockTestId: string;
  userId: string;
  score: number;
  percentage: number;
  timeSpent: number;
  answers: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  completedAt: Date;
}

export interface Analytics {
  overallProgress: number;
  strongSubjects: string[];
  weakSubjects: string[];
  studyStreak: number;
  weeklyProgress: number[];
  recentScores: number[];
  timeSpentToday: number;
  lessonsCompleted: number;
  testsCompleted: number;
}

export interface CampusService {
  id: string;
  type: 'announcement' | 'fee' | 'location';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  date: Date;
  actionRequired?: boolean;
  location?: {
    name: string;
    coordinates: [number, number];
    mapLink: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  targetUniversity: string;
  subjects: string[];
  currentLevel: string;
  studyGoal: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  targetUniversity: string;
  currentLevel: string;
  studyGoal: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}