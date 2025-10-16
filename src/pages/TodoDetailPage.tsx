import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Todo } from '../types/todo';
import { todoService } from '../api/todoService';

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTodo = await todoService.getTodoById(Number(id));
        if (fetchedTodo) {
          setTodo(fetchedTodo);
        } else {
          setError('Todo not found');
        }
      } catch (err) {
        setError('Failed to fetch todo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodo();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>{error}</h2>
        <Link to="/">Back to List</Link>
      </div>
    );
  }

  if (!todo) {
    return null; // Should be covered by error state
  }

  return (
    <div>
      <h2>Todo Detail</h2>
      <p>
        <strong>編號:</strong> {todo.id}
      </p>
      <p>
        <strong>標題:</strong> {todo.title}
      </p>
      <p>
        <strong>描述:</strong> {todo.description}
      </p>
      <p>
        <strong>狀態:</strong> {todo.status}
      </p>
      <p>
        <strong>建立時間:</strong> {new Date(todo.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>最後更新時間:</strong>{' '}
        {new Date(todo.updatedAt).toLocaleString()}
      </p>
      <br />
      <Link to="/">Back to List</Link>
    </div>
  );
};

export default TodoDetailPage;
