import { useState, useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { evaluateAptitudeAnswer } from '../data/scoring';
import type { RoundScore } from '../data/scoring';
import Timer from './Timer';

export default function AptitudeRound() {
  const { state, setScreen, setAptitudeAnswer, addRoundScore, nextRound } = useInterview();
  const { aptitudeQuestions } = state;

  const [localIndex, setLocalIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});
  const [localSelected, setLocalSelected] = useState(-1);
  const [localSubmitted, setLocalSubmitted] = useState(false);
  const [localExplanation, setLocalExplanation] = useState(false);
  const [localAnimating, setLocalAnimating] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const question = aptitudeQuestions[localIndex];
  const totalQ = aptitudeQuestions.length;

  const handleSelect = (idx: number) => {
    if (localSubmitted) return;
    setLocalSelected(idx);
  };

  const handleSubmit = () => {
    if (localSelected === -1) return;
    setLocalSubmitted(true);
    setLocalExplanation(true);
    const newAnswers = { ...localAnswers, [localIndex]: localSelected };
    setLocalAnswers(newAnswers);
    setAptitudeAnswer(localIndex, localSelected);
  };

  const handleTimerExpire = useCallback(() => {
    if (!localSubmitted) {
      const s = localSelected === -1 ? 0 : localSelected;
      setLocalSubmitted(true);
      setLocalExplanation(true);
      const newAnswers = { ...localAnswers, [localIndex]: s };
      setLocalAnswers(newAnswers);
      setAptitudeAnswer(localIndex, s);
    }
  }, [localSubmitted, localSelected, localIndex, localAnswers, setAptitudeAnswer]);

  const completeRound = (answers: Record<number, number>) => {
    const feedbacks = aptitudeQuestions.map((q, i) =>
      evaluateAptitudeAnswer(q.id, answers[i] ?? -1, q.correctIndex, q.explanation)
    );
    const correct = aptitudeQuestions.filter((q, i) => (answers[i] ?? -1) === q.correctIndex).length;
    const roundScore: RoundScore = {
      round: 'aptitude',
      score: correct * 10,
      maxScore: totalQ * 10,
      percentage: Math.round((correct / totalQ) * 100),
      questionsAttempted: totalQ,
      correctAnswers: correct,
      feedback: feedbacks,
    };
    addRoundScore(roundScore);
    nextRound();
    const nextRoundName = state.rounds[state.currentRoundIndex + 1];
    setScreen(nextRoundName || 'report');
  };

  const goNext = (currentAnswers: Record<number, number>) => {
    setLocalAnimating(true);
    setTimeout(() => {
      setLocalAnimating(false);
      if (localIndex < totalQ - 1) {
        const nextIdx = localIndex + 1;
        setLocalIndex(nextIdx);
        setLocalSelected(currentAnswers[nextIdx] ?? -1);
        setLocalSubmitted(currentAnswers[nextIdx] !== undefined);
        setLocalExplanation(currentAnswers[nextIdx] !== undefined);
        setTimerKey(k => k + 1);
      } else {
        completeRound(currentAnswers);
      }
    }, 200);
  };

  if (!question) return null;

  const isCorrect = localSubmitted && localSelected === question.correctIndex;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900/80 border-b border-white/5 px-6 py-4 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <div className="text-sm font-bold">Aptitude Round</div>
              <div className="text-xs text-gray-500">Question {localIndex + 1} of {totalQ}</div>
            </div>
          </div>
          <Timer key={timerKey} totalSeconds={90} onExpire={handleTimerExpire} label="Time Left" />
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="flex gap-1">
            {aptitudeQuestions.map((q, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  i < localIndex
                    ? localAnswers[i] === q.correctIndex
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                    : i === localIndex
                    ? 'bg-blue-400'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 max-w-4xl mx-auto px-6 py-10 w-full transition-all duration-200 ${
          localAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        {/* Question Card */}
        <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-semibold uppercase tracking-wider">
                {question.category}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-xs font-semibold">
                MCQ
              </span>
            </div>
            <span className="text-gray-600 text-sm font-medium">Q{localIndex + 1}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {question.options.map((option, i) => {
            let btnClass = 'border-white/5 bg-gray-900 hover:border-white/20 hover:bg-gray-800';
            let label = (
              <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center text-sm font-bold text-gray-500">
                {String.fromCharCode(65 + i)}
              </div>
            );

            if (localSubmitted) {
              if (i === question.correctIndex) {
                btnClass = 'border-emerald-500/40 bg-emerald-500/10';
                label = <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">✓</div>;
              } else if (i === localSelected) {
                btnClass = 'border-red-500/40 bg-red-500/10';
                label = <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">✗</div>;
              } else {
                btnClass = 'border-white/5 bg-gray-900 opacity-40';
              }
            } else if (i === localSelected) {
              btnClass = 'border-violet-500/60 bg-violet-500/10';
              label = <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-bold">{String.fromCharCode(65 + i)}</div>;
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={localSubmitted}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${btnClass}`}
              >
                {label}
                <span className="font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {localExplanation && (
          <div className={`rounded-2xl p-6 mb-8 border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex items-start gap-4">
              <div className="text-2xl">{isCorrect ? '✅' : '💡'}</div>
              <div>
                <div className={`font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isCorrect ? 'Correct! Well done.' : 'Not quite right.'}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {!localSubmitted
              ? localSelected === -1
                ? 'Select an option to continue'
                : 'Option selected — submit when ready'
              : `${Object.keys(localAnswers).length} of ${totalQ} answered`}
          </div>

          {!localSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={localSelected === -1}
              className={`px-8 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                localSelected === -1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:scale-105 shadow-lg shadow-blue-500/20'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={() => goNext(localAnswers)}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:scale-105 shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center gap-2"
            >
              {localIndex < totalQ - 1 ? <>Next Question <span>→</span></> : <>Finish Round <span>🏁</span></>}
            </button>
          )}
        </div>

        {/* Navigator */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="text-xs text-gray-500 mb-4 uppercase tracking-wider font-semibold">Question Navigator</div>
          <div className="flex flex-wrap gap-2">
            {aptitudeQuestions.map((q, i) => {
              const answered = localAnswers[i] !== undefined;
              const correct = answered && localAnswers[i] === q.correctIndex;
              return (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                    i === localIndex
                      ? 'bg-blue-500 text-white scale-110'
                      : answered
                      ? correct
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
