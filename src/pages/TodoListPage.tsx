import { useState, useMemo, useEffect } from 'react';
import type { Todo } from '../types/todo';
import TodoForm from '../components/TodoForm';
import './TodoListPage.css';
import { Link } from 'react-router-dom';
import { todoService } from '../api/todoService';

type SortKey = keyof Todo;
type SortOrder = 'asc' | 'desc';

const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTodos = await todoService.getTodos();
        setTodos(fetchedTodos);
      } catch (err) {
        setError('Failed to fetch todos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

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

  const handleAddTodo = async (
    newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newTodo = await todoService.createTodo(newTodoData);
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError('Failed to create todo.');
      console.error(err);
    }
  };

  const handleUpdateTodo = async (
    updatedTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingTodo) return;
    try {
      const updatedTodo = await todoService.updateTodo(
        editingTodo.id,
        updatedTodoData
      );
      if (updatedTodo) {
        setTodos(
          todos.map((todo) =>
            todo.id === editingTodo.id ? updatedTodo : todo
          )
        );
      }
      setEditingTodo(null);
    } catch (err) {
      setError('Failed to update todo.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        setError('Failed to delete todo.');
        console.error(err);
      }
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
