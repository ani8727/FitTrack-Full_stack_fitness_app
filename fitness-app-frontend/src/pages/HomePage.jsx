import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiActivity, FiTrendingUp, FiAward, FiUsers, FiTarget, FiZap } from 'react-icons/fi'

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
    { value: "10K+", label: "Active Users" },
    { value: "100K+", label: "Activities Logged" },
    { value: "50M+", label: "Calories Burned" },
    { value: "4.9★", label: "User Rating" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FiZap className="w-4 h-4" />
              <span>Transform Your Fitness Journey</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Track. Progress. Achieve.
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your all-in-one fitness companion. Track activities, monitor progress, and reach your goals with intelligent insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onLogin}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg shadow-primary-500/50 transition-all transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/50 border-y border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features to help you achieve your fitness goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl p-8 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/20 hover:transform hover:scale-105"
            >
              <div className="text-primary-400 mb-4 group-hover:text-primary-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-y border-white/10">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users already tracking their fitness progress with FitTrack
          </p>
          <button 
            onClick={onLogin}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-5 rounded-lg text-xl font-semibold shadow-lg shadow-primary-500/50 transition-all transform hover:scale-105"
          >
            Start Tracking Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">FitTrack</h3>
              <p className="text-gray-400 text-sm">
                Your personal fitness companion for tracking activities and achieving goals.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
