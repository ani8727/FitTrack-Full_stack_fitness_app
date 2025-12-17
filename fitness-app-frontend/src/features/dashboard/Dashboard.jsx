import React, { useContext, useEffect, useState } from 'react'
import ActivitySummary from './ActivitySummary'
import ActivityChart from './ActivityChart'
import QuickAdd from './QuickAdd'
import { useLocation } from 'react-router'
import { AuthContext } from 'react-oauth2-code-pkce'
import HealthInsights from './HealthInsights'
import Achievements from './Achievements'
import { getActivities } from '../../shared/api/api'

const Dashboard = () => {
  const location = useLocation()
  const { tokenData } = useContext(AuthContext)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (location.hash === '#quick-add') {
      const el = document.getElementById('quick-add')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  useEffect(() => {
    (async () => {
      try {
        const res = await getActivities()
        setActivities(res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const displayName = tokenData?.name || tokenData?.preferred_username || 'there'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome, {displayName}</h2>
          <p className="text-sm text-gray-300">Here’s your activity snapshot and insights.</p>
        </div>
      </div>
      <QuickAdd />
      <ActivitySummary />
      <ActivityChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthInsights />
        <Achievements activities={activities} loading={loading} />
      </div>
    </div>
  )
}

export default Dashboard
