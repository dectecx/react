import { useState, useEffect } from 'react';
import type { CreateWorkItemDto, UpdateWorkItemDto, WorkItemDto } from '../api/generated';
import './TodoForm.css';

interface TodoFormProps {
  isEditing: boolean;
  onSubmit: (data: CreateWorkItemDto | UpdateWorkItemDto) => void;
  initialData?: WorkItemDto;
}

const TodoForm = ({ isEditing, onSubmit, initialData }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    'pending'
  );

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      const currentStatus = initialData.status;
      if (
        currentStatus === 'pending' ||
        currentStatus === 'in-progress' ||
        currentStatus === 'completed'
      ) {
        setStatus(currentStatus);
      } else {
        setStatus('pending');
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }

    if (isEditing) {
      onSubmit({ title, description, status });
    } else {
      onSubmit({ title, description });
    }
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
      {isEditing && (
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as 'pending' | 'in-progress' | 'completed'
              )
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      <button type="submit" className="submit-button">
        {isEditing ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default TodoForm;
