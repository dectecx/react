import { useState, useCallback } from 'react';

export const useAsyncAction = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null | Error> => {
    if (isExecuting) {
      return null; // Prevent multiple executions
    }

    try {
      setIsExecuting(true);
      const result = await asyncFunction();
      return result;
    } catch (error) {
      return error as Error; // Return error instead of throwing
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting]);

  return {
    isExecuting,
    executeAsync,
  };
};
