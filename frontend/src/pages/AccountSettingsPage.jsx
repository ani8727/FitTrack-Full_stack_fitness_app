import React, { useState } from 'react'
import { FiAlertTriangle, FiLock, FiLogOut, FiTrash2, FiPauseCircle } from 'react-icons/fi'
import { useAuth0 } from '@auth0/auth0-react'
import { deactivateAccount, deleteAccount } from '../services/api'
import Toast from '../components/Toast'

const AccountSettingsPage = () => {
  const { user, logout } = useAuth0()
  const tokenData = user
  const logOut = () => logout({ logoutParams: { returnTo: window.location.origin } })
  const [toast, setToast] = useState(null)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deactivatePassword, setDeactivatePassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deactivateReason, setDeactivateReason] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [loading, setLoading] = useState(false)

  const userId = tokenData?.sub

  const handleDeactivate = async () => {
    try {
      setLoading(true)
      await deactivateAccount(userId, { password: deactivatePassword, reason: deactivateReason })
      setToast({ message: 'Account deactivated successfully', type: 'success' })
      setTimeout(() => {
        logOut()
      }, 2000)
    } catch (error) {
      console.error('Error deactivating account:', error)
      setToast({ message: 'Failed to deactivate account. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteAccount(userId, { password: deletePassword, reason: deleteReason })
      setToast({ message: 'Account marked for deletion. You will be logged out.', type: 'success' })
      setTimeout(() => {
        logOut()
      }, 2000)
    } catch (error) {
      console.error('Error deleting account:', error)
      setToast({ message: 'Failed to delete account. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-300">Manage your account preferences and security</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{tokenData?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-gray-400">Username</span>
            <span className="text-white">{tokenData?.preferred_username}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400">Account ID</span>
            <span className="text-white font-mono text-sm">{userId?.slice(0, 16)}...</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-800/50 border border-red-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <FiAlertTriangle className="text-red-400" />
          Danger Zone
        </h2>
        <p className="text-gray-400 mb-6">Irreversible and destructive actions</p>

        <div className="space-y-4">
          {/* Deactivate Account */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FiPauseCircle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Deactivate Account</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Temporarily disable your account. You can reactivate it anytime by logging back in.
                  Your data will be preserved.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="ml-4 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Deactivate
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrash2 className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                  All your activities, recommendations, and progress will be lost.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-yellow-500/30 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FiPauseCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Deactivate Account</h3>
                <p className="text-sm text-gray-400">You can reactivate anytime</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password (Required)
                </label>
                <input
                  type="password"
                  value={deactivatePassword}
                  onChange={(e) => setDeactivatePassword(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
                  placeholder="Why are you deactivating?"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeactivateModal(false)
                    setDeactivatePassword('')
                    setDeactivateReason('')
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={loading || !deactivatePassword.trim()}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Processing...' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
                <p className="text-sm text-red-400">This action cannot be undone!</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">Warning:</strong> All your data including activities, 
                recommendations, daily plans, and progress will be permanently deleted.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password (Required)
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Help us improve - why are you leaving?"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletePassword('')
                    setDeleteReason('')
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading || !deletePassword.trim()}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountSettingsPage
