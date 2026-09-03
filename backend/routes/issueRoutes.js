const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const issueController = require('../controllers/issueController');

router.use(authenticate);
router.get('/task/:taskId', issueController.getIssues);
router.get('/project/:projectId', issueController.getProjectIssues);
router.get('/workspace/:workspaceId', issueController.getWorkspaceIssues);
router.get('/:id', issueController.getIssue);
router.post('/', issueController.createIssue);
router.patch('/:id', issueController.updateIssue);

module.exports = router;
