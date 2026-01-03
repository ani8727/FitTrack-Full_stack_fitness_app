import React, { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getUserProfile, updateUserProfile } from '../services/api'
import Toast from '../components/Toast'
import { FiUser, FiMail, FiActivity, FiTarget, FiHeart, FiAlertCircle, FiSave } from 'react-icons/fi'

const ProfilePage = () => {
  const { tokenData } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    fitnessGoals: '',
    areasToImprove: '',
    weaknesses: '',
    healthIssues: '',
    dietaryPreferences: '',
    targetWeeklyWorkouts: ''
  })

  const userId = tokenData?.sub

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      const response = await getUserProfile(userId)
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userId) return
    
    try {
      setSaving(true)
      await updateUserProfile(userId, profile)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setToast({ message: 'Failed to update profile', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FiUser className="text-3xl text-primary-500" />
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-primary-500" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 flex items-center gap-2">
                <FiMail className="text-sm" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-neutral-800 text-gray-400 border border-white/10 rounded-md px-3 py-2 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender || ''}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiActivity className="text-primary-500" />
            Physical Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age || ''}
                onChange={handleChange}
                min="13"
                max="120"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profile.height || ''}
                onChange={handleChange}
                min="100"
                max="250"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 175"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profile.weight || ''}
                onChange={handleChange}
                min="30"
                max="300"
                step="0.1"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 70"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Activity Level</label>
              <select
                name="activityLevel"
                value={profile.activityLevel || ''}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Extremely Active">Extremely Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiTarget className="text-primary-500" />
            Fitness Goals & Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Fitness Goals</label>
              <textarea
                name="fitnessGoals"
                value={profile.fitnessGoals || ''}
                onChange={handleChange}
                rows="2"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Lose weight, Build muscle, Improve endurance..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Areas to Improve</label>
              <textarea
                name="areasToImprove"
                value={profile.areasToImprove || ''}
                onChange={handleChange}
                rows="2"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Core strength, Flexibility, Cardiovascular endurance..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Known Weaknesses</label>
              <textarea
                name="weaknesses"
                value={profile.weaknesses || ''}
                onChange={handleChange}
                rows="2"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Lower back pain, Knee issues, Limited mobility..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Target Weekly Workouts</label>
              <input
                type="number"
                name="targetWeeklyWorkouts"
                value={profile.targetWeeklyWorkouts || ''}
                onChange={handleChange}
                min="1"
                max="14"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 3-5"
              />
            </div>
          </div>
        </div>

        {/* Health & Diet */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiHeart className="text-primary-500" />
            Health & Dietary Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 flex items-center gap-2">
                <FiAlertCircle className="text-yellow-500" />
                Health Issues / Medical Conditions
              </label>
              <textarea
                name="healthIssues"
                value={profile.healthIssues || ''}
                onChange={handleChange}
                rows="2"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Asthma, Diabetes, High blood pressure... (Optional)"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Dietary Preferences</label>
              <textarea
                name="dietaryPreferences"
                value={profile.dietaryPreferences || ''}
                onChange={handleChange}
                rows="2"
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Vegetarian, Vegan, Keto, No restrictions..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default ProfilePage
