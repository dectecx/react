import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
}

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingMessage: 'Loading...',
  });

  const startLoading = useCallback((message: string = 'Loading...') => {
    setLoadingState({
      isLoading: true,
      loadingMessage: message,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      loadingMessage: 'Loading...',
    });
  }, []);

  const withLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage: string = 'Loading...'
  ): Promise<T> => {
    try {
      startLoading(loadingMessage);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    ...loadingState,
    startLoading,
    stopLoading,
    withLoading,
  };
};
