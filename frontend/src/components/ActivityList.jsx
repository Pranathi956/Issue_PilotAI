const ActivityList = ({ activities }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-slate-500">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li key={activity._id} className="border-b pb-2 text-sm">
              <div className="font-medium">{activity.action}</div>
              <div className="text-slate-600">{activity.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;
