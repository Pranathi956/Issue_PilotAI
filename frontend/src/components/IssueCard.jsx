const IssueCard = ({ issue, onUpdateStatus }) => {
  const nextAction = issue.status === 'Open'
    ? { label: 'Start Progress', nextStatus: 'In Progress' }
    : issue.status === 'In Progress'
      ? { label: 'Close Issue', nextStatus: 'Closed' }
      : null;

  return (
    <div className="bg-white p-4 rounded shadow border">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{issue.title}</h3>
        <span className="text-sm px-2 py-1 rounded bg-slate-100">{issue.priority}</span>
      </div>
      <p className="text-sm text-slate-600 mt-2">{issue.description}</p>
      <div className="flex justify-between mt-4 text-sm text-slate-500">
        <span>Status: {issue.status}</span>
        <span>Assignee: {issue.assignee || 'Unassigned'}</span>
      </div>
      {nextAction && (
        <button onClick={() => onUpdateStatus(issue._id, nextAction.nextStatus)} className="mt-3 bg-emerald-600 text-white px-3 py-1 rounded">
          {nextAction.label}
        </button>
      )}
    </div>
  );
};

export default IssueCard;
