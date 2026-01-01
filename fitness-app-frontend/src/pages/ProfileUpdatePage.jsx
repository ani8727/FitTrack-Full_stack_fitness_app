import React, { useState, useEffect, useContext } from 'react'
import { FiUser, FiMail, FiSave, FiEdit2, FiActivity, FiTrendingUp, FiAward } from 'react-icons/fi'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getUserProfile, updateUserProfile, getActivityStats } from '../services/api'
import Toast from '../components/Toast'

const ProfilePage = () => {
  const { tokenData } = useContext(AuthContext)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  const userId = tokenData?.sub

  useEffect(() => {
    if (tokenData) {
      setProfile({
        firstName: tokenData.given_name || '',
        lastName: tokenData.family_name || '',
        email: tokenData.email || '',
      })
    }
  }, [tokenData])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getActivityStats()
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserProfile(userId, profile)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setToast({ message: 'Failed to update profile', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold">
            {profile.firstName?.[0]}{profile.lastName?.[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-300">{profile.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium">
                Active Member
              </span>
              <span className="px-3 py-1 bg-secondary-500/20 text-secondary-300 rounded-full text-sm font-medium">
                {stats?.count || 0} Activities
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiEdit2 />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-white">{stats.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-secondary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-2xl font-bold text-white">{stats.totalDurationMinutes} min</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <FiAward className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Calories Burned</p>
                <p className="text-2xl font-bold text-white">{stats.totalCaloriesBurned}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          {editing && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FiSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Account Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-gray-400">User ID</span>
            <span className="text-white font-mono text-sm">{userId?.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-gray-400">Account Status</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-gray-400">Member Since</span>
            <span className="text-white">January 2026</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400">Preferred Username</span>
            <span className="text-white">{tokenData?.preferred_username || 'Not set'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
