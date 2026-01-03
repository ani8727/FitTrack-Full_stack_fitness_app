import React, { useEffect, useMemo, useState } from 'react'
import { FiMail, FiCalendar, FiShield, FiUser, FiArrowLeft, FiTrash2, FiCheckCircle, FiAlertTriangle, FiSlash, FiClock } from 'react-icons/fi'
import { getAllUsers, updateUserRole, deleteUser, updateUserStatus } from '../services/api'
import { useNavigate } from 'react-router-dom'

const AdminUsersPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', role: '', status: '' })
  const [statusDraft, setStatusDraft] = useState({})
  const [savingStatusId, setSavingStatusId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(filters)
    }, 250)
    return () => clearTimeout(delay)
  }, [filters])

  const fetchUsers = async (query = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllUsers(query)
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Could not load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await updateUserRole(userId, newRole)
      fetchUsers(filters)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId)
        fetchUsers(filters)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleStatusSelect = (userId, status) => {
    setStatusDraft((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        status,
      },
    }))
  }

  const handleStatusReason = (userId, reason) => {
    setStatusDraft((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        reason,
      },
    }))
  }

  const handleApplyStatus = async (userId) => {
    const draft = statusDraft[userId]
    if (!draft?.status) return
    try {
      setSavingStatusId(userId)
      await updateUserStatus(userId, draft.status, draft.reason)
      await fetchUsers(filters)
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update status')
    } finally {
      setSavingStatusId(null)
    }
  }

  const roleCounts = useMemo(() => ({
    user: users.filter((u) => u.role === 'USER').length,
    admin: users.filter((u) => u.role === 'ADMIN').length,
  }), [users])

  const statusCounts = useMemo(() => {
    const counts = {}
    users.forEach((u) => {
      const key = u.accountStatus || 'UNKNOWN'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [users])

  const filteredUsers = users

  const statusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      INACTIVE: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300',
      DEACTIVATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      SUSPENDED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      BANNED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      DELETED: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800/30 dark:text-neutral-400',
      UNKNOWN: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-200',
    }
    const label = status || 'UNKNOWN'
    const icon = {
      ACTIVE: <FiCheckCircle className="w-3 h-3" />,
      INACTIVE: <FiClock className="w-3 h-3" />,
      DEACTIVATED: <FiAlertTriangle className="w-3 h-3" />,
      SUSPENDED: <FiAlertTriangle className="w-3 h-3" />,
      BANNED: <FiSlash className="w-3 h-3" />,
      DELETED: <FiTrash2 className="w-3 h-3" />,
      UNKNOWN: <FiAlertTriangle className="w-3 h-3" />,
    }[label] || <FiAlertTriangle className="w-3 h-3" />
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[label] || styles.UNKNOWN}`}>
        {icon}
        {label}
      </span>
    )
  }

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
        <p className="section-subtitle">Manage all registered users, roles, and account status</p>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, or ID"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--color-border)] focus:outline-none"
          >
            <option value="">All roles ({users.length})</option>
            <option value="USER">Users ({roleCounts.user})</option>
            <option value="ADMIN">Admins ({roleCounts.admin})</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--color-border)] focus:outline-none"
          >
            <option value="">All status ({users.length})</option>
            {['ACTIVE','INACTIVE','DEACTIVATED','SUSPENDED','BANNED','DELETED'].map((status) => (
              <option key={status} value={status}>
                {status} ({statusCounts[status] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-200">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-100 dark:bg-neutral-800/50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">Last Login</th>
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
                          ID: {user.id?.substring(0, 8)}...
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
                  <td className="px-6 py-4">{statusBadge(user.accountStatus)}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                      <FiCalendar className="w-4 h-4" />
                      {new Date(user.createAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-3">
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={statusDraft[user.id]?.status || ''}
                          onChange={(e) => handleStatusSelect(user.id, e.target.value)}
                          className="col-span-1 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--color-border)] text-sm"
                        >
                          <option value="">Set status</option>
                          {['ACTIVE','INACTIVE','DEACTIVATED','SUSPENDED','BANNED','DELETED'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          value={statusDraft[user.id]?.reason || ''}
                          onChange={(e) => handleStatusReason(user.id, e.target.value)}
                          className="col-span-1 sm:col-span-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--color-border)] text-sm"
                        />
                        <button
                          onClick={() => handleApplyStatus(user.id)}
                          disabled={!statusDraft[user.id]?.status || savingStatusId === user.id}
                          className={`col-span-1 sm:col-span-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            !statusDraft[user.id]?.status || savingStatusId === user.id
                              ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          }`}
                        >
                          {savingStatusId === user.id ? 'Updating...' : 'Apply Status'}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[var(--color-text-muted)]">
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
