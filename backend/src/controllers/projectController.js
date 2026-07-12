const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({ name, description, createdBy: req.user._id });
    await ActivityLog.create({
      action: 'Project Created',
      description: `Project "${project.name}" was created`,
      projectId: project._id,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await ActivityLog.create({
      action: 'Project Updated',
      description: `Project "${project.name}" was updated`,
      projectId: project._id,
      createdBy: req.user._id,
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await ActivityLog.deleteMany({ projectId: project._id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

const getProjectActivity = async (req, res, next) => {
  try {
    const activities = await ActivityLog.find({ projectId: req.params.id, createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, getProjectById, updateProject, deleteProject, getProjectActivity };
