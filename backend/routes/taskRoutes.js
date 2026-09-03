const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const controller = require('../controllers/taskController');

router.use(authenticate);

router.get('/project/:projectId', controller.getTasks);

router.get('/workspace/:workspaceId', controller.getWorkspaceTasks);

router.get('/:id', controller.getTask);

router.post('/', controller.createTask);

router.patch('/:id', controller.updateTask);

router.delete('/:id', controller.deleteTask);

module.exports = router;
