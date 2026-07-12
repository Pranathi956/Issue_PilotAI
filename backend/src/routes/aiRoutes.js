const express = require('express');
const { suggestIssuePriority, getDailySummary, getProjectSummary, suggestBugFix } = require('../controllers/aiController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/suggest-priority', protect, suggestIssuePriority);
router.post('/project-summary', protect, getProjectSummary);
router.post('/suggest-fix', protect, suggestBugFix);
router.get('/daily-summary', protect, getDailySummary);

module.exports = router;
