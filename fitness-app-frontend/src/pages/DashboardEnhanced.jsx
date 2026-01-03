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
      <div className="bg-white/90 border border-[var(--color-border)] rounded-2xl p-8 shadow-[0_26px_70px_rgba(15,23,42,0.10)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Welcome back, {displayName}!</h2>
            <p className="text-[var(--color-text-muted)]">Here's your fitness activity snapshot and insights.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/activities#add-activity')}
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-[1px] flex items-center gap-2 shadow-[0_18px_36px_rgba(37,99,235,0.20)]"
            >
              <FiActivity />
              Add activity
            </button>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="border border-[var(--color-border)] bg-white/85 hover:bg-white text-[var(--color-text)] px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              View profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-[var(--color-border)] rounded-xl p-6 hover:shadow-[0_18px_38px_rgba(37,99,235,0.12)] hover:-translate-y-[1px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-500/12 flex items-center justify-center text-primary-700">
                <FiActivity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Total activities</p>
                <p className="text-3xl font-bold text-[var(--color-text)]">{stats.count || 0}</p>
              </div>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">All time</div>
          </div>

          <div className="bg-white/90 border border-[var(--color-border)] rounded-xl p-6 hover:shadow-[0_18px_38px_rgba(249,115,22,0.12)] hover:-translate-y-[1px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-secondary-500/12 flex items-center justify-center text-secondary-700">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Total duration</p>
                <p className="text-3xl font-bold text-[var(--color-text)]">{stats.totalDurationMinutes || 0}</p>
              </div>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">Minutes</div>
          </div>

          <div className="bg-white/90 border border-[var(--color-border)] rounded-xl p-6 hover:shadow-[0_18px_38px_rgba(249,115,22,0.10)] hover:-translate-y-[1px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-accent-500/12 flex items-center justify-center text-accent-600">
                <FiAward className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Calories burned</p>
                <p className="text-3xl font-bold text-[var(--color-text)]">{stats.totalCaloriesBurned || 0}</p>
              </div>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">Total burned</div>
          </div>

          <div className="bg-white/90 border border-[var(--color-border)] rounded-xl p-6 hover:shadow-[0_18px_38px_rgba(34,197,94,0.14)] hover:-translate-y-[1px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/12 flex items-center justify-center text-green-700">
                <FiCalendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Avg calories</p>
                <p className="text-3xl font-bold text-[var(--color-text)]">{Math.round(stats.avgCaloriesPerActivity || 0)}</p>
              </div>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-2">Per activity</div>
          </div>
        </div>
      )}

      <QuickAdd />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySummary />
        <div className="bg-white/90 border border-[var(--color-border)] rounded-2xl p-6 shadow-[0_18px_48px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">Recent activities</h3>
            <button 
              onClick={() => navigate('/activities')}
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1"
            >
              View All
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)] py-8">Loading...</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center text-[var(--color-text-muted)] py-8">
              <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-60 text-primary-500" />
              <p className="text-[var(--color-text)]">No activities yet</p>
              <button 
                onClick={() => navigate('/activities#add-activity')}
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold mt-2"
              >
                Add your first activity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:shadow-[0_14px_30px_rgba(15,23,42,0.10)] hover:-translate-y-[1px] transition-all cursor-pointer"
                  onClick={() => navigate(`/activities/${activity.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/12 flex items-center justify-center text-primary-700">
                        <FiActivity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[var(--color-text)] font-medium">{activity.type}</h4>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {activity.duration} min • {activity.caloriesBurned} cal
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
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
