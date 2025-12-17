import React from 'react'

const Profile = ({ user }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="bg-black/30 rounded-xl p-5 border border-white/5">
        <div className="text-sm text-gray-300">
          <div><span className="text-gray-400">Name:</span> {user?.name || user?.preferred_username || 'Unknown'}</div>
          <div><span className="text-gray-400">Email:</span> {user?.email || '—'}</div>
          <div><span className="text-gray-400">Sub:</span> {user?.sub || '—'}</div>
        </div>
      </div>
    </div>
  )
}

export default Profile
