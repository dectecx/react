import React, { useState } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
}

// 全域 Loading 狀態
let globalLoadingState: LoadingState = {
  isLoading: false,
  loadingMessage: 'Loading...',
};

// 訂閱者列表
const subscribers: Array<(state: LoadingState) => void> = [];

// 最小 Loading 顯示時間（毫秒）
const MIN_LOADING_DURATION = 500;

// 通知所有訂閱者
const notifySubscribers = () => {
  subscribers.forEach(callback => callback(globalLoadingState));
};

// 全域 Loading 管理器
export const globalLoadingManager = {
  startLoading: (message: string = 'Loading...') => {
    globalLoadingState = {
      isLoading: true,
      loadingMessage: message,
    };
    notifySubscribers();
  },

  stopLoading: () => {
    globalLoadingState = {
      isLoading: false,
      loadingMessage: 'Loading...',
    };
    notifySubscribers();
  },

  withLoading: async <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage: string = 'Loading...'
  ): Promise<T> => {
    const startTime = Date.now();
    
    try {
      globalLoadingManager.startLoading(loadingMessage);
      const result = await asyncFunction();
      
      // 計算剩餘需要等待的時間
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
      
      // 如果 API 回應太快，等待剩餘時間
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return result;
    } finally {
      globalLoadingManager.stopLoading();
    }
  },

  subscribe: (callback: (state: LoadingState) => void) => {
    subscribers.push(callback);
    // 立即通知當前狀態
    callback(globalLoadingState);
    
    // 返回取消訂閱函數
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },
};

// Hook 用於訂閱全域 Loading 狀態
export const useGlobalLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(() => globalLoadingState);

  React.useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setLoadingState);
    return unsubscribe;
  }, []);

  return loadingState;
};
