export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: QuestionDifficulty;
  timeLimit: number; // in seconds
}

export interface Answer {
  questionId: string;
  text: string;
  timestamp: number;
  timeSpent: number;
  score?: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFile?: File;
}

export interface InterviewSession {
  id: string;
  candidateProfile: CandidateProfile;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  status: 'not_started' | 'collecting_info' | 'in_progress' | 'completed' | 'paused';
  startTime?: number;
  endTime?: number;
  finalScore?: number;
  aiSummary?: string;
  timeRemaining?: number;
}

export interface AppState {
  sessions: InterviewSession[];
  currentSessionId: string | null;
  activeTab: 'interviewee' | 'interviewer';
}