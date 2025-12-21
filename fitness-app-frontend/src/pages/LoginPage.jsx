import React from 'react'

const LoginPage = ({ onLogin }) => {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-20 px-6">
      <div>
        <h1 className="text-4xl font-semibold mb-3">Welcome to FitTrack</h1>
        <p className="text-base text-gray-300 mb-6">
          Track workouts, visualize your progress, and get AI-driven recommendations. Responsive UI for all devices.
        </p>
        <div className="flex gap-3">
          <button onClick={() => onLogin()} className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-6 py-3">Sign in</button>
          <button className="bg-secondary-500/20 text-secondary-500 hover:bg-secondary-500/30 rounded-md px-6 py-3">Learn more</button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl border border-white/5 h-80 md:h-96" />
    </div>
  )
}

export default LoginPage
