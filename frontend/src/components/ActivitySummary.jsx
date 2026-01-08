import React, { useEffect, useMemo, useState } from 'react'
import { getActivities } from '../shared/api/api'

const StatCard = ({ label, value, accent }) => (
  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/5">
    <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</div>
    <div className={`text-2xl font-semibold ${accent || ''}`}>{value}</div>
  </div>
)

const ActivitySummary = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await getActivities()
        setItems(resp.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const { count, minutes, calories } = useMemo(() => {
    const c = items.length
    const m = items.reduce((sum, a) => sum + Number(a.duration || 0), 0)
    const k = items.reduce((sum, a) => sum + Number(a.caloriesBurned || 0), 0)
    return { count: c, minutes: m, calories: k }
  }, [items])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Sessions" value={count} accent="text-primary-500" />
      <StatCard label="Total Minutes" value={minutes} accent="text-accent-500" />
      <StatCard label="Calories" value={calories} accent="text-green-400" />
    </div>
  )
}

export default ActivitySummary
