import { useState } from 'react';
import api from '../services/api';

const IssueForm = ({ projects = [], onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [priority, setPriority] = useState(initialData.priority || 'Medium');
  const [status, setStatus] = useState(initialData.status || 'Open');
  const [assignee, setAssignee] = useState(initialData.assignee || '');
  const [projectId, setProjectId] = useState(initialData.projectId || '');
  const [screenshot, setScreenshot] = useState(null);
  const [isSuggestingPriority, setIsSuggestingPriority] = useState(false);
  const [priorityError, setPriorityError] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionError, setSuggestionError] = useState('');
  const [priorityTouched, setPriorityTouched] = useState(Boolean(initialData.priority));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
  title,
  description,
  priority,
  status,
  assignee,
  projectId,
  screenshot,
};
    onSubmit(payload);
  };

  const handleSuggestPriority = async () => {
    if (!title.trim() || !description.trim()) {
      setPriorityError('Please enter a title and description first.');
      return;
    }

    setIsSuggestingPriority(true);
    setPriorityError('');

    try {
      const response = await api.post('/ai/suggest-priority', { title, description });
      if (response?.data?.priority) {
        setPriority(response.data.priority);
        setPriorityTouched(true);
      }
    } catch (error) {
      setPriorityError(error.response?.data?.message || 'Unable to suggest priority.');
    } finally {
      setIsSuggestingPriority(false);
    }
  };

  const handleSuggestFix = async () => {
    if (!description.trim()) {
      setSuggestionError('Please enter an issue description first.');
      return;
    }

    setIsSuggesting(true);
    setSuggestionError('');
    setSuggestion(null);

    try {
      const response = await api.post('/ai/suggest-fix', { description });
      setSuggestion(response.data);
    } catch (error) {
      setSuggestionError(error.response?.data?.message || 'Unable to generate AI suggestions. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Issue title" className="w-full border rounded p-2" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Issue description" className="w-full border rounded p-2" />
      <button type="button" onClick={handleSuggestPriority} className="bg-sky-600 text-white px-3 py-2 rounded flex items-center gap-2">
        {isSuggestingPriority ? 'Suggesting...' : '✨ Suggest Priority'}
      </button>
      {priorityError && <p className="text-sm text-red-500">{priorityError}</p>}
      <button type="button" onClick={handleSuggestFix} className="bg-amber-500 text-white px-3 py-2 rounded flex items-center gap-2">
        {isSuggesting ? 'Generating...' : '✨ Suggest Fix'}
      </button>
      {suggestionError && <p className="text-sm text-red-500">{suggestionError}</p>}
      {suggestion && (
        <div className="border border-slate-200 rounded p-3 bg-slate-50">
          <h3 className="font-semibold text-slate-700">AI Response</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Possible Root Cause:</span> {suggestion.possibleCause}
            </div>
            <div>
              <span className="font-semibold">Suggested Fix:</span> {suggestion.suggestedFix}
            </div>
            <div>
              <span className="font-semibold">Additional Notes:</span> {suggestion.additionalNotes}
            </div>
          </div>
        </div>
      )}
      <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full border rounded p-2" required>
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>{project.name}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPriorityTouched(true); }} className="border rounded p-2">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded p-2">
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assignee" className="w-full border rounded p-2" />
      <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="w-full" />
      <button className="bg-sky-600 text-white px-4 py-2 rounded">Save Issue</button>
    </form>
  );
};

export default IssueForm;
