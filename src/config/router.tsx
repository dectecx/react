import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App';
import LoginPage from '../pages/LoginPage';
import TodoListPage from '../pages/TodoListPage';
import TodoDetailPage from '../pages/TodoDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <TodoListPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'todo/:id',
        element: <TodoDetailPage />,
      },
    ],
  },
]);

export default router;
