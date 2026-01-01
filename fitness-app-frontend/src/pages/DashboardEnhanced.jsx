import React, { useContext, useEffect, useState } from 'react'
import ActivitySummary from '../components/ActivitySummary'
import ActivityChart from '../components/ActivityChart'
import QuickAdd from '../components/QuickAdd'
import { useLocation, useNavigate } from 'react-router'
import { AuthContext } from 'react-oauth2-code-pkce'
import HealthInsights from '../components/HealthInsights'
import Achievements from '../components/Achievements'
import { getActivities, getActivityStats } from '../services/api'
import { FiActivity, FiTrendingUp, FiAward, FiCalendar, FiArrowRight } from 'react-icons/fi'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tokenData } = useContext(AuthContext)
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (location.hash === '#quick-add') {
      const el = document.getElementById('quick-add')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  useEffect(() => {
    (async () => {
      try {
        const [activitiesRes, statsRes] = await Promise.all([
          getActivities(),
          getActivityStats().catch(() => ({ data: null }))
        ])
        setActivities(activitiesRes.data || [])
        setStats(statsRes.data || {})
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const displayName = tokenData?.name || tokenData?.preferred_username || 'there'
  const recentActivities = activities.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {displayName}!</h2>
            <p className="text-gray-300">Here's your fitness activity snapshot and insights.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/activities#add-activity')}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <FiActivity />
              Add Activity
            </button>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Activities</p>
                <p className="text-3xl font-bold text-white">{stats.count || 0}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">All time</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-secondary-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-secondary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-3xl font-bold text-white">{stats.totalDurationMinutes || 0}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Minutes</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-accent-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <FiAward className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Calories Burned</p>
                <p className="text-3xl font-bold text-white">{stats.totalCaloriesBurned || 0}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Total burned</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Calories</p>
                <p className="text-3xl font-bold text-white">{Math.round(stats.avgCaloriesPerActivity || 0)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Per activity</div>
          </div>
        </div>
      )}

      <QuickAdd />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySummary />
        <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Activities</h3>
            <button 
              onClick={() => navigate('/activities')}
              className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
            >
              View All
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activities yet</p>
              <button 
                onClick={() => navigate('/activities#add-activity')}
                className="text-primary-400 hover:text-primary-300 text-sm mt-2"
              >
                Add your first activity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-gray-900/50 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => navigate(`/activities/${activity.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <FiActivity className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{activity.type}</h4>
                        <p className="text-sm text-gray-400">
                          {activity.duration} min • {activity.caloriesBurned} cal
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ActivityChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthInsights />
        <Achievements activities={activities} loading={loading} />
      </div>
    </div>
  )
}

export default Dashboard
