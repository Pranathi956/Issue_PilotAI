import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import IssueForm from '../components/IssueForm';

const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadIssue = async () => {
    try {
      const [issueRes, projectsRes] = await Promise.all([
        api.get(`/issues/${id}`),
        api.get('/projects'),
      ]);
      setIssue(issueRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssue();
  }, [id]);

  const handleUpdateIssue = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('priority', data.priority);
      formData.append('status', data.status);
      formData.append('assignee', data.assignee);
      formData.append('projectId', data.projectId);
      if (data.screenshot) {
        formData.append('screenshot', data.screenshot);
      }
      await api.put(`/issues/${id}`, formData);
      setEditing(false);
      loadIssue();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIssue = async () => {
    if (!window.confirm('Delete this issue?')) return;

    try {
      await api.delete(`/issues/${id}`);
      navigate('/issues');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!issue) {
    return <div className="p-6">Issue not found.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/issues" className="text-sky-600">← Back to Issues</Link>
        {!editing && (
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="bg-sky-600 text-white px-3 py-2 rounded">Edit Issue</button>
            <button onClick={handleDeleteIssue} className="bg-rose-600 text-white px-3 py-2 rounded">Delete Issue</button>
          </div>
        )}
      </div>

      {editing ? (
        <IssueForm
          projects={projects}
          onSubmit={handleUpdateIssue}
          initialData={{
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: issue.status,
            assignee: issue.assignee,
            projectId: issue.projectId,
          }}
        />
      ) : (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <p className="text-sm text-slate-500">Issue</p>
            <h1 className="text-3xl font-semibold">{issue.title}</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Priority</p>
              <p>{issue.priority}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{issue.status}</p>
            </div>
            <div>
              <p className="font-semibold">Assignee</p>
              <p>{issue.assignee || 'Unassigned'}</p>
            </div>
            <div>
              <p className="font-semibold">Project</p>
              <p>{issue.projectId}</p>
            </div>
            <div>
              <p className="font-semibold">Created</p>
              <p>{issue.createdAt ? new Date(issue.createdAt).toLocaleString() : 'Unknown'}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">Description</p>
            <p className="text-slate-700 whitespace-pre-wrap">{issue.description || 'No description provided.'}</p>
          </div>

          {issue.screenshotUrl && (
            <div>
              <p className="font-semibold">Screenshot</p>
              <img src={issue.screenshotUrl} alt="Issue screenshot" className="mt-2 max-h-64 rounded border" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueDetailsPage;
