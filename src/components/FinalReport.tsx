import { useInterview } from '../context/InterviewContext';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell
} from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

function CircularProgress({ percentage, size = 120, strokeWidth = 10 }: {
  percentage: number; size?: number; strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage / 100) * circumference;
  const color = percentage >= 75 ? '#10b981' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          style={{ transition: 'all 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-2xl" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="font-bold text-white">{payload[0]?.value}%</p>
      </div>
    );
  }
  return null;
};

export default function FinalReport() {
  const { state, resetSession } = useInterview();
  const { finalReport } = state;

  if (!finalReport) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">No Report Found</h2>
          <button onClick={resetSession} className="mt-4 px-6 py-3 bg-violet-600 rounded-xl font-bold">
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const {
    userName, role, level, percentage, rounds, strengths, weaknesses,
    selectionProbability, selectionCategory, learningRecommendations, radarData, completedAt
  } = finalReport;

  const selectionConfig = {
    'Highly Recommended': { color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', icon: '🌟', badge: 'bg-emerald-500' },
    'Recommended': { color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', icon: '👍', badge: 'bg-blue-500' },
    'Needs Improvement': { color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', icon: '📈', badge: 'bg-amber-500' },
    'Not Recommended': { color: 'text-red-400', bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30', icon: '📚', badge: 'bg-red-500' },
  };

  const sel = selectionConfig[selectionCategory];

  const barData = rounds.map(r => ({
    name: r.round.charAt(0).toUpperCase() + r.round.slice(1),
    score: r.percentage,
  }));

  const priorityColors = { high: 'text-red-400 bg-red-500/10 border-red-500/20', medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20', low: 'text-green-400 bg-green-500/10 border-green-500/20' };

  const roleLabels: Record<string, string> = {
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
    fullstack: 'Full Stack Developer',
    aiml: 'AI/ML Engineer',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-white/5 px-6 py-5 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-lg">📊</div>
            <div>
              <div className="font-bold">Interview Report</div>
              <div className="text-xs text-gray-500">{new Date(completedAt).toLocaleDateString('en-US', { dateStyle: 'full' })}</div>
            </div>
          </div>
          <button
            onClick={resetSession}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-bold transition-all hover:scale-105"
          >
            🔄 New Interview
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Hero Card */}
        <div className={`relative overflow-hidden rounded-3xl border ${sel.border} bg-gradient-to-br ${sel.bg} p-10`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <div className="text-[12rem] leading-none">{sel.icon}</div>
          </div>

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${sel.badge} text-white text-sm font-bold mb-6`}>
                <span>{sel.icon}</span>
                {selectionCategory}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                {userName}
              </h1>
              <p className="text-gray-400 text-lg mb-2">{roleLabels[role] || role}</p>
              <p className="text-gray-500 text-sm">{level === 'fresher' ? 'Fresher (0–2 years)' : 'Experienced (2+ years)'}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-black/20 rounded-2xl px-6 py-4">
                  <div className="text-xs text-gray-500 mb-1">Rounds Completed</div>
                  <div className="text-2xl font-black">{rounds.length}</div>
                </div>
                <div className="bg-black/20 rounded-2xl px-6 py-4">
                  <div className="text-xs text-gray-500 mb-1">Questions Answered</div>
                  <div className="text-2xl font-black">{rounds.reduce((s, r) => s + r.questionsAttempted, 0)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <CircularProgress percentage={percentage} size={160} strokeWidth={12} />
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Overall Performance</div>
                <div className={`text-2xl font-black ${sel.color}`}>{percentage}%</div>
              </div>

              {/* Selection Probability */}
              <div className="w-full bg-black/20 rounded-2xl p-5">
                <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Selection Probability</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${sel.badge}`}
                      style={{ width: `${selectionProbability}%` }}
                    />
                  </div>
                  <span className={`font-black text-xl ${sel.color}`}>{selectionProbability}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Round Scores */}
        <div>
          <h2 className="text-2xl font-black mb-6">Round Performance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rounds.map((round) => {
              const roundConfig: Record<string, { icon: string; color: string; bg: string; grad: string }> = {
                aptitude: { icon: '🧮', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', grad: 'from-blue-500 to-cyan-500' },
                technical: { icon: '💻', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', grad: 'from-violet-500 to-purple-500' },
                hr: { icon: '🎤', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', grad: 'from-pink-500 to-rose-500' },
              };
              const rc = roundConfig[round.round];
              return (
                <div key={round.round} className={`rounded-2xl border p-7 ${rc.bg}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{rc.icon}</span>
                    <div>
                      <div className="font-bold capitalize">{round.round} Round</div>
                      <div className="text-xs text-gray-500">{round.questionsAttempted} questions</div>
                    </div>
                  </div>

                  <CircularProgress percentage={round.percentage} size={100} strokeWidth={8} />

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Score</span>
                      <span className="font-bold">{round.score} / {round.maxScore}</span>
                    </div>
                    {round.correctAnswers !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Correct</span>
                        <span className="font-bold text-emerald-400">{round.correctAnswers} / {round.questionsAttempted}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg Depth</span>
                      <span className="font-bold">
                        {(round.feedback.reduce((s, f) => s + f.scores.depth, 0) / Math.max(round.feedback.length, 1)).toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Competency Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Round-wise Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>💪</span> Strengths
            </h3>
            <div className="space-y-3">
              {strengths.length > 0 ? strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <span className="text-emerald-400 font-bold text-lg leading-none mt-0.5">✓</span>
                  <span className="text-gray-300 text-sm">{s}</span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">Complete more rounds to identify strengths.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>🎯</span> Areas for Growth
            </h3>
            <div className="space-y-3">
              {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <span className="text-amber-400 text-lg leading-none mt-0.5">→</span>
                  <span className="text-gray-300 text-sm">{w}</span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No major weaknesses identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Question-Level Analysis */}
        <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span>🔍</span> Question-Level Analysis
          </h3>
          <div className="space-y-4">
            {rounds.map((round) =>
              round.feedback.map((fb, qi) => (
                <div
                  key={`${round.round}-${qi}`}
                  className={`p-5 rounded-2xl border ${
                    fb.verdict === 'excellent' ? 'bg-emerald-500/5 border-emerald-500/15' :
                    fb.verdict === 'good' ? 'bg-blue-500/5 border-blue-500/15' :
                    fb.verdict === 'average' ? 'bg-amber-500/5 border-amber-500/15' :
                    'bg-red-500/5 border-red-500/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-gray-400 capitalize">
                        {round.round}
                      </span>
                      <span className="text-gray-400 text-sm">Q{qi + 1}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      {[
                        { label: 'Score', val: fb.scores.overall },
                        { label: 'Depth', val: fb.scores.depth },
                        { label: 'Clarity', val: fb.scores.clarity },
                      ].map(({ label, val }) => (
                        <div key={label} className="text-center">
                          <div className={`font-bold ${val >= 7 ? 'text-emerald-400' : val >= 5 ? 'text-amber-400' : 'text-red-400'}`}>{val}</div>
                          <div className="text-gray-600">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {fb.improvements.length > 0 && (
                    <div className="text-xs text-gray-500 flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">💡</span>
                      {fb.improvements[0]}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <span>📚</span> Personalized Learning Roadmap
          </h3>
          <p className="text-gray-500 text-sm mb-8">Based on your performance, here's your prioritized study plan:</p>

          <div className="grid md:grid-cols-2 gap-5">
            {learningRecommendations.map((rec, i) => (
              <div key={i} className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 hover:border-violet-500/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-base flex-1 pr-3">{rec.topic}</h4>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${priorityColors[rec.priority]}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{rec.description}</p>
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Resources:</div>
                  {rec.resources.map((res, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="text-violet-400">▸</span>{res}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pb-10">
          <button
            onClick={resetSession}
            className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-2xl shadow-violet-500/20 flex items-center justify-center gap-3"
          >
            <span>🔄</span>
            <span>Retake Interview</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 border border-white/5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <span>🖨️</span>
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
