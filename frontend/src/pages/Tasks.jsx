import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import CreateTaskModal from '../components/CreateTaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function Tasks() {
    const { projectId, workspaceId } = useParams();

    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [searchParams] = useSearchParams();
    const [selectedProject, setSelectedProject] = useState('');

    const [projects, setProjects] = useState([]);
    const statusFilter = searchParams.get('status');
    useEffect(() => {
        if (workspaceId) {
            loadProjects();
        }
    }, [workspaceId]);
    const [deleteTaskData, setDeleteTaskData] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    async function deleteTask() {
        try {
            setDeleteLoading(true);

            await api.delete(`/tasks/${deleteTaskData.id}`);

            loadTasks();
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
            setDeleteTaskData(null);
        }
    }
    async function loadProjects() {
        try {
            const res = await api.get(`/projects/workspace/${workspaceId}`);

            setProjects(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        loadTasks();
    }, [projectId, workspaceId]);

    async function loadTasks() {
        try {
            let res;

            if (projectId) {
                res = await api.get(`/tasks/project/${projectId}`);
            } else {
                res = await api.get(`/tasks/workspace/${workspaceId}`);
            }

            setTasks(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const columns = [
        {
            title: '📝 To Do',
            status: 'TODO',
        },

        {
            title: '🚀 In Progress',
            status: 'IN_PROGRESS',
        },

        {
            title: '✅ Completed',
            status: 'DONE',
        },
    ];

    const visibleColumns = columns;

    return (
        <div className="tasks-page">
            <div className="tasks-header">
                <div>
                    <h1>Project Tasks</h1>

                    <p>Track progress and manage your team's work</p>
                </div>

                {projectId && (
                    <button
                        className="primary-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Task
                    </button>
                )}
            </div>

            <div className="task-toolbar">
                <div className="task-search">
                    🔍
                    <input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {workspaceId && (
                    <select
                        className="project-filter"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">All Projects</option>

                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div className="kanban-board">
                {visibleColumns.map((column) => (
                    <div className="kanban-column" key={column.status}>
                        <div className="column-title">
                            <h3>{column.title}</h3>

                            <span>
                                {
                                    tasks.filter((t) => {
                                        const statusMatch =
                                            t.status === column.status;

                                        const projectMatch =
                                            !selectedProject ||
                                            t.project_id === selectedProject;

                                        const filterMatch =
                                            !statusFilter ||
                                            t.status === statusFilter;

                                        return (
                                            statusMatch &&
                                            projectMatch &&
                                            filterMatch
                                        );
                                    }).length
                                }
                            </span>
                        </div>

                        {tasks
                            .filter((task) => {
                                const searchMatch = task.title
                                    .toLowerCase()
                                    .includes(search.toLowerCase());

                                const projectMatch =
                                    !selectedProject ||
                                    task.project_id === selectedProject;

                                const statusMatch =
                                    !statusFilter ||
                                    task.status === statusFilter;

                                return (
                                    task.status === column.status &&
                                    searchMatch &&
                                    projectMatch &&
                                    statusMatch
                                );
                            })
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className={`task-card ${task.priority?.toLowerCase()}`}
                                >
                                    <div className="task-card-top">
                                        <span className="task-priority">
                                            {task.priority}
                                        </span>

                                        <span className="task-status">
                                            {task.status}
                                        </span>
                                    </div>

                                    <Link
                                        to={`/tasks/${task.id}`}
                                        className="task-card-link"
                                    >
                                        <h3>{task.title}</h3>
                                    </Link>

                                    <p>
                                        {task.description || 'No description'}
                                    </p>

                                    <div className="task-card-footer">
                                        <span>
                                            👤{' '}
                                            {task.assigned_name || 'Unassigned'}
                                        </span>
                                    </div>

                                    <div className="task-actions">
                                        <Link
                                            to={`/tasks/${task.id}`}
                                            className="view-task-btn"
                                        >
                                            View →
                                        </Link>

                                        <button
                                            className="delete-task-btn"
                                            onClick={() =>
                                                setDeleteTaskData(task)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {showModal && (
                <CreateTaskModal
                    projectId={projectId}
                    workspaceId={workspaceId}
                    closeModal={() => setShowModal(false)}
                    refresh={loadTasks}
                />
            )}
            {deleteTaskData && (
                <DeleteConfirmModal
                    title="Delete Task?"

                    message={`Delete "${deleteTaskData.title}"? This action cannot be undone.`}

                    onConfirm={deleteTask}

                    onCancel={() => setDeleteTaskData(null)}

                    loading={deleteLoading}
                />
            )}
        </div>
    );
}

export default Tasks;
