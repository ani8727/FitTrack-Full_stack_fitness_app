import React, { useState, useEffect } from 'react'
import { FiMail, FiCalendar, FiShield, FiUser, FiArrowLeft, FiTrash2 } from 'react-icons/fi'
import { getAllUsers, updateUserRole, deleteUser } from '../services/api'
import { useNavigate } from 'react-router-dom'

const AdminUsersPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await updateUserRole(userId, newRole)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    if (filter === 'user') return user.role === 'USER'
    if (filter === 'admin') return user.role === 'ADMIN'
    return true
  })

  const activeCount = users.filter(u => u.role === 'USER').length
  const adminCount = users.filter(u => u.role === 'ADMIN').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="section-title">User Management</h1>
        <p className="section-subtitle">Manage all registered users and their permissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-neutral-200 dark:bg-neutral-800 text-[var(--color-text)] hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          All Users <span className="ml-1.5 opacity-75">({users.length})</span>
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'user'
              ? 'bg-secondary-500 text-white shadow-md'
              : 'bg-neutral-200 dark:bg-neutral-800 text-[var(--color-text)] hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          <FiUser className="inline w-4 h-4 mr-1" />
          Users <span className="ml-1.5 opacity-75">({userCount})</span>
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'admin'
              ? 'bg-accent-500 text-white shadow-md'
              : 'bg-neutral-200 dark:bg-neutral-800 text-[var(--color-text)] hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          <FiShield className="inline w-4 h-4 mr-1" />
          Admins <span className="ml-1.5 opacity-75">({adminCount})</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-100 dark:bg-neutral-800/50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-sm">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-[var(--color-text)] font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          ID: {user.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[var(--color-text)]">
                      <FiMail className="w-4 h-4 text-[var(--color-text-muted)]" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
                        : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400'
                    }`}>
                      {user.role === 'ADMIN' ? <FiShield className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                      <FiCalendar className="w-4 h-4" />
                      {new Date(user.createAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          user.role === 'ADMIN'
                            ? 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-400'
                            : 'bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900/30 dark:text-accent-400'
                        }`}
                        title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                      >
                        {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-lg bg-danger-100 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:hover:bg-danger-900/50 transition-all"
                        title="Delete user"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No users found matching the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
