import { useState, useMemo } from 'react';
import type { Todo } from '../types/todo';
import TodoForm from '../components/TodoForm';
import './TodoListPage.css';
import { Link } from 'react-router-dom';

export const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Learn the basics of React',
    status: 'completed',
    createdAt: '2025-10-16T10:00:00Z',
    updatedAt: '2025-10-16T11:00:00Z',
  },
  {
    id: 2,
    title: 'Learn TypeScript',
    description: 'Learn the basics of TypeScript',
    status: 'in-progress',
    createdAt: '2025-10-15T14:30:00Z',
    updatedAt: '2025-10-16T09:00:00Z',
  },
  {
    id: 3,
    title: 'Build a TodoList App',
    description: 'Build a full-featured TodoList App',
    status: 'pending',
    createdAt: '2025-10-14T08:00:00Z',
    updatedAt: '2025-10-14T08:00:00Z',
  },
];

type SortKey = keyof Todo;
type SortOrder = 'asc' | 'desc';

const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const sortedTodos = useMemo(() => {
    const sorted = [...todos].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [todos, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleAddTodo = (
    newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newTodo: Todo = {
      ...newTodoData,
      id: todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const handleUpdateTodo = (
    updatedTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingTodo) return;
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo.id
          ? {
              ...todo,
              ...updatedTodoData,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
    setEditingTodo(null); // Exit editing mode
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <TodoForm
        key={editingTodo ? editingTodo.id : 'add-form'}
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        initialData={editingTodo ?? undefined}
      />
      {editingTodo && (
        <button type="button" onClick={handleCancelEdit}>
          Cancel Edit
        </button>
      )}

      <h2>Todo List</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              編號 {sortKey === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('title')}>
              標題 {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('status')}>
              狀態 {sortKey === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>
                <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
              </td>
              <td>{todo.status}</td>
              <td>
                <button type="button" onClick={() => handleEdit(todo)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoListPage;
