import React, { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js'
import { getActivities } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const toDate = (d) => new Date(d)
const fmt = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`
}

const groupByDay = (items) => {
  const map = new Map()
  for (const a of items) {
    const day = fmt(a.createdAt || a.startTime || Date.now())
    const prev = map.get(day) || { minutes: 0, calories: 0 }
    prev.minutes += Number(a.duration || 0)
    prev.calories += Number(a.caloriesBurned || 0)
    map.set(day, prev)
  }
  return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]))
}

const ActivityChart = () => {
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

  const data = useMemo(() => {
    const grouped = groupByDay(items)
    const labels = grouped.map(([d]) => d)
    const minutes = grouped.map(([,v]) => v.minutes)
    const calories = grouped.map(([,v]) => v.calories)
    return {
      labels,
      datasets: [
        {
          label: 'Minutes',
          data: minutes,
          fill: true,
          tension: 0.35,
          backgroundColor: 'rgba(100,108,255,0.15)',
          borderColor: '#646cff',
          pointRadius: 2
        },
        {
          label: 'Calories',
          data: calories,
          fill: true,
          tension: 0.35,
          backgroundColor: 'rgba(255,122,89,0.15)',
          borderColor: '#ff7a59',
          pointRadius: 2
        }
      ]
    }
  }, [items])

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: 'inherit' } },
      tooltip: { enabled: true }
    },
    scales: {
      x: { ticks: { color: 'inherit' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { ticks: { color: 'inherit' }, grid: { color: 'rgba(255,255,255,0.08)' } }
    }
  }

  if (loading) return <div className="h-56 rounded-xl bg-white/5 animate-pulse" />

  return (
    <div className="bg-black/30 rounded-xl border border-white/5 p-4">
      <div className="text-sm text-gray-300 mb-2">Progress</div>
      <Line data={data} options={options} height={80} />
    </div>
  )
}

export default ActivityChart
