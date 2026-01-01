import React from 'react'
import { FiActivity, FiTrendingUp, FiAward, FiZap } from 'react-icons/fi'

const LoginPage = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 px-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FiZap className="w-4 h-4" />
            <span>Start Your Fitness Journey</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Welcome to FitTrack
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Track workouts, visualize your progress, and get AI-driven recommendations. Your personal fitness companion for achieving your goals.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <FiActivity className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-gray-200">Track all your activities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-secondary-400" />
              </div>
              <span className="text-gray-200">Monitor your progress with charts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <FiAward className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-gray-200">Earn achievements and badges</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onLogin()} 
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg px-8 py-4 text-lg font-semibold shadow-lg shadow-primary-500/50 transition-all transform hover:scale-105"
            >
              Sign In with Keycloak
            </button>
            {onRegister && (
              <button 
                onClick={onRegister}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-8 py-4 text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all"
              >
                Create Account
              </button>
            )}
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Secure authentication powered by Keycloak OAuth2 PKCE
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl p-6 border border-primary-500/30">
                <h3 className="text-2xl font-bold text-white mb-2">10K+</h3>
                <p className="text-gray-300">Active Users</p>
              </div>
              <div className="bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 rounded-2xl p-6 border border-secondary-500/30">
                <h3 className="text-2xl font-bold text-white mb-2">100K+</h3>
                <p className="text-gray-300">Activities Logged</p>
              </div>
              <div className="bg-gradient-to-r from-accent-500/20 to-accent-600/20 rounded-2xl p-6 border border-accent-500/30">
                <h3 className="text-2xl font-bold text-white mb-2">50M+</h3>
                <p className="text-gray-300">Calories Burned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
