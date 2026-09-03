-- ============================================
-- TRACKLITE SEED DATA
-- ============================================

BEGIN;


-- ============================================
-- ORGANIZATION
-- ============================================

INSERT INTO organizations
(
    id,
    name
)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'TrackLite Organization'
);



-- ============================================
-- USERS
-- Passwords are bcrypt examples:
-- password123
-- ============================================

INSERT INTO users
(
    id,
    organization_id,
    name,
    email,
    password,
    role
)
VALUES

(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Admin User',
    'admin@tracklite.com',
    '$2a$10$7QJ8QvY9V6GvZx0kY6zW3e9r3hKfQ6K1K1z3j7Y9H4Kx1Y8xQ8q7m',
    'OWNER'
),


(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'John Member',
    'john@tracklite.com',
    '$2a$10$7QJ8QvY9V6GvZx0kY6zW3e9r3hKfQ6K1K1z3j7Y9H4Kx1Y8xQ8q7m',
    'MEMBER'
),


(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'Sarah Developer',
    'sarah@tracklite.com',
    '$2a$10$7QJ8QvY9V6GvZx0kY6zW3e9r3hKfQ6K1K1z3j7Y9H4Kx1Y8xQ8q7m',
    'MEMBER'
);



-- ============================================
-- WORKSPACE
-- ============================================

INSERT INTO workspaces
(
    id,
    organization_id,
    name,
    description,
    owner_id
)
VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Development Workspace',
    'Main TrackLite workspace',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);



-- ============================================
-- WORKSPACE MEMBERS
-- ============================================

INSERT INTO workspace_members
(
    workspace_id,
    user_id,
    role
)
VALUES

(
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'OWNER'
),

(
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'MEMBER'
),

(
    '22222222-2222-2222-2222-222222222222',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'MEMBER'
);



-- ============================================
-- PROJECT
-- ============================================

INSERT INTO projects
(
    id,
    project_key,
    workspace_id,
    name,
    description,
    created_by
)
VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'TL',
    '22222222-2222-2222-2222-222222222222',
    'TrackLite Web Application',
    'Project management and issue tracking system',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);



-- ============================================
-- PROJECT MEMBERS
-- ============================================

INSERT INTO project_members
(
    project_id,
    user_id,
    role
)
VALUES

(
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'OWNER'
),

(
    '33333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'MEMBER'
),

(
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'MEMBER'
);



-- ============================================
-- TASKS
-- ============================================

INSERT INTO tasks
(
    id,
    project_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by
)
VALUES


(
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    'Create Authentication',
    'Build login and registration system',
    'DONE',
    'HIGH',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),


(
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'Build Dashboard',
    'Create dashboard UI',
    'IN_PROGRESS',
    'MEDIUM',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),


(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    'Improve UI',
    'Responsive design improvements',
    'TODO',
    'LOW',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);



-- ============================================
-- ISSUES
-- ============================================

INSERT INTO issues
(
    id,
    task_id,
    issue_key,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by
)
VALUES


(
    '77777777-7777-7777-7777-777777777777',
    '55555555-5555-5555-5555-555555555555',
    'TL-001',
    'Dashboard loading slowly',
    'Optimize dashboard API queries',
    'OPEN',
    'HIGH',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),


(
    '88888888-8888-8888-8888-888888888888',
    '66666666-6666-6666-6666-666666666666',
    'TL-002',
    'Mobile layout problem',
    'Sidebar overlaps content',
    'IN_PROGRESS',
    'MEDIUM',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);



-- ============================================
-- COMMENTS
-- ============================================

INSERT INTO comments
(
    issue_id,
    user_id,
    body
)
VALUES

(
    '77777777-7777-7777-7777-777777777777',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'I will investigate the API performance.'
),


(
    '77777777-7777-7777-7777-777777777777',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Please check database indexes.'
);

INSERT INTO comments
(
    task_id,
    user_id,
    body
)
VALUES
(
    '55555555-5555-5555-5555-555555555555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Dashboard API is almost complete.'
);

-- ============================================
-- ACTIVITY
-- ============================================

INSERT INTO activity_logs
(
    project_id,
    task_id,
    issue_id,
    user_id,
    action
)
VALUES
(
    '33333333-3333-3333-3333-333333333333',
    '55555555-5555-5555-5555-555555555555',
    '77777777-7777-7777-7777-777777777777',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Created issue TL-001'
);

INSERT INTO workspace_invitations
(
    workspace_id,
    inviter_id,
    email,
    role,
    status
)
VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'john@tracklite.com',
    'MEMBER',
    'ACCEPTED'
);
-- ============================================
-- LABELS
-- ============================================

INSERT INTO labels
(
    project_id,
    name
)
VALUES

(
    '33333333-3333-3333-3333-333333333333',
    'bug'
),

(
    '33333333-3333-3333-3333-333333333333',
    'frontend'
);

INSERT INTO issue_labels
(
    issue_id,
    label_id
)
VALUES
(
    '77777777-7777-7777-7777-777777777777',
    (SELECT id FROM labels WHERE name='bug')
);
INSERT INTO notifications
(
    user_id,
    sender_id,
    type,
    message
)
VALUES
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'TASK_ASSIGNED',
    'You were assigned Build Dashboard task'
);
INSERT INTO workspace_invitations
(
    workspace_id,
    inviter_id,
    email,
    role,
    status
)
VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'newuser@test.com',
    'MEMBER',
    'PENDING'
);
COMMIT;