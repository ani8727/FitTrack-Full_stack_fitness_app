import React from 'react'
import { FiActivity, FiTrendingUp, FiAward, FiZap } from 'react-icons/fi'

const LoginPage = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-[80vh] flex items-center relative" style={{ background: 'radial-gradient(circle at 10% 12%, rgba(37,99,235,0.10), transparent 30%), radial-gradient(circle at 86% 10%, rgba(249,115,22,0.08), transparent 28%), linear-gradient(140deg, #eef2f8 0%, #f8fbff 55%, #edf2fb 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-10 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute right-0 top-24 w-72 h-72 bg-secondary-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 px-6 relative">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/80 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-[0_12px_30px_rgba(37,99,235,0.10)]">
            <FiZap className="w-4 h-4" />
            <span>Start your fitness journey</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-[var(--color-text)]">
            Welcome to FitTrack
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-xl">
            Track workouts, visualize your progress, and get AI-driven recommendations—all in a calming, bright workspace.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/12 flex items-center justify-center text-primary-700">
                <FiActivity className="w-5 h-5" />
              </div>
              <span className="text-[var(--color-text)]">Track all your activities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/12 flex items-center justify-center text-secondary-700">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[var(--color-text)]">Monitor your progress with charts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/12 flex items-center justify-center text-accent-600">
                <FiAward className="w-5 h-5" />
              </div>
              <span className="text-[var(--color-text)]">Earn achievements and badges</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onLogin()} 
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-[0_20px_40px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-[1px]"
            >
              Sign in with Auth0
            </button>
            {onRegister && (
              <button 
                onClick={onRegister}
                className="border border-[var(--color-border)] bg-white/80 text-[var(--color-text)] rounded-xl px-8 py-4 text-lg font-semibold shadow-sm hover:bg-white transition-all"
              >
                Create account
              </button>
            )}
          </div>

          <p className="text-[var(--color-text-muted)] text-sm mt-6">
            Secure authentication powered by Auth0 OAuth2
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative rounded-3xl border border-[var(--color-border)] p-8 backdrop-blur-sm bg-white/85 shadow-[0_26px_70px_rgba(15,23,42,0.14)]">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-500/14 to-primary-600/16 rounded-2xl p-6 border border-primary-500/20">
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">10K+</h3>
                <p className="text-[var(--color-text-muted)]">Active users</p>
              </div>
              <div className="bg-gradient-to-r from-secondary-500/14 to-secondary-600/16 rounded-2xl p-6 border border-secondary-500/20">
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">100K+</h3>
                <p className="text-[var(--color-text-muted)]">Activities logged</p>
              </div>
              <div className="bg-gradient-to-r from-accent-500/14 to-accent-600/16 rounded-2xl p-6 border border-accent-500/20">
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">50M+</h3>
                <p className="text-[var(--color-text-muted)]">Calories burned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
