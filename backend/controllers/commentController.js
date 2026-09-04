const Comment = require('../models/Comment');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.getByIssue(req.params.issueId);
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot get comments',
        });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { issue_id, body } = req.body;
        const comment = await Comment.create({
            id: uuidv4(),
            issue_id,
            user_id: req.user.id,
            body,
        });

        await db.query(
            `
                INSERT INTO activity_logs
                (
                issue_id,
                user_id,
                action
                )
                VALUES
                ($1,$2,$3)
                `,
            [issue_id, req.user.id, 'Added a comment'],
        );

        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Comment failed',
        });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT user_id
            FROM comments
            WHERE id=$1
            `,
            [req.params.id],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Comment not found',
            });
        }

        if (result.rows[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: 'Not allowed',
            });
        }

        await Comment.delete(req.params.id);

        res.json({
            message: 'Comment deleted',
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Delete failed',
        });
    }
};
