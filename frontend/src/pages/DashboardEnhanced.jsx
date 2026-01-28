import React, { useEffect, useState } from 'react'
import ActivitySummary from '../components/ActivitySummary'
import ActivityChart from '../components/ActivityChart'
import QuickAdd from '../components/QuickAdd'
import { useLocation, useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import HealthInsights from '../components/HealthInsights'
import Achievements from '../components/Achievements'
import { getActivities, getActivityStats } from '../services/apiClient'
import { FiActivity, FiTrendingUp, FiAward, FiCalendar, FiArrowRight } from 'react-icons/fi'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth0()
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

  const displayName = user?.name || user?.nickname || 'there'
  const recentActivities = activities.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Header - Enhanced with gradient */}
      <div className="relative rounded-2xl p-8 overflow-hidden border border-[var(--color-border)]/50 shadow-lg">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
              Welcome back, {displayName}!
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">Here's your fitness activity snapshot and insights.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button 
              onClick={() => navigate('/activities#add-activity')}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 shadow-md active:scale-95"
            >
              <FiActivity className="w-5 h-5" />
              Add activity
            </button>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="border-2 border-[var(--color-primary)] bg-white/80 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-800 text-[var(--color-text)] px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              View profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced with colors and gradients */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Activities */}
          <div className="group relative rounded-xl p-6 border border-[var(--color-border)]/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 group-hover:from-blue-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                  <FiActivity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Total activities</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{stats.count || 0}</p>
                </div>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-2">All time</div>
            </div>
          </div>

          {/* Total Duration */}
          <div className="group relative rounded-xl p-6 border border-[var(--color-border)]/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 group-hover:from-emerald-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600/20 to-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Total duration</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">{stats.totalDurationMinutes || 0}</p>
                </div>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-2">Minutes</div>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="group relative rounded-xl p-6 border border-[var(--color-border)]/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 group-hover:from-orange-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-400/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Calories burned</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 dark:from-orange-400 dark:to-red-300 bg-clip-text text-transparent">{stats.totalCaloriesBurned || 0}</p>
                </div>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-2">Total burned</div>
            </div>
          </div>

          {/* Avg Calories */}
          <div className="group relative rounded-xl p-6 border border-[var(--color-border)]/50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 group-hover:from-purple-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-400/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium">Avg per activity</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 bg-clip-text text-transparent">{Math.round(stats.avgCaloriesPerActivity || 0)}</p>
                </div>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-2">Per activity</div>
            </div>
          </div>
        </div>
      )}

      <QuickAdd />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySummary />
        <div className="relative rounded-2xl p-6 border border-[var(--color-border)]/50 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-500/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-200 bg-clip-text text-transparent">Recent activities</h3>
              <button 
                onClick={() => navigate('/activities')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            {loading ? (
              <div className="text-center text-[var(--color-text-muted)] py-8">Loading...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center text-[var(--color-text-muted)] py-8">
                <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-60 text-blue-500" />
                <p className="text-[var(--color-text)]">No activities yet</p>
                <button 
                  onClick={() => navigate('/activities#add-activity')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold mt-2 transition-colors"
                >
                  Add your first activity
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="group relative rounded-lg p-4 border border-[var(--color-border)]/60 hover:border-blue-400/50 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/activities/${activity.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                          <FiActivity className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[var(--color-text)] font-semibold">{activity.type}</h4>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            {activity.duration} min • {activity.caloriesBurned} cal
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] font-medium">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
