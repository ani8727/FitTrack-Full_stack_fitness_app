import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiSave, FiEdit2, FiActivity, FiTrendingUp, FiAward, FiMapPin, FiTarget, FiAlertCircle, FiHeart } from 'react-icons/fi'
import { useAuth0 } from '@auth0/auth0-react'
import { getMyProfile, updateMyProfile, getActivityStats } from '../services/apiClient'
import Toast from '../components/Toast'

const ProfilePage = () => {
  const { user } = useAuth0()
  const tokenData = user
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    age: '',
    location: '',
    fitnessGoals: '',
    areasToImprove: '',
    weaknesses: '',
    healthIssues: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryPreferences: '',
    targetWeeklyWorkouts: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (tokenData?.sub) {
        try {
          const response = await getMyProfile()
          const userData = response.data
          setProfile({
            firstName: userData.firstName || tokenData.given_name || '',
            lastName: userData.lastName || tokenData.family_name || '',
            email: userData.email || tokenData.email || '',
            gender: userData.gender || '',
            age: userData.age || '',
            location: userData.location || '',
            fitnessGoals: userData.fitnessGoals || '',
            areasToImprove: userData.areasToImprove || '',
            weaknesses: userData.weaknesses || '',
            healthIssues: userData.healthIssues || '',
            height: userData.height || '',
            weight: userData.weight || '',
            activityLevel: userData.activityLevel || '',
            dietaryPreferences: userData.dietaryPreferences || '',
            targetWeeklyWorkouts: userData.targetWeeklyWorkouts || '',
          })
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Fallback to tokenData
          setProfile({
            firstName: tokenData.given_name || '',
            lastName: tokenData.family_name || '',
            email: tokenData.email || '',
            gender: '',
            age: '',
            location: '',
            fitnessGoals: '',
            areasToImprove: '',
            weaknesses: '',
            healthIssues: '',
            height: '',
            weight: '',
            activityLevel: '',
            dietaryPreferences: '',
            targetWeeklyWorkouts: '',
          })
        }
      }
    }
    fetchProfile()
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
      await updateMyProfile(profile)
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

          {/* Extended Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!editing}
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                disabled={!editing}
                min="13"
                max="120"
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="25"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiMapPin className="inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!editing}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="City, Country"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
                disabled={!editing}
                min="50"
                max="300"
                step="0.1"
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="170"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                disabled={!editing}
                min="20"
                max="500"
                step="0.1"
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="70"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Activity Level
            </label>
            <select
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
              disabled={!editing}
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Activity Level</option>
              <option value="Sedentary">Sedentary (little or no exercise)</option>
              <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
              <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
              <option value="Very Active">Very Active (6-7 days/week)</option>
              <option value="Extra Active">Extra Active (physical job + exercise)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Weekly Workouts
            </label>
            <input
              type="number"
              name="targetWeeklyWorkouts"
              value={profile.targetWeeklyWorkouts}
              onChange={handleChange}
              disabled={!editing}
              min="0"
              max="14"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="3-5 workouts per week"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiTarget className="inline mr-2" />
              Fitness Goals
            </label>
            <textarea
              name="fitnessGoals"
              value={profile.fitnessGoals}
              onChange={handleChange}
              disabled={!editing}
              rows="3"
              maxLength="1000"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Describe your fitness goals (e.g., lose weight, build muscle, improve endurance)"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.fitnessGoals?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiTrendingUp className="inline mr-2" />
              Areas to Improve
            </label>
            <textarea
              name="areasToImprove"
              value={profile.areasToImprove}
              onChange={handleChange}
              disabled={!editing}
              rows="3"
              maxLength="1000"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="What areas do you want to focus on improving?"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.areasToImprove?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiAlertCircle className="inline mr-2" />
              Known Weaknesses
            </label>
            <textarea
              name="weaknesses"
              value={profile.weaknesses}
              onChange={handleChange}
              disabled={!editing}
              rows="3"
              maxLength="1000"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Any physical weaknesses or limitations"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.weaknesses?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiHeart className="inline mr-2" />
              Health Issues
            </label>
            <textarea
              name="healthIssues"
              value={profile.healthIssues}
              onChange={handleChange}
              disabled={!editing}
              rows="3"
              maxLength="1000"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Any health conditions or injuries to consider"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.healthIssues?.length || 0}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dietary Preferences
            </label>
            <textarea
              name="dietaryPreferences"
              value={profile.dietaryPreferences}
              onChange={handleChange}
              disabled={!editing}
              rows="2"
              maxLength="500"
              className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Dietary preferences or restrictions (e.g., vegetarian, vegan, allergies)"
            />
            <p className="text-xs text-gray-500 mt-1">{profile.dietaryPreferences?.length || 0}/500 characters</p>
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
