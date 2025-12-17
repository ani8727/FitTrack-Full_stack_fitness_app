import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getActivities } from '../shared/api/api'

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('DATE_DESC')
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities()
  }, [])

  const visible = activities
    .filter((a) => (filter === 'ALL' ? true : a.type === filter))
    .sort((a, b) => {
      if (sortBy === 'DATE_DESC') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'DATE_ASC') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'CAL_DESC') return (b.caloriesBurned || 0) - (a.caloriesBurned || 0)
      if (sortBy === 'CAL_ASC') return (a.caloriesBurned || 0) - (b.caloriesBurned || 0)
      return 0
    })

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2">
            <option value="ALL">All</option>
            <option value="RUNNING">Running</option>
            <option value="WALKING">Walking</option>
            <option value="CYCLING">Cycling</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2">
            <option value="DATE_DESC">Newest</option>
            <option value="DATE_ASC">Oldest</option>
            <option value="CAL_DESC">Calories (high→low)</option>
            <option value="CAL_ASC">Calories (low→high)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {visible.map((activity) => (
        <div
          key={activity.id}
          className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-primary-500/60 transition cursor-pointer"
          onClick={() => navigate(`/activities/${activity.id}`)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{activity.type}</h3>
            <span className="text-xs text-gray-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-gray-300">
            <div>Duration: {activity.duration} min</div>
            <div>Calories: {activity.caloriesBurned}</div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default ActivityList