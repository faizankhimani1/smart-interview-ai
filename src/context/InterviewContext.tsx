import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Role, Level, AptitudeQuestion, TechnicalQuestion, HRQuestion } from '../data/questions';
import type { RoundScore, FinalReport } from '../data/scoring';
import { type AppScreen, type InterviewRound, type InterviewSession, initialSession } from '../store/interviewStore';

type Action =
  | { type: 'SET_SCREEN'; screen: AppScreen }
  | {
      type: 'INIT_SESSION';
      userName: string;
      role: Role;
      level: Level;
      aptitudeQuestions: AptitudeQuestion[];
      technicalQuestions: TechnicalQuestion[];
      hrQuestions: HRQuestion[];
    }
  | { type: 'SET_APTITUDE_ANSWER'; index: number; answer: number }
  | { type: 'SET_TECHNICAL_ANSWER'; index: number; answer: string }
  | { type: 'SET_HR_ANSWER'; index: number; answer: string }
  | { type: 'ADD_ROUND_SCORE'; score: RoundScore }
  | { type: 'SET_FINAL_REPORT'; report: FinalReport }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_QUESTION_INDEX'; index: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_SESSION' };

function reducer(state: InterviewSession, action: Action): InterviewSession {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };

    case 'INIT_SESSION': {
      const rounds: InterviewRound[] =
        action.level === 'fresher'
          ? ['aptitude', 'technical', 'hr']
          : ['technical', 'hr'];
      return {
        ...state,
        userName: action.userName,
        role: action.role,
        level: action.level,
        rounds,
        aptitudeQuestions: action.aptitudeQuestions,
        technicalQuestions: action.technicalQuestions,
        hrQuestions: action.hrQuestions,
        aptitudeAnswers: new Array(action.aptitudeQuestions.length).fill(-1),
        technicalAnswers: new Array(action.technicalQuestions.length).fill(''),
        hrAnswers: new Array(action.hrQuestions.length).fill(''),
        currentRoundIndex: 0,
        currentQuestionIndex: 0,
        roundScores: [],
        finalReport: null,
        startTime: new Date(),
      };
    }

    case 'SET_APTITUDE_ANSWER': {
      const answers = [...state.aptitudeAnswers];
      answers[action.index] = action.answer;
      return { ...state, aptitudeAnswers: answers };
    }

    case 'SET_TECHNICAL_ANSWER': {
      const answers = [...state.technicalAnswers];
      answers[action.index] = action.answer;
      return { ...state, technicalAnswers: answers };
    }

    case 'SET_HR_ANSWER': {
      const answers = [...state.hrAnswers];
      answers[action.index] = action.answer;
      return { ...state, hrAnswers: answers };
    }

    case 'ADD_ROUND_SCORE':
      return { ...state, roundScores: [...state.roundScores, action.score] };

    case 'SET_FINAL_REPORT':
      return { ...state, finalReport: action.report };

    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };

    case 'PREV_QUESTION':
      return { ...state, currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1) };

    case 'SET_QUESTION_INDEX':
      return { ...state, currentQuestionIndex: action.index };

    case 'NEXT_ROUND':
      return { ...state, currentRoundIndex: state.currentRoundIndex + 1, currentQuestionIndex: 0 };

    case 'RESET_SESSION':
      return { ...initialSession };

    default:
      return state;
  }
}

interface InterviewContextType {
  state: InterviewSession;
  setScreen: (screen: AppScreen) => void;
  initSession: (
    userName: string,
    role: Role,
    level: Level,
    aptitudeQuestions: AptitudeQuestion[],
    technicalQuestions: TechnicalQuestion[],
    hrQuestions: HRQuestion[]
  ) => void;
  setAptitudeAnswer: (index: number, answer: number) => void;
  setTechnicalAnswer: (index: number, answer: string) => void;
  setHRAnswer: (index: number, answer: string) => void;
  addRoundScore: (score: RoundScore) => void;
  setFinalReport: (report: FinalReport) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setQuestionIndex: (index: number) => void;
  nextRound: () => void;
  resetSession: () => void;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialSession);

  const setScreen = useCallback((screen: AppScreen) => dispatch({ type: 'SET_SCREEN', screen }), []);
  const initSession = useCallback(
    (userName: string, role: Role, level: Level, aq: AptitudeQuestion[], tq: TechnicalQuestion[], hq: HRQuestion[]) =>
      dispatch({ type: 'INIT_SESSION', userName, role, level, aptitudeQuestions: aq, technicalQuestions: tq, hrQuestions: hq }),
    []
  );
  const setAptitudeAnswer = useCallback((index: number, answer: number) => dispatch({ type: 'SET_APTITUDE_ANSWER', index, answer }), []);
  const setTechnicalAnswer = useCallback((index: number, answer: string) => dispatch({ type: 'SET_TECHNICAL_ANSWER', index, answer }), []);
  const setHRAnswer = useCallback((index: number, answer: string) => dispatch({ type: 'SET_HR_ANSWER', index, answer }), []);
  const addRoundScore = useCallback((score: RoundScore) => dispatch({ type: 'ADD_ROUND_SCORE', score }), []);
  const setFinalReport = useCallback((report: FinalReport) => dispatch({ type: 'SET_FINAL_REPORT', report }), []);
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV_QUESTION' }), []);
  const setQuestionIndex = useCallback((index: number) => dispatch({ type: 'SET_QUESTION_INDEX', index }), []);
  const nextRound = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []);
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);

  return (
    <InterviewContext.Provider
      value={{
        state,
        setScreen,
        initSession,
        setAptitudeAnswer,
        setTechnicalAnswer,
        setHRAnswer,
        addRoundScore,
        setFinalReport,
        nextQuestion,
        prevQuestion,
        setQuestionIndex,
        nextRound,
        resetSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider');
  return ctx;
}
