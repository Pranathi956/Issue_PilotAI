import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProjectForm from '../components/ProjectForm';
import EmptyState from '../components/EmptyState';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (data) => {
    try {
      await api.post('/projects', data);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/projects/${editingProjectId}`, data);
      setEditingProjectId(null);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      await api.delete(`/projects/${projectId}`);
      loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Projects</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <ProjectForm onSubmit={handleCreate} />
        <div>
          {loading ? <p>Loading...</p> : projects.length === 0 ? <EmptyState title="No projects yet" message="Create your first project to organize work." /> : <div className="space-y-3">{projects.map((project) => <div key={project._id} className="bg-white p-4 rounded shadow"> <div className="flex items-center justify-between"> <Link to={`/projects/${project._id}`} className="font-semibold text-sky-700">{project.name}</Link><div className="flex gap-2"><button onClick={() => setEditingProjectId(project._id)} className="text-sky-600 text-sm">Edit</button><button onClick={() => handleDelete(project._id)} className="text-rose-600 text-sm">Delete</button></div></div><p className="text-sm text-slate-600">{project.description}</p>{editingProjectId === project._id && <div className="mt-3"><ProjectForm onSubmit={handleUpdate} initialData={project} /><button onClick={() => setEditingProjectId(null)} className="mt-2 text-sm text-slate-500">Cancel</button></div>}</div>)}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
