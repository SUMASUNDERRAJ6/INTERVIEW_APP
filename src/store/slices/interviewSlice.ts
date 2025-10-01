import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, InterviewSession, CandidateProfile, Answer, Question } from '../../types/interview';

const initialState: AppState = {
  sessions: [],
  currentSessionId: null,
  activeTab: 'interviewee',
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    createSession: (state, action: PayloadAction<CandidateProfile>) => {
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        candidateProfile: action.payload,
        questions: [],
        answers: [],
        currentQuestionIndex: 0,
        status: 'collecting_info',
      };
      state.sessions.push(newSession);
      state.currentSessionId = newSession.id;
    },

    updateCandidateProfile: (state, action: PayloadAction<Partial<CandidateProfile>>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.candidateProfile = { ...session.candidateProfile, ...action.payload };
      }
    },

    startInterview: (state, action: PayloadAction<Question[]>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.questions = action.payload;
        session.status = 'in_progress';
        session.startTime = Date.now();
        session.currentQuestionIndex = 0;
      }
    },

    submitAnswer: (state, action: PayloadAction<Answer>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.answers.push(action.payload);
        session.currentQuestionIndex += 1;
        
        if (session.currentQuestionIndex >= session.questions.length) {
          session.status = 'completed';
          session.endTime = Date.now();
        }
      }
    },

    pauseInterview: (state, action: PayloadAction<number>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.status = 'paused';
        session.timeRemaining = action.payload;
      }
    },

    resumeInterview: (state) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.status = 'in_progress';
      }
    },

    completeInterview: (state, action: PayloadAction<{ finalScore: number; aiSummary: string }>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        session.status = 'completed';
        session.endTime = Date.now();
        session.finalScore = action.payload.finalScore;
        session.aiSummary = action.payload.aiSummary;
      }
    },

    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload;
    },

    setCurrentSession: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload;
    },

    updateQuestionScore: (state, action: PayloadAction<{ questionId: string; score: number }>) => {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (session) {
        const answer = session.answers.find(a => a.questionId === action.payload.questionId);
        if (answer) {
          answer.score = action.payload.score;
        }
      }
    },
  },
});

export const {
  createSession,
  updateCandidateProfile,
  startInterview,
  submitAnswer,
  pauseInterview,
  resumeInterview,
  completeInterview,
  setActiveTab,
  setCurrentSession,
  updateQuestionScore,
} = interviewSlice.actions;

export default interviewSlice.reducer;