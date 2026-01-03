import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiActivity, FiTrendingUp, FiAward, FiUsers, FiTarget, FiZap, FiHeart, FiClock, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const HomePage = ({ onLogin }) => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <FiActivity className="w-8 h-8" />,
      title: "Track Activities",
      description: "Log your workouts including running, cycling, swimming, yoga, and more"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "View Progress",
      description: "Visualize your fitness journey with beautiful charts and statistics"
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Earn Achievements",
      description: "Unlock badges and milestones as you reach your fitness goals"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "AI Recommendations",
      description: "Get personalized workout suggestions powered by AI"
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Set Goals",
      description: "Define your fitness targets and track your progress towards them"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Quick Add",
      description: "Log activities in seconds with our streamlined quick-add feature"
    }
  ]

  const stats = [
    { value: "10K+", label: "Active users" },
    { value: "100K+", label: "Activities logged" },
    { value: "50M+", label: "Calories burned" },
    { value: "4.9★", label: "Community rating" }
  ]

  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const backgroundStyle = isDark
    ? 'radial-gradient(circle at 12% 14%, rgba(56,189,248,0.14), transparent 32%), radial-gradient(circle at 86% 10%, rgba(251,146,60,0.12), transparent 30%), linear-gradient(150deg, #0f172a 0%, #111827 55%, #0b1220 100%)'
    : 'radial-gradient(circle at 8% 12%, rgba(37,99,235,0.12), transparent 28%), radial-gradient(circle at 88% 10%, rgba(249,115,22,0.10), transparent 26%), linear-gradient(140deg, #eff3f9 0%, #f7f9fc 60%, #eef2f8 100%)'

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: backgroundStyle }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -left-24 top-12 w-72 h-72 ${isDark ? 'bg-primary-400/12' : 'bg-primary-500/8'} blur-3xl rounded-full`} />
        <div className={`absolute right-0 top-32 w-80 h-80 ${isDark ? 'bg-secondary-400/12' : 'bg-secondary-500/8'} blur-3xl rounded-full`} />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative app-container pt-16 lg:pt-20 pb-16 lg:pb-24">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-white/80 dark:bg-neutral-900/70 text-[var(--color-text)] dark:text-slate-100 shadow-sm hover:shadow transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              <span className="text-sm font-semibold">{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-primary-500/15 text-primary-100' : 'bg-white/80 text-primary-700'} backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-[0_12px_30px_rgba(37,99,235,0.08)]`}>
                <FiZap className="w-4 h-4" />
                <span>Transform your fitness journey</span>
              </div>
              <h1 className={`text-4xl lg:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>
                Track progress, stay motivated, and hit every goal.
              </h1>
              <p className={`text-lg max-w-2xl ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                FitTrack blends effortless logging with AI guidance, personalized goals, and clear visuals so you always know what to do next.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onLogin}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-base font-semibold shadow-lg shadow-primary-500/30 hover:translate-y-[-1px] transition-all"
                >
                  Get started free
                </button>
                <button 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className={`px-7 py-3 rounded-xl border border-[var(--color-border)] ${isDark ? 'text-white bg-neutral-900/60 hover:bg-neutral-800' : 'text-[var(--color-text)] bg-white/80 hover:bg-white'} shadow-sm transition-all`}
                >
                  See how it works
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className={`rounded-xl border border-[var(--color-border)] p-4 shadow-sm ${isDark ? 'bg-neutral-900/70 text-white' : 'bg-white/80 text-[var(--color-text)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full grid place-items-center ${isDark ? 'bg-primary-500/20 text-primary-100' : 'bg-primary-500/15 text-primary-700'}`}><FiActivity /></div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Daily streak</p>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>18 days</p>
                    </div>
                  </div>
                </div>
                <div className={`rounded-xl border border-[var(--color-border)] p-4 shadow-sm ${isDark ? 'bg-neutral-900/70 text-white' : 'bg-white/80 text-[var(--color-text)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full grid place-items-center ${isDark ? 'bg-secondary-500/25 text-secondary-100' : 'bg-secondary-500/15 text-secondary-700'}`}><FiHeart /></div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Calories today</p>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>820 kcal</p>
                    </div>
                  </div>
                </div>
                <div className={`rounded-xl border border-[var(--color-border)] p-4 shadow-sm ${isDark ? 'bg-neutral-900/70 text-white' : 'bg-white/80 text-[var(--color-text)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full grid place-items-center ${isDark ? 'bg-primary-500/20 text-primary-100' : 'bg-primary-500/15 text-primary-700'}`}><FiClock /></div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Time saved</p>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>12 hrs/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className={`relative rounded-3xl border border-[var(--color-border)] shadow-[0_30px_80px_rgba(15,23,42,0.12)] p-6 overflow-hidden ${isDark ? 'bg-[#0f172a]/90' : 'bg-white/80'}`}>
                <div className={`absolute -right-10 -top-10 w-40 h-40 ${isDark ? 'bg-primary-400/12' : 'bg-primary-500/10'} blur-3xl rounded-full`} />
                <div className={`absolute -left-10 bottom-0 w-52 h-52 ${isDark ? 'bg-secondary-400/12' : 'bg-secondary-500/10'} blur-3xl rounded-full`} />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>This week</span>
                    <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>+18%</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[4, 5, 3, 7, 6, 5, 4].map((v, i) => (
                      <div key={i} className={`h-20 rounded-lg overflow-hidden flex items-end ${isDark ? 'bg-primary-500/20' : 'bg-primary-500/15'}`}>
                        <div className="w-full bg-gradient-to-t from-primary-500 to-primary-400" style={{ height: `${v * 12}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-xl border border-[var(--color-border)] p-4 ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>AI recommendation</p>
                      <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Lower-body + core • 45 min</p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-primary-200' : 'text-primary-700'}`}>Based on recovery and recent sessions</p>
                    </div>
                    <div className={`rounded-xl border border-[var(--color-border)] p-4 ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Goal progress</p>
                      <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-[var(--color-surface-muted)]'}`}>
                        <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: '72%' }} />
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>72% toward weekly target</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative app-container pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`rounded-2xl border border-[var(--color-border)] p-5 text-center shadow-sm ${isDark ? 'bg-neutral-900/70' : 'bg-white/85'}`}>
              <div className={`text-3xl lg:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>{stat.value}</div>
              <div className={`text-sm lg:text-base ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative app-container pb-20 lg:pb-28">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>
            Everything you need, beautifully organized
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
            Thoughtful tools, calming visuals, and AI guidance to keep you moving without the clutter.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group rounded-2xl border border-[var(--color-border)] p-7 transition-all hover:-translate-y-1 ${isDark ? 'bg-[#0f172a]/80 shadow-[0_18px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_22px_48px_rgba(37,99,235,0.18)]' : 'bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_48px_rgba(37,99,235,0.12)]'}`}
            >
              <div className={`w-12 h-12 rounded-xl grid place-items-center mb-4 group-hover:scale-105 transition-all ${isDark ? 'bg-primary-500/20 text-primary-100' : 'bg-primary-500/12 text-primary-700 group-hover:bg-primary-500/16'}`}>
                {feature.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>{feature.title}</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'} leading-relaxed`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative app-container pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-10 lg:p-14 shadow-[0_28px_70px_rgba(37,99,235,0.28)] overflow-hidden">
          <div className="absolute right-0 -top-10 w-72 h-72 bg-white/15 blur-3xl rounded-full" />
          <div className="absolute -left-16 bottom-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          <div className="relative text-center space-y-4">
            <h2 className="text-3xl lg:4xl font-bold">Ready to start your journey?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands already using FitTrack to stay accountable, measure progress, and feel confident every week.
            </p>
            <button 
              onClick={onLogin}
              className="px-8 py-3 rounded-xl bg-white text-primary-700 font-semibold shadow-lg hover:translate-y-[-1px] transition-all"
            >
              Start tracking now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-[var(--color-border)] bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-sm">
        <div className="app-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>FitTrack</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'} text-sm`}>
                Your personal fitness companion for tracking activities and achieving goals.
              </p>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Product</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                <li><a href="#features" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Features</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Pricing</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Company</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>About</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Blog</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                <li><button onClick={() => navigate('/privacy')} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Privacy</button></li>
                <li><button onClick={() => navigate('/terms')} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Terms</button></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Contact</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-[var(--color-border)] pt-6 text-center text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
            <p>© 2026 FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
