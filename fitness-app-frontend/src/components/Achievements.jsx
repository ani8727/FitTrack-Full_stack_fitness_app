import React, { useMemo } from 'react'

const Badge = ({ label, achieved }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border ${achieved ? 'bg-success-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
    <div className={`w-8 h-8 rounded-full grid place-items-center text-sm ${achieved ? 'bg-green-500/20 text-green-200' : 'bg-white/10 text-gray-300'}`}>★</div>
    <div className="flex-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-gray-300">{achieved ? 'Unlocked' : 'Keep going…'}</div>
    </div>
  </div>
)

const Achievements = ({ activities = [] }) => {
  const stats = useMemo(() => {
    const total = activities.length
    const minutes = activities.reduce((s, a) => s + Number(a.duration || 0), 0)
    const streak = (() => {
      const days = new Set(
        activities.map(a => new Date(a.createdAt || a.startTime || 0).toDateString())
      )
      // Simplified streak: number of distinct days with activity in last 7 days
      const now = new Date();
      let count = 0
      for (let i = 0; i < 7; i++) {
        const d = new Date(now)
        d.setDate(now.getDate() - i)
        if (days.has(d.toDateString())) count++
      }
      return count
    })()
    return { total, minutes, streak }
  }, [activities])

  const list = [
    { label: 'First Activity Logged', achieved: stats.total >= 1 },
    { label: 'Five Activities', achieved: stats.total >= 5 },
    { label: '100 Minutes Total', achieved: stats.minutes >= 100 },
    { label: 'Weekly Streak 3+', achieved: stats.streak >= 3 },
  ]

  return (
    <div className="bg-black/30 rounded-xl border border-white/5 p-4">
      <div className="text-sm text-gray-300 mb-2">Achievements</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((b, i) => (
          <Badge key={i} label={b.label} achieved={b.achieved} />
        ))}
      </div>
    </div>
  )
}

export default Achievements
