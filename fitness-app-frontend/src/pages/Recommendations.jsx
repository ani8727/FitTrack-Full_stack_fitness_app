import React, { useEffect, useState } from 'react'

// Placeholder for AI recommendations page (could fetch from aiservice once API is ready)
const Recommendations = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    // TODO: fetch recommendations
    setItems([])
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Recommendations</h2>
      <div className="bg-black/20 rounded-xl p-5 border border-white/5">
        {items.length === 0 ? (
          <div className="text-gray-400">No recommendations yet. Log some activities to see insights!</div>
        ) : (
          <ul className="space-y-2">
            {items.map((r, idx) => (
              <li key={idx} className="bg-black/30 rounded-lg p-3 border border-white/5">{r.text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Recommendations
