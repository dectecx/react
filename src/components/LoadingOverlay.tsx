import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Page Loading...Please Wait' }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="pencil">
          <div className="pencil__ball-point"></div>
          <div className="pencil__cap"></div>
          <div className="pencil__cap-base"></div>
          <div className="pencil__middle"></div>
          <div className="pencil__eraser"></div>
        </div>
        <div className="line"></div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default LoadingOverlay;
