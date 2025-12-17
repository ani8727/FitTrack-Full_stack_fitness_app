import React, { useState } from 'react'
import { addActivity } from '../shared/api/api'
import Toast from './Toast'

const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
        type: 'RUNNING',
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
    })

    const [toast, setToast] = useState({ type: 'success', message: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addActivity({
                ...activity,
                duration: Number(activity.duration || 0),
                caloriesBurned: Number(activity.caloriesBurned || 0)
            })
            if (onActivityAdded) onActivityAdded()
            setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '' })
            setToast({ type: 'success', message: 'Activity added successfully!' })
        } catch (error) {
            console.error(error)
            setToast({ type: 'error', message: 'Failed to add activity.' })
        }
    }

    return (
        <form id="add-activity" onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm mb-1">Activity Type</label>
                    <select
                        value={activity.type}
                        onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                        className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="RUNNING">Running</option>
                        <option value="WALKING">Walking</option>
                        <option value="CYCLING">Cycling</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Duration (minutes)</label>
                    <input
                        type="number"
                        min="0"
                        value={activity.duration}
                        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                        className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g. 30"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Calories Burned</label>
                    <input
                        type="number"
                        min="0"
                        value={activity.caloriesBurned}
                        onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                        className="w-full bg-neutral-900 text-white border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g. 250"
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-md">
                    Add Activity
                </button>
            </div>
            <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, message: '' })} />
        </form>
    )
}

export default ActivityForm