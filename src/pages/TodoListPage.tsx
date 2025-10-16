import { useState, useMemo, useEffect } from 'react';
import type { WorkItem } from '../api/generated';
import { WorkItemsService } from '../api/generated';
import TodoForm from '../components/TodoForm';
import InfoDisplay from '../components/InfoDisplay';
import './TodoListPage.css';
import { Link } from 'react-router-dom';

type SortKey = keyof WorkItem;
type SortOrder = 'asc' | 'desc';

const TodoListPage = () => {
  const [todos, setTodos] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTodo, setEditingTodo] = useState<WorkItem | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTodos = await WorkItemsService.getApiWorkItems();
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
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (valA < valB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
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
    newTodoData: Pick<WorkItem, 'title' | 'description' | 'status'>
  ) => {
    try {
      const newTodo = await WorkItemsService.postApiWorkItems({
        ...newTodoData,
      });
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError('Failed to create todo.');
      console.error(err);
    }
  };

  const handleUpdateTodo = async (
    updatedTodoData: Pick<WorkItem, 'title' | 'description' | 'status'>
  ) => {
    if (!editingTodo || !editingTodo.id) return;
    try {
      await WorkItemsService.putApiWorkItems(editingTodo.id, {
        id: editingTodo.id,
        ...updatedTodoData,
      });
      // Refetch list to get updated data, or update locally
      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id
          ? { ...todo, ...updatedTodoData, updatedTime: new Date().toISOString() }
          : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
    } catch (err) {
      setError('Failed to update todo.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await WorkItemsService.deleteApiWorkItems(id);
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        setError('Failed to delete todo.');
        console.error(err);
      }
    }
  };

  const handleEdit = (todo: WorkItem) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (isLoading) {
    return <InfoDisplay title="Loading Todos..." />;
  }

  if (error) {
    return <InfoDisplay title="Something went wrong" message={error} />;
  }

  return (
    <div className="todolist-container">
      <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <TodoForm
        key={editingTodo ? editingTodo.id : 'add-form'}
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        initialData={
          editingTodo
            ? {
                title: editingTodo.title ?? '',
                description: editingTodo.description ?? '',
                status: (editingTodo.status as any) ?? 'pending',
              }
            : undefined
        }
      />
      {editingTodo && (
        <button
          type="button"
          onClick={handleCancelEdit}
          className="cancel-button"
        >
          Cancel Edit
        </button>
      )}

      <h2>Todo List</h2>
      {sortedTodos.length > 0 ? (
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
                    onClick={() => todo.id && handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <InfoDisplay
          title="No todos yet!"
          message="Use the form above to add your first todo item."
        />
      )}
    </div>
  );
};

export default TodoListPage;
