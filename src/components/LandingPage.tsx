import { useEffect, useState } from 'react';
import { useInterview } from '../context/InterviewContext';

const stats = [
  { value: '10K+', label: 'Interviews Simulated' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '4', label: 'Interview Rounds' },
  { value: 'AI', label: 'Powered Feedback' },
];

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Evaluation',
    desc: 'Smart scoring with detailed feedback, weak point analysis, and personalized improvement tips.',
  },
  {
    icon: '⏱️',
    title: 'Real-Time Timer',
    desc: 'Practice under actual interview conditions with countdown timers for each section.',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Radar charts and bar graphs show your performance across all competency dimensions.',
  },
  {
    icon: '🎯',
    title: 'Role-Based Questions',
    desc: 'Curated questions for Frontend, Backend, Full Stack, and AI/ML roles at all levels.',
  },
  {
    icon: '📋',
    title: 'Structured Rounds',
    desc: 'Aptitude → Technical → HR — the exact flow used by top tech companies.',
  },
  {
    icon: '📚',
    title: 'Learning Roadmap',
    desc: 'Get a personalized study plan with prioritized topics and curated resources.',
  },
];

const roles = [
  { id: 'frontend', label: 'Frontend', icon: '🖥️', color: 'from-blue-500 to-cyan-500' },
  { id: 'backend', label: 'Backend', icon: '⚙️', color: 'from-purple-500 to-indigo-500' },
  { id: 'fullstack', label: 'Full Stack', icon: '🚀', color: 'from-emerald-500 to-teal-500' },
  { id: 'aiml', label: 'AI/ML', icon: '🤖', color: 'from-orange-500 to-pink-500' },
];

export default function LandingPage() {
  const { setScreen } = useInterview();
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Your Dream Job Awaits.';

  useEffect(() => {
    setVisible(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-lg">🎯</div>
            <span className="font-bold text-lg tracking-tight">
              Smart<span className="text-violet-400">Interview</span> AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
          </div>
          <button
            onClick={() => setScreen('setup')}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-violet-500/20"
          >
            Start Interview
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Hero Text */}
          <div
            className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              AI-Powered Interview Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
              <span className="text-white">Ace Every</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-6 min-h-[2.5rem]">
              {typedText}
              <span className="animate-blink text-violet-400">|</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
              Experience a full-stack interview simulation with AI-driven feedback, real-time scoring,
              and personalized learning plans. Practice like it's real — because your career is.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setScreen('setup')}
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-violet-500/30 flex items-center gap-3"
              >
                <span>Begin Simulation</span>
                <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-14">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interview Preview Card */}
          <div
            className={`transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative">
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl animate-float z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-lg">✓</div>
                  <div>
                    <div className="text-xs text-gray-400">Aptitude Round</div>
                    <div className="text-sm font-bold text-green-400">Score: 87%</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-delayed z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 text-lg">🤖</div>
                  <div>
                    <div className="text-xs text-gray-400">AI Feedback</div>
                    <div className="text-sm font-bold text-violet-400">Ready in 2s</div>
                  </div>
                </div>
              </div>

              {/* Main card */}
              <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Technical Round</div>
                    <div className="text-lg font-bold mt-1">Question 3 of 5</div>
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    <span className="text-red-400 text-sm font-mono font-bold">12:45</span>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-5 mb-6 border border-white/5">
                  <div className="text-sm text-violet-400 font-medium mb-3">💡 Conceptual Question</div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Explain the difference between <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">async/await</code> and <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">Promises</code> in JavaScript...
                  </p>
                </div>

                <textarea
                  className="w-full bg-gray-800/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/50"
                  rows={4}
                  placeholder="Type your answer here..."
                  readOnly
                  defaultValue="async/await is syntactic sugar built on top of Promises that makes asynchronous code look synchronous..."
                />

                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`w-2 h-2 rounded-full ${n <= 3 ? 'bg-violet-500' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                  <button className="px-5 py-2.5 bg-violet-600 rounded-xl text-sm font-semibold hover:bg-violet-500 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-violet-400 font-semibold mb-3 uppercase tracking-wider text-sm">Why Choose Us</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform simulates the complete interview process with intelligent feedback at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-gray-900 border border-white/5 rounded-2xl p-7 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-violet-400 font-semibold mb-3 uppercase tracking-wider text-sm">The Process</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">From setup to final report in minutes.</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent hidden lg:block" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Set Your Profile', desc: 'Choose your role and experience level to personalize the interview.', icon: '👤' },
                { step: '02', title: 'Take the Interview', desc: 'Go through Aptitude → Technical → HR rounds with real questions.', icon: '🎤' },
                { step: '03', title: 'Get AI Feedback', desc: 'Receive instant scoring and detailed feedback for every answer.', icon: '🤖' },
                { step: '04', title: 'View Your Report', desc: 'See charts, scores, strengths, weaknesses, and learning paths.', icon: '📊' },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-950 border-2 border-violet-400 flex items-center justify-center text-xs font-black text-violet-400">
                      {item.step.slice(-1)}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-violet-400 font-semibold mb-3 uppercase tracking-wider text-sm">Choose Your Path</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Interview by{' '}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Role
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Tailored questions for your specific career path.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setScreen('setup')}
                className="group relative bg-gray-900 border border-white/5 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="text-5xl mb-5">{role.icon}</div>
                <h3 className="text-xl font-bold mb-2">{role.label}</h3>
                <p className="text-gray-500 text-sm">Developer</p>
                <div className={`mt-6 py-2 px-4 rounded-xl bg-gradient-to-r ${role.color} text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                  Start Interview →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-violet-900/50 to-blue-900/50 border border-violet-500/20 rounded-3xl p-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Land Your Dream Job?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Start your mock interview now. Get instant AI feedback and a detailed report to prepare like a pro.
            </p>
            <button
              onClick={() => setScreen('setup')}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-2xl font-black text-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-violet-500/30"
            >
              <span>Start Free Simulation</span>
              <span className="group-hover:translate-x-1 transition-transform text-2xl">🚀</span>
            </button>
            <p className="text-gray-600 text-sm mt-6">No account required. Start immediately.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm">🎯</div>
            <span className="font-bold text-sm">Smart Interview Simulator AI</span>
          </div>
          <p className="text-gray-600 text-sm text-center">
            © 2026 Smart Interview AI. Built for aspiring developers. <br />
            Developed by{" "}
            <a
              href="https://faizankhimani.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Faizan Khimani
            </a>
          </p>

        </div>
      </footer>
    </div>
  );
}
