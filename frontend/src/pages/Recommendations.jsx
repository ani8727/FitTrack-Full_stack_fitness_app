import React, { useEffect, useState } from 'react'
import { FiActivity, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiZap } from 'react-icons/fi'
import { getRecommendations } from '../services/apiClient'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        setError('User not authenticated. Please log in again.')
        setLoading(false)
        return
      }
      const response = await getRecommendations(userId)
      setRecommendations(response.data)
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to load recommendations. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading AI recommendations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="section-title">AI Recommendations</h1>
          <p className="section-subtitle">Get personalized fitness insights powered by AI</p>
        </div>
        
        <div className="card text-center py-12">
          <FiActivity className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)]" />
          <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
          <p className="text-[var(--color-text-muted)] mb-6">
            Log some activities to receive AI-powered recommendations and insights!
          </p>
          <button
            onClick={() => window.location.href = '/activities#add-activity'}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiActivity className="w-4 h-4" />
            Log Your First Activity
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">AI Recommendations</h1>
        <p className="section-subtitle">
          {recommendations.length} personalized recommendation{recommendations.length !== 1 ? 's' : ''} based on your activities
        </p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, idx) => (
          <div key={rec.id || idx} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">
                    {rec.activityType} Analysis
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    AI Generated
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {new Date(rec.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Analysis Section */}
            {rec.recommendation && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-3">
                  <FiActivity className="w-4 h-4 text-primary-500" />
                  Analysis
                </h4>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 whitespace-pre-line text-[var(--color-text)]">
                  {rec.recommendation}
                </div>
              </div>
            )}

            {/* Improvements Section */}
            {rec.improvements && rec.improvements.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-3">
                  <FiTrendingUp className="w-4 h-4 text-secondary-500" />
                  Improvements
                </h4>
                <ul className="space-y-2">
                  {rec.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--color-text)]">
                      <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions Section */}
            {rec.suggestions && rec.suggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-3">
                  <FiZap className="w-4 h-4 text-accent-500" />
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  {rec.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--color-text)]">
                      <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">{i + 1}</span>
                      </div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Guidelines */}
            {rec.safety && rec.safety.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-3">
                  <FiAlertCircle className="w-4 h-4" />
                  Safety Guidelines
                </h4>
                <ul className="space-y-2">
                  {rec.safety.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <span className="text-yellow-600 dark:text-yellow-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <FiActivity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)] mb-1">Get More Insights</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Log more activities to receive personalized AI recommendations based on your fitness journey
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
