export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar?: string;
  streak_days: number;
  grade_level?: string;
}

export interface Topic {
  id: number;
  subject_id?: number;
  name: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  order_index?: number;
  mastery_score?: number;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  topics: Topic[];
}

export type FeedbackType = 'NORMAL' | 'CORRECT' | 'GUIDANCE' | 'CHECK_STEP' | 'SOLVED' | 'ENCOURAGEMENT' | 'HINT';

export interface ChatMessage {
  id: number | string;
  sender: 'STUDENT' | 'AI' | 'SYSTEM';
  content: string;
  feedback_type?: FeedbackType;
  hint_step?: number;
  created_at?: string;
}

export interface TutorSession {
  session_id: number;
  title: string;
  difficulty: string;
  status: 'ACTIVE' | 'COMPLETED';
  current_step: number;
  total_steps: number;
  hints_used: number;
  topic?: {
    id: number;
    name: string;
    subject_name?: string;
  };
  messages: ChatMessage[];
}

export interface ProgressSummary {
  overall_progress: number;
  questions_completed: number;
  accuracy_pct: number;
  learning_streak_days: number;
  hints_used: number;
  learning_time: string;
  subject_performance: Array<{
    subject: string;
    score: number;
    target: number;
    color: string;
  }>;
  topic_strength: Array<{
    topic: string;
    mastery: number;
    benchmark: number;
  }>;
  weekly_activity: Array<{
    day: string;
    questions: number;
    minutes: number;
  }>;
  recommendation: string;
}

export interface LearningHistoryItem {
  id: number;
  period: string;
  date_display: string;
  subject: string;
  topic: string;
  problem: string;
  score: string;
  hints_used: number;
  time_spent: string;
  status: string;
  outcome: string;
  badge_color: string;
}

export interface StudentSupportProfile {
  id: number;
  name: string;
  subject: string;
  topic: string;
  accuracy: number;
  struggle_area: string;
  recent_attempts: number;
  recommended_action: string;
  avatar: string;
}

export interface CommonMistake {
  id: number;
  topic: string;
  category: string;
  percentage: number;
  description: string;
  tip?: string;
}

export interface SystemStatus {
  mode: string;
  gemma_configured: boolean;
  system_ready: boolean;
}
