

interface RoundCompleteProps {
  roundName: string;
  score: number;
  onNext: () => void;
}

export default function RoundComplete({ roundName, score, onNext }: RoundCompleteProps) {
  const getScoreLabel = (s: number) => {
    if (s >= 80) return { label: 'Excellent!', color: 'text-emerald-400', icon: '🌟' };
    if (s >= 60) return { label: 'Good Job!', color: 'text-blue-400', icon: '👍' };
    if (s >= 40) return { label: 'Average', color: 'text-amber-400', icon: '📊' };
    return { label: 'Keep Practicing', color: 'text-red-400', icon: '📚' };
  };

  const { label, color, icon } = getScoreLabel(score);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">{icon}</div>
        <h1 className="text-4xl font-black mb-2">{roundName} Complete!</h1>
        <p className={`text-6xl font-black mb-6 ${color}`}>{score}%</p>
        <p className={`text-2xl font-bold mb-10 ${color}`}>{label}</p>
        <button
          onClick={onNext}
          className="px-10 py-4 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
