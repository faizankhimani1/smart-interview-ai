import { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  totalSeconds: number;
  onExpire?: () => void;
  label?: string;
}

export default function Timer({ totalSeconds, onExpire, label }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const pct = secondsLeft / totalSeconds;
    setIsWarning(pct <= 0.4);
    setIsDanger(pct <= 0.15);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, totalSeconds, onExpire]);

  const percentage = (secondsLeft / totalSeconds) * 100;

  const colorClass = isDanger
    ? 'text-red-400 border-red-500/30 bg-red-500/10'
    : isWarning
    ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  const strokeColor = isDanger ? '#f87171' : isWarning ? '#fb923c' : '#34d399';

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${colorClass} transition-all duration-500`}>
      {/* SVG circular progress */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg width="40" height="40" className="transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        {isDanger && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
          </div>
        )}
      </div>

      <div>
        {label && <div className="text-xs text-gray-500 leading-none mb-0.5">{label}</div>}
        <div className={`font-mono font-bold text-lg leading-none ${isDanger ? 'animate-pulse' : ''}`}>
          {formatTime(secondsLeft)}
        </div>
      </div>
    </div>
  );
}
