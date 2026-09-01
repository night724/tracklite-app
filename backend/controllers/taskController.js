const Task = require("../models/Task");
const { v4: uuidv4 } = require("uuid");

exports.getTasks = async (req, res) => {
    try {
        const tasks =
            await Task.getByProject(
                req.params.projectId
            );
        res.json(tasks);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Cannot get tasks"
        });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.getById(req.params.id);
        if (!task) {
            return res.status(404)
                .json({
                    message:
                        "Task not found"
                });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500)
            .json({ message: "Error loading task" });
    }
};

exports.createTask = async (req, res) => {
    try {
        const {
            project_id,
            title,
            description,
            status,
            priority,
            assigned_to
        } = req.body;

        const task = await Task.create({
            id: uuidv4(),
            project_id,
            title,
            description,
            status: status || "TODO",
            priority: priority || "MEDIUM",
            assigned_to,
            created_by:
                req.user.id
        });
        res.status(201)
            .json(task);
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: "Task creation failed" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task =
            await Task.update(
                req.params.id,
                req.body
            );
        res.json(task);
    }
    catch (error) {
        res.status(500)
            .json({ message: "Task update failed" });
    }
};
exports.deleteTask = async (req, res) => {
    try {
        await Task.delete(
            req.params.id
        );
        res.json({ message: "Task deleted" });
    }
    catch (error) {
        res.status(500)
            .json({ message: "Delete failed" });
    }
};
exports.getWorkspaceTasks = async (req, res) => {

    try {

        const tasks =
            await Task.getByWorkspace(
                req.params.workspaceId
            );

        res.json(tasks);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Cannot load workspace tasks"
        });

    }

};