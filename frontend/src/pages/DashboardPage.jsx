import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ActivityList from '../components/ActivityList';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalProjects: 0, totalIssues: 0, openIssues: 0, closedIssues: 0 });
  const [issues, setIssues] = useState([]);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [projectsRes, issuesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/issues'),
        ]);

        const projects = projectsRes.data || [];
        const allIssues = issuesRes.data || [];
        setStats({
          totalProjects: projects.length,
          totalIssues: allIssues.length,
          openIssues: allIssues.filter((issue) => issue.status === 'Open').length,
          closedIssues: allIssues.filter((issue) => issue.status === 'Closed').length,
        });
        setIssues(allIssues.slice(0, 5));

        if (projects[0]) {
          const [activityRes, summaryRes] = await Promise.all([
            api.get(`/projects/${projects[0]._id}/activity`),
            api.get(`/ai/daily-summary?projectId=${projects[0]._id}`),
          ]);
          setActivities(activityRes.data.slice(0, 5));
          setSummary(summaryRes.data.summary);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-slate-500">Total Projects</div><div className="text-2xl font-bold">{stats.totalProjects}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-slate-500">Total Issues</div><div className="text-2xl font-bold">{stats.totalIssues}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-slate-500">Open Issues</div><div className="text-2xl font-bold">{stats.openIssues}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-slate-500">Closed Issues</div><div className="text-2xl font-bold">{stats.closedIssues}</div></div>
      </div>

      <div className="bg-sky-50 border border-sky-200 p-4 rounded shadow mb-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">AI Daily Summary</h2>
          <Link to="/activity" className="text-sm text-sky-600">View Activity History</Link>
        </div>
        <p className="text-slate-700 mt-2">{summary || 'Create a project to generate your summary.'}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3">Recent Issues</h2>
          {issues.length === 0 ? <EmptyState title="No issues yet" message="Create your first issue to get started." /> : <div className="space-y-3">{issues.map((issue) => <div key={issue._id} className="bg-white p-3 rounded shadow flex items-center justify-between"><span>{issue.title}</span><Link to={`/issues/${issue._id}`} className="text-sm text-sky-600">Open</Link></div>)}</div>}
        </div>
        <ActivityList activities={activities} />
      </div>
    </div>
  );
};

export default DashboardPage;
