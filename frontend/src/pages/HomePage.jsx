import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiActivity, FiTrendingUp, FiAward, FiUsers, FiTarget, FiZap, FiHeart, FiClock, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import ContactModal from '../shared/ui/ContactModal'
import { Logo } from '../shared/ui/Icons'
import { site } from '../config/site'

const HomePage = ({ onLogin }) => {
  const navigate = useNavigate()
  const [contactOpen, setContactOpen] = useState(false)

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

  const backgroundStyle =
    'radial-gradient(circle at 10% 12%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 38%), ' +
    'radial-gradient(circle at 92% 10%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 34%), ' +
    'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg) 100%)'

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: backgroundStyle }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -left-24 top-10 w-72 h-72 ${isDark ? 'bg-primary-400/12' : 'bg-primary-500/10'} blur-3xl rounded-full`} />
        <div className={`absolute right-0 top-28 w-80 h-80 ${isDark ? 'bg-secondary-400/12' : 'bg-secondary-500/10'} blur-3xl rounded-full`} />
      </div>

      {/* Top bar */}
      <header className="relative">
        <div className="app-container pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 select-none">
              <Logo className="w-10 h-10" />
              <div className="leading-tight">
                <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>{site?.name || 'FitTrack'}</div>
                <div className={`text-xs ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Track • Insights • AI guidance</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] glass text-[var(--color-text)]"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                <span className="text-sm font-semibold">{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={onLogin}
                className="px-5 py-2.5 rounded-full btn-primary"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative app-container pt-10 lg:pt-14 pb-14 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'text-white' : 'text-primary-700'}`}>
                <FiZap className="w-4 h-4" />
                <span>Transform your fitness journey</span>
              </div>
              <h1 className={`text-4xl lg:text-6xl font-bold leading-[1.06] tracking-tight ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>
                A calmer way to stay consistent.
              </h1>
              <p className={`text-lg max-w-2xl ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                FitTrack blends effortless logging with AI guidance, personalized goals, and clear visuals so you always know what to do next.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onLogin}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-base font-semibold shadow-glow hover:translate-y-[-1px] transition-all"
                >
                  Get started free
                </button>
                <button 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className={`px-7 py-3 rounded-xl border border-[var(--color-border)] glass ${isDark ? 'text-white' : 'text-[var(--color-text)]'} transition-all`}
                >
                  See how it works
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                <div className="glass rounded-2xl border border-[var(--color-border)] p-4">
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Daily streak</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl grid place-items-center ${isDark ? 'bg-primary-500/20 text-primary-100' : 'bg-primary-500/12 text-primary-700'}`}><FiActivity /></div>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>18 days</p>
                  </div>
                </div>
                <div className="glass rounded-2xl border border-[var(--color-border)] p-4">
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Calories today</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl grid place-items-center ${isDark ? 'bg-secondary-500/25 text-secondary-100' : 'bg-secondary-500/12 text-secondary-700'}`}><FiHeart /></div>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>820 kcal</p>
                  </div>
                </div>
                <div className="glass rounded-2xl border border-[var(--color-border)] p-4">
                  <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>Time saved</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl grid place-items-center ${isDark ? 'bg-primary-500/20 text-primary-100' : 'bg-primary-500/12 text-primary-700'}`}><FiClock /></div>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>12 hrs/mo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl border border-[var(--color-border)] glass shadow-soft p-6 overflow-hidden">
                <div className={`absolute -right-10 -top-10 w-44 h-44 ${isDark ? 'bg-primary-400/12' : 'bg-primary-500/10'} blur-3xl rounded-full`} />
                <div className={`absolute -left-10 bottom-0 w-56 h-56 ${isDark ? 'bg-secondary-400/12' : 'bg-secondary-500/10'} blur-3xl rounded-full`} />
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
                    <div className="rounded-xl border border-[var(--color-border)] p-4 glass">
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>AI recommendation</p>
                      <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Lower-body + core • 45 min</p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-primary-200' : 'text-primary-700'}`}>Based on recovery and recent sessions</p>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] p-4 glass">
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
            <div key={index} className="rounded-2xl border border-[var(--color-border)] p-5 text-center glass">
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
              className="group rounded-2xl border border-[var(--color-border)] p-7 glass transition-all hover:-translate-y-1 hover:shadow-soft"
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
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-10 lg:p-14 shadow-glow overflow-hidden">
          <div className="absolute right-0 -top-10 w-72 h-72 bg-white/15 blur-3xl rounded-full" />
          <div className="absolute -left-16 bottom-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          <div className="relative text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to start your journey?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands already using FitTrack to stay accountable, measure progress, and feel confident every week.
            </p>
            <button 
              onClick={onLogin}
              className="px-8 py-3 rounded-xl bg-white text-primary-700 font-semibold shadow-soft hover:translate-y-[-1px] transition-all"
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
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
                <li><button onClick={() => navigate('/privacy')} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Privacy</button></li>
                <li><button onClick={() => navigate('/terms')} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}>Terms</button></li>
                <li>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className={`transition-colors px-0 py-0 ${isDark ? 'hover:text-white' : 'hover:text-[var(--color-text)]'}`}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-[var(--color-border)] pt-6 text-center text-sm ${isDark ? 'text-slate-300' : 'text-[var(--color-text-muted)]'}`}>
            <p>© 2026 FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}

export default HomePage
