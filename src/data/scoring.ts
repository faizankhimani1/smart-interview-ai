export interface ScoreBreakdown {
  correctness: number;
  depth: number;
  clarity: number;
  exampleUsage: number;
  overall: number;
}

export interface QuestionFeedback {
  scores: ScoreBreakdown;
  weakPoints: string[];
  bestPractices: string[];
  improvements: string[];
  recommendedTopics: string[];
  verdict: 'excellent' | 'good' | 'average' | 'poor';
}

export interface RoundScore {
  round: 'aptitude' | 'technical' | 'hr';
  score: number;
  maxScore: number;
  percentage: number;
  questionsAttempted: number;
  correctAnswers?: number;
  feedback: QuestionFeedback[];
}

export interface FinalReport {
  userName: string;
  role: string;
  level: string;
  totalScore: number;
  totalMaxScore: number;
  percentage: number;
  rounds: RoundScore[];
  strengths: string[];
  weaknesses: string[];
  selectionProbability: number;
  selectionCategory: 'Highly Recommended' | 'Recommended' | 'Needs Improvement' | 'Not Recommended';
  learningRecommendations: LearningRecommendation[];
  radarData: RadarDataPoint[];
  completedAt: Date;
}

export interface LearningRecommendation {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  description: string;
}

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

// Evaluate MCQ answers
export function evaluateAptitudeAnswer(
  _questionId: string,
  selectedIndex: number,
  correctIndex: number,
  explanation: string
): QuestionFeedback {
  const isCorrect = selectedIndex === correctIndex;

  return {
    scores: {
      correctness: isCorrect ? 10 : 0,
      depth: isCorrect ? 8 : 2,
      clarity: 10,
      exampleUsage: 5,
      overall: isCorrect ? 9 : 1,
    },
    weakPoints: isCorrect ? [] : ['Incorrect answer selected', 'Review the underlying concept'],
    bestPractices: ['Always eliminate obviously wrong options first', 'Read all options before selecting'],
    improvements: isCorrect
      ? ['Understand the deeper concept, not just the answer']
      : ['Study this topic in more depth', 'Practice similar problems'],
    recommendedTopics: isCorrect ? [] : [explanation],
    verdict: isCorrect ? 'excellent' : 'poor',
  };
}

// Rule-based evaluation for open-ended answers
export function evaluateTechnicalAnswer(
  answer: string,
  keyPoints: string[],
  questionType: 'conceptual' | 'coding'
): QuestionFeedback {
  const answerLower = answer.toLowerCase().trim();
  const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < 10) {
    return {
      scores: { correctness: 1, depth: 1, clarity: 2, exampleUsage: 0, overall: 1 },
      weakPoints: ['Answer is too short', 'Lacks any substantive content'],
      bestPractices: ['Always provide detailed explanations', 'Use examples to illustrate points'],
      improvements: ['Expand your answer significantly', 'Structure your response clearly'],
      recommendedTopics: ['Topic fundamentals', 'Communication skills'],
      verdict: 'poor',
    };
  }

  // Check key points coverage
  const coveredPoints = keyPoints.filter(kp =>
    kp.toLowerCase().split(' ').some(word => word.length > 3 && answerLower.includes(word.toLowerCase()))
  );
  const coverageRatio = coveredPoints.length / keyPoints.length;

  // Check for examples/code
  const hasExample = answerLower.includes('example') || answerLower.includes('e.g') ||
    answerLower.includes('for instance') || answer.includes('{') || answer.includes('()');
  const hasStructure = wordCount > 50;

  // Scoring
  const correctness = Math.round(coverageRatio * 10);
  const depth = Math.min(10, Math.round((wordCount / 100) * 5 + coverageRatio * 5));
  const clarity = hasStructure ? Math.round(6 + coverageRatio * 4) : Math.round(3 + coverageRatio * 3);
  const exampleUsage = hasExample ? Math.round(7 + coverageRatio * 3) : Math.round(coverageRatio * 5);
  const overall = Math.round((correctness * 0.4 + depth * 0.25 + clarity * 0.2 + exampleUsage * 0.15));

  const verdict =
    overall >= 8 ? 'excellent' :
    overall >= 6 ? 'good' :
    overall >= 4 ? 'average' : 'poor';

  const missingPoints = keyPoints.filter(kp =>
    !kp.toLowerCase().split(' ').some(word => word.length > 3 && answerLower.includes(word.toLowerCase()))
  );

  const improvements: string[] = [];
  if (!hasExample) improvements.push('Add concrete examples to strengthen your answer');
  if (wordCount < 50) improvements.push('Provide more detailed explanations');
  if (missingPoints.length > 0) improvements.push(`Cover these key aspects: ${missingPoints.slice(0, 2).join(', ')}`);
  if (questionType === 'coding' && !answer.includes('function') && !answer.includes('def '))
    improvements.push('Include actual code implementation, not just description');

  return {
    scores: { correctness, depth, clarity, exampleUsage, overall },
    weakPoints: missingPoints.length > 0 ? missingPoints.slice(0, 2) : [],
    bestPractices: [
      'Structure answers with definition → explanation → example → trade-offs',
      'Always mention real-world use cases',
      'Compare alternatives when relevant',
    ],
    improvements,
    recommendedTopics: missingPoints.slice(0, 2),
    verdict,
  };
}

