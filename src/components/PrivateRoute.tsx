import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  // In a real app, you might want to verify the token with the server
  const token = localStorage.getItem('authToken');
  return !!token;
};

const PrivateRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
