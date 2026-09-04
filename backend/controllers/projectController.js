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
        const { projectId } = req.params;

        console.log('REQUEST PROJECT:', projectId);

        const project = await Project.getById(projectId);

        console.log('FOUND PROJECT:', project);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
                id: projectId,
            });
        }

        res.json(project);
    } catch (error) {
        console.log('GET PROJECT ERROR:', error);

        res.status(500).json({
            message: 'Server error',
        });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { workspace_id, name, description } = req.body;

        const project = await Project.create({
            id: uuidv4(),
            project_key: name.substring(0, 3).toUpperCase(),
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
exports.getProjectMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await db.query(
            `
            SELECT
                u.id,
                u.name,
                u.email
            FROM projects p
            JOIN workspace_members wm
            ON p.workspace_id = wm.workspace_id
            JOIN users u
            ON wm.user_id = u.id
            WHERE p.id = $1
            `,
            [projectId],
        );
        res.json(result.rows);
    } catch (error) {
        console.log('GET PROJECT MEMBERS ERROR:', error);
        res.status(500).json({
            message: 'Cannot load project members',
        });
    }
};
