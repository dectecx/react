import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WorkItemDto, CreateWorkItemDto, UpdateWorkItemDto } from '../api/generated';
import { WorkItemsService } from '../api/generated';
import InfoDisplay from '../components/InfoDisplay';
import Toast from '../components/Toast';
import { globalLoadingManager } from '../services/globalLoadingManager';
import { useAsyncAction } from '../hooks/useAsyncAction';
import './WorkItemEditPage.css';

type ToastInfo = {
  message: string;
  type: 'success' | 'error';
};

const WorkItemEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const isEditMode = Boolean(id);
  const [workItem, setWorkItem] = useState<WorkItemDto | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { isExecuting, executeAsync } = useAsyncAction();

  useEffect(() => {
    if (isEditMode && id) {
      const fetchWorkItem = async () => {
        try {
          setIsLoading(true);
          setToastInfo(null);
          await globalLoadingManager.withLoading(async () => {
            const fetchedItem = await WorkItemsService.getApiWorkItems1(Number(id));
            if (fetchedItem) {
              setWorkItem(fetchedItem);
              setTitle(fetchedItem.title ?? '');
              setDescription(fetchedItem.description ?? '');
            } else {
              setToastInfo({ message: 'Work item not found.', type: 'error' });
            }
          }, 'Loading work item...');
        } catch (err) {
          setToastInfo({ message: 'Failed to fetch work item details.', type: 'error' });
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWorkItem();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setToastInfo({ message: 'Title is required.', type: 'error' });
      return;
    }

    const result = await executeAsync(async () => {
      setToastInfo(null);
      
      if (isEditMode && id) {
        await globalLoadingManager.withLoading(async () => {
          const updateData: UpdateWorkItemDto = { title, description };
          await WorkItemsService.putApiWorkItems(Number(id), updateData);
        }, 'Updating work item...');
        setToastInfo({ message: 'Work item updated successfully!', type: 'success' });
      } else {
        await globalLoadingManager.withLoading(async () => {
          const createData: CreateWorkItemDto = { title, description };
          await WorkItemsService.postApiWorkItems(createData);
        }, 'Creating work item...');
        setToastInfo({ message: 'Work item created successfully!', type: 'success' });
      }
      
      // Navigate back to list after a short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      setToastInfo({ 
        message: isEditMode ? 'Failed to update work item.' : 'Failed to create work item.', 
        type: 'error' 
      });
      console.error(result);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isLoading) {
    return <InfoDisplay title="Loading..." />;
  }

  if (isEditMode && !workItem && !toastInfo) {
    return <InfoDisplay title="Not Found" message="This work item could not be found." />;
  }

  return (
    <div className="work-item-edit-container">
      {toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
      
      <div className="edit-header">
        <h2>{isEditMode ? 'Edit Work Item' : 'Create New Work Item'}</h2>
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter work item title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter work item description (optional)"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isExecuting}>
            {isExecuting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button" disabled={isExecuting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkItemEditPage;
