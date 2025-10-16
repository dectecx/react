import type { Todo } from '../types/todo';
// import apiClient from './apiClient';

// --- Mock Data Store ---
let mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Learn the basics of React',
    status: 'completed',
    createdAt: '2025-10-16T10:00:00Z',
    updatedAt: '2025-10-16T11:00:00Z',
  },
  {
    id: 2,
    title: 'Learn TypeScript',
    description: 'Learn the basics of TypeScript',
    status: 'in-progress',
    createdAt: '2025-10-15T14:30:00Z',
    updatedAt: '2025-10-16T09:00:00Z',
  },
  {
    id: 3,
    title: 'Build a TodoList App',
    description: 'Build a full-featured TodoList App',
    status: 'pending',
    createdAt: '2025-10-14T08:00:00Z',
    updatedAt: '2025-10-14T08:00:00Z',
  },
];

// --- Mock API Service ---

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    console.log('Fetching all todos...');
    await sleep(500); // Simulate network delay
    // Real implementation:
    // const response = await apiClient.get('/todos');
    // return response.data;
    return Promise.resolve([...mockTodos]);
  },

  async getTodoById(id: number): Promise<Todo | undefined> {
    console.log(`Fetching todo with id: ${id}...`);
    await sleep(500);
    const todo = mockTodos.find((t) => t.id === id);
    return Promise.resolve(todo);
  },

  async createTodo(
    todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Todo> {
    console.log('Creating new todo...', todoData);
    await sleep(500);
    const newTodo: Todo = {
      ...todoData,
      id: mockTodos.length > 0 ? Math.max(...mockTodos.map((t) => t.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTodos.push(newTodo);
    return Promise.resolve(newTodo);
  },

  async updateTodo(
    id: number,
    todoData: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Todo | undefined> {
    console.log(`Updating todo with id: ${id}...`, todoData);
    await sleep(500);
    const todoIndex = mockTodos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      return Promise.resolve(undefined);
    }
    const updatedTodo = {
      ...mockTodos[todoIndex],
      ...todoData,
      updatedAt: new Date().toISOString(),
    };
    mockTodos[todoIndex] = updatedTodo;
    return Promise.resolve(updatedTodo);
  },

  async deleteTodo(id: number): Promise<{ success: boolean }> {
    console.log(`Deleting todo with id: ${id}...`);
    await sleep(500);
    const initialLength = mockTodos.length;
    mockTodos = mockTodos.filter((t) => t.id !== id);
    const success = mockTodos.length < initialLength;
    return Promise.resolve({ success });
  },
};
