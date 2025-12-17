import React, { useEffect, useMemo, useState } from 'react'
import { getActivities } from '../services/api'

const chip = (level, text) => {
  const base = 'px-3 py-1 rounded-full text-xs border inline-block'
  const styles = level === 'warn'
    ? 'bg-warning-500/15 text-yellow-200 border-yellow-400/30'
    : level === 'error'
      ? 'bg-red-500/15 text-red-200 border-red-400/30'
      : 'bg-success-500/15 text-green-200 border-green-400/30'
  return <span className={`${base} ${styles}`}>{text}</span>
}

const HealthInsights = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const r = await getActivities()
        setItems(r.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const { lastActiveDays, weeklyMinutes, weeklyCalories } = useMemo(() => {
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const last = items
      .map(a => new Date(a.createdAt || a.startTime || 0))
      .sort((a,b) => b - a)[0]
    const lastActiveDays = last ? Math.floor((now - last) / oneDay) : Infinity
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7)
    const week = items.filter(a => new Date(a.createdAt || a.startTime || 0) >= cutoff)
    const weeklyMinutes = week.reduce((s,a) => s + Number(a.duration || 0), 0)
    const weeklyCalories = week.reduce((s,a) => s + Number(a.caloriesBurned || 0), 0)
    return { lastActiveDays, weeklyMinutes, weeklyCalories }
  }, [items])

  if (loading) return <div className="h-24 rounded-xl bg-white/5 animate-pulse" />

  const cards = []
  if (lastActiveDays === Infinity) {
    cards.push({ level: 'warn', title: 'No activity yet', text: 'Start tracking your first session to get insights.' })
  } else if (lastActiveDays >= 3) {
    cards.push({ level: 'warn', title: 'Inactivity', text: `No activity in ${lastActiveDays} day(s). A short walk helps!` })
  }
  if (weeklyMinutes < 150) {
    cards.push({ level: 'warn', title: 'Weekly minutes low', text: `You have ${weeklyMinutes} min this week. Aim for 150+.` })
  } else {
    cards.push({ level: 'ok', title: 'Great pace', text: `You've logged ${weeklyMinutes} minutes this week.` })
  }
  if (weeklyCalories < 1000) {
    cards.push({ level: 'info', title: 'Calories this week', text: `${weeklyCalories} kcal burned. Keep it up!` })
  }

  return (
    <div className="bg-black/30 rounded-xl border border-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-300">Health Insights</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-lg border border-white/5 p-3 bg-black/20">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">{c.title}</div>
              {chip(c.level === 'ok' ? 'success' : c.level, c.level === 'ok' ? 'Good' : 'Notice')}
            </div>
            <div className="text-sm text-gray-300">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthInsights
