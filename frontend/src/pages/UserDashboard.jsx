import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiTrendingUp, FiAward, FiTarget, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

const UserDashboard = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const stats = [
    { label: 'Activities', value: '24', icon: FiActivity, color: 'bg-blue-500' },
    { label: 'Calories Burned', value: '12,450', icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Achievements', value: '8', icon: FiAward, color: 'bg-yellow-500' },
    { label: 'Goals Met', value: '75%', icon: FiTarget, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { name: 'Morning Run', duration: '30 min', calories: 320, date: 'Today' },
    { name: 'Evening Yoga', duration: '45 min', calories: 180, date: 'Yesterday' },
    { name: 'Cycling', duration: '1 hr', calories: 450, date: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Hi, {user?.name || user?.email}!</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiSettings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Activities</h2>
                <button
                  onClick={() => navigate('/activities')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 text-white p-3 rounded-lg">
                        <FiActivity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{activity.name}</p>
                        <p className="text-sm text-slate-600">{activity.duration} • {activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{activity.calories}</p>
                      <p className="text-sm text-slate-600">calories</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/activities/add')}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Log New Activity
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/daily-plan')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiTarget className="w-5 h-5" />
                  <span>View Daily Plan</span>
                </button>
                <button
                  onClick={() => navigate('/recommendations')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiTrendingUp className="w-5 h-5" />
                  <span>AI Recommendations</span>
                </button>
                <button
                  onClick={() => navigate('/achievements')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiAward className="w-5 h-5" />
                  <span>My Achievements</span>
                </button>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-16 h-16 rounded-full border-4 border-white/20 mx-auto mb-4"
                />
              )}
              <h3 className="text-center text-lg font-semibold">{user?.name}</h3>
              <p className="text-center text-blue-100 text-sm mt-1">{user?.email}</p>
              <button
                onClick={() => navigate('/profile')}
                className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
