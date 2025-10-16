import React from 'react';
import type { WorkItemDto } from '../api/generated';
import './TodoDetailModal.css';

interface TodoDetailModalProps {
  todo: WorkItemDto;
  onClose: () => void;
}

const TodoDetailModal: React.FC<TodoDetailModalProps> = ({ todo, onClose }) => {
  // Stop propagation to prevent closing the modal when clicking inside the content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h2>{todo.title}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-item">
            <span className="detail-label">編號</span>
            <span className="detail-value">{todo.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">建立時間</span>
            <span className="detail-value">
              {todo.createdTime ? new Date(todo.createdTime).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="detail-item full-width">
            <span className="detail-label">描述</span>
            <p className="detail-value">{todo.description || 'No description.'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">最後更新時間</span>
            <span className="detail-value">
              {todo.updatedTime ? new Date(todo.updatedTime).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailModal;
