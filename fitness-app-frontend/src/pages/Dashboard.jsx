import React, { useEffect } from 'react'
import ActivitySummary from '../components/ActivitySummary'
import ActivityChart from '../components/ActivityChart'
import QuickAdd from '../components/QuickAdd'
import { useLocation } from 'react-router'

const Dashboard = () => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '#quick-add') {
      const el = document.getElementById('quick-add')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <QuickAdd />
      <ActivitySummary />
      <ActivityChart />
    </div>
  )
}

export default Dashboard
