const express = require('express');
const router = express.Router();

const db = require('../config/database');
const auth = require('../middleware/auth');

// GET TEAM MEMBERS
router.get('/workspace/:workspaceId', auth, async (req, res) => {
    try {
        const members = await db.query(
            `
                SELECT

                    u.id AS user_id,
                    u.name,
                    u.email,

                    wm.role,

                    p.id AS project_id,
                    p.name AS project_name,
                    p.status AS project_status


                FROM workspace_members wm


                JOIN users u
                ON wm.user_id = u.id


                LEFT JOIN project_members pm
                ON pm.user_id = u.id


                LEFT JOIN projects p
                ON p.id = pm.project_id
                AND p.workspace_id = wm.workspace_id


                WHERE wm.workspace_id=$1


                ORDER BY u.name

                `,
            [req.params.workspaceId],
        );

        const invitations = await db.query(
            `
        SELECT

            wi.id,
            wi.email,
            wi.role,
            wi.status,
            wi.created_at

        FROM workspace_invitations wi

        WHERE wi.workspace_id=$1

        AND wi.status='PENDING'

        ORDER BY wi.created_at DESC

    `,
            [req.params.workspaceId],
        );
        res.json({
            members: members.rows,

            invitations: invitations.rows,
        });
    } catch (error) {
        console.log('LOAD TEAM ERROR:', error);

        res.status(500).json({
            message: 'Cannot load team',
        });
    }
});

// INVITE MEMBER
router.post('/invite', auth, async (req, res) => {
    try {
        const { workspace_id, email, role } = req.body;

        if (!workspace_id || !email) {
            return res.status(400).json({
                message: 'Workspace and email required',
            });
        }

        // find user

        const user = await db.query(
            `
                SELECT id
                FROM users
                WHERE email=$1
                `,
            [email],
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: 'User does not exist',
            });
        }

        const userId = user.rows[0].id;

        // check already member

        const existing = await db.query(
            `
                SELECT id
                FROM workspace_members
                WHERE workspace_id=$1
                AND user_id=$2
                `,
            [workspace_id, userId],
        );

        if (existing.rows.length) {
            return res.status(400).json({
                message: 'User already in workspace',
            });
        }

        console.log({
            workspace_id,

            inviter: req.user,

            invited_user: userId,

            role,
        });

        const invitation = await db.query(
            `
                    INSERT INTO workspace_invitations
            (
            workspace_id,
            inviter_id,
            email,
            role
            )

            VALUES
            ($1,$2,$3,$4)

                    RETURNING id
                    `,
            [
                workspace_id,
                req.user.id,
                email,
                ['OWNER', 'ADMIN', 'MEMBER'].includes(role) ? role : 'MEMBER',
            ],
        );

        const invitationId = invitation.rows[0].id;
        // CREATE INBOX NOTIFICATION

        await db.query(
            `
INSERT INTO notifications
(
 user_id,
 message,
 type,
 reference_id
)

VALUES
(
 $1,
 $2,
 $3,
 $4
)
`,
            [userId, 'You have been invited to join a workspace', 'WORKSPACE_INVITE', invitationId],
        );

        res.json({
            message: 'Member invited successfully',
        });
    } catch (error) {
        console.log('INVITE ERROR:', error.message);

        res.status(500).json({
            message: error.message,
        });
    }
});
// RESEND INVITATION
router.post('/invite/:id/resend', auth, async (req, res) => {
    try {
        const inviteId = req.params.id;

        const invite = await db.query(
            `
            SELECT
                wi.email,
                wi.workspace_id

            FROM workspace_invitations wi

            WHERE wi.id=$1
            AND wi.status='PENDING'
            `,
            [inviteId],
        );
        if (invite.rows.length === 0) {
            return res.status(404).json({
                message: 'Invitation not found',
            });
        }

        const email = invite.rows[0].email;

        const user = await db.query(
            `
    SELECT id
    FROM users
    WHERE email=$1
    `,
            [email],
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const userId = user.rows[0].id;

        await db.query(
            `
                INSERT INTO notifications
                (
                    user_id,
                    message,
                    type,
                    reference_id
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,
            [userId, 'You have a workspace invitation reminder', 'WORKSPACE_INVITE', inviteId],
        );

        res.json({
            message: 'Invitation resent',
        });
    } catch (error) {
        console.log('RESEND ERROR:', error);

        res.status(500).json({
            message: 'Resend failed',
        });
    }
});

// REVOKE INVITATION
router.delete('/invite/:id/revoke', auth, async (req, res) => {
    try {
        await db.query(
            `
                UPDATE workspace_invitations

                SET status='REJECTED'

                WHERE id=$1
                `,
            [req.params.id],
        );

        res.json({
            message: 'Invitation revoked',
        });
    } catch (error) {
        console.log('REVOKE ERROR:', error);

        res.status(500).json({
            message: 'Revoke failed',
        });
    }
});
// ACCEPT WORKSPACE INVITE
router.post('/invite/:notificationId/accept', auth, async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        const invite = await db.query(
            `
            SELECT
                wi.id,
                wi.workspace_id,
                wi.role,
                wi.email

            FROM notifications n

            JOIN workspace_invitations wi
            ON n.reference_id = wi.id

            WHERE n.id=$1
            AND n.user_id=$2
            AND wi.status='PENDING'

            `,
            [notificationId, req.user.id],
        );

        console.log('INVITE RESULT:', invite.rows);

        if (invite.rows.length === 0) {
            return res.status(404).json({
                message: 'Invitation not found',
            });
        }

        const invitation = invite.rows[0];

        // check duplicate member

        const exists = await db.query(
            `
            SELECT id
            FROM workspace_members

            WHERE workspace_id=$1
            AND user_id=$2
            `,
            [invitation.workspace_id, req.user.id],
        );

        if (exists.rows.length) {
            return res.status(400).json({
                message: 'Already joined workspace',
            });
        }

        // add member

        await db.query(
            `
            INSERT INTO workspace_members
            (
                id,
                workspace_id,
                user_id,
                role
            )

            VALUES
            (
                gen_random_uuid(),
                $1,
                $2,
                $3
            )
            `,
            [invitation.workspace_id, req.user.id, invitation.role],
        );

        // update invitation

        await db.query(
            `
            UPDATE workspace_invitations

            SET status='ACCEPTED'

            WHERE id=$1

            `,
            [invitation.id],
        );

        // mark notification read

        await db.query(
            `
            UPDATE notifications

            SET read=true

            WHERE id=$1

            `,
            [notificationId],
        );

        res.json({
            message: 'Workspace joined successfully',
        });
    } catch (error) {
        console.log('ACCEPT INVITE ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;
