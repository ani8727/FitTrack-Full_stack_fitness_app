import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getActivityDetail } from '../shared/api/api'

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error(error);
      }
    }

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <div className="text-gray-300">Loading...</div>
  }
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/5">
        <h2 className="text-xl font-semibold mb-2">Activity Details</h2>
        <div className="text-sm text-gray-300 space-y-1">
          <div>Type: {activity.type}</div>
          <div>Duration: {activity.duration} minutes</div>
          <div>Calories Burned: {activity.caloriesBurned}</div>
          <div>Date: {new Date(activity.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {recommendation && (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/5">
          <h3 className="text-lg font-semibold mb-3">AI Recommendation</h3>
          {activity?.recommendation && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Analysis</div>
              <p className="text-gray-200">{activity.recommendation}</p>
            </div>
          )}

          {activity?.improvements?.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Improvements</div>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {activity.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}

          {activity?.suggestions?.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Suggestions</div>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {activity.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {activity?.safety?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Safety Guidelines</div>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {activity.safety.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ActivityDetail