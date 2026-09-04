function DeleteConfirmModal({ title, message, onConfirm, onCancel, loading }) {
    return (
        <div className="modal-overlay">
            <div className="delete-modal">
                <div className="delete-icon">⚠️</div>

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="delete-actions">
                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