export function evaluateHRAnswer(answer: string, keyTraits: string[]): QuestionFeedback {
  const answerLower = answer.toLowerCase().trim();
  const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < 15) {
    return {
      scores: { correctness: 2, depth: 1, clarity: 2, exampleUsage: 0, overall: 1 },
      weakPoints: ['Response too brief for behavioral questions', 'No concrete examples provided'],
      bestPractices: ['Use the STAR method (Situation, Task, Action, Result)', 'Be specific and quantifiable'],
      improvements: ['Expand with a real-life example', 'Structure with STAR format', 'Add measurable outcomes'],
      recommendedTopics: ['Behavioral interview techniques', 'STAR method'],
      verdict: 'poor',
    };
  }

  // STAR method detection
  const hasSituation = answerLower.includes('when') || answerLower.includes('situation') || answerLower.includes('working on');
  const hasAction = answerLower.includes('i ') || answerLower.includes('decided') || answerLower.includes('implemented');
  const hasResult = answerLower.includes('result') || answerLower.includes('outcome') || answerLower.includes('achieved') || answerLower.includes('helped');
  const starScore = [hasSituation, hasAction, hasResult].filter(Boolean).length;

  const traitKeywords: Record<string, string[]> = {
    'Communication': ['explained', 'communicated', 'discussed', 'team', 'clear'],
    'Analytical thinking': ['analyzed', 'research', 'data', 'logic', 'approach'],
    'Perseverance': ['challenge', 'difficult', 'overcome', 'persist', 'tried'],
    'Emotional intelligence': ['understand', 'empathy', 'perspective', 'listen', 'feel'],
    'Growth mindset': ['learn', 'improve', 'feedback', 'grow', 'develop'],
    'Organization': ['prioritize', 'plan', 'organize', 'schedule', 'track'],
  };

  let traitScore = 0;
  keyTraits.forEach(trait => {
    const keywords = traitKeywords[trait] || [];
    if (keywords.some(kw => answerLower.includes(kw))) traitScore++;
  });

  const coverageRatio = traitScore / Math.max(keyTraits.length, 1);
  const correctness = Math.round(starScore * 2 + coverageRatio * 4);
  const depth = Math.min(10, Math.round((wordCount / 150) * 7 + 3));
  const clarity = Math.min(10, Math.round(starScore * 2.5 + coverageRatio * 2.5));
  const exampleUsage = Math.round(starScore * 3 + coverageRatio * 1);
  const overall = Math.round((correctness * 0.3 + depth * 0.25 + clarity * 0.25 + exampleUsage * 0.2));

  const verdict =
    overall >= 8 ? 'excellent' :
    overall >= 6 ? 'good' :
    overall >= 4 ? 'average' : 'poor';

  return {
    scores: {
      correctness: Math.max(1, correctness),
      depth: Math.max(1, depth),
      clarity: Math.max(1, clarity),
      exampleUsage: Math.max(0, exampleUsage),
      overall: Math.max(1, overall),
    },
    weakPoints: [
      ...(!hasSituation ? ['Missing context/situation setup'] : []),
      ...(!hasResult ? ['Missing outcome or result'] : []),
      ...(wordCount < 60 ? ['Response lacks sufficient depth'] : []),
    ].slice(0, 2),
    bestPractices: [
      'Use the STAR method for all behavioral questions',
      'Quantify results when possible (e.g., "reduced load time by 40%")',
      'Show self-reflection and learning',
    ],
    improvements: [
      ...(!hasResult ? ['Add measurable outcomes to your answer'] : []),
      ...(coverageRatio < 0.5 ? ['Demonstrate the key traits expected for this question'] : []),
      ...(wordCount < 80 ? ['Add more specific details and examples'] : []),
    ].slice(0, 3),
    recommendedTopics: ['Behavioral interview preparation', 'STAR method practice'],
    verdict,
  };
}

