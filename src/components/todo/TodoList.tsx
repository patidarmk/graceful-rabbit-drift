import { useState, useMemo } from 'react';
import { Todo, TodoStatus } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>('all');

  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter(todo => todo.completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
    showSuccess('Todo added successfully!');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    showSuccess('Todo deleted successfully!');
  };

  const editTodo = (id: string, newTitle: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, title: newTitle, updatedAt: new Date() }
          : todo
      )
    );
    showSuccess('Todo updated successfully!');
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount === 0) {
      showError('No completed todos to clear!');
      return;
    }
    setTodos(prev => prev.filter(todo => !todo.completed));
    showSuccess(`Cleared ${completedCount} completed todo${completedCount > 1 ? 's' : ''}!`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">Todo List</h1>
          <p className="text-center text-muted-foreground">
            {todos.length === 0 ? 'No todos yet. Add one below!' : `${activeCount} active, ${completedCount} completed`}
          </p>
        </div>

        <TodoForm onAdd={addTodo} />

        {todos.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <TodoFilters
                currentStatus={status}
                onStatusChange={setStatus}
                activeCount={activeCount}
                completedCount={completedCount}
              />
              {completedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  className="text-destructive hover:text-destructive"
                >
                  Clear Completed
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  completed={todo.completed}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};