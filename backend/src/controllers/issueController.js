console.log("BODY:", req.body);
console.log("FILE:", req.file);
const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');
const { suggestPriority } = require('../services/aiService');

const VALID_STATUSES = ['Open', 'In Progress', 'Closed'];

const normalizeStatus = (status) => {
  return VALID_STATUSES.includes(status) ? status : 'Open';
};

const getIssues = async (req, res, next) => {
  try {
    const { projectId, priority, status } = req.query;
    const filter = { createdBy: req.user._id };

    if (projectId) filter.projectId = projectId;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

const createIssue = async (req, res, next) => {
  try {
    const { title, description, priority, status, assignee, screenshotUrl } = req.body;
    const projectId = req.params.projectId || req.body.projectId;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    let finalPriority = priority;

if (!finalPriority) {
  finalPriority = await suggestPriority(title, description);
}

if (!finalPriority) {
  finalPriority = "Medium";
}
    const issue = await Issue.create({
      title,
      description,
      priority: finalPriority,
      status: normalizeStatus(status || 'Open'),
      assignee,
      screenshotUrl,
      projectId,
      createdBy: req.user._id,
    });

    await ActivityLog.create({
      action: 'Issue Created',
      description: `Issue "${issue.title}" was created`,
      projectId,
      issueId: issue._id,
      createdBy: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.status) {
      updateData.status = normalizeStatus(updateData.status);
    }

    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updateData,
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (req.body.status === 'Closed') {
      await ActivityLog.create({
        action: 'Issue Closed',
        description: `Issue "${issue.title}" was closed`,
        projectId: issue.projectId,
        issueId: issue._id,
        createdBy: req.user._id,
      });
    } else {
      await ActivityLog.create({
        action: 'Issue Updated',
        description: `Issue "${issue.title}" was updated`,
        projectId: issue.projectId,
        issueId: issue._id,
        createdBy: req.user._id,
      });
    }

    res.json(issue);
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await ActivityLog.deleteMany({ issueId: issue._id });
    res.json({ message: 'Issue deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getIssues, createIssue, getIssueById, updateIssue, deleteIssue };
