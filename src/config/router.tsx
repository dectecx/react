import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App';
import LoginPage from '../pages/LoginPage';
import TodoListPage from '../pages/TodoListPage';
import TodoDetailPage from '../pages/TodoDetailPage';
import PrivateRoute from '../components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <App />, // Layout component for protected routes
        children: [
          {
            index: true,
            element: <TodoListPage />,
          },
          {
            path: 'todo/:id',
            element: <TodoDetailPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
