import { useState, useMemo, useEffect } from 'react';
import type {
  WorkItemDto,
  CreateWorkItemDto,
  UpdateWorkItemDto,
  WorkItemStateDto,
} from '../api/generated';
import { WorkItemsService, UserStatesService } from '../api/generated';
import TodoForm from '../components/TodoForm';
import InfoDisplay from '../components/InfoDisplay';
import Toast from '../components/Toast';
import './TodoListPage.css';
import { Link } from 'react-router-dom';

type SortKey = keyof WorkItemDto;
type SortOrder = 'asc' | 'desc';

type ToastInfo = {
  message: string;
  type: 'success' | 'error';
};

const TodoListPage = () => {
  const [todos, setTodos] = useState<WorkItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingTodo, setEditingTodo] = useState<WorkItemDto | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setToastInfo(null);
        setIsLoading(true);
        const fetchedTodos = await WorkItemsService.getApiWorkItems();
        setTodos(fetchedTodos);
      } catch (err) {
        setToastInfo({ message: 'Failed to fetch todos.', type: 'error' });
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
    newTodoData: CreateWorkItemDto
  ) => {
    try {
      setToastInfo(null);
      const newTodo = await WorkItemsService.postApiWorkItems(newTodoData);
      setTodos([...todos, newTodo]);
      setToastInfo({ message: 'Successfully added todo!', type: 'success' });
    } catch (err) {
      setToastInfo({ message: 'Failed to create todo.', type: 'error' });
      console.error(err);
    }
  };

  const handleUpdateTodo = async (
    updatedTodoData: UpdateWorkItemDto
  ) => {
    if (!editingTodo || !editingTodo.id) return;
    try {
      setToastInfo(null);
      await WorkItemsService.putApiWorkItems(editingTodo.id, updatedTodoData);
      // Refetch list to get updated data, or update locally
      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id
          ? { ...todo, ...updatedTodoData, updatedTime: new Date().toISOString() }
          : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setToastInfo({ message: 'Successfully updated todo!', type: 'success' });
    } catch (err) {
      setToastInfo({ message: 'Failed to update todo.', type: 'error' });
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        setToastInfo(null);
        await WorkItemsService.deleteApiWorkItems(id);
        setTodos(todos.filter((todo) => todo.id !== id));
        setToastInfo({ message: 'Successfully deleted todo!', type: 'success' });
      } catch (err) {
        setToastInfo({ message: 'Failed to delete todo.', type: 'error' });
        console.error(err);
      }
    }
  };

  const handleEdit = (todo: WorkItemDto) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleCheckChange = (itemId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleConfirmStates = async () => {
    setToastInfo(null);
    
    const statesToConfirm: WorkItemStateDto[] = Object.entries(checkedItems)
      .filter(([, isChecked]) => isChecked)
      .map(([itemId]) => ({
        itemId: Number(itemId),
        isChecked: true, // Assuming check means confirm
      }));

    if (statesToConfirm.length === 0) {
      setToastInfo({ message: "Please select items to confirm.", type: 'error' });
      return;
    }

    try {
      await UserStatesService.postApiUserStatesConfirm({
        states: statesToConfirm,
      });
      setToastInfo({
        message: `Successfully confirmed ${statesToConfirm.length} item(s).`,
        type: 'success',
      });
      setCheckedItems({}); // Clear selection after successful confirmation
    } catch (err) {
      setToastInfo({ message: "Failed to confirm items. Please try again.", type: 'error' });
      console.error(err);
    }
  };

  if (isLoading) {
    return <InfoDisplay title="Loading Todos..." />;
  }

  // Display full-page error only on initial load failure
  if (todos.length === 0 && toastInfo?.type === 'error') {
    return <InfoDisplay title="Something went wrong" message={toastInfo.message} />;
  }

  return (
    <div className="todolist-container">
      {toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
      <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <TodoForm
        key={editingTodo ? editingTodo.id : 'add-form'}
        isEditing={!!editingTodo}
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        initialData={editingTodo ?? undefined}
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
        <>
          <table>
            <thead>
              <tr>
                <th>{/* Checkbox header */}</th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checkedItems[todo.id!]}
                      onChange={() => handleCheckChange(todo.id!)}
                    />
                  </td>
                  <td>{todo.id}</td>
                  <td>
                    <Link to={`/todo/${todo.id!}`}>{todo.title}</Link>
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
          <div className="batch-actions">
            <button onClick={handleConfirmStates} className="confirm-button">
              Confirm Selected Items
            </button>
          </div>
        </>
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