export function calculateRoundScore(feedbacks: QuestionFeedback[]): number {
  if (feedbacks.length === 0) return 0;
  const total = feedbacks.reduce((sum, f) => sum + f.scores.overall, 0);
  return Math.round((total / (feedbacks.length * 10)) * 100);
}

export function generateFinalReport(
  userName: string,
  role: string,
  level: string,
  rounds: RoundScore[]
): FinalReport {
  const totalScore = rounds.reduce((sum, r) => sum + r.score, 0);
  const totalMaxScore = rounds.reduce((sum, r) => sum + r.maxScore, 0);
  const percentage = Math.round((totalScore / totalMaxScore) * 100);

  // Determine strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  rounds.forEach(round => {
    const pct = round.percentage;
    const roundName = round.round.charAt(0).toUpperCase() + round.round.slice(1);
    if (pct >= 70) {
      strengths.push(`Strong ${roundName} performance (${pct}%)`);
    } else if (pct < 50) {
      weaknesses.push(`${roundName} round needs significant improvement (${pct}%)`);
    } else {
      weaknesses.push(`${roundName} performance is average — room for growth (${pct}%)`);
    }
  });

  // Aggregate improvements
  const allTopics = rounds.flatMap(r =>
    r.feedback.flatMap(f => f.recommendedTopics)
  ).filter(Boolean);
  const topicCounts = allTopics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic);

  const learningRecommendations: LearningRecommendation[] = [
    ...priorityTopics.slice(0, 2).map(topic => ({
      topic,
      priority: 'high' as const,
      resources: ['Official documentation', 'YouTube tutorials', 'Practice problems on LeetCode'],
      description: `Focus heavily on ${topic} — it appeared as a weak area across multiple questions.`,
    })),
    {
      topic: `${role} best practices`,
      priority: 'medium' as const,
      resources: ['Design patterns book', 'Clean Code by Robert Martin', 'GitHub trending projects'],
      description: 'Study industry best practices and real-world project architectures.',
    },
    {
      topic: 'System Design fundamentals',
      priority: percentage >= 60 ? 'medium' as const : 'high' as const,
      resources: ['System Design Primer (GitHub)', 'Grokking System Design', 'ByteByteGo'],
      description: 'Strengthen your ability to design scalable, reliable systems.',
    },
    {
      topic: 'Communication & Behavioral skills',
      priority: 'low' as const,
      resources: ['Cracking the Coding Interview (HR section)', 'YouTube mock interview videos'],
      description: 'Practice articulating technical concepts clearly and telling structured stories.',
    },
  ];

  // Selection probability based on overall score
  const selectionProbability = Math.min(95, Math.max(5, percentage));
  const selectionCategory =
    percentage >= 75 ? 'Highly Recommended' :
    percentage >= 60 ? 'Recommended' :
    percentage >= 40 ? 'Needs Improvement' : 'Not Recommended';

  // Radar chart data
  const radarData: RadarDataPoint[] = [
    {
      subject: 'Aptitude',
      score: rounds.find(r => r.round === 'aptitude')?.percentage || 0,
      fullMark: 100,
    },
    {
      subject: 'Technical',
      score: rounds.find(r => r.round === 'technical')?.percentage || 0,
      fullMark: 100,
    },
    {
      subject: 'Communication',
      score: rounds.find(r => r.round === 'hr')?.percentage || 0,
      fullMark: 100,
    },
    {
      subject: 'Problem Solving',
      score: Math.round(
        (rounds.filter(r => r.round !== 'hr').reduce((s, r) => s + r.percentage, 0)) /
        Math.max(rounds.filter(r => r.round !== 'hr').length, 1)
      ),
      fullMark: 100,
    },
    {
      subject: 'Depth',
      score: Math.round(
        rounds.flatMap(r => r.feedback).reduce((s, f) => s + f.scores.depth, 0) /
        Math.max(rounds.flatMap(r => r.feedback).length, 1) * 10
      ),
      fullMark: 100,
    },
    {
      subject: 'Clarity',
      score: Math.round(
        rounds.flatMap(r => r.feedback).reduce((s, f) => s + f.scores.clarity, 0) /
        Math.max(rounds.flatMap(r => r.feedback).length, 1) * 10
      ),
      fullMark: 100,
    },
  ];

  return {
    userName,
    role,
    level,
    totalScore,
    totalMaxScore,
    percentage,
    rounds,
    strengths,
    weaknesses,
    selectionProbability,
    selectionCategory,
    learningRecommendations,
    radarData,
    completedAt: new Date(),
  };
}
