import { useParams, Link } from 'react-router-dom';
import { Todo } from '../types/todo';

// This is temporary. In a real app, you'd fetch this data.
import { mockTodos } from './TodoListPage';

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const todoId = Number(id);
  const todo: Todo | undefined = mockTodos.find((t) => t.id === todoId);

  if (!todo) {
    return (
      <div>
        <h2>Todo not found</h2>
        <Link to="/">Back to List</Link>
      </div>
    );
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
