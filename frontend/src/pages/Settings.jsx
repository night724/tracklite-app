import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [name, setName] = useState('Knight');
    const [email, setEmail] = useState('knight@email.com');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await api.get('/auth/me');
                setName(res.data.name);
                setEmail(res.data.email);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark',
    );
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);
    const [notifications, setNotifications] = useState({
        task: true,
        issue: true,
        comment: false,
        invite: true,
    });
    async function saveProfile() {
        try {
            const response = await api.put('/auth/profile', {
                name,
                email,
            });

            setName(response.data.user.name);

            setEmail(response.data.user.email);

            setEditing(false);

            alert('Profile updated successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    }

    async function changePassword() {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');

            return;
        }
        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,

                newPassword: passwordData.newPassword,
            });
            alert('Password changed successfully');
            setShowPasswordModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Password change failed');
        }
    }

    function deleteWorkspace() {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete workspace?',
        );
        if (confirmDelete) {
            alert('Workspace deleted');
        }
    }

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>

                <p>Manage your account and TrackLite preferences</p>
            </div>

            <div className="settings-layout">
                {/* LEFT MENU */}

                <div className="settings-menu">
                    <h3>Preferences</h3>

                    <button
                        className={activeTab === 'account' ? 'active' : ''}

                        onClick={() => setActiveTab('account')}
                    >
                        👤 Account
                    </button>

                    <button
                        className={activeTab === 'security' ? 'active' : ''}

                        onClick={() => setActiveTab('security')}
                    >
                        🔒 Security
                    </button>

                    <button
                        className={activeTab === 'appearance' ? 'active' : ''}

                        onClick={() => setActiveTab('appearance')}
                    >
                        🎨 Appearance
                    </button>

                    <button
                        className={activeTab === 'workspace' ? 'active' : ''}

                        onClick={() => setActiveTab('workspace')}
                    >
                        🏢 Workspace
                    </button>
                </div>

                {/* CONTENT */}

                <div className="settings-content">
                    {activeTab === 'account' && (
                        <div className="settings-card account-card">
                            <div className="card-header">
                                <div>
                                    <h2>👤 Account Profile</h2>
                                    <p>Manage your personal information</p>
                                </div>
                            </div>

                            <div className="profile-header">
                                <div className="profile-avatar large">
                                    {name.charAt(0).toUpperCase()}
                                </div>

                                <div className="profile-info">
                                    <h3>{name}</h3>
                                    <span>{email}</span>
                                </div>
                            </div>

                            <div className="divider"></div>

                            {editing ? (
                                <div className="profile-form">
                                    <div className="form-group">
                                        <label>Name</label>

                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>

                                        <input
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="cancel-btn"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="primary-btn"
                                            onClick={saveProfile}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-details">
                                    <div>
                                        <small>Name</small>
                                        <p>{name}</p>
                                    </div>

                                    <div>
                                        <small>Email</small>
                                        <p>{email}</p>
                                    </div>

                                    <button
                                        className="primary-btn"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-card">
                            <h2>🔒 Security</h2>

                            <p>Keep your TrackLite account safe.</p>

                            <button
                                className="secondary-btn"

                                onClick={() => setShowPasswordModal(true)}
                            >
                                Change Password
                            </button>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="settings-card">
                            <h2>🎨 Appearance</h2>

                            <div className="toggle-row">
                                <span>Dark Mode</span>

                                <input
                                    type="checkbox"

                                    checked={darkMode}

                                    onChange={(e) =>
                                        setDarkMode(e.target.checked)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'workspace' && (
                        <div className="settings-card">
                            <h2>🏢 Workspace</h2>

                            <p>Manage your TrackLite team.</p>

                            <div className="workspace-box">
                                <strong>TrackLite Workspace</strong>

                                <p>Manage members and projects.</p>
                            </div>

                            <button
                                className="primary-btn"

                                onClick={() => navigate('/team')}
                            >
                                Manage My Team
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="invite-modal">
                        <h2>🔒 Change Password</h2>

                        <input
                            type="password"

                            placeholder="Current Password"

                            value={passwordData.currentPassword}

                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,

                                    currentPassword: e.target.value,
                                })
                            }
                        />

                        <input
                            type="password"

                            placeholder="New Password"

                            value={passwordData.newPassword}

                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,

                                    newPassword: e.target.value,
                                })
                            }
                        />

                        <input
                            type="password"

                            placeholder="Confirm Password"

                            value={passwordData.confirmPassword}

                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,

                                    confirmPassword: e.target.value,
                                })
                            }
                        />

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"

                                onClick={() => setShowPasswordModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-btn"

                                onClick={changePassword}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
