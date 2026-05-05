import { useState, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { evaluateHRAnswer } from '../data/scoring';
import type { RoundScore, QuestionFeedback } from '../data/scoring';
import { generateFinalReport } from '../data/scoring';
import Timer from './Timer';

const traitIcons: Record<string, string> = {
  Communication: '🗣️',
  'Analytical thinking': '🧠',
  Perseverance: '💪',
  Creativity: '🎨',
  'Emotional intelligence': '❤️',
  'Growth mindset': '🌱',
  Organization: '📋',
  Ambition: '🎯',
  Alignment: '🔗',
  Realism: '⚖️',
  'Self-awareness': '🪞',
  Confidence: '💼',
  'Time Management': '⏰',
  Teamwork: '🤝',
  'Problem Solving': '🔧',
  'Conflict resolution': '🕊️',
  Empathy: '💞',
  Professionalism: '👔',
};

export default function HRRound() {
  const { state, setScreen, setHRAnswer, addRoundScore, setFinalReport } = useInterview();
  const { hrQuestions } = state;

  const [localIndex, setLocalIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<QuestionFeedback | null>(null);
  const [animating, setAnimating] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const question = hrQuestions[localIndex];
  const totalQ = hrQuestions.length;

  const handleAnswerChange = (text: string) => {
    setCurrentAnswer(text);
    setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
  };

  const handleTimerExpire = useCallback(() => {
    if (!submitted) {
      handleEvaluate();
    }
  }, [submitted, currentAnswer]);

  const handleEvaluate = () => {
    if (currentAnswer.trim().length < 10) return;
    setEvaluating(true);
    setTimeout(() => {
      const fb = evaluateHRAnswer(currentAnswer, question.keyTraits);
      setFeedback(fb);
      setSubmitted(true);
      setEvaluating(false);
      const newAnswers = { ...answers, [localIndex]: currentAnswer };
      setAnswers(newAnswers);
      setHRAnswer(localIndex, currentAnswer);
    }, 1400);
  };

  const completeRound = (finalAnswers: Record<number, string>) => {
    const feedbacks = hrQuestions.map((q, i) =>
      evaluateHRAnswer(finalAnswers[i] || '', q.keyTraits)
    );
    const totalScore = feedbacks.reduce((sum, f) => sum + f.scores.overall, 0);
    const maxScore = totalQ * 10;

    const hrRoundScore: RoundScore = {
      round: 'hr',
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      questionsAttempted: totalQ,
      feedback: feedbacks,
    };

    addRoundScore(hrRoundScore);

    // Generate final report
    const allRounds = [...state.roundScores, hrRoundScore];
    const report = generateFinalReport(
      state.userName,
      state.role,
      state.level,
      allRounds
    );
    setFinalReport(report);
    setScreen('report');
  };

  const goNext = () => {
    const updatedAnswers = { ...answers, [localIndex]: currentAnswer };
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      if (localIndex < totalQ - 1) {
        const nextIdx = localIndex + 1;
        setLocalIndex(nextIdx);
        setCurrentAnswer(updatedAnswers[nextIdx] || '');
        setWordCount((updatedAnswers[nextIdx] || '').trim().split(/\s+/).filter(w => w.length > 0).length);
        setSubmitted(updatedAnswers[nextIdx] !== undefined && updatedAnswers[nextIdx].length > 10);
        setFeedback(null);
        setTimerKey(k => k + 1);
      } else {
        completeRound(updatedAnswers);
      }
    }, 200);
  };

  if (!question) return null;

  const verdictConfig = {
    excellent: { label: 'Excellent Response', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '🌟', grade: 'A+' },
    good: { label: 'Good Response', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: '👍', grade: 'B+' },
    average: { label: 'Average Response', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: '📊', grade: 'C' },
    poor: { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: '📚', grade: 'D' },
  };

  const verdictInfo = feedback ? verdictConfig[feedback.verdict] : null;

  const getWordCountColor = () => {
    if (wordCount < 30) return 'text-red-400';
    if (wordCount < 80) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900/80 border-b border-white/5 px-6 py-4 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm font-bold">HR</div>
            <div>
              <div className="text-sm font-bold">HR Round</div>
              <div className="text-xs text-gray-500">Question {localIndex + 1} of {totalQ}</div>
            </div>
          </div>
          <Timer key={timerKey} totalSeconds={240} onExpire={handleTimerExpire} label="Per Question" />
        </div>

        <div className="max-w-5xl mx-auto mt-4">
          <div className="flex gap-1">
            {hrQuestions.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  i < localIndex ? 'bg-pink-500' : i === localIndex ? 'bg-rose-400' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 max-w-5xl mx-auto px-6 py-10 w-full transition-all duration-200 ${
          animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question */}
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 text-xs font-semibold uppercase tracking-wider">
                  👥 {question.category}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
                {question.question}
              </h2>

              <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-4">
                <div className="text-xs font-semibold text-pink-400 mb-3 uppercase tracking-wider">
                  💡 Tips for this question
                </div>
                <ul className="space-y-1.5">
                  <li className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-pink-400 mt-0.5">→</span>
                    Use the STAR method: Situation, Task, Action, Result
                  </li>
                  <li className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-pink-400 mt-0.5">→</span>
                    Be specific with examples from real experiences
                  </li>
                  <li className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-pink-400 mt-0.5">→</span>
                    Aim for 80–150 words for best score
                  </li>
                </ul>
              </div>

              {/* Key Traits */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Evaluating For:</div>
                <div className="flex flex-wrap gap-2">
                  {question.keyTraits.map(trait => (
                    <span
                      key={trait}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full text-xs font-medium text-gray-300"
                    >
                      <span>{traitIcons[trait] || '⭐'}</span>
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">📝 Your Response</label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${getWordCountColor()}`}>
                    {wordCount} words
                  </span>
                  <span className="text-xs text-gray-600">(Aim: 80–150)</span>
                </div>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={submitted}
                className="w-full bg-gray-800 border border-white/5 rounded-2xl p-5 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none focus:border-pink-500/40 transition-colors disabled:opacity-70 leading-relaxed"
                rows={10}
                placeholder="Share a specific experience using the STAR method. Describe the situation, your role, the actions you took, and the outcome..."
              />

              {/* Word count bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      wordCount < 30 ? 'bg-red-500' : wordCount < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (wordCount / 150) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Too short</span>
                  <span>Ideal range</span>
                  <span>Max</span>
                </div>
              </div>

              {!submitted ? (
                <button
                  onClick={handleEvaluate}
                  disabled={currentAnswer.trim().length < 10 || evaluating}
                  className={`w-full mt-5 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                    currentAnswer.trim().length < 10
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : evaluating
                      ? 'bg-pink-700 text-white cursor-wait'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 hover:scale-[1.02] shadow-lg shadow-pink-500/20'
                  }`}
                >
                  {evaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing communication skills...</span>
                    </>
                  ) : (
                    <>🤖 Submit for AI Evaluation</>
                  )}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="w-full mt-5 py-3.5 rounded-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 hover:scale-[1.02] shadow-lg shadow-pink-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {localIndex < totalQ - 1 ? <>Next Question →</> : <>View Final Report 🎯</>}
                </button>
              )}
            </div>
          </div>

          {/* Right: Feedback */}
          <div className="lg:col-span-2 space-y-4">
            {!feedback ? (
              <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 text-center">
                <div className="text-5xl mb-5">🎯</div>
                <h3 className="font-bold text-lg mb-3">HR Evaluator Ready</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Your response will be evaluated for clarity, confidence, communication skills, and alignment with key behavioral traits.
                </p>
                <div className="space-y-3 text-sm text-left">
                  {['Clarity', 'Confidence', 'Communication', 'Depth'].map(metric => (
                    <div key={metric} className="flex items-center gap-3 text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 text-xs">✓</div>
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Verdict card */}
                {verdictInfo && (
                  <div className={`rounded-2xl p-5 border ${verdictInfo.bg}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{verdictInfo.icon}</span>
                      <div className="flex-1">
                        <div className={`font-black text-lg ${verdictInfo.color}`}>{verdictInfo.label}</div>
                        <div className="text-gray-500 text-xs">Communication Assessment</div>
                      </div>
                      <div className={`text-4xl font-black ${verdictInfo.color}`}>
                        {verdictInfo.grade}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scores */}
                <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Communication Metrics</div>
                  {[
                    { label: 'Clarity', val: feedback.scores.clarity },
                    { label: 'Depth', val: feedback.scores.depth },
                    { label: 'STAR Structure', val: feedback.scores.correctness },
                    { label: 'Example Quality', val: feedback.scores.exampleUsage },
                  ].map(({ label, val }) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-bold">{val}/10</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-700 ${
                            val >= 7 ? 'bg-emerald-500' : val >= 5 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${val * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-semibold">Overall Score</span>
                    <span className="text-2xl font-black text-pink-400">{feedback.scores.overall}<span className="text-sm text-gray-500">/10</span></span>
                  </div>
                </div>

                {/* Weak Points */}
                {feedback.weakPoints.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
                    <div className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider">⚠️ Areas to Improve</div>
                    {feedback.weakPoints.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                        <span className="text-red-400 mt-0.5">•</span>{w}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements.length > 0 && (
                  <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
                    <div className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider">💡 Improvement Tips</div>
                    {feedback.improvements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                        <span className="text-blue-400 mt-0.5">→</span>{imp}
                      </div>
                    ))}
                  </div>
                )}

                {/* Best Practices */}
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">✅ Best Practices</div>
                  {feedback.bestPractices.slice(0, 2).map((bp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>{bp}
                    </div>
                  ))}
                </div>

                {/* Sample Answer */}
                <details className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
                  <summary className="px-5 py-4 text-sm font-semibold text-pink-400 cursor-pointer hover:bg-white/5">
                    📖 View Sample Response
                  </summary>
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    {question.sampleAnswer}
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
