import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import IssueCard from '../components/IssueCard';
import EmptyState from '../components/EmptyState';
import IssueForm from '../components/IssueForm';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ priority: '', status: '' });
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadData = async () => {
    try {
      const [issuesRes, projectsRes] = await Promise.all([api.get('/issues'), api.get('/projects')]);
      setIssues(issuesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = !filters.priority || issue.priority === filters.priority;
    const matchesStatus = !filters.status || issue.status === filters.status;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateIssue = async (data) => {
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
      await api.post('/issues', formData);
      setShowCreateForm(false);
      loadData();
    } catch (error) {
  console.error("Create Issue Error:", error.response?.data || error);
  alert(JSON.stringify(error.response?.data || error.message));
}
  };

  const handleStatusUpdate = async (issueId, status) => {
    try {
      await api.put(`/issues/${issueId}`, { status });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Issues</h1>
        <button onClick={() => setShowCreateForm((prev) => !prev)} className="bg-sky-600 text-white px-4 py-2 rounded">
          {showCreateForm ? 'Cancel' : 'Create Issue'}
        </button>
      </div>
      {showCreateForm && <div className="mb-6"><IssueForm projects={projects} onSubmit={handleCreateIssue} /></div>}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" className="border rounded p-2 min-w-[220px]" />
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="border rounded p-2">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="border rounded p-2">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      {filteredIssues.length === 0 ? <EmptyState title="No issues match your filters" message="Try changing the search filters." /> : <div className="space-y-3">{filteredIssues.map((issue) => <div key={issue._id} className="space-y-2"><IssueCard issue={issue} onUpdateStatus={handleStatusUpdate} /><Link to={`/issues/${issue._id}`} className="text-sm text-sky-600">View details</Link></div>)}</div>}
    </div>
  );
};

export default IssuesPage;
