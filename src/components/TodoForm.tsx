import { useState, useEffect } from 'react';
import type { WorkItem } from '../api/generated';
import './TodoForm.css';

type FormData = Pick<WorkItem, 'title' | 'description' | 'status'>;

interface TodoFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

const TodoForm = ({ onSubmit, initialData }: TodoFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    (initialData?.status as any) || 'pending'
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      setStatus((initialData.status as any) ?? 'pending');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }
    onSubmit({
      title,
      description,
      status,
    });
    // Only clear form if it's not for editing
    if (!initialData) {
      setTitle('');
      setDescription('');
      setStatus('pending');
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
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')
          }
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default TodoForm;
