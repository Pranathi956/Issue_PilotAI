const Project = require('../models/Project');
const Issue = require('../models/Issue');
const { suggestPriority, generateDailySummary, generateProjectSummary } = require('../services/aiService');
const { generateBugFixSuggestion } = require('../services/groqService');

const suggestIssuePriority = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const priority = await suggestPriority(title, description);
    res.json({ priority });
  } catch (error) {
    next(error);
  }
};

const getDailySummary = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.query.projectId, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const issues = await Issue.find({ projectId: project._id, createdBy: req.user._id });
    const summary = await generateDailySummary(project, issues);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

const getProjectSummary = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findOne({ _id: projectId, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const issues = await Issue.find({ projectId: project._id, createdBy: req.user._id });
    const summary = await generateProjectSummary(project, issues);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

const suggestBugFix = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const suggestions = await generateBugFixSuggestion(description);
    res.json(suggestions);
  } catch (error) {
    const message = error.message || 'Groq request failed';
    res.status(502).json({ message });
  }
};

module.exports = { suggestIssuePriority, getDailySummary, getProjectSummary, suggestBugFix };
