import type { Role, Level, AptitudeQuestion, TechnicalQuestion, HRQuestion } from '../data/questions';
import type { RoundScore, FinalReport } from '../data/scoring';

export type AppScreen =
  | 'landing'
  | 'setup'
  | 'aptitude'
  | 'technical'
  | 'hr'
  | 'round-complete'
  | 'report';

export type InterviewRound = 'aptitude' | 'technical' | 'hr';

export interface InterviewSession {
  userName: string;
  role: Role;
  level: Level;
  rounds: InterviewRound[];
  currentRoundIndex: number;
  aptitudeQuestions: AptitudeQuestion[];
  technicalQuestions: TechnicalQuestion[];
  hrQuestions: HRQuestion[];
  aptitudeAnswers: number[];
  technicalAnswers: string[];
  hrAnswers: string[];
  roundScores: RoundScore[];
  finalReport: FinalReport | null;
  currentQuestionIndex: number;
  startTime: Date | null;
  currentScreen: AppScreen;
}

export const initialSession: InterviewSession = {
  userName: '',
  role: 'frontend',
  level: 'fresher',
  rounds: [],
  currentRoundIndex: 0,
  aptitudeQuestions: [],
  technicalQuestions: [],
  hrQuestions: [],
  aptitudeAnswers: [],
  technicalAnswers: [],
  hrAnswers: [],
  roundScores: [],
  finalReport: null,
  currentQuestionIndex: 0,
  startTime: null,
  currentScreen: 'landing',
};
