import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import TodoDetailModal from '../components/TodoDetailModal';
import { authManager } from '../services/authManager';
import { globalLoadingManager } from '../services/globalLoadingManager';
import { useAsyncAction } from '../hooks/useAsyncAction';
import './TodoListPage.css';

type SortKey = keyof WorkItemDto;
type SortOrder = 'asc' | 'desc';

type ToastInfo = {
  message: string;
  type: 'success' | 'error';
};

const TodoListPage: React.FC = () => {
  const [todos, setTodos] = useState<WorkItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [sortKey, setSortKey] = useState<SortKey>(
    (searchParams.get('sortKey') as SortKey) || 'createdTime'
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || 'desc'
  );

  const [editingTodo, setEditingTodo] = useState<WorkItemDto | null>(null);
  const [viewingTodo, setViewingTodo] = useState<WorkItemDto | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const isAdmin = authManager.isAdmin();
  const { isExecuting: isConfirming, executeAsync: executeConfirmAsync } = useAsyncAction('Confirming items...');
  const { isExecuting: isUndoing, executeAsync: executeUndoAsync } = useAsyncAction('Undoing confirmation...');
  const { executeAsync: executeAddAsync } = useAsyncAction('Creating work item...');
  const { executeAsync: executeUpdateAsync } = useAsyncAction('Updating work item...');
  const { isExecuting: isDeleting, executeAsync: executeDeleteAsync } = useAsyncAction('Deleting work item...');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setToastInfo(null);
        setIsLoading(true);
        await globalLoadingManager.withLoading(async () => {
          const fetchedTodos = await WorkItemsService.getApiWorkItems();
          setTodos(fetchedTodos);
        }, 'Loading work items...');
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
    const newSortOrder = (sortKey === key && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newSortOrder);
    setSearchParams({ sortKey: key, sortOrder: newSortOrder });
  };

  const handleAddTodo = async (newTodoData: CreateWorkItemDto) => {
    const result = await executeAddAsync(async () => {
      setToastInfo(null);
      const newTodo = await WorkItemsService.postApiWorkItems(newTodoData);
      setTodos([...todos, newTodo]);
      setToastInfo({ message: 'Successfully added todo!', type: 'success' });
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      setToastInfo({ message: 'Failed to create todo.', type: 'error' });
      console.error(result);
    }
  };

  const handleUpdateTodo = async (updatedTodoData: UpdateWorkItemDto) => {
    if (!editingTodo || !editingTodo.id) return;
    
    const result = await executeUpdateAsync(async () => {
      setToastInfo(null);
      await WorkItemsService.putApiWorkItems(editingTodo.id!, updatedTodoData);

      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id
          ? { ...todo, ...updatedTodoData, updatedTime: new Date().toISOString() }
          : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setToastInfo({ message: 'Successfully updated todo!', type: 'success' });
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      setToastInfo({ message: 'Failed to update todo.', type: 'error' });
      console.error(result);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      const result = await executeDeleteAsync(async () => {
        setToastInfo(null);
        await WorkItemsService.deleteApiWorkItems(id);
        setTodos(todos.filter((todo) => todo.id !== id));
        setToastInfo({ message: 'Successfully deleted todo!', type: 'success' });
      });

      if (result === null) return; // Prevented duplicate execution

      // Handle errors
      if (result && result instanceof Error) {
        setToastInfo({ message: 'Failed to delete todo.', type: 'error' });
        console.error(result);
      }
    }
  };

  const handleEdit = (todo: WorkItemDto) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleViewDetails = (todo: WorkItemDto) => {
    setViewingTodo(todo);
  };

  const handleCloseModal = () => {
    setViewingTodo(null);
  };

  const handleCheckChange = (itemId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSelectAll = () => {
    const allChecked = sortedTodos.every(todo => checkedItems[todo.id!]);
    const newCheckedItems: Record<number, boolean> = {};
    
    if (!allChecked) {
      sortedTodos.forEach(todo => {
        if (todo.id) {
          newCheckedItems[todo.id] = true;
        }
      });
    }
    
    setCheckedItems(newCheckedItems);
  };

  const handleConfirmStates = async () => {
    const result = await executeConfirmAsync(async () => {
      setToastInfo(null);

      const statesToConfirm: WorkItemStateDto[] = Object.entries(checkedItems)
        .filter(([, isChecked]) => isChecked)
        .map(([itemId]) => ({
          workItemId: Number(itemId),
          isConfirmed: true,
        }));

      if (statesToConfirm.length === 0) {
        setToastInfo({ message: "Please select items to confirm.", type: 'error' });
        return;
      }

      await UserStatesService.postApiUserStatesConfirm({
        states: statesToConfirm,
      });
      
      setToastInfo({
        message: `Successfully confirmed ${statesToConfirm.length} item(s).`,
        type: 'success',
      });
      setCheckedItems({});
      
      // Refresh the list to get updated status
      const updatedTodos = await WorkItemsService.getApiWorkItems();
      setTodos(updatedTodos);
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      setToastInfo({ message: "Failed to confirm items. Please try again.", type: 'error' });
      console.error(result);
    }
  };

  const handleUndoConfirm = async (itemId: number) => {
    if (window.confirm('確定要將此項目標記回「待確認」嗎？')) {
      const result = await executeUndoAsync(async () => {
        setToastInfo(null);
        await UserStatesService.postApiUserStatesConfirm({
          states: [{ workItemId: itemId, isConfirmed: false }],
        });
        setToastInfo({ message: '已將項目標記為待確認', type: 'success' });
        // Refresh the list to get updated status
        const updatedTodos = await WorkItemsService.getApiWorkItems();
        setTodos(updatedTodos);
      });

      if (result === null) return; // Prevented duplicate execution

      // Handle errors
      if (result && result instanceof Error) {
        setToastInfo({ message: '撤銷確認失敗，請重試', type: 'error' });
        console.error(result);
      }
    }
  };

  const isAllSelected = sortedTodos.length > 0 && sortedTodos.every(todo => checkedItems[todo.id!]);
  const hasSelectedItems = Object.values(checkedItems).some(Boolean);

  if (isLoading) {
    return <InfoDisplay title="Loading Todos..." />;
  }

  if (todos.length === 0 && toastInfo?.type === 'error') {
    return <InfoDisplay title="Something went wrong" message={toastInfo.message} />;
  }

  return (
    <>
      <div className="todolist-container">
        {toastInfo && (
          <Toast
            message={toastInfo.message}
            type={toastInfo.type}
            onClose={() => setToastInfo(null)}
          />
        )}

        {isAdmin && (
          <>
            <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
            <TodoForm
              key={editingTodo ? editingTodo.id : 'add-form'}
              isEditing={!!editingTodo}
              onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
              initialData={editingTodo ?? undefined}
              onCancel={handleCancelEdit}
            />
          </>
        )}

        <h2>Work Items</h2>

        {sortedTodos.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => handleSort('id')}>
                    編號 {sortKey === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('title')}>
                    標題 {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('userStatus')}>
                    狀態 {sortKey === 'userStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTodos.map((todo) => (
                  <tr key={todo.id} onClick={() => handleViewDetails(todo)} className="clickable-row">
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[todo.id!]}
                        onChange={() => todo.id && handleCheckChange(todo.id)}
                      />
                    </td>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>
                      <span className={`status-badge status-${todo.userStatus?.toLowerCase()}`}>
                        {todo.userStatus === 'Confirmed' ? '已確認' : '待確認'}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="action-button" onClick={() => handleViewDetails(todo)}>
                        <span className="icon">🔍</span>
                        <span className="text">View</span>
                      </button>
                      {isAdmin && (
                        <>
                          <button type="button" className="action-button" onClick={() => handleEdit(todo)}>
                            <span className="icon">✏️</span>
                            <span className="text">Edit</span>
                          </button>
                          <button
                            type="button"
                            className="action-button"
                            onClick={() => todo.id && handleDeleteTodo(todo.id)}
                            disabled={isDeleting}
                          >
                            <span className="icon">🗑️</span>
                            <span className="text">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        </>
                      )}
                      {todo.userStatus === 'Confirmed' && (
                        <button
                          type="button"
                          className="action-button undo-button"
                          onClick={() => todo.id && handleUndoConfirm(todo.id)}
                          disabled={isUndoing}
                        >
                          <span className="icon">↶</span>
                          <span className="text">{isUndoing ? 'Undoing...' : 'Undo'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="batch-actions">
              <button 
                onClick={handleConfirmStates} 
                className="confirm-button"
                disabled={!hasSelectedItems || isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Confirm Selected Items'}
              </button>
            </div>
          </>
        ) : (
          <InfoDisplay
            title="No work items yet!"
            message={isAdmin ? "Use the form above to add your first work item." : "No work items available."}
          />
        )}
      </div>
      {viewingTodo && (
        <TodoDetailModal todo={viewingTodo} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default TodoListPage;