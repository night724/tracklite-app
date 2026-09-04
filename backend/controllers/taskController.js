const Task = require('../models/Task');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.getByProject(req.params.projectId);
        res.json(tasks);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Cannot get tasks',
        });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.getById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error loading task' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { project_id, title, description, status, priority, assigned_to } = req.body;

        console.log('REQ USER:', req.user);
        console.log('REQ BODY:', req.body);

        const task = await Task.create({
            id: uuidv4(),
            project_id,
            title,
            description,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            assigned_to: assigned_to || null,
            created_by: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        console.log('CREATE TASK ERROR:', error.message);

        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        console.log('UPDATE TASK ID:', req.params.id);
        console.log('UPDATE DATA:', req.body);

        const task = await Task.update(req.params.id, req.body);

        res.json(task);
    } catch (error) {
        console.log('UPDATE TASK ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
};
exports.deleteTask = async (req, res) => {
    try {
        await Task.delete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
exports.getWorkspaceTasks = async (req, res) => {
    try {
        const status = req.query.status;
        const tasks = await Task.getByWorkspace(req.params.workspaceId, status);
        res.json(tasks);
    } catch (error) {
        console.log('GET WORKSPACE TASKS ERROR:', error.message);

        res.status(500).json({
            message: error.message,
        });
    }
};
