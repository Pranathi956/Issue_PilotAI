import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import IssueForm from '../components/IssueForm';
import IssueCard from '../components/IssueCard';
import { Link } from 'react-router-dom';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activity, setActivity] = useState([]);
  const [showCreateIssue, setShowCreateIssue] = useState(false);

  const loadData = async () => {
    try {
      const [projectRes, issuesRes, projectsRes, activityRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/issues`),
        api.get('/projects'),
        api.get(`/projects/${id}/activity`),
      ]);
      setProject(projectRes.data);
      setIssues(issuesRes.data);
      setProjects(projectsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateIssue = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('priority', data.priority);
      formData.append('status', data.status);
      formData.append('assignee', data.assignee);
      formData.append('projectId', id);
      if (data.screenshot) {
        formData.append('screenshot', data.screenshot);
      }
      await api.post(`/projects/${id}/issues`, formData);
      setShowCreateIssue(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await api.post('/ai/project-summary', { projectId: id });
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleUpdateStatus = async (issueId, status) => {
    try {
      await api.put(`/issues/${issueId}`, { status });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!project) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-2">{project.name}</h1>
      <p className="text-slate-600 mb-6">{project.description}</p>
      <div className="mb-6 rounded border border-sky-200 bg-sky-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">AI Project Summary</h2>
            <p className="text-sm text-slate-600">Generate a quick summary of project progress and open work.</p>
          </div>
          <button onClick={handleGenerateSummary} className="bg-sky-600 px-3 py-2 rounded text-white">
            {summaryLoading ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
        {summary && <p className="mt-3 text-slate-700">{summary}</p>}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button onClick={() => setShowCreateIssue((prev) => !prev)} className="bg-sky-600 text-white px-4 py-2 rounded">
            {showCreateIssue ? 'Cancel' : 'Create Issue'}
          </button>
          {showCreateIssue && <IssueForm projects={projects} onSubmit={handleCreateIssue} initialData={{ projectId: id }} />}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Activity Log</h2>
            {activity.length === 0 ? <p className="text-sm text-slate-500">No activity yet.</p> : <div className="space-y-2">{activity.map((item) => <div key={item._id} className="border-b pb-2 text-sm"><div className="font-medium">{item.action}</div><div className="text-slate-600">{item.description}</div></div>)}</div>}
          </div>
        </div>
        <div className="space-y-3">
          {issues.map((issue) => <div key={issue._id} className="space-y-2"><IssueCard issue={issue} onUpdateStatus={handleUpdateStatus} /><Link to={`/issues/${issue._id}`} className="text-sm text-sky-600">View details</Link></div>)}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
