import { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { getQuestionsForSession, type Role, type Level } from '../data/questions';

const roles = [
  {
    id: 'frontend' as Role,
    label: 'Frontend Developer',
    icon: '🖥️',
    desc: 'HTML, CSS, JavaScript, React, Vue, Angular',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'backend' as Role,
    label: 'Backend Developer',
    icon: '⚙️',
    desc: 'Python, Node.js, Java, Databases, APIs',
    color: 'from-purple-500 to-indigo-500',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  {
    id: 'fullstack' as Role,
    label: 'Full Stack Developer',
    icon: '🚀',
    desc: 'Frontend + Backend + DevOps basics',
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'aiml' as Role,
    label: 'AI / ML Engineer',
    icon: '🤖',
    desc: 'Python, ML Algorithms, Deep Learning, Statistics',
    color: 'from-orange-500 to-pink-500',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
];

const levels = [
  {
    id: 'fresher' as Level,
    label: 'Fresher',
    sublabel: '0–2 years',
    icon: '🌱',
    desc: 'Aptitude → Technical → HR',
    rounds: ['Aptitude', 'Technical', 'HR'],
    color: 'from-green-500 to-emerald-500',
    border: 'border-green-500/40',
    bg: 'bg-green-500/10',
  },
  {
    id: 'experienced' as Level,
    label: 'Experienced',
    sublabel: '2+ years',
    icon: '💼',
    desc: 'Technical → HR',
    rounds: ['Technical', 'HR'],
    color: 'from-violet-500 to-purple-500',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
  },
];

export default function SetupPage() {
  const { setScreen, initSession } = useInterview();
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    const errs: string[] = [];
    if (!userName.trim()) errs.push('Please enter your name');
    if (!selectedRole) errs.push('Please select a role');
    if (!selectedLevel) errs.push('Please select your experience level');
    setErrors(errs);
    if (errs.length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const { aptitude, technical, hr } = getQuestionsForSession(selectedRole!, selectedLevel!);
      initSession(userName.trim(), selectedRole!, selectedLevel!, aptitude, technical, hr);
      const firstRound = selectedLevel === 'fresher' ? 'aptitude' : 'technical';
      setScreen(firstRound);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setScreen('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm">🎯</div>
            <span className="font-bold text-sm hidden sm:block">Smart Interview AI</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Set Up Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Interview
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Personalize your simulation for the most accurate experience.</p>
        </div>

        {/* Step 1: Name */}
        <div className="mb-10">
          <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            <span className="text-violet-400 mr-2">01</span> Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => { setUserName(e.target.value); setErrors([]); }}
            placeholder="Enter your full name..."
            className="w-full bg-gray-900 border border-white/10 focus:border-violet-500/60 rounded-2xl px-6 py-4 text-lg outline-none transition-all duration-200 placeholder-gray-600 focus:shadow-lg focus:shadow-violet-500/10"
          />
        </div>

        {/* Step 2: Role */}
        <div className="mb-10">
          <label className="block text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            <span className="text-violet-400 mr-2">02</span> Target Role
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setSelectedRole(role.id); setErrors([]); }}
                className={`relative group p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  selectedRole === role.id
                    ? `${role.border} ${role.bg}`
                    : 'border-white/5 bg-gray-900 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-3xl p-2 rounded-xl ${selectedRole === role.id ? role.bg : 'bg-white/5'}`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base">{role.label}</div>
                    <div className="text-gray-500 text-xs mt-1">{role.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedRole === role.id ? `bg-gradient-to-r ${role.color} border-transparent` : 'border-gray-600'
                  }`}>
                    {selectedRole === role.id && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Level */}
        <div className="mb-10">
          <label className="block text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            <span className="text-violet-400 mr-2">03</span> Experience Level
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => { setSelectedLevel(level.id); setErrors([]); }}
                className={`relative group p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  selectedLevel === level.id
                    ? `${level.border} ${level.bg}`
                    : 'border-white/5 bg-gray-900 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-3xl mb-2">{level.icon}</div>
                    <div className="font-bold text-lg">{level.label}</div>
                    <div className="text-gray-500 text-sm">{level.sublabel}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedLevel === level.id ? `bg-gradient-to-r ${level.color} border-transparent` : 'border-gray-600'
                  }`}>
                    {selectedLevel === level.id && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {level.rounds.map((r) => (
                    <span
                      key={r}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        selectedLevel === level.id ? level.bg + ' text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            {errors.map((e) => (
              <div key={e} className="flex items-center gap-2 text-red-400 text-sm">
                <span>⚠️</span> {e}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {selectedRole && selectedLevel && userName && (
          <div className="mb-8 bg-gray-900 border border-violet-500/20 rounded-2xl p-6">
            <div className="text-sm font-semibold text-violet-400 mb-4 uppercase tracking-wider">Your Interview Plan</div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Candidate</div>
                <div className="font-semibold">{userName}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Role</div>
                <div className="font-semibold">{roles.find(r => r.id === selectedRole)?.label}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Rounds</div>
                <div className="font-semibold">
                  {selectedLevel === 'fresher' ? 'Aptitude → Technical → HR' : 'Technical → HR'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 ${
            loading
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 hover:scale-[1.02] shadow-2xl shadow-violet-500/30'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
              <span>Preparing Your Interview...</span>
            </div>
          ) : (
            <span>🚀 Begin Interview</span>
          )}
        </button>
      </div>
    </div>
  );
}
