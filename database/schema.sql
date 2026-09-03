-- ============================================
-- TRACKLITE DATABASE SCHEMA
-- PostgreSQL
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Clean old tables
DROP TABLE IF EXISTS workspace_invitations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS issue_labels CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password TEXT NOT NULL,

    avatar TEXT,

    role VARCHAR(30)
        DEFAULT 'MEMBER'
        CHECK(role IN ('OWNER','ADMIN','MEMBER')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE
);



-- ============================================
-- WORKSPACE
-- ============================================

CREATE TABLE workspaces (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    owner_id UUID,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,


    FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);



-- ============================================
-- WORKSPACE MEMBERS
-- ============================================

CREATE TABLE workspace_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL,

    user_id UUID NOT NULL,

    role VARCHAR(30)
        DEFAULT 'MEMBER'
        CHECK(role IN ('OWNER','ADMIN','MEMBER')),


    FOREIGN KEY(workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,


    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,


    UNIQUE(workspace_id,user_id)
);



-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE projects (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_key VARCHAR(10) UNIQUE NOT NULL,
    workspace_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    status VARCHAR(30)
        DEFAULT 'ACTIVE'
        CHECK(status IN
        (
            'ACTIVE',
            'ARCHIVED',
            'COMPLETED'
        )),


    created_by UUID,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,


    FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);



-- ============================================
-- PROJECT MEMBERS
-- ============================================

CREATE TABLE project_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    user_id UUID NOT NULL,


    role VARCHAR(30)
        DEFAULT 'MEMBER'
        CHECK(role IN
        (
            'OWNER',
            'ADMIN',
            'MEMBER'
        )),


    FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,


    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,


    UNIQUE(project_id,user_id)
);


-- ============================================
-- TASKS
-- ============================================

CREATE TABLE tasks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    project_id UUID NOT NULL,


    title VARCHAR(255) NOT NULL,


    description TEXT,


    status VARCHAR(30)
        DEFAULT 'TODO'
        CHECK(
            status IN
            (
                'TODO',
                'IN_PROGRESS',
                'DONE'
            )
        ),


    priority VARCHAR(30)
        DEFAULT 'MEDIUM'
        CHECK(
            priority IN
            (
                'LOW',
                'MEDIUM',
                'HIGH',
                'URGENT'
            )
        ),


    assigned_to UUID,


    created_by UUID,


    due_date DATE,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,


    FOREIGN KEY(assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,


    FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE SET NULL

);


-- ============================================
-- ISSUES
-- ============================================

CREATE TABLE issues (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    task_id UUID NOT NULL,


    issue_key VARCHAR(30) UNIQUE NOT NULL,


    title VARCHAR(255) NOT NULL,


    description TEXT,


    status VARCHAR(30)
        DEFAULT 'OPEN'
        CHECK(status IN
        (
            'OPEN',
            'IN_PROGRESS',
            'RESOLVED',
            'CLOSED'
        )),


    priority VARCHAR(30)
        DEFAULT 'MEDIUM'
        CHECK(priority IN
        (
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL'
        )),


    assigned_to UUID,


    created_by UUID,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,


    FOREIGN KEY(assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,


    FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);



-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE comments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID,

    issue_id UUID,

    user_id UUID NOT NULL,

    body TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,


    FOREIGN KEY(issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,


    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================
-- ACTIVITY LOGS
-- ============================================

CREATE TABLE activity_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    project_id UUID,


    task_id UUID,


    issue_id UUID,


    user_id UUID,


    action VARCHAR(255) NOT NULL,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,


    FOREIGN KEY(task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,


    FOREIGN KEY(issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,


    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL

);



-- ============================================
-- LABELS
-- ============================================

CREATE TABLE labels (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    name VARCHAR(50) NOT NULL,


    FOREIGN KEY(project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);



CREATE TABLE issue_labels (

    issue_id UUID NOT NULL,

    label_id UUID NOT NULL,


    PRIMARY KEY(issue_id,label_id),


    FOREIGN KEY(issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,


    FOREIGN KEY(label_id)
        REFERENCES labels(id)
        ON DELETE CASCADE
);



-- ============================================
-- NOTIFICATIONS
-- ============================================


CREATE TABLE notifications (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    user_id UUID NOT NULL,


    sender_id UUID,


    type VARCHAR(50)
        DEFAULT 'GENERAL'
        CHECK(
            type IN
            (
                'GENERAL',
                'WORKSPACE_INVITE',
                'TASK_ASSIGNED',
                'COMMENT'
            )
        ),


    reference_id UUID,


    message TEXT NOT NULL,


    read BOOLEAN DEFAULT FALSE,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY(sender_id)
        REFERENCES users(id)
        ON DELETE SET NULL

);
CREATE TABLE workspace_invitations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL,

    inviter_id UUID NOT NULL,

    email VARCHAR(150) NOT NULL,

    role VARCHAR(50)
        DEFAULT 'MEMBER',

    status VARCHAR(20)
        DEFAULT 'PENDING'
        CHECK(status IN(
            'PENDING',
            'ACCEPTED',
            'REJECTED'
        )),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,


    FOREIGN KEY(inviter_id)
        REFERENCES users(id)
        ON DELETE CASCADE,


    UNIQUE(workspace_id,email)

);
-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_tasks_project
ON tasks(project_id);


CREATE INDEX idx_tasks_status
ON tasks(status);


CREATE INDEX idx_activity_project
ON activity_logs(project_id);


CREATE INDEX idx_activity_task
ON activity_logs(task_id);


CREATE INDEX idx_notifications_user
ON notifications(user_id);


CREATE INDEX idx_workspace_invites_email
ON workspace_invitations(email);


CREATE INDEX idx_issues_task
ON issues(task_id);


CREATE INDEX idx_comments_issue
ON comments(issue_id);

CREATE INDEX idx_activity_issue
ON activity_logs(issue_id);

CREATE INDEX idx_activity_user
ON activity_logs(user_id);

CREATE INDEX idx_notifications_sender
ON notifications(sender_id);

CREATE INDEX idx_projects_workspace
ON projects(workspace_id);

CREATE INDEX idx_tasks_assigned
ON tasks(assigned_to);

CREATE INDEX idx_issues_status
ON issues(status);

CREATE INDEX idx_users_email
ON users(email);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tasks_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


CREATE TRIGGER update_issues_timestamp
BEFORE UPDATE ON issues
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_notifications_created
ON notifications(created_at DESC);