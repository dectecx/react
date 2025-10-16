import { useState, useEffect } from 'react';
import type { CreateWorkItemDto, UpdateWorkItemDto, WorkItemDto } from '../api/generated';
import './TodoForm.css';

interface TodoFormProps {
  isEditing: boolean;
  onSubmit: (data: CreateWorkItemDto | UpdateWorkItemDto) => void;
  initialData?: WorkItemDto;
  onCancel?: () => void; // Optional cancel callback
}

const TodoForm = ({ isEditing, onSubmit, initialData, onCancel }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }
    onSubmit({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
