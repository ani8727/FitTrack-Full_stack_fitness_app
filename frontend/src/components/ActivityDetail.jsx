import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getActivity, getActivityRecommendation } from '../shared/api/api'

const ActivityDetail = () => {
 const { id } = useParams();
 const navigate = useNavigate();

 const [activity, setActivity] = useState(null);
 const [recommendation, setRecommendation] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        
        // Fetch activity details
        const activityResponse = await getActivity(id);
        setActivity(activityResponse.data);

        // Fetch AI recommendation
        try {
          const recResponse = await getActivityRecommendation(id);
          setRecommendation(recResponse.data);
        } catch {
          // Recommendation might not exist yet - that's okay
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        setError('Failed to load activity details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchActivityData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-300 text-lg">Loading activity details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-center">
          <p className="text-red-200 mb-2">❌ Error loading activity</p>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/activities')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/5">
        <h2 className="text-xl font-semibold mb-2">Activity Details</h2>
        {activity ? (
          <div className="text-sm text-gray-300 space-y-1">
            <div>Type: <span className="text-white">{activity.type || 'Not specified'}</span></div>
            <div>Duration: <span className="text-white">{activity.duration ? `${activity.duration} minutes` : 'Not specified'}</span></div>
            <div>Calories Burned: <span className="text-white">{activity.caloriesBurned || 'Not specified'}</span></div>
            <div>Date: <span className="text-white">{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}</span></div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">No activity data available</div>
        )}
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/5">
        <h3 className="text-lg font-semibold mb-3">AI Recommendation</h3>
        
        {!recommendation ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">⏳ Generating AI recommendations...</div>
            <p className="text-sm text-gray-500">This may take a few seconds</p>
          </div>
        ) : (
          <>
            {recommendation.recommendation && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Analysis</div>
                {!recommendation.isGenerated ? (
                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                    <p className="text-yellow-200 mb-2">⚠️ AI Analysis Currently Unavailable</p>
                    <p className="text-sm text-gray-300">
                      The AI service is not available. Please try again later or view setup guide
                      <a href="#" className="text-blue-400 hover:underline ml-1">here</a>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-200 whitespace-pre-wrap">{recommendation.recommendation}</p>
                )}
              </div>
            )}

            {recommendation.improvements && recommendation.improvements.length > 0 && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Improvements</div>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  {recommendation.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.suggestions && recommendation.suggestions.length > 0 && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Suggestions</div>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  {recommendation.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.safety && recommendation.safety.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Safety Guidelines</div>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  {recommendation.safety.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ActivityDetail