import React, { useState, useEffect } from 'react'
import { FiUsers, FiActivity, FiTrendingUp, FiAward, FiArrowRight } from 'react-icons/fi'
import { getDashboardStats, getAllUsers, getAllActivities } from '../services/api'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ icon, title, value, color, gradient }) => {
  const Icon = icon
  return (
    <div className={`card p-6 hover:shadow-lg transition-all cursor-pointer ${gradient}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-muted)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-text)]">{value}</p>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [dashboardStats, allUsers, allActivities] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
        getAllActivities()
      ])
      
      setStats(dashboardStats.data)
      setRecentUsers(allUsers.data.slice(0, 5))
      setRecentActivities(allActivities.data.slice(0, 5))
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Manage users, activities, and monitor system performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          icon={FiUsers}
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-gradient-to-br from-primary-500 to-primary-600"
          gradient="hover:border-primary-300 dark:hover:border-primary-600"
        />
        <StatCard
          icon={FiAward}
          title="Admin Users"
          value={stats?.adminUsers || 0}
          color="bg-gradient-to-br from-secondary-500 to-secondary-600"
          gradient="hover:border-secondary-300 dark:hover:border-secondary-600"
        />
        <StatCard
          icon={FiActivity}
          title="Regular Users"
          value={stats?.regularUsers || 0}
          color="bg-gradient-to-br from-accent-500 to-accent-600"
          gradient="hover:border-accent-300 dark:hover:border-accent-600"
        />
      </div>

      {/* Recent Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Recent Users</h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              View all <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-center text-[var(--color-text-muted)] py-8">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-[var(--color-text)] font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(user.createAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Recent Activities</h2>
            <button
              onClick={() => navigate('/activities')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              View all <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-center text-[var(--color-text-muted)] py-8">No activities yet</p>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                      <FiActivity className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div>
                      <p className="text-[var(--color-text)] font-medium">{activity.type}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {activity.duration}min • {activity.caloriesBurned} cal
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="btn-primary flex items-center gap-2"
        >
          <FiUsers className="w-5 h-5" />
          Manage Users
        </button>
        <button
          onClick={() => navigate('/activities')}
          className="btn-secondary flex items-center gap-2"
        >
          <FiActivity className="w-5 h-5" />
          View Activities
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
