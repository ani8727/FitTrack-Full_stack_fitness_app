import React, { useState } from 'react'
import { addActivity } from '../shared/api/api'
import Toast from './Toast'

const QuickAdd = () => {
  const [activity, setActivity] = useState({ type: 'RUNNING', duration: '', caloriesBurned: '' })
  const [toast, setToast] = useState({ type: 'success', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addActivity({
        ...activity,
        duration: Number(activity.duration || 0),
        caloriesBurned: Number(activity.caloriesBurned || 0)
      })
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '' })
      setToast({ type: 'success', message: 'Quick add successful!' })
    } catch (e) {
      console.error(e)
      setToast({ type: 'error', message: 'Failed to quick add.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="quick-add" onSubmit={submit} className="bg-black/30 border border-white/5 rounded-xl p-4">
      <div className="text-sm font-medium mb-3">Quick Add</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={activity.type} onChange={(e) => setActivity({ ...activity, type: e.target.value })} className="bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2">
          <option value="RUNNING">Running</option>
          <option value="WALKING">Walking</option>
          <option value="CYCLING">Cycling</option>
        </select>
        <input type="number" min="0" placeholder="Minutes" value={activity.duration} onChange={(e) => setActivity({ ...activity, duration: e.target.value })} className="bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2" />
        <input type="number" min="0" placeholder="Calories" value={activity.caloriesBurned} onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })} className="bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2" />
        <button type="submit" disabled={loading} className="bg-secondary-500 hover:bg-secondary-700 disabled:opacity-60 text-white rounded-md px-4 py-2">{loading ? 'Adding...' : 'Add'}</button>
      </div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, message: '' })} />
    </form>
  )
}

export default QuickAdd
