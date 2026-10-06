import { 
  User, Subject, TutorSession, ChatMessage, 
  ProgressSummary, LearningHistoryItem, StudentSupportProfile, 
  CommonMistake, SystemStatus 
} from '../types';

const API_BASE = 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('socratic_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async demoLogin(role: 'STUDENT' | 'TEACHER' | 'ADMIN'): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Demo login failed');
    return res.json();
  },

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid email or password');
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Status
  async getStatus(): Promise<SystemStatus> {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) return res.json();
    } catch {
      // ignore
    }
    return { mode: 'Demo Mode', gemma_configured: false, system_ready: true };
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await fetch(`${API_BASE}/subjects`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  // Tutor
  async startTutorSession(topic_id?: number, title?: string, difficulty?: string): Promise<TutorSession> {
    const res = await fetch(`${API_BASE}/tutor/session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic_id, title, difficulty })
    });
    if (!res.ok) throw new Error('Failed to start session');
    return res.json();
  },

  async sendMessage(session_id: number, content: string): Promise<{
    id: number;
    sender: 'AI';
    content: string;
    feedback_type: string;
    current_step: number;
    total_steps: number;
    status: string;
    is_completed: boolean;
    source: string;
    created_at?: string;
  }> {
    const res = await fetch(`${API_BASE}/tutor/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ session_id, content })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async requestHint(session_id: number): Promise<{
    hint_step: number;
    max_hints: number;
    title: string;
    content: string;
    message: ChatMessage;
  }> {
    const res = await fetch(`${API_BASE}/tutor/hint`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ session_id })
    });
    if (!res.ok) throw new Error('Failed to request hint');
    return res.json();
  },

  async getSession(session_id: number): Promise<TutorSession> {
    const res = await fetch(`${API_BASE}/tutor/session/${session_id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  // Progress & History
  async getProgress(): Promise<ProgressSummary> {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async getHistory(): Promise<LearningHistoryItem[]> {
    const res = await fetch(`${API_BASE}/progress/history`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  // Teacher Dashboard
  async getTeacherDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/teacher/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch teacher dashboard');
    return res.json();
  },

  async getTeacherStudents(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/teacher/students`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch students list');
    return res.json();
  },

  async getStudentsNeedingSupport(): Promise<StudentSupportProfile[]> {
    const res = await fetch(`${API_BASE}/teacher/students-needing-support`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch support students');
    return res.json();
  },

  async getCommonMistakes(): Promise<CommonMistake[]> {
    const res = await fetch(`${API_BASE}/teacher/common-mistakes`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch common mistakes');
    return res.json();
  },

  // Practice
  async getPracticeQuestions(topic_id?: number, difficulty?: string): Promise<any[]> {
    const query = new URLSearchParams();
    if (topic_id) query.append('topic_id', topic_id.toString());
    if (difficulty) query.append('difficulty', difficulty);
    const res = await fetch(`${API_BASE}/practice/questions?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch practice questions');
    return res.json();
  },

  async submitPracticeAnswer(question_id: number, user_answer: string): Promise<any> {
    const res = await fetch(`${API_BASE}/practice/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question_id, user_answer })
    });
    if (!res.ok) throw new Error('Failed to submit answer');
    return res.json();
  },

  // Settings & Gemma AI Configuration
  async getSettings(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/config`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateApiKey(api_key: string): Promise<{ success: boolean; status: any }> {
    const res = await fetch(`${API_BASE}/settings/ai-config`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ api_key })
    });
    if (!res.ok) throw new Error('Failed to update API key');
    return res.json();
  },

  async resetDemoData(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/reset-demo`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  }
};
