import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ActivityHistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const projectIds = projectsRes.data.map((project) => project._id);
        const activityResults = await Promise.all(projectIds.map((id) => api.get(`/projects/${id}/activity`)));
        const combined = activityResults.flatMap((res) => res.data);
        setActivities(combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Activity History</h1>
        <Link to="/dashboard" className="text-sky-600">Back to Dashboard</Link>
      </div>

      {loading ? (
        <p>Loading activity history...</p>
      ) : activities.length === 0 ? (
        <p className="text-slate-500">No activity yet.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{activity.action}</div>
              <div className="text-sm text-slate-600">{activity.description}</div>
              <div className="text-xs text-slate-400 mt-1">{new Date(activity.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;
