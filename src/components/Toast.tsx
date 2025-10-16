import { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimeout = setTimeout(() => setIsVisible(true), 10);

    // Set timer to auto-close
    const autoCloseTimeout = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before unmounting
      setTimeout(onClose, 300);
    }, 3000); // Message visible for 3 seconds

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`toast ${type} ${isVisible ? 'show' : ''}`}>
      <div className="toast-message">{message}</div>
      <button onClick={handleClose} className="toast-close-button">
        &times;
      </button>
    </div>
  );
};

export default Toast;
