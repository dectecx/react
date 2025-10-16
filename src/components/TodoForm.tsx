import { useState } from 'react';
import type { Todo } from '../types/todo';
import './TodoForm.css';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
}

const TodoForm = ({ onSubmit, initialData }: TodoFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    initialData?.status || 'pending'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }
    onSubmit({ title, description, status });
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default TodoForm;
