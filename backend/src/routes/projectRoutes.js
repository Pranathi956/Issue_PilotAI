const express = require('express');
const { getProjects, createProject, getProjectById, updateProject, deleteProject, getProjectActivity } = require('../controllers/projectController');
const { getIssues, createIssue } = require('../controllers/issueController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id/issues', protect, (req, res, next) => {
  req.query.projectId = req.params.id;
  return getIssues(req, res, next);
});
router.post('/:id/issues', protect, (req, res, next) => {
  req.body.projectId = req.params.id;
  return createIssue(req, res, next);
});
router.get('/:id/activity', protect, getProjectActivity);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
