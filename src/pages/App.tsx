import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <header>
        <h1>TodoList App</h1>
        {/* Navigation can go here */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
