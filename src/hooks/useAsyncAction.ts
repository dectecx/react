import { useState, useCallback } from 'react';
import { globalLoadingManager } from '../services/globalLoadingManager';

export const useAsyncAction = (loadingMessage: string = 'Loading...') => {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null | Error> => {
    if (isExecuting) {
      return null; // Prevent multiple executions
    }

    try {
      setIsExecuting(true);
      const result = await globalLoadingManager.withLoading(async () => {
        return await asyncFunction();
      }, loadingMessage);
      return result;
    } catch (error) {
      return error as Error; // Return error instead of throwing
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, loadingMessage]);

  return {
    isExecuting,
    executeAsync,
  };
};
