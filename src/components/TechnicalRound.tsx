import { useState, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { evaluateTechnicalAnswer } from '../data/scoring';
import type { RoundScore, QuestionFeedback } from '../data/scoring';
import Timer from './Timer';

const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="font-bold text-white">{value}/10</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${
          value >= 7 ? 'bg-emerald-500' : value >= 5 ? 'bg-amber-500' : 'bg-red-500'
        }`}
        style={{ width: `${value * 10}%` }}
      />
    </div>
  </div>
);

export default function TechnicalRound() {
  const { state, setScreen, setTechnicalAnswer, addRoundScore, nextRound } = useInterview();
  const { technicalQuestions } = state;

  const [localIndex, setLocalIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<QuestionFeedback | null>(null);
  const [animating, setAnimating] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [evaluating, setEvaluating] = useState(false);

  const question = technicalQuestions[localIndex];
  const totalQ = technicalQuestions.length;

  const handleTimerExpire = useCallback(() => {
    if (!submitted && currentAnswer.trim().length > 0) {
      handleSubmit();
    } else if (!submitted) {
      setSubmitted(true);
      const fb = evaluateTechnicalAnswer('', question.keyPoints, question.type);
      setFeedback(fb);
    }
  }, [submitted, currentAnswer, question]);

  const handleSubmit = () => {
    if (currentAnswer.trim().length < 5) return;
    setEvaluating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const fb = evaluateTechnicalAnswer(currentAnswer, question.keyPoints, question.type);
      setFeedback(fb);
      setSubmitted(true);
      setEvaluating(false);

      const newAnswers = { ...answers, [localIndex]: currentAnswer };
      setAnswers(newAnswers);
      setTechnicalAnswer(localIndex, currentAnswer);
    }, 1200);
  };

  const completeRound = (finalAnswers: Record<number, string>) => {
    const feedbacks = technicalQuestions.map((q, i) =>
      evaluateTechnicalAnswer(finalAnswers[i] || '', q.keyPoints, q.type)
    );
    const totalScore = feedbacks.reduce((sum, f) => sum + f.scores.overall, 0);
    const maxScore = totalQ * 10;

    const roundScore: RoundScore = {
      round: 'technical',
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      questionsAttempted: totalQ,
      feedback: feedbacks,
    };

    addRoundScore(roundScore);
    nextRound();
    const nextRoundName = state.rounds[state.currentRoundIndex + 1];
    setScreen(nextRoundName || 'report');
  };

  const goNext = () => {
    const updatedAnswers = { ...answers, [localIndex]: currentAnswer };
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      if (localIndex < totalQ - 1) {
        const nextIdx = localIndex + 1;
        setLocalIndex(nextIdx);
        setCurrentAnswer(updatedAnswers[nextIdx] || (technicalQuestions[nextIdx]?.codeTemplate || ''));
        setSubmitted(updatedAnswers[nextIdx] !== undefined && updatedAnswers[nextIdx].length > 5);
        setFeedback(null);
        setTimerKey(k => k + 1);
      } else {
        completeRound(updatedAnswers);
      }
    }, 200);
  };

  if (!question) return null;

  const verdictConfig = {
    excellent: { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '🌟' },
    good: { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: '👍' },
    average: { label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: '📊' },
    poor: { label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: '📚' },
  };

  const verdictInfo = feedback ? verdictConfig[feedback.verdict] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900/80 border-b border-white/5 px-6 py-4 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-sm font-bold">T</div>
            <div>
              <div className="text-sm font-bold">Technical Round</div>
              <div className="text-xs text-gray-500">Question {localIndex + 1} of {totalQ}</div>
            </div>
          </div>
          <Timer key={timerKey} totalSeconds={300} onExpire={handleTimerExpire} label="Per Question" />
        </div>

        {/* Progress */}
        <div className="max-w-5xl mx-auto mt-4">
          <div className="flex gap-1">
            {technicalQuestions.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  i < localIndex ? 'bg-violet-500' : i === localIndex ? 'bg-purple-400' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 max-w-5xl mx-auto px-6 py-10 w-full transition-all duration-200 ${
          animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Question + Answer */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question */}
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                  question.type === 'coding'
                    ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                    : 'bg-violet-500/10 border border-violet-500/20 text-violet-400'
                }`}>
                  {question.type === 'coding' ? '💻 Coding' : '💡 Conceptual'}
                </span>
                <span className="text-gray-600 text-sm">Q{localIndex + 1}</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold leading-relaxed mb-4">{question.question}</h2>

              {question.type === 'coding' && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  Write functional code with proper syntax and handle edge cases.
                </div>
              )}
            </div>

            {/* Answer Area */}
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  {question.type === 'coding' ? '📝 Your Code' : '📝 Your Answer'}
                </label>
                <span className="text-xs text-gray-600">{currentAnswer.length} chars</span>
              </div>

              {question.type === 'coding' ? (
                <div className="relative">
                  <div className="absolute top-3 right-3 flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <textarea
                    value={currentAnswer || question.codeTemplate || ''}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={submitted}
                    className="w-full bg-gray-800 border border-white/5 rounded-2xl p-5 text-sm font-mono text-gray-200 placeholder-gray-600 resize-none outline-none focus:border-violet-500/40 transition-colors disabled:opacity-70 leading-relaxed"
                    rows={12}
                    placeholder={question.codeTemplate || '// Write your code here...'}
                    style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
                  />
                </div>
              ) : (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  disabled={submitted}
                  className="w-full bg-gray-800 border border-white/5 rounded-2xl p-5 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none focus:border-violet-500/40 transition-colors disabled:opacity-70 leading-relaxed"
                  rows={8}
                  placeholder="Explain your answer clearly. Include definitions, key concepts, examples, and trade-offs where applicable..."
                />
              )}

              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={currentAnswer.trim().length < 5 || evaluating}
                  className={`w-full mt-4 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                    currentAnswer.trim().length < 5
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : evaluating
                      ? 'bg-violet-700 text-white cursor-wait'
                      : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:scale-[1.02] shadow-lg shadow-violet-500/20'
                  }`}
                >
                  {evaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AI is evaluating your answer...</span>
                    </>
                  ) : (
                    <>🤖 Submit for AI Evaluation</>
                  )}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="w-full mt-4 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:scale-[1.02] shadow-lg shadow-violet-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {localIndex < totalQ - 1 ? <>Next Question →</> : <>Finish Technical Round 🏁</>}
                </button>
              )}
            </div>
          </div>

          {/* Right: Feedback Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!feedback ? (
              <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 text-center">
                <div className="text-5xl mb-5">🤖</div>
                <h3 className="font-bold text-lg mb-3">AI Evaluator Ready</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Submit your answer to receive instant AI-powered scoring with detailed feedback, weak points, and improvement suggestions.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-600">
                  {['Correctness', 'Depth', 'Clarity', 'Examples'].map(m => (
                    <div key={m} className="bg-gray-800 rounded-xl p-3">
                      <div className="w-6 h-1.5 bg-gray-700 rounded-full mb-2" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Verdict */}
                {verdictInfo && (
                  <div className={`rounded-2xl p-5 border ${verdictInfo.bg}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{verdictInfo.icon}</span>
                      <div>
                        <div className={`font-black text-lg ${verdictInfo.color}`}>{verdictInfo.label}</div>
                        <div className="text-gray-500 text-xs">AI Verdict</div>
                      </div>
                      <div className={`ml-auto text-3xl font-black ${verdictInfo.color}`}>
                        {feedback.scores.overall}<span className="text-sm text-gray-500">/10</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Score Breakdown */}
                <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Score Breakdown</div>
                  <ScoreBar label="Correctness" value={feedback.scores.correctness} />
                  <ScoreBar label="Depth" value={feedback.scores.depth} />
                  <ScoreBar label="Clarity" value={feedback.scores.clarity} />
                  <ScoreBar label="Example Usage" value={feedback.scores.exampleUsage} />
                </div>

                {/* Weak Points */}
                {feedback.weakPoints.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
                    <div className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span>⚠️</span> Weak Points
                    </div>
                    {feedback.weakPoints.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                        {w}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements.length > 0 && (
                  <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
                    <div className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span>💡</span> How to Improve
                    </div>
                    {feedback.improvements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                        <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                        {imp}
                      </div>
                    ))}
                  </div>
                )}

                {/* Best Practices */}
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span>✅</span> Best Practices
                  </div>
                  {feedback.bestPractices.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      {bp}
                    </div>
                  ))}
                </div>

                {/* Sample Answer Hint */}
                <details className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
                  <summary className="px-5 py-4 text-sm font-semibold text-violet-400 cursor-pointer flex items-center gap-2 hover:bg-white/5">
                    <span>📖</span> View Sample Answer
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{question.sampleAnswer}</p>
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2 font-semibold">Key Points to Cover:</div>
                      {question.keyPoints.map((kp, i) => (
                        <span key={i} className="inline-block mr-2 mb-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs text-violet-400">
                          {kp}
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
