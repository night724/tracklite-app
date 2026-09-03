const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.getAll(req.params.workspaceId);
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get projects',
        });
    }
};

exports.getProject = async (req, res) => {
    try {
        const project = await Project.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({
            message: 'Error loading project',
        });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { workspace_id, name, description } = req.body;

        const project = await Project.create({
            id: uuidv4(),
            workspace_id,
            name,
            description,
            created_by: req.user.id,
        });

        res.status(201).json(project);
    } catch (error) {
        console.log('CREATE PROJECT ERROR:', error);
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.update(req.params.id, req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({
            message: 'Update failed',
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({
            message: 'Project deleted',
        });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
