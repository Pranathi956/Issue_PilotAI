const express = require('express');
const { getIssues, createIssue, getIssueById, updateIssue, deleteIssue } = require('../controllers/issueController');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../services/cloudinaryService');

const router = express.Router();

router.get('/', protect, getIssues);
router.post('/', protect, upload.single('screenshot'), async (req, res, next) => {
  try {
    if (req.file) {
      const screenshotUrl = await uploadToCloudinary(req.file.path);
      req.body.screenshotUrl = screenshotUrl;
    }
    return createIssue(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.get('/:id', protect, getIssueById);
router.put('/:id', protect, upload.single('screenshot'), async (req, res, next) => {
  try {
    if (req.file) {
      const screenshotUrl = await uploadToCloudinary(req.file.path);
      req.body.screenshotUrl = screenshotUrl;
    }
    return updateIssue(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', protect, deleteIssue);

module.exports = router;
