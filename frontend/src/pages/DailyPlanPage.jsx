import React, { useState, useEffect, useCallback } from 'react'
import { FiCalendar, FiClock, FiActivity, FiCheckCircle, FiTrendingUp, FiCoffee, FiDroplet, FiHeart, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth0 } from '@auth0/auth0-react'
import { generateDailyPlan, getDailyPlanByDate } from '../services/api'
import Toast from '../components/Toast'

const DailyPlanPage = () => {
  const { user } = useAuth0()
  const tokenData = user
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyPlan, setDailyPlan] = useState(null)

  const userId = tokenData?.sub

  const fetchDailyPlan = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      const response = await getDailyPlanByDate(userId, selectedDate)
      setDailyPlan(response.data)
    } catch (error) {
      console.error('Error fetching daily plan:', error)
      setDailyPlan(null)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, userId])

  useEffect(() => {
    fetchDailyPlan()
  }, [fetchDailyPlan])

  const handleGeneratePlan = async () => {
    if (!userId) return
    try {
      setLoading(true)
      setToast({ message: 'Generating personalized daily plan...', type: 'info' })
      const response = await generateDailyPlan(userId, selectedDate)
      setDailyPlan(response.data)
      setToast({ message: 'Daily plan generated successfully!', type: 'success' })
    } catch (error) {
      console.error('Error generating plan:', error)
      setToast({ message: 'Failed to generate plan. Please ensure your profile is complete.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getIntensityColor = (intensity) => {
    switch (intensity?.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-400/20'
      case 'moderate': return 'text-yellow-400 bg-yellow-400/20'
      case 'high': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getTimeIcon = (time) => {
    if (time?.toLowerCase().includes('morning')) return <FiSun className="text-yellow-400" />
    if (time?.toLowerCase().includes('evening')) return <FiMoon className="text-purple-400" />
    return <FiClock className="text-blue-400" />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Daily Plan</h1>
            <p className="text-gray-300">AI-powered personalized fitness and wellness plan</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <FiActivity />
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </div>
      </div>

      {loading && !dailyPlan && (
        <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your personalized plan...</p>
        </div>
      )}

      {!loading && !dailyPlan && (
        <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-12 text-center">
          <FiCalendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Plan Available</h3>
          <p className="text-gray-400 mb-6">Generate a personalized daily plan for {selectedDate}</p>
          <button
            onClick={handleGeneratePlan}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
          >
            <FiActivity />
            Generate Now
          </button>
        </div>
      )}

      {dailyPlan && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <FiActivity className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Target Steps</p>
                  <p className="text-2xl font-bold text-white">{dailyPlan.targetSteps?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-orange-500/30 flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Target Calories</p>
                  <p className="text-2xl font-bold text-white">{dailyPlan.targetCalories}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Workouts</p>
                  <p className="text-2xl font-bold text-white">{dailyPlan.workouts?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          {dailyPlan.motivationalQuote && (
            <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-xl text-white italic">"{dailyPlan.motivationalQuote}"</p>
            </div>
          )}

          {/* Morning Routine */}
          {dailyPlan.morningRoutine && (
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <FiCoffee className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Morning Routine</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{dailyPlan.morningRoutine}</p>
            </div>
          )}

          {/* Workouts */}
          {dailyPlan.workouts && dailyPlan.workouts.length > 0 && (
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <FiActivity className="text-primary-400" />
                Workout Schedule
              </h2>
              <div className="space-y-4">
                {dailyPlan.workouts.map((workout, index) => (
                  <div key={index} className="bg-gray-900/50 border border-white/5 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTimeIcon(workout.time)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{workout.type}</h3>
                          <p className="text-sm text-gray-400">{workout.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIntensityColor(workout.intensity)}`}>
                          {workout.intensity}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <FiClock /> {workout.duration} min
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{workout.description}</p>
                    {workout.exercises && workout.exercises.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-2">Exercises:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {workout.exercises.map((exercise, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-300">
                              <FiCheckCircle className="text-green-400 flex-shrink-0" />
                              {exercise}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {dailyPlan.goals && dailyPlan.goals.length > 0 && (
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-secondary-400" />
                Today's Goals
              </h2>
              <ul className="space-y-3">
                {dailyPlan.goals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <FiCheckCircle className="text-green-400 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition & Hydration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyPlan.nutritionAdvice && (
              <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Nutrition</h2>
                </div>
                <p className="text-gray-300">{dailyPlan.nutritionAdvice}</p>
              </div>
            )}
            {dailyPlan.hydrationReminder && (
              <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FiDroplet className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Hydration</h2>
                </div>
                <p className="text-gray-300">{dailyPlan.hydrationReminder}</p>
              </div>
            )}
          </div>

          {/* Rest & Recovery */}
          {dailyPlan.restAndRecovery && (
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FiMoon className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Rest & Recovery</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{dailyPlan.restAndRecovery}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DailyPlanPage
